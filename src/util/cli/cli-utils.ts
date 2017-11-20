import { BuildConfig, Logger } from '../../util/interfaces';
import { isAbsolute, join } from 'path';
import { normalizePath } from '../../compiler/util';
import { writeFile } from 'fs';


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
    if (argv.serviceWorker && config.serviceWorker === undefined) {
      // dev mode, but forcing service worker
      // but they didn't provide a sw config
      // so still force it to generate w/ our defaults
      config.serviceWorker = true;

    } else {
      // dev mode, and not forcing service worker
      // so set this to false so it's not generated
      config.serviceWorker = false;
    }

  } else if (config.serviceWorker === undefined) {
    // prod mode, and they didn't provide a sw config
    // so force it generate with our defaults
    config.serviceWorker = true;
  }

  if (argv.es5) {
    config.es5Fallback = true;
  }
}


export function getConfigFilePath(process: NodeJS.Process, configArg: string) {
  if (configArg) {
    if (!isAbsolute(configArg)) {
      // passed in a custom stencil config location
      // but it's relative, so prefix the cwd
      return normalizePath(join(process.cwd(), configArg));
    }

    // config path already an absolute path, we're good here
    return normalizePath(configArg);
  }

  // nothing was passed in, use the current working directory
  return normalizePath(process.cwd());
}



export function help(process: NodeJS.Process, logger: Logger) {
  var p = logger.dim((process.platform === 'win32') ? '>' : '$');

  console.log(`
  ${logger.bold('Build:')} ${logger.dim('Build components for development or production.')}

    ${p} ${logger.green('stencil build [--dev] [--watch] [--prerender] [--debug]')}

      ${logger.green('--dev')} ${logger.dim('..................')} Execute a development build.
      ${logger.green('--watch')} ${logger.dim('................')} Execute a build in watch mode.
      ${logger.green('--prerender')} ${logger.dim('............')} Prerender URLs.
      ${logger.green('--debug')} ${logger.dim('................')} Set the log level to debug.
      ${logger.green('--config')} ${logger.dim('...............')} Stencil config file.

  ${logger.bold('Examples:')}

    ${p} ${logger.green('stencil build --dev --watch')}
    ${p} ${logger.green('stencil build --prerender')}
    ${p} ${logger.green('stencil init')}

`);
}


export function init(process: NodeJS.Process) {
  var configPath = join(process.cwd(), 'stencil.config.js');

  writeFile(configPath, DEFAULT_CONFIG, (err) => {
    if (err) {
      console.error(err);

    } else {
      console.log(`Created ${configPath}`);
    }
  });
}


var DEFAULT_CONFIG = `
exports.config = {
  namespace: 'App',
  bundles: [],
  collections: []
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
`;


export function parseArgv(process: NodeJS.Process) {
  const minimist = require('minimist');
  const cmdArgs = getCmdArgs(process);
  const argv: CliArgv = minimist(cmdArgs, ARG_OPTS) as any;

  argv.serviceWorker = (argv as any)['service-worker'];
  argv.skipNodeCheck = (argv as any)['skip-node-check'];
  argv.logLevel = (argv as any)['log-level'];

  return argv as CliArgv;
}


const ARG_OPTS: any = {
  boolean: [
    'debug',
    'dev',
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
  es5?: boolean;
  help?: boolean;
  logLevel?: string;
  prerender?: boolean;
  prod?: boolean;
  serviceWorker?: boolean;
  skipNodeCheck?: boolean;
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


export function isValidNodeVersion(minNodeVersion: number, currentVersion: string) {
  const versionMatch = currentVersion.match(/(\d+).(\d+)/);
  return (versionMatch && parseFloat(versionMatch[0]) >= minNodeVersion);
}
