import type * as d from '@stencil/core/declarations';
import { buildJestArgv } from '../jest-config';
import { mockConfig } from '@stencil/core/testing';
import { parseFlags } from '../../../cli/parse-flags';
import path from 'path';

describe('jest-config', () => {
  it('pass --maxWorkers=2 arg when --max-workers=2', () => {
    const args = ['test', '--ci', '--max-workers=2'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci', '--max-workers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('pass --maxWorkers=2 arg when e2e test and --ci', () => {
    const args = ['test', '--ci', '--e2e', '--max-workers=2'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci', '--e2e', '--max-workers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('forces --maxWorkers=4 arg when e2e test and --ci', () => {
    const args = ['test', '--ci', '--e2e'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci', '--e2e']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(0);
  });

  it('pass --maxWorkers=2 arg to jest', () => {
    const args = ['test', '--maxWorkers=2'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    expect(config.flags.args).toEqual(['--maxWorkers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('--maxWorkers arg is set from config', () => {
    const config = mockConfig();
    config.testing = {};
    config.maxConcurrentWorkers = 3;
    config.flags = parseFlags(['test'], config.sys);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.maxWorkers).toBe(3);
  });

  it('--maxWorkers arg is not set from config when --runInBand is used', () => {
    const config = mockConfig();
    config.testing = {};
    config.maxConcurrentWorkers = 3;

    const args = ['test', '--runInBand'];
    config.flags = parseFlags(args, config.sys);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.maxWorkers).toBeUndefined();
  });

  it('pass --ci arg to jest', () => {
    const args = ['test', '--ci'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(config.maxConcurrentWorkers);
  });

  it('sets legacy jest options', () => {
    const args = ['test'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    const jestArgv = buildJestArgv(config);

    expect(jestArgv.detectLeaks).toBe(false);
    expect(jestArgv['detect-leaks']).toBe(false);
    expect(jestArgv.detectOpenHandles).toBe(false);
    expect(jestArgv['detect-open-handles']).toBe(false);
    expect(jestArgv.detectLeaks).toBe(false);
    expect(jestArgv['detect-leaks']).toBe(false);
    expect(jestArgv.errorOnDeprecated).toBe(false);
    expect(jestArgv['error-on-deprecated']).toBe(false);
    expect(jestArgv.listTests).toBe(false);
    expect(jestArgv['list-tests']).toBe(false);
    expect(jestArgv.maxConcurrency).toBe(5);
    expect(jestArgv['max-concurrency']).toBe(5);
    expect(jestArgv.notifyMode).toBe('failure-change');
    expect(jestArgv['notify-mode']).toBe('failure-change');
    expect(jestArgv.passWithNoTests).toBe(false);
    expect(jestArgv['pass-with-no-tests']).toBe(false);
    expect(jestArgv.runTestsByPath).toBe(false);
    expect(jestArgv['run-tests-by-path']).toBe(false);
    expect(jestArgv.testLocationInResults).toBe(false);
    expect(jestArgv['test-location-in-results']).toBe(false);
  });

  it('pass test spec arg to jest', () => {
    const args = ['test', 'hello.spec.ts'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    expect(config.flags.args).toEqual(['hello.spec.ts']);
    expect(config.flags.unknownArgs).toEqual(['hello.spec.ts']);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv._).toEqual(['hello.spec.ts']);
  });

  it('pass test config to jest', () => {
    const args = ['test'];
    const config = mockConfig();
    config.flags = parseFlags(args, config.sys);
    config.testing = {
      testMatch: ['hello.spec.ts'],
    };

    expect(config.flags.task).toBe('test');

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.testMatch).toEqual(['hello.spec.ts']);
  });

  it('set jestArgv config reporters', () => {
    const rootDir = path.resolve('/');
    const args = ['test'];
    const config = mockConfig();
    config.rootDir = rootDir;
    config.flags = parseFlags(args, config.sys);
    config.testing = {
      reporters: ['default', ['jest-junit', { suiteName: 'jest tests' }]],
    };

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.reporters).toHaveLength(2);
    expect(parsedConfig.reporters[0]).toBe('default');
    expect(parsedConfig.reporters[1][0]).toBe('jest-junit');
    expect(parsedConfig.reporters[1][1].suiteName).toBe('jest tests');
  });

  it('set jestArgv config rootDir', () => {
    const rootDir = path.resolve('/');
    const args = ['test'];
    const config = mockConfig();
    config.rootDir = rootDir;
    config.flags = parseFlags(args, config.sys);
    config.testing = {};

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.rootDir).toBe(rootDir);
  });

  it('set jestArgv config collectCoverageFrom', () => {
    const rootDir = path.resolve('/');
    const args = ['test'];
    const config = mockConfig();
    config.rootDir = rootDir;
    config.flags = parseFlags(args, config.sys);
    config.testing = {
      collectCoverageFrom: ['**/*.+(ts|tsx)'],
    };

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.collectCoverageFrom).toHaveLength(1);
    expect(parsedConfig.collectCoverageFrom[0]).toBe('**/*.+(ts|tsx)');
  });
});
