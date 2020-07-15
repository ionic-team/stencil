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

    envArgs.forEach(envArg => {
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
  ARG_OPTS.boolean.forEach(booleanName => {
    const alias = (ARG_OPTS.alias as any)[booleanName];
    const flagKey = configCase(booleanName);

    if (typeof flags[flagKey] !== 'boolean') {
      flags[flagKey] = null;
    }

    args.forEach(cmdArg => {
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

  ARG_OPTS.string.forEach(stringName => {
    const alias = (ARG_OPTS.alias as any)[stringName];
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

  ARG_OPTS.number.forEach(numberName => {
    const alias = (ARG_OPTS.alias as any)[numberName];
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
  return prop.charAt(0).toLowerCase() + prop.substr(1);
};

const ARG_OPTS = {
  boolean: [
    'build',
    'cache',
    'check-version',
    'ci',
    'compare',
    'debug',
    'dev',
    'devtools',
    'docs',
    'e2e',
    'es5',
    'esm',
    'headless',
    'help',
    'log',
    'open',
    'prerender',
    'prerender-external',
    'prod',
    'profile',
    'service-worker',
    'screenshot',
    'serve',
    'skip-node-check',
    'spec',
    'stats',
    'update-screenshot',
    'verbose',
    'version',
    'watch',
  ],
  number: ['max-workers', 'port'],
  string: ['address', 'config', 'docs-json', 'emulate', 'log-level', 'root', 'screenshot-connector'],
  alias: {
    config: 'c',
    help: 'h',
    port: 'p',
    version: 'v',
  },
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
