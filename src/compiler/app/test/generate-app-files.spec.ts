import { injectAppIntoLoader } from '../app-loader';
import { getAppPublicPath } from '../app-core';
import { BuildConfig, LoadComponentRegistry } from '../../../util/interfaces';
import { mockStencilSystem } from '../../../test';


describe('build-project-files', () => {

  describe('inject project', () => {

    it('should set the loader arguments', () => {
      config.namespace = 'MyApp';
      config.publicPath = 'build/';
      const publicpath = getAppPublicPath(config);
      const projectCoreFileName = 'myapp.core.js';
      const projectCoreEs5FileName = 'myapp.core.ce.js';
      const componentRegistry: LoadComponentRegistry[] = [];

      const projectLoader = injectAppIntoLoader(
        config,
        projectCoreFileName,
        projectCoreEs5FileName,
        publicpath,
        componentRegistry,
        mockStencilContent
      );

      expect(projectLoader).toBe(`("MyApp","build/myapp/myapp.core.js","build/myapp/myapp.core.ce.js",[])`);
    });

  });

  var mockStencilContent = `('__STENCIL__APP__')`;
  var config: BuildConfig = {
    sys: mockStencilSystem()
  };

});
