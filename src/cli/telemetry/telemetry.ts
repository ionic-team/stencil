import { tryFn, hasDebug, readJson, hasVerbose, uuidv4 } from './helpers';
import { shouldTrack } from './shouldTrack';
import { CompilerBuildResults, PackageJsonData, TaskCommand } from 'src/declarations';
import { readConfig, updateConfig, writeConfig } from '../ionic-config';
import { getCompilerSystem, getCoreCompiler, getStencilCLIConfig } from '../state/stencil-cli-config';

/**
 * Used as the object sent to the server. Value is the data tracked.
 */
export interface Metric {
  name: string;
  timestamp: string;
  source: 'stencil_cli';
  value: TrackableData;
  session_id: string;
}

/**
 * The task to run in order to collect the duration data point.
 */
type TelemetryCallback = (...args: any[]) => void | Promise<void>;

/**
 * The model for the data that's tracked.
 */
export interface TrackableData {
  yarn: boolean;
  component_count?: number;
  arguments: string[];
  targets: string[];
  task: TaskCommand;
  duration_ms: number;
  packages: string[];
  os_name: string;
  os_version: string;
  cpu_model: string;
  typescript: string;
  rollup: string;
  system: string;
  build: string;
  stencil: string;
  has_app_pwa_config: boolean;
}

/**
 * Used to within taskBuild to provide the component_count property.
 * @param result The results of a compiler build.
 */
export async function telemetryBuildFinishedAction(result: CompilerBuildResults) {
  const { flags, logger } = getStencilCLIConfig();
  const tracking = await shouldTrack(flags.ci);

  if (!tracking) {
    return;
  }

  const component_count = Object.keys(result.componentGraph).length;

  const data = await prepareData(result.duration, component_count);

  await sendMetric('stencil_cli_command', data);
  logger.debug(`${logger.blue('Telemetry')}: ${logger.gray(JSON.stringify(data))}`);
}

/**
 * A function to wrap a compiler task function around. Will send telemetry if, and only if, the machine allows.
 * @param action A Promise-based function to call in order to get the duration of any given command.
 * @returns void
 */
export async function telemetryAction(action?: TelemetryCallback) {
  const { flags, logger } = getStencilCLIConfig();
  const tracking = await shouldTrack(!!flags.ci);

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

  const data = await prepareData(duration);

  await sendMetric('stencil_cli_command', data);
  logger.debug(`${logger.blue('Telemetry')}: ${logger.gray(JSON.stringify(data))}`);

  if (error) {
    throw error;
  }
}

export function hasAppTarget(): boolean {
  return getStencilCLIConfig().validatedConfig.config.outputTargets.some(
    (target) => target.type === 'www' && (!!target.serviceWorker || (!!target.baseUrl && target.baseUrl !== '/'))
  );
}

export function isUsingYarn() {
  return getCompilerSystem().getEnvironmentVar('npm_execpath')?.includes('yarn') || false;
}

export async function getActiveTargets(): Promise<string[]> {
  const result = getStencilCLIConfig().validatedConfig.config.outputTargets.map((t) => t.type);
  return Array.from(new Set(result));
}

export const prepareData = async (duration_ms: number, component_count: number = undefined): Promise<TrackableData> => {
  const { flags, sys } = getStencilCLIConfig();
  const { typescript, rollup } = getCoreCompiler()?.versions || { typescript: 'unknown', rollup: 'unknown' };
  const packages = await getInstalledPackages();
  const targets = await getActiveTargets();
  const yarn = isUsingYarn();
  const stencil = getCoreCompiler()?.version || 'unknown';
  const system = `${sys.name} ${sys.version}`;
  const os_name = sys.details.platform;
  const os_version = sys.details.release;
  const cpu_model = sys.details.cpuModel;
  const build = getCoreCompiler()?.buildId || 'unknown';
  const has_app_pwa_config = hasAppTarget();

  return {
    yarn,
    duration_ms,
    component_count,
    targets,
    packages,
    arguments: flags.args,
    task: flags.task,
    stencil,
    system,
    os_name,
    os_version,
    cpu_model,
    build,
    typescript,
    rollup,
    has_app_pwa_config,
  };
};

