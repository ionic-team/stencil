import { TestingCompiler, TestingConfig } from '../../../testing';
import { mockElement, mockHtml } from '../../testing/mocks';


describe('client publicPath', () => {

  let c: TestingCompiler;
  let config: TestingConfig;

  beforeEach(() => {
    (global as any).HTMLElement = class {};
  });

  afterEach(() => {
    delete (global as any).HTMLElement;
  });


  it('default www build w/ external loader script', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = '/User/testing/';

    c = new TestingCompiler(config);
    const wwwOutput = config.outputTargets.find(o => o.type === 'www');

    await c.fs.writeFiles({
      '/User/testing/src/components/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
      '/User/testing/src/index.html': `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="/build/app.js"></script>
        </head>
        <body>
          <cmp-a></cmp-a>
        </body>
        </html>
      `,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const indexHtml = await c.fs.readFile(wwwOutput.indexHtml);

    const { win, doc } = mockDom(indexHtml, { url: 'http://emmitts-garage.com/?core=es2015' });

    const loaderScriptElm = doc.head.querySelector('script[src="/build/app.js"]');
    expect(loaderScriptElm).not.toBe(null);

    const loaderContent = await c.fs.readFile('/User/testing/www/build/app.js');
    execScript(win, doc, loaderContent);

    const coreScriptElm = doc.head.querySelector('script[data-path][data-namespace]');
    expect(coreScriptElm).not.toBe(null);

    const coreScriptSrc = coreScriptElm.getAttribute('src');
    const buildPath = coreScriptElm.getAttribute('data-path');
    const fsNamespace = coreScriptElm.getAttribute('data-namespace');

    expect(coreScriptSrc).toBe('/build/app/app.core.js');
    expect(buildPath).toBe('/build/app/');
    expect(fsNamespace).toBe('app');

    const coreContent = await c.fs.readFile('/User/testing/www/build/app/app.core.js');
    execScript(win, doc, coreContent);
  });


  function mockDom(html: string, opts: any): { win: Window, doc: HTMLDocument } {
    const jsdom = require('jsdom');
    const dom = new jsdom.JSDOM(html, opts);

    const win = dom.window;
    const doc = win.document;

    win.fetch = {};

    win.CSS = {
      supports: () => true
    };

    win.requestAnimationFrame = (cb: Function) => {
      setTimeout(cb);
    };

    win.performance = {
      now: () => Date.now()
    };

    win.CustomEvent = class {};

    win.customElements = {
      define: (tag: string) => true
    };

    win.dispatchEvent = () => true;

    return { win, doc };
  }

  function execScript(win: any, doc: any, jsContent: string) {
    jsContent = jsContent.replace(/import\(/g, 'mockImport(');
    const winFn = new Function('window', 'document', jsContent);
    winFn(win, doc, jsContent);
  }

});
