import { tryFn, isInteractive, hasDebug, readJson, hasVerbose } from './helpers';
import { CompilerBuildResults, CompilerSystem, Config, Logger, PackageJsonData } from 'src/declarations';
import { parseFlags } from '../parse-flags';
import { loadCoreCompiler } from '../load-compiler';
import { readConfig, updateConfig } from '../ionic-config';
import { isObject } from '@utils';
import { getCompilerSystem } from '../state/stencil-cli-config';

export interface CommandMetricData {
  // app_id: string;
  command: string;
  arguments: string;
  options: string;
  duration: number;
  error: string | null;
  node_version: string;
  // os: string;
}

export interface Metric<N extends string, D> {
  name: N;
  timestamp: string;
  source: 'stencil_cli';
  value: D;
}

// Used for deeper understanding on how people are using certain output targets
interface OutputTargetOptions {
  serviceWorker?: boolean;
}

type TelemetryCallback = (...args: any[]) => void | Promise<void>;

export interface TrackableData {
  command?: string;
  yarn?: boolean;
  session_id?: string;
  component_count?: number;
  arguments?: string[];
  targets?: string[][] | OutputTargetOptions[][];
  task?: string;
  duration?: number;
  packages?: string[];
  telemetry?: boolean;
  os_name: string;
  os_version: string;
  cpu_model: string;
  typescript: string;
  rollup: string;
  system: string;
  build: string;
  stencil: string;
}

export interface telemetryActionArgs {
  args?: string[];
  sys?: CompilerSystem;
  logger?: Logger;
  buildResults?: Logger;
  config?: Config;
  action?: TelemetryCallback;
}

// Used to within taskBuild to signal out with the componentCount integer.
export async function telemetryBuildFinishedAction(result: CompilerBuildResults, args: telemetryActionArgs) {
  const { sys, config, logger } = args;
  const tracking = await shouldTrack(!!config.flags.ci);

  if (!tracking) {
    return;
  }

  const details = sys.details;
  const session_id = await getTelemetryToken();
  const packages = await getInstalledPackages();
  const targets = await getActiveTargets(config);
  const coreCompiler = await loadCoreCompiler(sys);
  const versions = coreCompiler.versions;
  const component_count = Object.keys(result.componentGraph).length;

  const data: TrackableData = {
    session_id,
    yarn: isUsingYarn(),
    duration: result.duration,
    component_count,
    targets,
    packages: packages || [],
    arguments: config.flags.args,
    task: config.flags.task,
    stencil: coreCompiler.version,
    system: `${sys.name} ${sys.version}`,
    os_name: details.platform,
    os_version: details.release,
    cpu_model: `${details.cpuModel}`,
    build: `${result.buildId}`,
    typescript: versions.typescript,
    rollup: versions.rollup,
  };

  await sendMetric('stencil_cli_command', data);
  logger.debug(`${logger.blue('Telemetry')}: ${logger.gray(JSON.stringify(data))}`);
}

export async function telemetryAction(options: telemetryActionArgs) {
  const { args, sys, logger, config, action } = options;
  const tracking = await shouldTrack(!!config.flags.ci);

  const coreCompiler = await loadCoreCompiler(sys);
  const details = sys.details;
  const versions = coreCompiler.versions;
  const flags = parseFlags(args, sys);
  let duration = undefined;
  let error: any;

  if (action) {
    const start = new Date();

    try {
      await action();
    } catch (e) {
      error = e;
    }

    const end = new Date();
    duration = end.getTime() - start.getTime();
  }

  // We'll get componentCount details inside the taskBuild, so let's not send two messages.
  if (!tracking || (flags.task == 'build' && !flags.args.includes('--watch'))) {
    return;
  }

  const session_id = await getTelemetryToken();
  const packages = await getInstalledPackages();
  const targets = await getActiveTargets(config);

  const data: TrackableData = {
    session_id,
    yarn: isUsingYarn(),
    duration,
    targets,
    packages: packages || [],
    arguments: flags.args,
    task: flags.task,
    stencil: coreCompiler.version,
    system: `${sys.name} ${sys.version}`,
    os_name: details.platform,
    os_version: details.release,
    cpu_model: `${details.cpuModel}`,
    build: coreCompiler.buildId,
    typescript: versions.typescript,
    rollup: versions.rollup,
  };

  await sendMetric('stencil_cli_command', data);
  logger.debug(`${logger.blue('Telemetry')}: ${logger.gray(JSON.stringify(data))}`);

  if (error) {
    throw error;
  }
}

