import { BuildCtx, CompilerCtx, ComponentRegistry, Config, EntryModule } from '../../declarations';
import { generateAppFiles } from '../../compiler/app/generate-app-files';
import { getBuildContext } from '../../compiler/build/build-utils';
import { mockCompilerCtx, mockConfig } from '../../testing/mocks';
import { validateConfig } from '../../compiler/config/validate-config';


describe('client publicPath', () => {

  let config: Config;
  let compilerCtx: CompilerCtx;
  let componentRegistry: ComponentRegistry;
  let buildCtx: BuildCtx;
  let entryModules: EntryModule[];

  beforeEach(() => {
    config = mockConfig();
    config.buildAppCore = true;
    config._isValidated = false;
    compilerCtx = mockCompilerCtx();
    componentRegistry = {};
    entryModules = [];
  });


  describe('same domain', () => {

    it('change www.build', async () => {
      config.outputTargets = [
        {
          type: 'www',
          buildPath: 'my-build'
        }
      ];
      config = validateConfig(config);

      buildCtx = getBuildContext(config, compilerCtx, null);

      await generateAppFiles(config, compilerCtx, buildCtx, entryModules, componentRegistry);

      const appLoaderJs = await compilerCtx.fs.readFile('/www/my-build/app.js');
      expect(appLoaderJs).toBeDefined();

      const appCoreJs = await compilerCtx.fs.readFile('/www/my-build/app/app.core.js');
      expect(appCoreJs).toBeDefined();
    });

    it('change www.dir and www.buildDir', async () => {
      config.namespace = 'MyNamespace';
      delete config.fsNamespace;
      config.outputTargets = [
        {
          type: 'www',
          path: 'my-www',
          buildPath: 'my-www-build'
        },
        {
          type: 'dist',
          path: 'my-dist',
          buildPath: 'my-dist-build'
        }
      ];
      config = validateConfig(config);

      buildCtx = getBuildContext(config, compilerCtx, null);

      await generateAppFiles(config, compilerCtx, buildCtx, entryModules, componentRegistry);

      const appWwwLoaderJs = await compilerCtx.fs.readFile('/my-www/my-www-build/mynamespace.js');
      expect(appWwwLoaderJs).toBeDefined();

      const appWwwCoreJs = await compilerCtx.fs.readFile('/my-www/my-www-build/mynamespace/mynamespace.core.js');
      expect(appWwwCoreJs).toBeDefined();

      const appDistLoaderJs = await compilerCtx.fs.readFile('/my-dist/my-dist-build/mynamespace.js');
      expect(appDistLoaderJs).toBeDefined();

      const appDistCoreJs = await compilerCtx.fs.readFile('/my-dist/my-dist-build/mynamespace/mynamespace.core.js');
      expect(appDistCoreJs).toBeDefined();
    });

    it('writes distribution loader, app core and app core es5, default config w/ es5 build', async () => {
      config.outputTargets = [{
        type: 'dist'
      }];
      config.buildEs5 = true;
      config = validateConfig(config);
      buildCtx = getBuildContext(config, compilerCtx, null);

      await generateAppFiles(config, compilerCtx, buildCtx, entryModules, componentRegistry);

      const apDistLoaderJs = await compilerCtx.fs.readFile('/dist/app.js');
      expect(apDistLoaderJs).toBeDefined();

      const appDistCoreJs = await compilerCtx.fs.readFile('/dist/app/app.core.js');
      expect(appDistCoreJs).toBeDefined();

      const appDistCorePolyfillJs = await compilerCtx.fs.readFile('/dist/app/app.core.pf.js');
      expect(appDistCorePolyfillJs).toBeDefined();

      const wwwLoaderExists = await compilerCtx.fs.access('/www/build/app.js');
      expect(wwwLoaderExists).toBe(false);
    });

    it('writes www loader, app core and app core es5, default config w/ es5 build', async () => {
      config.buildEs5 = true;
      config = validateConfig(config);
      buildCtx = getBuildContext(config, compilerCtx, null);

      await generateAppFiles(config, compilerCtx, buildCtx, entryModules, componentRegistry);

      const appWwwLoaderJs = await compilerCtx.fs.readFile('/www/build/app.js');
      expect(appWwwLoaderJs).toBeDefined();

      const appWwwCoreJs = await compilerCtx.fs.readFile('/www/build/app/app.core.js');
      expect(appWwwCoreJs).toBeDefined();

      const appWwwCorePolyfillJs = await compilerCtx.fs.readFile('/www/build/app/app.core.pf.js');
      expect(appWwwCorePolyfillJs).toBeDefined();

      const distLoaderExists = await compilerCtx.fs.access('/dist/app.js');
      expect(distLoaderExists).toBe(false);
    });

  });

});
