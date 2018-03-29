import { ConfigFlags } from '../declarations';
import { dashToPascalCase } from '../util/helpers';


export function parseFlags(process: NodeJS.Process): ConfigFlags {
  const cmdArgs = getCmdArgs(process);
  const flags: any = {};

  if (cmdArgs[0] && !cmdArgs[0].startsWith('-')) {
    flags.task = cmdArgs[0];
  } else {
    flags.task = null;
  }

  ARG_OPTS.boolean.forEach(booleanName => {

    const alias = (ARG_OPTS.alias as any)[booleanName];
    const flagKey = configCase(booleanName);

    flags[flagKey] = null;

    cmdArgs.forEach(cmdArg => {
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

    flags[flagKey] = null;

    for (let i = 0; i < cmdArgs.length; i++) {
      const cmdArg = cmdArgs[i];

      if (cmdArg.startsWith(`--${stringName}=`)) {
        const values = cmdArg.split('=');
        values.shift();
        flags[flagKey] = values.join('=');

      } else if (cmdArg === `--${stringName}`) {
        flags[flagKey] = cmdArgs[i + 1];

      } else if (alias) {
        if (cmdArg.startsWith(`-${alias}=`)) {
          const values = cmdArg.split('=');
          values.shift();
          flags[flagKey] = values.join('=');

        } else if (cmdArg === `-${alias}`) {
          flags[flagKey] = cmdArgs[i + 1];
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
    'cache',
    'debug',
    'dev',
    'docs',
    'es5',
    'help',
    'log',
    'prerender',
    'prod',
    'skip-node-check',
    'stats',
    'version',
    'watch'
  ],
  string: [
    'config',
    'docs-json',
    'log-level'
  ],
  alias: {
    'config': 'c',
    'help': 'h',
    'version': 'v'
  }
};


export function getCmdArgs(process: NodeJS.Process) {
  let cmdArgs = process.argv.slice(2);

  try {
    if (process.env) {
      const npmConfigArgs = process.env.npm_config_argv;
      if (npmConfigArgs) {
        const npmOrginalFlags = (JSON.parse(npmConfigArgs).original as string[]).filter(arg => arg.startsWith('-'));
        cmdArgs = cmdArgs.concat(npmOrginalFlags);
      }
    }
  } catch (e) {}

  return cmdArgs;
}
