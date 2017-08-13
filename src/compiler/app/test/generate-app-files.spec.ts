import { injectAppIntoLoader } from '../app-loader';
import { getAppPublicPath } from '../app-core';
import { BuildConfig, LoadComponentRegistry } from '../../../util/interfaces';
import { mockStencilSystem } from '../../../test';


describe('build-project-files', () => {

  describe('inject project', () => {

    it('should set the loader arguments', () => {
      config.namespace = 'MyApp';
      config.publicPath = 'build/';
      const publicPath = getAppPublicPath(config);
      const appCoreFileName = 'myapp.core.js';
      const appCorePolyfilledFileName = 'myapp.core.pf.js';
      const componentRegistry: LoadComponentRegistry[] = [];

      const projectLoader = injectAppIntoLoader(
        config,
        appCoreFileName,
        appCorePolyfilledFileName,
        publicPath,
        componentRegistry,
        mockStencilContent
      );

      expect(projectLoader).toBe(`("MyApp","build/myapp/myapp.core.js","build/myapp/myapp.core.pf.js",[])`);
    });

  });

  var mockStencilContent = `('__STENCIL__APP__')`;
  var config: BuildConfig = {
    sys: mockStencilSystem()
  };

});
