import * as d from '../../../declarations';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';
import * as path from 'path';

jest.setTimeout(10000);

describe('www loader/core resourcesUrl', () => {

  let c: TestingCompiler;
  let config: TestingConfig;
  const root = path.resolve('/');

  it('default config w/ external loader script', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');

    c = new TestingCompiler(config);
    const wwwOutput = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    expect(wwwOutput.resourcesUrl).toBeUndefined();

    await setupFs(c, '<script src="build/app.js"></script>');

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const { win, doc } = mockDom(wwwOutput.indexHtml);

    const loaderContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'www', 'build', 'app.js'));
    execScript(win, doc, loaderContent);

    const coreScriptElm = doc.head.querySelector('script[data-resources-url][data-namespace="app"]');
    const resourcesUrl = coreScriptElm.getAttribute('data-resources-url');
    const coreScriptSrc = coreScriptElm.getAttribute('src');

    expect(resourcesUrl).toBe('http://emmitts-garage.com/build/app/');
    expect(coreScriptSrc).toBe('http://emmitts-garage.com/build/app/app.core.js');

    const coreContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'www', 'build', 'app', 'app.core.js'));
    execScript(win, doc, coreContent);

    expect(win.customElements.get('cmp-a')).toBeDefined();
  });


  it('custom resourcesUrl config w/ external loader script', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.outputTargets = [{
      type: 'www',
      resourcesUrl: '/some/resource/config/path'
    } as d.OutputTargetWww];

    c = new TestingCompiler(config);
    const wwwOutput = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    expect(wwwOutput.resourcesUrl).toBe('/some/resource/config/path/');

    await setupFs(c, '<script src="build/app.js"></script>');

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const { win, doc } = mockDom(wwwOutput.indexHtml);

    const loaderContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'www', 'build', 'app.js'));
    execScript(win, doc, loaderContent);

    const coreScriptElm = doc.head.querySelector('script[data-resources-url][data-namespace][data-namespace="app"]');
    const resourcesUrl = coreScriptElm.getAttribute('data-resources-url');
    const coreScriptSrc = coreScriptElm.getAttribute('src');

    expect(resourcesUrl).toBe('/some/resource/config/path/');
    expect(coreScriptSrc).toBe('/some/resource/config/path/app.core.js');

    const coreContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'www', 'build', 'app', 'app.core.js'));
    execScript(win, doc, coreContent);

    expect(win.customElements.get('cmp-a')).toBeDefined();
  });


  it('custom data-resources-url attr on external loader script', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');

    c = new TestingCompiler(config);
    const wwwOutput = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    expect(wwwOutput.resourcesUrl).toBeUndefined();

    await setupFs(c, '<script src="build/app.js" data-resources-url="/some/resource/attr/path/"></script>');

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const { win, doc } = mockDom(wwwOutput.indexHtml);

    const loaderContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'www', 'build', 'app.js'));
    execScript(win, doc, loaderContent);

    const coreScriptElm = doc.head.querySelector('script[data-resources-url][data-namespace="app"]');
    const resourcesUrl = coreScriptElm.getAttribute('data-resources-url');
    const coreScriptSrc = coreScriptElm.getAttribute('src');

    expect(resourcesUrl).toBe('/some/resource/attr/path/');
    expect(coreScriptSrc).toBe('/some/resource/attr/path/app.core.js');

    const coreContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'www', 'build', 'app', 'app.core.js'));
    execScript(win, doc, coreContent);

    expect(win.customElements.get('cmp-a')).toBeDefined();
  });


  function mockDom(htmlFilePath: string): { win: Window, doc: HTMLDocument } {
    const jsdom = require('jsdom');

    const html = c.fs.readFileSync(htmlFilePath);

    const dom = new jsdom.JSDOM(html, {
      url: 'http://emmitts-garage.com/?core=esm'
    });

    const win = dom.window;
    const doc = win.document;

    win.fetch = {};

    win.CSS = {
      supports: () => true
    };

    win.requestAnimationFrame = (cb: Function) => {
      setTimeout(cb);
    };

    win.CustomEvent = class {};

    win.customElements = {
      define: (tag: string) => $definedTag[tag] = true,
      get: (tag: string) => $definedTag[tag]
    };

    const $definedTag = {};

    win.dispatchEvent = () => true;

    return { win, doc };
  }


  function execScript(win: any, doc: any, jsContent: string) {
    jsContent = jsContent.replace(/import\(/g, 'mockImport(');
    const winFn = new Function('window', 'document', jsContent);
    winFn(win, doc, jsContent);
  }


  async function setupFs(c: TestingCompiler, loaderSrc: string) {
    await c.fs.writeFile(path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.tsx'), `@Component({ tag: 'cmp-a' }) export class CmpA {}`);

    await c.fs.writeFile(
      path.join(root, 'User', 'testing', 'src', 'index.html'), `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="http://some-cdn.com/dist/other-stencil-app1.js" data-resources-url="http://some-cdn.com/dist/other-stencil-app1/" data-namespace="other-stencil-app1"></script>
          <script>/* some other inlined script */</script>
          <script src="assets/other-local-stencil-app2.js"></script>
          <script>/* some other inlined script */</script>
          <script src="assets/other-local-stencil-app2/other-local-stencil-app2.core.js" data-resources-url="/assets/other-local-stencil-app2/" data-namespace="other-local-stencil-app2"></script>
          <script src="assets/jquery.js"></script>
          <script src="http://some-cdn.com/dist/other-stencil-app3.js" data-resources-url="http://some-cdn.com/dist/other-stencil-app3/" data-namespace="other-stencil-app3"></script>
          ${loaderSrc}
        </head>
        <body>
          <script>/* some other inlined script */</script>
          <cmp-a></cmp-a>
          <script>/* some other inlined script */</script>
        </body>
        </html>
      `
    );

    await c.fs.commit();
  }

  beforeEach(() => {
    (global as any).HTMLElement = class {};
  });

  afterEach(() => {
    delete (global as any).HTMLElement;
  });

});
