import { Config, Diagnostic, StencilSystem } from '../declarations';
import { normalizePath } from '../compiler/util';


export function overrideConfigFromArgv(config: Config, argv: CliArgv) {
  if (argv.prod) {
    config.devMode = false;

  } else if (argv.dev) {
    config.devMode = true;
  }

  if (argv.stats) {
    config.writeStats = true;
  }

  if (argv.log) {
    config.writeLog = true;
  }

  if (argv.noCache) {
    config.enableCache = false;
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
      return normalizePath(sys.path.join(process.cwd(), configArg));
    }

    // config path already an absolute path, we're good here
    return normalizePath(configArg);
  }

  // nothing was passed in, use the current working directory
  return normalizePath(process.cwd());
}


export function parseArgv(process: NodeJS.Process, sys: StencilSystem) {
  const cmdArgs = getCmdArgs(process);
  const argv: CliArgv = sys.parseArgv(cmdArgs, ARG_OPTS);

  argv.logLevel = (argv as any)['log-level'];
  argv.serviceWorker = (argv as any)['service-worker'];
  argv.noCache = cmdArgs.includes('--no-cache');

  return argv as CliArgv;
}


const ARG_OPTS: any = {
  boolean: [
    'debug',
    'dev',
    'docs',
    'es5',
    'help',
    'log',
    'no-cache',
    'prod',
    'prerender',
    'service-worker',
    'skip-node-check',
    'stats',
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
  log?: boolean;
  logLevel?: string;
  noCache?: boolean;
  prerender?: boolean;
  prod?: boolean;
  serviceWorker?: boolean;
  stats?: boolean;
  version?: boolean;
  watch?: boolean;
}


function getCmdArgs(process: NodeJS.Process) {
  let cmdArgs = process.argv.slice(2);

  try {
    const npmRunArgs = process.env.npm_config_argv;
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
