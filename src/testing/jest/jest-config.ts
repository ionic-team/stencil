import type * as d from '@stencil/core/internal';
import type { Config } from '@jest/types';
import { isString } from '@utils';

export function buildJestArgv(config: d.Config) {
  const yargs = require('yargs');

  const args = [...config.flags.unknownArgs.slice(), ...config.flags.knownArgs.slice()];

  if (!args.some((a) => a.startsWith('--max-workers') || a.startsWith('--maxWorkers'))) {
    args.push(`--max-workers=${config.maxConcurrentWorkers}`);
  }

  if (config.flags.devtools) {
    args.push('--runInBand');
  }

  config.logger.info(config.logger.magenta(`jest args: ${args.join(' ')}`));

  const { options } = require('jest-cli/build/cli/args');
  const jestArgv = yargs(args).options(options).argv as Config.Argv;
  jestArgv.config = buildJestConfig(config);

  if (typeof jestArgv.maxWorkers === 'string') {
    try {
      jestArgv.maxWorkers = parseInt(jestArgv.maxWorkers, 10);
    } catch (e) {}
  }

  if (typeof jestArgv.ci === 'string') {
    jestArgv.ci = jestArgv.ci === 'true' || jestArgv.ci === '';
  }

  return jestArgv;
}

export function buildJestConfig(config: d.Config) {
  const stencilConfigTesting = config.testing;
  const jestDefaults: Config.DefaultOptions = require('jest-config').defaults;

  const validJestConfigKeys = Object.keys(jestDefaults);

  const jestConfig: d.JestConfig = {};

  Object.keys(stencilConfigTesting).forEach((key) => {
    if (validJestConfigKeys.includes(key)) {
      (jestConfig as any)[key] = (stencilConfigTesting as any)[key];
    }
  });

  // https://github.com/facebook/jest/commit/8d3ddd5db440088f4488fbb4aaffe8ae4f5401e5#diff-7677b25b723832a937d598022186bd20

  jestConfig.rootDir = config.rootDir;

  if (isString(stencilConfigTesting.collectCoverage)) {
    jestConfig.collectCoverage = stencilConfigTesting.collectCoverage;
  }
  if (Array.isArray(stencilConfigTesting.collectCoverageFrom)) {
    jestConfig.collectCoverageFrom = stencilConfigTesting.collectCoverageFrom;
  }
  if (isString(stencilConfigTesting.coverageDirectory)) {
    jestConfig.coverageDirectory = stencilConfigTesting.coverageDirectory;
  }
  if (stencilConfigTesting.coverageThreshold) {
    jestConfig.coverageThreshold = stencilConfigTesting.coverageThreshold;
  }
  if (isString(stencilConfigTesting.globalSetup)) {
    jestConfig.globalSetup = stencilConfigTesting.globalSetup;
  }
  if (isString(stencilConfigTesting.globalTeardown)) {
    jestConfig.globalTeardown = stencilConfigTesting.globalTeardown;
  }
  if (isString(stencilConfigTesting.preset)) {
    jestConfig.preset = stencilConfigTesting.preset;
  }
  if (stencilConfigTesting.projects) {
    jestConfig.projects = stencilConfigTesting.projects;
  }
  if (Array.isArray(stencilConfigTesting.reporters)) {
    jestConfig.reporters = stencilConfigTesting.reporters;
  }
  if (isString(stencilConfigTesting.testResultsProcessor)) {
    jestConfig.testResultsProcessor = stencilConfigTesting.testResultsProcessor;
  }
  if (stencilConfigTesting.transform) {
    jestConfig.transform = stencilConfigTesting.transform;
  }
  if (stencilConfigTesting.verbose) {
    jestConfig.verbose = stencilConfigTesting.verbose;
  }

  return JSON.stringify(jestConfig);
}

export function getProjectListFromCLIArgs(config: d.Config, argv: Config.Argv): Config.Path[] {
  const projects = argv.projects ? argv.projects : [];

  projects.push(config.rootDir);

  return projects;
}