function isUsingYarn() {
  return process.env.npm_execpath.includes('yarn');
}

async function getActiveTargets(config: Config): Promise<string[][] | OutputTargetOptions[][]> {
  return (config.outputTargets as any[]).map(target => {
    let outputTargetSettings: OutputTargetOptions = {};

    if (target.type === 'www') {
      outputTargetSettings.serviceWorker = isObject(target?.serviceWorker);
    }

    return [target.type, outputTargetSettings];
  });
}

async function getInstalledPackages() {
  try {
    // Read package.json and package-lock.json
    const appRootDir = process.cwd();

    const packageJson: PackageJsonData = await tryFn(
      readJson,
      getCompilerSystem().resolvePath(appRootDir + '/package.json'),
    );
    const packageLockJson: any = await tryFn(
      readJson,
      getCompilerSystem().resolvePath(appRootDir + '/package-lock.json'),
    );

    const packages = Object.entries({
      ...packageJson.devDependencies,
      ...packageJson.dependencies,
    });

    // Collect packages only in the stencil, ionic, or capacitor org's:
    // https://www.npmjs.com/org/stencil
    const ionicPackages = packages.filter(
      ([k]) => k.startsWith('@stencil/') || k.startsWith('@ionic/') || k.startsWith('@capacitor/'),
    );

    // Original method, but cross reference with package-lock.json, don't consider yarn.
    const versions = packageLockJson
      ? ionicPackages.map(
          ([k, v]) =>
            `${k}@${packageLockJson.dependencies[k].version || packageLockJson.devDependencies[k].version || v}`,
        )
      : ionicPackages.map(([k, v]) => `${k}@${v}`);

    return versions;
  } catch (err) {
    hasDebug() && console.error(err);
    return [];
  }
}

export async function shouldTrack(ci: boolean) {
  return (await checkTelemetry()) && !ci && isInteractive();
}

export async function getTelemetryToken() {
  const config = await readConfig();
  return config['tokens.telemetry'];
}

export async function checkTelemetry() {
  const config = await readConfig();
  return config['telemetry.stencil'];
}

export async function enableTelemetry() {
  await updateConfig({ 'telemetry.stencil': true });
}

export async function disableTelemetry() {
  await updateConfig({ 'telemetry.stencil': false });
}

/**
 * If telemetry is enabled, send a metric via IPC to a forked process for uploading.
 */
export async function sendMetric<D>(name: string, data: D): Promise<void> {
  const message: Metric<string, D> = {
    name,
    timestamp: new Date().toISOString(),
    source: 'stencil_cli',
    value: data,
  };

  await sendTelemetry({ type: 'telemetry', message });
}

export async function sendTelemetry(data: any) {
  try {
    const now = new Date().toISOString();

    const { request } = getCompilerSystem();

    // This request is only made if telemetry is on.
    const req = request(
      {
        hostname: 'api.ionicjs.com',
        port: 443,
        path: '/events/metrics',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (response: any) => {
        hasVerbose() &&
          console.debug('Sent %O metric to events service (status: %O)', data.message.name, response.statusCode);

        if (response.statusCode !== 204) {
          response.on('data', (chunk: any) => {
            hasVerbose() && console.debug('Bad response from events service. Request body: %O', chunk.toString());
          });
        }
      },
    );

    const body = {
      metrics: [data.message],
      sent_at: now,
    };

    req.end(JSON.stringify(body));
  } catch (e) {
    hasVerbose() && console.debug('Telemetry request failed', e);
  }
}
