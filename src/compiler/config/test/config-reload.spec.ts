import * as d from '@stencil/core/declarations';
import { configReload } from '../config-reload';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { normalizePath } from '@stencil/core/utils';
import { validateConfig } from '../validate-config';
import path from 'path';


describe('config-reload', () => {
  let config: d.Config;
  let logger: d.Logger;
  let updateConfig: d.Config;
  const root = path.resolve('/');

  beforeEach(() => {
    config = {
      logger: mockLogger(),
      sys: mockStencilSystem(),
      namespace: 'Testing'
    };
    logger = config.logger;
    config.rootDir = normalizePath(path.join(root, 'my-app'));
    config.cwd = normalizePath(path.join(root, 'my-app'));
    updateConfig = {};
  });

  it('should keep flags', () => {
    config.flags = {
      dev: true,
      debug: true,
      es5: true
    };
    validateConfig(config, [], false);

    expect(config.devMode).toBe(true);
    expect(logger.level).toBe('debug');
    expect(config.buildEs5).toBe(true);
    expect(config.autoprefixCss).toBe(undefined);

    updateConfig.autoprefixCss = false;
    configReload(config, updateConfig);

    expect(config.devMode).toBe(true);
    expect(logger.level).toBe('debug');
    expect(config.buildEs5).toBe(true);
    expect(config.autoprefixCss).toBe(false);
  });

  it('should update outputTarget', () => {
    validateConfig(config, [], false);
    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe(normalizePath(path.join(root, 'my-app', 'www')));

    updateConfig.outputTargets = [
      {
        type: 'www',
        dir: 'public'
      } as d.OutputTargetWww
    ];

    configReload(config, updateConfig);

    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe(normalizePath(path.join(root, 'my-app', 'public')));
  });

  it('should keep outputTarget', () => {
    validateConfig(config, [], false);
    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe(normalizePath(path.join(root, 'my-app', 'www')));

    configReload(config, updateConfig);

    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe(normalizePath(path.join(root, 'my-app', 'www')));
  });

  it('should keep watch the same', () => {
    config.watch = true;
    validateConfig(config, [], false);

    const orgWatch: any = config.watch;

    configReload(config, updateConfig);

    expect(config.watch).toBe(orgWatch);
  });

  it('should keep sys and logger the same', () => {
    validateConfig(config, [], false);

    const orgSys = config.sys;
    const orgLogger = config.logger;

    configReload(config, updateConfig);

    expect(config.sys).toBe(orgSys);
    expect(config.logger).toBe(orgLogger);
  });

  it('should keep rootDir and cwd the same', () => {
    const orgCwd = config.cwd;
    const rootCwd = config.rootDir;
    validateConfig(config, [], false);

    configReload(config, updateConfig);

    expect(config.cwd).toBe(orgCwd);
    expect(config.rootDir).toBe(rootCwd);
  });

});
