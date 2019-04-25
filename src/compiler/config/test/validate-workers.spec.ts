import * as d from '@stencil/core/declarations';
import { validateConfig } from '../validate-config';
import { mockLogger } from '@stencil/core/testing';
import path from 'path';


describe('validate-workers', () => {

  let config: d.Config;
  const logger = mockLogger();

  beforeEach(() => {
    config = {
      sys: {
        path: path
      } as any,
      logger: logger,
      rootDir: '/',
      namespace: 'Testing'
    };
    config.sys.details = {
      cpuModel: 'cpuModel',
      cpus: 8,
      platform: 'darwin',
      release: '17.6.0',
      runtime: 'node',
      runtimeVersion: 'v10.0.0',
      tmpDir: '/tmpdir'
    };
  });

  it('set maxConcurrentWorkers, but dont let it go under 1', () => {
    config.maxConcurrentWorkers = 0;
    validateConfig(config);
    expect(config.maxConcurrentWorkers).toBe(1);
  });

  it('set maxConcurrentWorkers, but dont let it get over the number of cpus', () => {
    config.maxConcurrentWorkers = 8000;
    validateConfig(config);
    expect(config.maxConcurrentWorkers).toBe(8);
  });

  it('set maxConcurrentWorkers from flags', () => {
    config.flags = {
      maxWorkers: 1
    };
    config.maxConcurrentWorkers = 4;
    validateConfig(config);
    expect(config.maxConcurrentWorkers).toBe(1);
  });

  it('set maxConcurrentWorkers', () => {
    config.maxConcurrentWorkers = 4;
    validateConfig(config);
    expect(config.maxConcurrentWorkers).toBe(4);
  });

  it('default maxConcurrentWorkers from number of cpus', () => {
    validateConfig(config);
    expect(config.maxConcurrentWorkers).toBe(8);
  });

  it('set maxConcurrentTasksPerWorker but dont let it go below 1', () => {
    config.maxConcurrentTasksPerWorker = 0;
    validateConfig(config);
    expect(config.maxConcurrentTasksPerWorker).toBe(1);
  });

  it('set maxConcurrentTasksPerWorker but dont let it get too many', () => {
    config.maxConcurrentTasksPerWorker = 88;
    validateConfig(config);
    expect(config.maxConcurrentTasksPerWorker).toBe(20);
  });

  it('set maxConcurrentTasksPerWorker', () => {
    config.maxConcurrentTasksPerWorker = 5;
    validateConfig(config);
    expect(config.maxConcurrentTasksPerWorker).toBe(5);
  });

  it('default maxConcurrentTasksPerWorker', () => {
    validateConfig(config);
    expect(config.maxConcurrentTasksPerWorker).toBe(2);
  });

});
