import type * as d from '@stencil/core/declarations';
import { buildJestArgv } from '../jest-config';
import { mockValidatedConfig } from '@stencil/core/testing';
import { parseFlags } from '../../../cli/parse-flags';
import path from 'path';

describe('jest-config', () => {
  it('pass --maxWorkers=2 arg when --max-workers=2', () => {
    const args = ['test', '--ci', '--max-workers=2'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

    expect(config.flags.args).toEqual(['--ci', '--max-workers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('marks outputFile as a Jest argument', () => {
    const args = ['test', '--ci', '--outputFile=path/to/my-file'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);
    expect(config.flags.args).toEqual(['--ci', '--outputFile=path/to/my-file']);
    expect(config.flags.unknownArgs).toEqual([]);
    const jestArgv = buildJestArgv(config);
    expect(jestArgv.outputFile).toBe('path/to/my-file');
  });

  it('pass --maxWorkers=2 arg when e2e test and --ci', () => {
    const args = ['test', '--ci', '--e2e', '--max-workers=2'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

    expect(config.flags.args).toEqual(['--ci', '--e2e', '--max-workers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('forces --maxWorkers=4 arg when e2e test and --ci', () => {
    const args = ['test', '--ci', '--e2e'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

    expect(config.flags.args).toEqual(['--ci', '--e2e']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(0);
  });

  it('pass --maxWorkers=2 arg to jest', () => {
    const args = ['test', '--maxWorkers=2'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

    expect(config.flags.args).toEqual(['--maxWorkers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('pass --ci arg to jest', () => {
    const args = ['test', '--ci'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

    expect(config.flags.args).toEqual(['--ci']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(config.maxConcurrentWorkers);
  });

  it('sets legacy jest options', () => {
    const args = ['test'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

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
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

    expect(config.flags.args).toEqual(['hello.spec.ts']);
    expect(config.flags.unknownArgs).toEqual(['hello.spec.ts']);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv._).toEqual(['hello.spec.ts']);
  });

  it('pass test config to jest', () => {
    const args = ['test'];
    const config = mockValidatedConfig({
      testing: {
        testMatch: ['hello.spec.ts'],
      },
    });
    config.flags = parseFlags(args);

    expect(config.flags.task).toBe('test');

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.testMatch).toEqual(['hello.spec.ts']);
  });

  it('set jestArgv config reporters', () => {
    const rootDir = path.resolve('/');
    const args = ['test'];
    const config = mockValidatedConfig({
      rootDir,
      testing: { reporters: ['default', ['jest-junit', { suiteName: 'jest tests' }]] },
    });
    config.flags = parseFlags(args);

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
    const config = mockValidatedConfig({ rootDir });
    config.flags = parseFlags(args);

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.rootDir).toBe(rootDir);
  });

  it('set jestArgv config collectCoverageFrom', () => {
    const rootDir = path.resolve('/');
    const args = ['test'];
    const config = mockValidatedConfig({ rootDir, testing: { collectCoverageFrom: ['**/*.+(ts|tsx)'] } });
    config.flags = parseFlags(args);

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.collectCoverageFrom).toHaveLength(1);
    expect(parsedConfig.collectCoverageFrom[0]).toBe('**/*.+(ts|tsx)');
  });

  it('passed flags should be respected over defaults', () => {
    const args = ['test', '--spec', '--passWithNoTests'];
    const config = mockValidatedConfig();
    config.flags = parseFlags(args);

    expect(config.flags.args).toEqual(['--spec', '--passWithNoTests']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.spec).toBe(true);
    expect(jestArgv.passWithNoTests).toBe(true);
  });
});
