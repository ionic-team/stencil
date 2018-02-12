import * as loader from '../loader';
import { LoadComponentRegistry } from '../../declarations';
import { mockWindow } from '../../testing/mocks';


describe('loader', () => {

  let win: any;
  let doc: HTMLDocument;
  let docScripts: HTMLScriptElement[];
  let appNamespace: string;
  let urlNamespace: string;
  let publicPath: string;
  let discoverPublicPath: boolean;
  let appCore: string;
  let appCorePolyfilled: string;
  let hydratedCssClass: string;
  let components: LoadComponentRegistry[];

  beforeEach(() => {
    win = mockWindow();
    doc = win.document;
    docScripts = doc.scripts as any;
    appNamespace = 'AppNameSpace';
    urlNamespace = 'app-namespace';
    publicPath = '/build/app-namespace/';
    discoverPublicPath = true;
    appCore = 'app.core.js';
    appCorePolyfilled = 'app.core.pf.js';
    hydratedCssClass = 'hydrated';
    components = [];
  });

  describe('init', () => {

    describe('publicPath', () => {

      it('should not discover public path, but always use given path', () => {
        const script1 = doc.createElement('script');
        script1.src = '/assets1/script1/file.js';

        const script2 = doc.createElement('script');
        script2.src = '/assets2/script2/file.js';

        discoverPublicPath = false;
        publicPath = '/my-awesome-public/path/';

        docScripts = [
          script1,
          script2
        ];
        loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
        const script = doc.head.children[0];
        expect(script.getAttribute('data-path')).toBe('/my-awesome-public/path/');
      });

      it('should discover public path from last script', () => {
        const script1 = doc.createElement('script');
        script1.src = '/assets1/script1/file.js';

        const script2 = doc.createElement('script');
        script2.src = '/assets2/script2/file.js';

        discoverPublicPath = true;
        docScripts = [
          script1,
          script2
        ];
        loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
        const script = doc.head.children[0];
        expect(script.getAttribute('data-path')).toBe('/assets2/script2/app-namespace/');
      });

    });

    it('set window namespace', () => {
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      expect(win[appNamespace]).toBeDefined();
    });

    it('set window namespace components', () => {
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      expect(win[appNamespace].components).toBe(components);
    });

    it('add <style> when components w/ styles', () => {
      components = [
        ['cmp-tag', {}, true] as any
      ];
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const style = doc.head.querySelector('style');
      expect(style.hasAttribute('data-styles')).toBeTruthy();
      expect(style.innerHTML.indexOf('cmp-tag') > -1).toBeTruthy();
      expect(style.innerHTML.indexOf('{visibility:hidden}') > -1).toBeTruthy();
    });

    it('do not add <style> when no components w/ styles', () => {
      components = [];
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const style = doc.head.querySelector('style');
      expect(style).toBeFalsy();
    });

    it('set script src attribute', () => {
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.children[0];
      expect(script.getAttribute('src')).toBe('/build/app-namespace/app.core.pf.js');
    });

    it('set script public path data attribute', () => {
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.children[0];
      expect(script.getAttribute('data-path')).toBe(publicPath);
    });

    it('set script appNamespace data attribute', () => {
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.children[0];
      expect(script.getAttribute('data-namespace')).toBe(urlNamespace);
    });

    it('parse file:// src', () => {
      const scriptElm = doc.createElement('script');
      scriptElm.src = 'file:///c:/path/to/my%20bundle.js';
      doc.head.appendChild(scriptElm);
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.lastElementChild;
      expect(script.getAttribute('src')).toBe('file:///c:/path/to/app-namespace/app.core.pf.js');
    });

    it('parse http:// src', () => {
      const scriptElm = doc.createElement('script');
      scriptElm.src = 'http://domain.com/some/path/bundle.js';
      doc.head.appendChild(scriptElm);
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.lastElementChild;
      expect(script.getAttribute('src')).toBe('http://domain.com/some/path/app-namespace/app.core.pf.js');
    });

    it('parse ../ src', () => {
      const scriptElm = doc.createElement('script');
      scriptElm.src = '../bundle.js';
      doc.head.appendChild(scriptElm);
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.lastElementChild;
      expect(script.getAttribute('src')).toBe('../app-namespace/app.core.pf.js');
    });

    it('parse ./ src', () => {
      const scriptElm = doc.createElement('script');
      scriptElm.src = './bundle.js';
      doc.head.appendChild(scriptElm);
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.lastElementChild;
      expect(script.getAttribute('src')).toBe('./app-namespace/app.core.pf.js');
    });

    it('parse src', () => {
      const scriptElm = doc.createElement('script');
      scriptElm.src = 'bundle.js';
      doc.head.appendChild(scriptElm);
      loader.init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components);
      const script = doc.head.lastElementChild;
      expect(script.getAttribute('src')).toBe('app-namespace/app.core.pf.js');
    });

  });

  // TODO: how can we write a test for dynamic import()
  // describe('supportsEsModules', () => {

  //   it('supportsEsModules true', () => {
  //     const scriptElm: any = {
  //       noModule: {}
  //     };
  //     expect(loader.supportsEsModules(scriptElm)).toBeTruthy();
  //   });

  //   it('supportsEsModules false', () => {
  //     const scriptElm: any = {};
  //     expect(loader.supportsEsModules(scriptElm)).toBeFalsy();
  //   });

  // });

  describe('supportsCustomElements', () => {

    it('supportsCustomElements true', () => {
      win = {
        customElements: {}
      };
      expect(loader.supportsCustomElements(win)).toBeTruthy();
    });

    it('supportsCustomElements false', () => {
      win = {};
      expect(loader.supportsCustomElements(win)).toBeFalsy();
    });

  });

  describe('supportsFetch', () => {

    it('supportsFetch true', () => {
      win = {
        fetch: {}
      };
      expect(loader.supportsFetch(win)).toBeTruthy();
    });

    it('supportsFetch false', () => {
      win = {};
      expect(loader.supportsFetch(win)).toBeFalsy();
    });

  });

  describe('supportsCssVariables', () => {

    it('supportsCssVariables true', () => {
      win = {
        CSS: {
          supports: function() { return true; }
        }
      };
      expect(loader.supportsCssVariables(win)).toBeTruthy();
    });

    it('supportsCssVariables false, no window.CSS.supports css variable', () => {
      win = {
        CSS: {
          supports: function() { return false; }
        }
      };
      expect(loader.supportsCssVariables(win)).toBeFalsy();
    });

    it('supportsCssVariables false, no window.CSS.supports', () => {
      win = {
        CSS: {}
      };
      expect(loader.supportsCssVariables(win)).toBeFalsy();
    });

    it('supportsCssVariables false, no window.CSS', () => {
      win = {};
      expect(loader.supportsCssVariables(win)).toBeFalsy();
    });

  });

});
