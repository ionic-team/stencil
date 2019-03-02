import * as d from '../../declarations';
import { logger } from '@sys';


export function buildJestArgv(config: d.Config) {
  const yargs = require('yargs');

  const args = [
    ...config.flags.unknownArgs.slice(),
    ...config.flags.knownArgs.slice()
  ];

  if (config.flags.e2e && config.flags.ci && !args.some(a => a.startsWith('--maxWorkers'))) {
    args.push('--maxWorkers=4');
  }

  logger.debug(`jest args: ${args.join(' ')}`);

  const { options } = require('jest-cli/build/cli/args');
  const jestArgv = yargs(args).options(options).argv as d.JestArgv;

  jestArgv.config = buildJestConfig(config);

  return jestArgv;
}


export function buildJestConfig(config: d.Config) {
  const jestDefaults = require('jest-config').defaults;

  const validJestConfigKeys = Object.keys(jestDefaults);

  const jestConfig: d.JestConfig = {};

  Object.keys(config.testing).forEach(key => {
    if (validJestConfigKeys.includes(key)) {
      (jestConfig as any)[key] = (config.testing as any)[key];
    }
  });

  jestConfig.rootDir = config.rootDir;

  if (Array.isArray(config.testing.reporters)) {
    jestConfig.reporters = config.testing.reporters;
  }

  return JSON.stringify(jestConfig);
}


export function getProjectListFromCLIArgs(config: d.Config, argv: d.JestArgv) {
  const projects = argv.projects ? argv.projects : [];

  projects.push(config.rootDir);

  return projects;
}
