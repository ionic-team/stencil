import * as d from '@stencil/core/declarations';
import { buildJestArgv } from '../jest-config';
import { mockConfig } from '@stencil/core/testing';
import { parseFlags } from '@stencil/core/cli';
import path from 'path';


describe('jest-config', () => {

  it('pass --maxWorkers=2 arg when --max-workers=2', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--ci', '--e2e', '--max-workers=2']
    };
    const config = mockConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci', '--e2e', '--max-workers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('pass --maxWorkers=2 arg when e2e test and --ci', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--ci', '--e2e', '--max-workers=2']
    };
    const config = mockConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci', '--e2e', '--max-workers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('force --maxWorkers=4 arg when e2e test and --ci', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--ci', '--e2e']
    };
    const config = mockConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci', '--e2e']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(1);
  });

  it('pass --maxWorkers=2 arg to jest', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--maxWorkers=2']
    };
    const config = mockConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--maxWorkers=2']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.maxWorkers).toBe(2);
  });

  it('pass --ci arg to jest', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--ci']
    };
    const config = mockConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.maxWorkers).toBe(config.maxConcurrentWorkers);
  });

  it('pass test spec arg to jest', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', 'hello.spec.ts']
    };
    const config = mockConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['hello.spec.ts']);
    expect(config.flags.unknownArgs).toEqual(['hello.spec.ts']);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv._).toEqual(['hello.spec.ts']);
  });

  it('pass test config to jest', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test']
    };
    const config = mockConfig();
    config.flags = parseFlags(process);
    config.testing = {
      testMatch: ['hello.spec.ts']
    };

    expect(config.flags.task).toBe('test');

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.testMatch).toEqual(['hello.spec.ts']);
  });

  it('set jestArgv config reporters', () => {
    const rootDir = path.resolve('/');
    const process: any = {
      argv: ['node stencil test']
    };
    const config = mockConfig();
    config.rootDir = rootDir;
    config.flags = parseFlags(process);
    config.testing = {
      reporters: [
        'default',
        ['jest-junit', { suiteName: 'jest tests' } ]
      ]
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
    const process: any = {
      argv: ['node stencil test']
    };
    const config = mockConfig();
    config.rootDir = rootDir;
    config.flags = parseFlags(process);
    config.testing = {};

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.rootDir).toBe(rootDir);
  });

});
