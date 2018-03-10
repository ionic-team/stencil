import { AppRegistry, CompilerCtx, ComponentRegistry, Config, LoadComponentRegistry, OutputTarget } from '../../../declarations';
import { generateLoader, injectAppIntoLoader } from '../app-loader';
import { generatePreamble } from '../../util';
import { mockCache, mockCompilerCtx, mockLogger, mockStencilSystem } from '../../../testing/mocks';


describe('build-project-files', () => {

  let mockStencilContent: string;
  let config: Config;
  let outputTarget: OutputTarget;

  beforeEach(() => {
    mockStencilContent = `('__APP__')`;

    config = {
      namespace: 'MyApp',
      fsNamespace: 'my-app',
      logger: mockLogger(),
      sys: mockStencilSystem(),
      hydratedCssClass: 'hydrated'
    };

    outputTarget = {
      type: 'www',
      publicPath: 'build',
    };
  });

  describe('injectAppIntoLoader', () => {

    let mockMinify: jest.Mock<any>;

    beforeEach(() => {
      mockMinify = jest.fn();
      mockMinify.mockReturnValue({ diagnostics: [] });  // NOTE: bad idea - typedef has this as optional, but not optional in the code under test...
      config.sys.minifyJs = mockMinify;
    });

    it('should set the loader arguments', () => {
      const cmpRegistry: ComponentRegistry = {
        'root-cmp': {
          bundleIds: {
            Mode1: 'abc',
            Mode2: 'def',
          }
        }
      };

      const appLoader = injectAppIntoLoader(
        config,
        outputTarget,
        'my-app.core.js',
        'my-app.core.pf.js',
        'hydrated-css',
        cmpRegistry,
        `("__APP__")`
      );

      expect(appLoader).toBe(`("MyApp","my-app","build/my-app/",true,"my-app.core.js","my-app.core.pf.js","hydrated-css",[["root-cmp",{"Mode1":"abc","Mode2":"def"}]])`);
    });

  });

  describe('generate loader', () => {

    let mockGetClientCoreFile: jest.Mock<Promise<string>>;

    beforeEach(() => {
      mockGetClientCoreFile = jest.fn();
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(''));
      config.sys.getClientCoreFile = mockGetClientCoreFile;
    });

    it('gets the client core minified file', async () => {
      config.minifyJs = true;
      await callGenerateLoader();
      expect(mockGetClientCoreFile.mock.calls.length).toEqual(1);
      expect(mockGetClientCoreFile.mock.calls[0][0]).toEqual({ staticName: 'loader.js' });
    });

    it('includes the injected app, w/ discoverPublicPath', async () => {
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(`pretend i am code ('__APP__') yeah me too`));

      const ctx = mockCompilerCtx();

      const appRegistry: AppRegistry = {
        core: 'myapp.core.js',
        corePolyfilled: 'myapp.core.pf.js',
        components: {},
        namespace: config.namespace,
        fsNamespace: config.fsNamespace
      };

      config.namespace = 'MyApp';
      config.fsNamespace = 'my-app';
      config.outputTargets = [
        { type: 'www', buildPath: 'build/my-app/', publicPath: '/my/custom/public/path/', discoverPublicPath: false }
      ];

      const res = await generateLoader(
        config,
        ctx,
        config.outputTargets[0],
        appRegistry,
        {}
      );

      const lines = res.split('\n');
      expect(lines[1]).toEqual(`pretend i am code ("MyApp","my-app","/my/custom/public/path/",false,"myapp.core.js","myapp.core.pf.js","hydrated",[]) yeah me too`);
    });

    it('includes the injected app', async () => {
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(`pretend i am code ('__APP__') yeah me too`));
      const res = await callGenerateLoader();
      const lines = res.split('\n');
      expect(lines[1]).toEqual(`pretend i am code ("MyApp","my-app","build/my-app/",true,"myapp.core.js","myapp.core.pf.js","hydrated",[]) yeah me too`);
    });

  });

  async function callGenerateLoader(params?: {
    namespace?: string,
    publicPath?: string,
    componentRegistry?: ComponentRegistry
  }) {
    config.namespace = 'MyApp';
    config.fsNamespace = 'my-app';
    config.outputTargets = [
      { type: 'www', buildPath: 'build/mp-app/', publicPath: 'build/' }
    ];

    const ctx = mockCompilerCtx();

    const appRegistry: AppRegistry = {
      core: 'myapp.core.js',
      corePolyfilled: 'myapp.core.pf.js',
      components: {},
      namespace: config.namespace,
      fsNamespace: config.fsNamespace
    };

    return await generateLoader(
      config,
      ctx,
      config.outputTargets[0],
      appRegistry,
      (params && params.componentRegistry) || {}
    );
  }

});
