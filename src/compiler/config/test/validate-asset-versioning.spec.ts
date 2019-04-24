import * as d from '@stencil/core/declarations';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { validateConfig } from '../validate-config';


describe('validateAssetVerioning', () => {

  let config: d.Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/'
    };
  });


  it('should default null', () => {
    validateConfig(config);
    expect(config.assetVersioning).toBe(null);
  });

});