/**
 * Reads package-lock.json and package.json files in order to cross references the dependencies and devDependencies properties. Pull the current installed version of each package under the @stencil, @ionic, and @capacitor scopes.
 * @returns string[]
 */
async function getInstalledPackages() {
  try {
    // Read package.json and package-lock.json
    const appRootDir = getCompilerSystem().getCurrentDirectory();

    const packageJson: PackageJsonData = await tryFn(
      readJson,
      getCompilerSystem().resolvePath(appRootDir + '/package.json')
    );

    const packageLockJson: any = await tryFn(
      readJson,
      getCompilerSystem().resolvePath(appRootDir + '/package-lock.json')
    );

    // They don't have a package.json for some reason? Eject button.
    if (!packageJson) {
      return [];
    }

    const packages: [string, string][] = Object.entries({
      ...packageJson.devDependencies,
      ...packageJson.dependencies,
    });

    // Collect packages only in the stencil, ionic, or capacitor org's:
    // https://www.npmjs.com/org/stencil
    const ionicPackages = packages.filter(
      ([k]) => k.startsWith('@stencil/') || k.startsWith('@ionic/') || k.startsWith('@capacitor/')
    );

    const versions = packageLockJson
      ? ionicPackages.map(
          ([k, v]) =>
            `${k}@${packageLockJson?.dependencies[k]?.version ?? packageLockJson?.devDependencies[k]?.version ?? v}`
        )
      : ionicPackages.map(([k, v]) => `${k}@${v}`);

    return versions;
  } catch (err) {
    hasDebug() && console.error(err);
    return [];
  }
}

/**
 * If telemetry is enabled, send a metric via IPC to a forked process for uploading.
 */
export async function sendMetric(name: string, value: TrackableData): Promise<void> {
  const session_id = await getTelemetryToken();

  const message: Metric = {
    name,
    timestamp: new Date().toISOString(),
    source: 'stencil_cli',
    value,
    session_id,
  };

  await sendTelemetry({ type: 'telemetry', message });
}

/**
 * Used to read the config file's tokens.telemetry property.
 * @returns string
 */
async function getTelemetryToken() {
  const config = await readConfig();
  if (config['tokens.telemetry'] === undefined) {
    config['tokens.telemetry'] = uuidv4();
    await writeConfig(config);
  }
  return config['tokens.telemetry'];
}

/**
 * Issues a request to the telemetry server.
 * @param data Data to be tracked
 */
async function sendTelemetry(data: any) {
  try {
    const now = new Date().toISOString();

    const body = {
      metrics: [data.message],
      sent_at: now,
    };

    // This request is only made if telemetry is on.
    const response = await getCompilerSystem().fetch('https://api.ionicjs.com/events/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    hasVerbose() &&
      console.debug('\nSent %O metric to events service (status: %O)', data.message.name, response.status, '\n');

    if (response.status !== 204) {
      hasVerbose() &&
        console.debug('\nBad response from events service. Request body: %O', response.body.toString(), '\n');
    }
  } catch (e) {
    hasVerbose() && console.debug('Telemetry request failed:', e);
  }
}

/**
 * Checks if telemetry is enabled on this machine
 * @returns true if telemetry is enabled, false otherwise
 */
export async function checkTelemetry(): Promise<boolean> {
  const config = await readConfig();
  if (config['telemetry.stencil'] === undefined) {
    config['telemetry.stencil'] = true;
    await writeConfig(config);
  }
  return config['telemetry.stencil'];
}

/**
 * Writes to the config file, enabling telemetry for this machine.
 * @returns true if writing the file was successful, false otherwise
 */
export async function enableTelemetry(): Promise<boolean> {
  return await updateConfig({ 'telemetry.stencil': true });
}

/**
 * Writes to the config file, disabling telemetry for this machine.
 * @returns true if writing the file was successful, false otherwise
 */
export async function disableTelemetry(): Promise<boolean> {
  return await updateConfig({ 'telemetry.stencil': false });
}
