import * as d from '../../../declarations';
import { buildJestArgv } from '../jest-config';
import { parseFlags } from '../../../cli/parse-flags';
import { TestingConfig } from '../../testing-config';
import path from 'path';


describe('jest-config', () => {

  it('force --runInBand arg when e2e test and --ci', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--ci', '--e2e']
    };
    const config = new TestingConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci', '--e2e']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.runInBand).toBe(true);
  });

  it('pass --runInBand arg to jest', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--runInBand']
    };
    const config = new TestingConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--runInBand']);
    expect(config.flags.unknownArgs).toEqual(['--runInBand']);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.runInBand).toBe(true);
  });

  it('pass --ci arg to jest', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', '--ci']
    };
    const config = new TestingConfig();
    config.flags = parseFlags(process);
    config.testing = {};

    expect(config.flags.args).toEqual(['--ci']);
    expect(config.flags.unknownArgs).toEqual([]);

    const jestArgv = buildJestArgv(config);
    expect(jestArgv.ci).toBe(true);
    expect(jestArgv.runInBand).not.toBe(true);
  });

  it('pass test spec arg to jest', () => {
    const process: any = {
      argv: ['node', 'stencil', 'test', 'hello.spec.ts']
    };
    const config = new TestingConfig();
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
    const config = new TestingConfig();
    config.flags = parseFlags(process);
    config.testing = {
      testMatch: ['hello.spec.ts']
    };

    expect(config.flags.task).toBe('test');

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.testMatch).toEqual(['hello.spec.ts']);
  });

  it('set jestArgv config rootDir', () => {
    const rootDir = path.resolve('/');
    const process: any = {
      argv: ['node stencil test']
    };
    const config = new TestingConfig();
    config.rootDir = rootDir;
    config.flags = parseFlags(process);
    config.testing = {};

    const jestArgv = buildJestArgv(config);
    const parsedConfig = JSON.parse(jestArgv.config) as d.JestConfig;
    expect(parsedConfig.rootDir).toBe(rootDir);
  });

});
