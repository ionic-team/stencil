import type { CompilerSystem, ConfigFlags } from '../declarations';
import { dashToPascalCase } from '@utils';

export const parseFlags = (args: string[], sys?: CompilerSystem): ConfigFlags => {
  const flags: any = {
    task: null,
    args: [],
    knownArgs: [],
    unknownArgs: null,
  };

  // cmd line has more priority over npm scripts cmd
  flags.args = args.slice();
  if (flags.args.length > 0 && flags.args[0] && !flags.args[0].startsWith('-')) {
    flags.task = flags.args[0];
  }
  parseArgs(flags, flags.args, flags.knownArgs);

  if (sys && sys.name === 'node') {
    const envArgs = getNpmConfigEnvArgs(sys);
    parseArgs(flags, envArgs, flags.knownArgs);

    envArgs.forEach((envArg) => {
      if (!flags.args.includes(envArg)) {
        flags.args.push(envArg);
      }
    });
  }

  if (flags.task != null) {
    const i = flags.args.indexOf(flags.task);
    if (i > -1) {
      flags.args.splice(i, 1);
    }
  }

  flags.unknownArgs = flags.args.filter((arg: string) => {
    return !flags.knownArgs.includes(arg);
  });

  return flags;
};

const parseArgs = (flags: any, args: string[], knownArgs: string[]) => {
  Object.values(BOOLEAN_ARG_OPTS).forEach((booleanName) => {
    const alias = ARG_OPTS_ALIASES[booleanName];
    const flagKey = configCase(booleanName);

    if (typeof flags[flagKey] !== 'boolean') {
      flags[flagKey] = null;
    }

    args.forEach((cmdArg) => {
      if (cmdArg === `--${booleanName}`) {
        flags[flagKey] = true;
        knownArgs.push(cmdArg);
      } else if (cmdArg === `--${flagKey}`) {
        flags[flagKey] = true;
        knownArgs.push(cmdArg);
      } else if (cmdArg === `--no-${booleanName}`) {
        flags[flagKey] = false;
        knownArgs.push(cmdArg);
      } else if (cmdArg === `--no${dashToPascalCase(booleanName)}`) {
        flags[flagKey] = false;
        knownArgs.push(cmdArg);
      } else if (alias && cmdArg === `-${alias}`) {
        flags[flagKey] = true;
        knownArgs.push(cmdArg);
      }
    });
  });

  Object.values(STRING_ARG_OPTS).forEach((stringName) => {
    const alias = ARG_OPTS_ALIASES[stringName];
    const flagKey = configCase(stringName);

    if (typeof flags[flagKey] !== 'string') {
      flags[flagKey] = null;
    }

    for (let i = 0; i < args.length; i++) {
      const cmdArg = args[i];

      if (cmdArg.startsWith(`--${stringName}=`)) {
        const values = cmdArg.split('=');
        values.shift();
        flags[flagKey] = values.join('=');
        knownArgs.push(cmdArg);
      } else if (cmdArg === `--${stringName}`) {
        flags[flagKey] = args[i + 1];
        knownArgs.push(cmdArg);
        knownArgs.push(args[i + 1]);
      } else if (cmdArg === `--${flagKey}`) {
        flags[flagKey] = args[i + 1];
        knownArgs.push(cmdArg);
        knownArgs.push(args[i + 1]);
      } else if (cmdArg.startsWith(`--${flagKey}=`)) {
        const values = cmdArg.split('=');
        values.shift();
        flags[flagKey] = values.join('=');
        knownArgs.push(cmdArg);
      } else if (alias) {
        if (cmdArg.startsWith(`-${alias}=`)) {
          const values = cmdArg.split('=');
          values.shift();
          flags[flagKey] = values.join('=');
          knownArgs.push(cmdArg);
        } else if (cmdArg === `-${alias}`) {
          flags[flagKey] = args[i + 1];
          knownArgs.push(args[i + 1]);
        }
      }
    }
  });

  Object.values(NUMBER_ARG_OPTS).forEach((numberName) => {
    const alias = ARG_OPTS_ALIASES[numberName];
    const flagKey = configCase(numberName);

    if (typeof flags[flagKey] !== 'number') {
      flags[flagKey] = null;
    }

    for (let i = 0; i < args.length; i++) {
      const cmdArg = args[i];

      if (cmdArg.startsWith(`--${numberName}=`)) {
        const values = cmdArg.split('=');
        values.shift();
        flags[flagKey] = parseInt(values.join(''), 10);
        knownArgs.push(cmdArg);
      } else if (cmdArg === `--${numberName}`) {
        flags[flagKey] = parseInt(args[i + 1], 10);
        knownArgs.push(args[i + 1]);
      } else if (cmdArg.startsWith(`--${flagKey}=`)) {
        const values = cmdArg.split('=');
        values.shift();
        flags[flagKey] = parseInt(values.join(''), 10);
        knownArgs.push(cmdArg);
      } else if (cmdArg === `--${flagKey}`) {
        flags[flagKey] = parseInt(args[i + 1], 10);
        knownArgs.push(args[i + 1]);
      } else if (alias) {
        if (cmdArg.startsWith(`-${alias}=`)) {
          const values = cmdArg.split('=');
          values.shift();
          flags[flagKey] = parseInt(values.join(''), 10);
          knownArgs.push(cmdArg);
        } else if (cmdArg === `-${alias}`) {
          flags[flagKey] = parseInt(args[i + 1], 10);
          knownArgs.push(args[i + 1]);
        }
      }
    }
  });
};

