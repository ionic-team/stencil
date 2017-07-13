import { injectProjectIntoLoader, injectProjectIntoCore } from '../build-project-files';
import { BuildConfig, LoadComponentRegistry } from '../../../util/interfaces';
import { mockStencilSystem } from '../../../test';


describe('build-project-files', () => {

  describe('inject project', () => {

    it('should set the loader arguments', () => {
      config.namespace = 'MyApp';
      const staticBuildDir = 'build/myapp';
      const projectCoreFileName = 'myapp.core.js';
      const projectCoreEs5FileName = 'myapp.core.ce.js';
      const componentRegistry: LoadComponentRegistry[] = [];

      const projectLoader = injectProjectIntoLoader(
        config,
        staticBuildDir,
        projectCoreFileName,
        projectCoreEs5FileName,
        componentRegistry,
        mockStencilContent
      );

      expect(projectLoader).toBe(`("MyApp","build/myapp/myapp.core.js","build/myapp/myapp.core.ce.js",[])`);
    });

    it('should set the core arguments', () => {
      config.namespace = 'MyApp';
      const staticBuildDir = 'build/myapp';

      const projectLoader = injectProjectIntoCore(
        config,
        staticBuildDir,
        mockStencilContent
      );

      expect(projectLoader).toBe(`("MyApp","build/myapp/")`);
    });

  });

  var mockStencilContent = `('__STENCIL__APP__')`;
  var config: BuildConfig = {
    sys: mockStencilSystem()
  };

});
