import * as d from '../declarations';
import { dashToPascalCase } from '../util/helpers';


export function parseFlags(process: NodeJS.Process): d.ConfigFlags {
  const flags: any = {
    task: null,
    args: []
  };

  // cmd line has more priority over npm scripts cmd
  flags.args = process.argv.slice(2);
  if (flags.args.length > 0 && flags.args[0] && !flags.args[0].startsWith('-')) {
    flags.task = flags.args[0];
  }
  parseArgs(flags, flags.args);

  const npmScriptCmdArgs = getNpmScriptArgs(process);
  parseArgs(flags, npmScriptCmdArgs);

  npmScriptCmdArgs.forEach(npmArg => {
    if (!flags.args.includes(npmArg)) {
      flags.args.push(npmArg);
    }
  });

  return flags;
}


export function parseArgs(flags: any, args: string[]): d.ConfigFlags {
  ARG_OPTS.boolean.forEach(booleanName => {

    const alias = (ARG_OPTS.alias as any)[booleanName];
    const flagKey = configCase(booleanName);

    if (typeof flags[flagKey] !== 'boolean') {
      flags[flagKey] = null;
    }

    args.forEach(cmdArg => {
      if (cmdArg === `--${booleanName}`) {
        flags[flagKey] = true;

      } else if (cmdArg === `--no-${booleanName}`) {
        flags[flagKey] = false;

      } else if (alias && cmdArg === `-${alias}`) {
        flags[flagKey] = true;
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

      } else if (cmdArg === `--${stringName}`) {
        flags[flagKey] = args[i + 1];

      } else if (alias) {
        if (cmdArg.startsWith(`-${alias}=`)) {
          const values = cmdArg.split('=');
          values.shift();
          flags[flagKey] = values.join('=');

        } else if (cmdArg === `-${alias}`) {
          flags[flagKey] = args[i + 1];
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

      } else if (cmdArg === `--${numberName}`) {
        flags[flagKey] = parseInt(args[i + 1], 10);

      } else if (alias) {
        if (cmdArg.startsWith(`-${alias}=`)) {
          const values = cmdArg.split('=');
          values.shift();
          flags[flagKey] = parseInt(values.join(''), 10);

        } else if (cmdArg === `-${alias}`) {
          flags[flagKey] = parseInt(args[i + 1], 10);
        }
      }
    }
  });

  return flags;
}


function configCase(prop: string) {
  prop = dashToPascalCase(prop);
  return prop.charAt(0).toLowerCase() + prop.substr(1);
}


const ARG_OPTS = {
  boolean: [
    'build',
    'cache',
    'check-version',
    'ci',
    'compare',
    'debug',
    'dev',
    'docs',
    'e2e',
    'es5',
    'headless',
    'help',
    'log',
    'open',
    'prerender',
    'service-worker',
    'prod',
    'screenshot',
    'serve',
    'skip-node-check',
    'spec',
    'stats',
    'update-screenshot',
    'version',
    'watch'
  ],
  number: [
    'max-workers',
    'port'
  ],
  string: [
    'address',
    'config',
    'docs-json',
    'log-level',
    'root',
    'screenshot-connector'
  ],
  alias: {
    'config': 'c',
    'help': 'h',
    'port': 'p',
    'version': 'v'
  }
};


export function getNpmScriptArgs(process: NodeJS.Process) {
  // process.env.npm_config_argv
  // {"remain":["4444"],"cooked":["run","serve","--port","4444"],"original":["run","serve","--port","4444"]}
  let args: string[] = [];
  try {
    if (process.env) {
      const npmConfigArgs = process.env.npm_config_argv;
      if (npmConfigArgs) {
        args = (JSON.parse(npmConfigArgs).original as string[]);
        args.shift();
      }
    }
  } catch (e) {}
  return args;
}
