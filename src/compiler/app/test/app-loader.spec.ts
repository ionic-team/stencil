import { AppRegistry, BuildConfig, BuildContext, ComponentRegistry, LoadComponentRegistry } from '../../../util/interfaces';
import { generateLoader, injectAppIntoLoader } from '../app-loader';
import { generatePreamble } from '../../util';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';


describe('build-project-files', () => {
  let mockStencilContent: string;
  let config: BuildConfig;

  beforeEach(() => {
    mockStencilContent = `('__APP__')`;
    config = {
      namespace: 'MyApp',
      fsNamespace: 'my-app',
      logger: mockLogger(),
      sys: mockStencilSystem(),
      hydratedCssClass: 'hydrated',
      publicPath: 'build'
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
            Mode1: { esm: 'Mode1_es2015', es5: 'Mode1_es5' },
            Mode2: { esm: 'Mode2_es2015', es5: 'Mode2_es5' },
          }
        }
      };

      const appLoader = injectAppIntoLoader(
        config,
        'my-app.core.js',
        'my-app.core.ssr.js',
        'my-app.core.pf.js',
        cmpRegistry,
        `("__APP__")`
      );

      expect(appLoader).toBe(`("MyApp","build/my-app/","my-app.core.js","my-app.core.ssr.js","my-app.core.pf.js\",[["root-cmp",{"Mode1":["Mode1_es2015","Mode1_es5"],"Mode2":["Mode2_es2015","Mode2_es5"]}]])`);
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

    it('includes the injected app', async () => {
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(`pretend i am code ('__APP__') yeah me too`));
      const res = await callGenerateLoader();
      let lines = res.split('\n');
      expect(lines[1]).toEqual(`pretend i am code ("MyApp","build/myapp/","myapp.core.js","myapp.core.ssr.js","myapp.core.pf.js",[]) yeah me too`);
    });
  });

  async function callGenerateLoader(params?: {
    namespace?: string,
    publicPath?: string,
    componentRegistry?: ComponentRegistry
  }) {
    config.namespace = 'MyApp';
    config.fsNamespace = config.namespace.toLowerCase();
    config.publicPath = 'build/';

    let ctx: BuildContext = { appFiles: {} };

    let appRegistry: AppRegistry = {
      core: 'myapp.core.js',
      coreSsr: 'myapp.core.ssr.js',
      corePolyfilled: 'myapp.core.pf.js',
      components: {},
      namespace: config.namespace,
      fsNamespace: config.fsNamespace
    };

    return await generateLoader(
      config,
      ctx,
      appRegistry,
      (params && params.componentRegistry) || {}
    );
  }

});
