import * as d from '../../declarations';


export function buildJestArgv(config: d.Config) {
  const yargs = require('yargs');

  const args = [
    ...config.flags.unknownArgs.slice(),
    ...config.flags.knownArgs.slice()
  ];

  config.logger.debug(`jest args: ${args.join(' ')}`);

  const { options } = require('jest-cli/build/cli/args');
  const jestArgv = yargs(args).options(options).argv;

  jestArgv.config = buildJestConfig(config);

  return jestArgv;
}


export function buildJestConfig(config: d.Config) {
  const jestDefaults = require('jest-config').defaults;

  const validJestConfigKeys = Object.keys(jestDefaults);

  const jestConfig: any = {};

  Object.keys(config.testing).forEach(key => {
    if (validJestConfigKeys.includes(key)) {
      jestConfig[key] = (config.testing as any)[key];
    }
  });

  jestConfig.rootDir = config.rootDir;

  return JSON.stringify(jestConfig);
}


export function getProjectListFromCLIArgs(config: d.Config, argv: any) {
  const projects = argv.projects ? argv.projects : [];

  projects.push(config.rootDir);

  return projects;
}
