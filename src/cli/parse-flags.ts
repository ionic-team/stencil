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

    if (cmdArgs.includes(`--${booleanName}`)) {
      flags[configCase(booleanName)] = true;
      return;
    }

    if (cmdArgs.includes(`--no-${booleanName}`)) {
      flags[configCase(booleanName)] = false;
      return;
    }

    const alias = (ARG_OPTS.alias as any)[booleanName];

    if (alias) {
      if (cmdArgs.includes(`-${alias}`)) {
        flags[configCase(booleanName)] = true;
        return;
      }
    }

    flags[configCase(booleanName)] = null;

  });

  ARG_OPTS.string.forEach(stringName => {

    for (let i = 0; i < cmdArgs.length; i++) {
      const cmdArg = cmdArgs[i];

      if (cmdArg.startsWith(`--${stringName}=`)) {
        const values = cmdArg.split('=');
        values.shift();
        flags[configCase(stringName)] = values.join('=');
        return;
      }

      if (cmdArg === `--${stringName}`) {
        flags[configCase(stringName)] = cmdArgs[i + 1];
        return;
      }

      const alias = (ARG_OPTS.alias as any)[stringName];

      if (alias) {
        if (cmdArg.startsWith(`-${alias}=`)) {
          const values = cmdArg.split('=');
          values.shift();
          flags[configCase(stringName)] = values.join('=');
          return;
        }

        if (cmdArg === `-${alias}`) {
          flags[configCase(stringName)] = cmdArgs[i + 1];
          return;
        }
      }

      flags[configCase(stringName)] = null;
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
    'prod',
    'prerender',
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
