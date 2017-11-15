import { AppRegistry, BuildConfig, BuildContext, LoadComponentRegistry } from '../../../util/interfaces';
import { generateLoader, injectAppIntoLoader } from '../app-loader';
import { generatePreamble } from '../../util';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';


describe('build-project-files', () => {
  let mockStencilContent: string;
  let config: BuildConfig;

  beforeEach(() => {
    mockStencilContent = `('__APP__')`;
    config = {
      logger: mockLogger(),
      sys: mockStencilSystem(),
      hydratedCssClass: 'hydrated'
    };
  });

  describe('inject project', () => {
    let mockMinify: jest.Mock<any>;
    beforeEach(() => {
      mockMinify = jest.fn();
      mockMinify.mockReturnValue({ diagnostics: [] });  // NOTE: bad idea - typedef has this as optional, but not optional in the code under test...
      config.sys.minifyJs = mockMinify;
    });

    it('should set the loader arguments', () => {
      const loadCmp: LoadComponentRegistry = ['my-app', { Mode1: 'something', Mode2: 'Something Else' }, false, null, null, null, null, null];
      const projectLoader = callInjectAppIntoLoader({
        componentRegistry: [loadCmp]
      });
      expect(projectLoader).toBe(`("MyApp","build/myapp/","myapp.core.js","myapp.core.ssr.js","myapp.core.pf.js",[["my-app",{"Mode1":"something","Mode2":"Something Else"},false,null,null,null,null,null]])`);
    });

    it('only replaces the magic string', () => {
      mockStencilContent = `(This is bogus text'__APP__'yeah, me too)`;
      const projectLoader = callInjectAppIntoLoader();
      expect(projectLoader).toBe(`(This is bogus text"MyApp","build/myapp/","myapp.core.js","myapp.core.ssr.js","myapp.core.pf.js",[]yeah, me too)`);
    });

  });

  describe('generate loader', () => {
    let mockGetClientCoreFile: jest.Mock<Promise<string>>;
    beforeEach(() => {
      mockGetClientCoreFile = jest.fn();
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(''));
      config.sys.getClientCoreFile = mockGetClientCoreFile;
    });

    it('gets the client core minified file', () => {
      config.minifyJs = true;
      callGenerateLoader();
      expect(mockGetClientCoreFile.mock.calls.length).toEqual(1);
      expect(mockGetClientCoreFile.mock.calls[0][0]).toEqual({ staticName: 'loader.js' });
    });

    it('includes the generted banner', async () => {
      const preamble = generatePreamble(config); // lack of DI makes this harder to test, so will just pre-calc
      const res = await callGenerateLoader();
      expect(res).toEqual(preamble.trim());
    });

    it('includes the injected app', async () => {
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(`pretend i am code ('__APP__') yeah me too`));
      const res = await callGenerateLoader();
      let lines = res.split('\n');
      expect(lines[1]).toEqual(`pretend i am code ("MyApp","build/myapp/","myapp.core.js","myapp.core.ssr.js","myapp.core.pf.js",[]) yeah me too`);
    });
  });

  function callInjectAppIntoLoader(params?: {
    namespace?: string,
    publicPath?: string,
    appCoreFileName?: string,
    appCoreSsrFileName?: string,
    appCorePolyfillFileName?: string,
    componentRegistry?: Array<LoadComponentRegistry>
  }): string {
    let p = params || {};
    config.namespace = 'MyApp';
    config.publicPath = 'build/';
    return injectAppIntoLoader(
      config,
      p.appCoreFileName || 'myapp.core.js',
      p.appCoreSsrFileName || 'myapp.core.ssr.js',
      p.appCorePolyfillFileName || 'myapp.core.pf.js',
      p.componentRegistry || [],
      mockStencilContent
    );
  }

  async function callGenerateLoader(params?: {
    namespace?: string,
    publicPath?: string,
    componentRegistry?: Array<LoadComponentRegistry>
  }) {
    config.namespace = 'MyApp';
    config.publicPath = 'build/';

    let ctx: BuildContext = { appFiles: {} };

    let appRegistry: AppRegistry = {
      core: 'myapp.core.js',
      coreSsr: 'myapp.core.ssr.js',
      corePolyfilled: 'myapp.core.pf.js',
      components: [],
      namespace: config.namespace
    };

    return await generateLoader(
      config,
      ctx,
      appRegistry
    );
  }

});
