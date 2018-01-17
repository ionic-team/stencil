import { BuildConfig, Diagnostic, StencilSystem } from '../util/interfaces';


export function overrideConfigFromArgv(config: BuildConfig, argv: CliArgv) {
  if (argv.prod) {
    config.devMode = false;

  } else if (argv.dev) {
    config.devMode = true;
  }

  if (argv.watch) {
    config.watch = true;
  }

  if (argv.debug) {
    config.logLevel = 'debug';

  } else if (argv.logLevel) {
    config.logLevel = argv.logLevel;
  }

  if (!argv.prerender) {
    config.prerender = false;

  } else if (!config.prerender) {
    config.prerender = true;
  }

  if (config.devMode) {
    if (argv.serviceWorker && config.serviceWorker) {
      // dev mode, but forcing service worker
      // and they provided a sw config
      // so generate a service worker with their config
      config.serviceWorker = true;
    } else if (argv.serviceWorker && config.serviceWorker === undefined) {
      // dev mode, but forcing service worker
      // but they didn't provide a sw config
      // so still force it to generate w/ our defaults
      config.serviceWorker = true;
    } else {
      // service worker is off by default in dev mode
      config.serviceWorker = false;
    }

  } else if (config.serviceWorker === undefined) {
    // prod mode, and they didn't provide a sw config
    // so force it generate with our defaults
    config.serviceWorker = true;
  }

  if (argv.es5) {
    config.buildEs5 = true;
  }

  if (argv.docs) {
    config.generateDocs = true;
  }
}


export function getConfigFilePath(process: NodeJS.Process, sys: StencilSystem, configArg: string) {
  if (configArg) {
    if (!sys.path.isAbsolute(configArg)) {
      // passed in a custom stencil config location
      // but it's relative, so prefix the cwd
      return sys.path.join(process.cwd(), configArg);
    }

    // config path already an absolute path, we're good here
    return configArg;
  }

  // nothing was passed in, use the current working directory
  return process.cwd();
}


export function parseArgv(process: NodeJS.Process) {
  const minimist = require('minimist');
  const cmdArgs = getCmdArgs(process);
  const argv: CliArgv = minimist(cmdArgs, ARG_OPTS) as any;

  argv.serviceWorker = (argv as any)['service-worker'];
  argv.logLevel = (argv as any)['log-level'];

  return argv as CliArgv;
}


const ARG_OPTS: any = {
  boolean: [
    'debug',
    'dev',
    'docs',
    'es5',
    'help',
    'prod',
    'prerender',
    'service-worker',
    'skip-node-check',
    'version',
    'watch'
  ],
  string: [
    'config',
    'log-level'
  ],
  alias: {
    'c': 'config',
    'h': 'help',
    'v': 'version'
  }
};


export interface CliArgv {
  config?: string;
  debug?: boolean;
  dev?: boolean;
  docs?: boolean;
  es5?: boolean;
  help?: boolean;
  logLevel?: string;
  prerender?: boolean;
  prod?: boolean;
  serviceWorker?: boolean;
  version?: boolean;
  watch?: boolean;
}


function getCmdArgs(process: NodeJS.Process) {
  let cmdArgs = process.argv.slice(2);

  try {
    var npmRunArgs = process.env.npm_config_argv;
    if (npmRunArgs) {
      cmdArgs = cmdArgs.concat(JSON.parse(npmRunArgs).original);
    }
  } catch (e) {}

  return cmdArgs;
}


export function hasError(diagnostics: Diagnostic[]): boolean {
  if (!diagnostics) {
    return false;
  }
  return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
}
