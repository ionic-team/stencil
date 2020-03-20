import * as d from '@stencil/core/declarations';
import { validateConfig } from '../validate-config';
import { mockLogger } from '@stencil/core/testing';
import path from 'path';

describe('validate-workers', () => {
  let userConfig: d.Config;
  const logger = mockLogger();

  beforeEach(() => {
    userConfig = {
      sys: {
        path: path,
      } as any,
      logger: logger,
      rootDir: '/',
      namespace: 'Testing',
    };
  });

  it('set maxConcurrentWorkers, but dont let it go under 0', () => {
    userConfig.maxConcurrentWorkers = -1;
    const { config } = validateConfig(userConfig);
    expect(config.maxConcurrentWorkers).toBe(0);
  });

  it('set maxConcurrentWorkers from ci flags', () => {
    userConfig.flags = {
      ci: true,
    };
    userConfig.maxConcurrentWorkers = 2;
    const { config } = validateConfig(userConfig);
    expect(config.maxConcurrentWorkers).toBe(4);
  });

  it('set maxConcurrentWorkers from flags', () => {
    userConfig.flags = {
      maxWorkers: 1,
    };
    userConfig.maxConcurrentWorkers = 4;
    const { config } = validateConfig(userConfig);
    expect(config.maxConcurrentWorkers).toBe(1);
  });

  it('set maxConcurrentWorkers', () => {
    userConfig.maxConcurrentWorkers = 4;
    const { config } = validateConfig(userConfig);
    expect(config.maxConcurrentWorkers).toBe(4);
  });
});