const configCase = (prop: string) => {
  prop = dashToPascalCase(prop);
  return prop.charAt(0).toLowerCase() + prop.slice(1);
};

enum BOOLEAN_ARG_OPTS {
  build = 'build',
  cache = 'cache',
  checkversion = 'check-version',
  ci = 'ci',
  compare = 'compare',
  debug = 'debug',
  dev = 'dev',
  devtools = 'devtools',
  docs = 'docs',
  e2e = 'e2e',
  es5 = 'es5',
  esm = 'esm',
  headless = 'headless',
  help = 'help',
  log = 'log',
  open = 'open',
  prerender = 'prerender',
  prerenderexternal = 'prerender-external',
  prod = 'prod',
  profile = 'profile',
  service = 'service-worker',
  screenshot = 'screenshot',
  serve = 'serve',
  skipnodecheck = 'skip-node-check',
  spec = 'spec',
  ssr = 'ssr',
  stats = 'stats',
  updatescreenshot = 'update-screenshot',
  verbose = 'verbose',
  version = 'version',
  watch = 'watch',
}

enum NUMBER_ARG_OPTS {
  maxworkers = 'max-workers',
  port = 'port',
}

enum STRING_ARG_OPTS {
  address = 'address',
  config = 'config',
  docsJson = 'docs-json',
  emulate = 'emulate',
  logLevel = 'log-level',
  root = 'root',
  screenshotConnector = 'screenshot-connector',
}

const ARG_OPTS_ALIASES: Partial<Record<BOOLEAN_ARG_OPTS | NUMBER_ARG_OPTS | STRING_ARG_OPTS, string | undefined>> = {
  config: 'c',
  help: 'h',
  port: 'p',
  version: 'v',
};

const getNpmConfigEnvArgs = (sys: CompilerSystem) => {
  // process.env.npm_config_argv
  // {"remain":["4444"],"cooked":["run","serve","--port","4444"],"original":["run","serve","--port","4444"]}
  let args: string[] = [];
  try {
    const npmConfigArgs = sys.getEnvironmentVar('npm_config_argv');
    if (npmConfigArgs) {
      args = JSON.parse(npmConfigArgs).original as string[];
      if (args[0] === 'run') {
        args = args.slice(2);
      }
    }
  } catch (e) {}
  return args;
};
