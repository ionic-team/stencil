import * as d from '../../../declarations';
import { mockDom } from '../../../testing/mocks';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';
import * as path from 'path';


describe('dist loader/core resourcesUrl', () => {

  let c: TestingCompiler;
  let config: TestingConfig;
  const root = path.resolve('/');


  it('default config', async () => {
    jest.setTimeout(15000);
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.namespace = 'MyApp';
    config.outputTargets = [
      {
        type: 'dist'
      }
    ];

    c = new TestingCompiler(config);
    const distOutput = config.outputTargets.find(o => o.type === 'dist') as d.OutputTargetDist;
    expect(distOutput.resourcesUrl).toBeUndefined();

    await setupFs(c,
      '<script src="http://cdn.stenciljs.com/dist/myapp.js"></script>',
      `{
        "module": "dist/esm/es5/index.js",
        "main": "dist/index.js",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`);

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const url = 'http://emmitts-garage.com/?core=esm';
    const html = c.fs.readFileSync(path.join(root, 'User', 'testing', 'www', 'index.html'));
    const { win, doc } = mockDom(url, html);

    const loaderContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'dist', 'myapp.js'));
    execScript(win, doc, loaderContent);

    const coreScriptElm = doc.head.querySelector('script[data-resources-url][data-namespace="myapp"]');
    const resourcesUrl = coreScriptElm.getAttribute('data-resources-url');
    const coreScriptSrc = coreScriptElm.getAttribute('src');

    expect(resourcesUrl).toBe('http://cdn.stenciljs.com/dist/myapp/');
    expect(coreScriptSrc).toBe('http://cdn.stenciljs.com/dist/myapp/myapp.core.js');

    const coreContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'dist', 'myapp', 'myapp.core.js'));
    execScript(win, doc, coreContent);

    expect(win.customElements.get('cmp-a')).toBeDefined();
  });


  it('custom buildDir config', async () => {
    jest.setTimeout(15000);
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.namespace = 'MyApp';
    config.outputTargets = [
      {
        type: 'dist',
        buildDir: 'some-build'
      } as d.OutputTargetDist
    ];

    c = new TestingCompiler(config);
    const distOutput = config.outputTargets.find(o => o.type === 'dist') as d.OutputTargetDist;
    expect(distOutput.resourcesUrl).toBeUndefined();

    await setupFs(c,
      '<script src="http://cdn.stenciljs.com/dist/some-build/myapp.js"></script>',
      `{
        "module": "dist/some-build/esm/es5/index.js",
        "main": "dist/some-build/index.js",
        "collection\": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`);

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const url = 'http://emmitts-garage.com/?core=esm';
    const html = c.fs.readFileSync(path.join(root, 'User', 'testing', 'www', 'index.html'));
    const { win, doc } = mockDom(url, html);

    const loaderContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'dist', 'some-build', 'myapp.js'));
    execScript(win, doc, loaderContent);

    const coreScriptElm = doc.head.querySelector('script[data-resources-url][data-namespace="myapp"]');
    const resourcesUrl = coreScriptElm.getAttribute('data-resources-url');
    const coreScriptSrc = coreScriptElm.getAttribute('src');

    expect(resourcesUrl).toBe('http://cdn.stenciljs.com/dist/some-build/myapp/');
    expect(coreScriptSrc).toBe('http://cdn.stenciljs.com/dist/some-build/myapp/myapp.core.js');

    const coreContent = await c.fs.readFile(path.join(root, 'User', 'testing', 'dist', 'some-build', 'myapp', 'myapp.core.js'));
    execScript(win, doc, coreContent);

    expect(win.customElements.get('cmp-a')).toBeDefined();
  });


  function execScript(win: any, doc: any, jsContent: string) {
    jsContent = jsContent.replace(/import\(/g, 'mockImport(');
    const winFn = new Function('window', 'document', jsContent);
    winFn(win, doc, jsContent);
  }


  async function setupFs(c: TestingCompiler, loaderSrc: string, packageJson: string) {
    await c.fs.writeFile(path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.tsx'), `@Component({ tag: 'cmp-a' }) export class CmpA {}`);

    await c.fs.writeFile(
      path.join(root, 'User', 'testing', 'www', 'index.html'), `
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

    if (packageJson) {
      await c.fs.writeFile(path.join(root, 'User', 'testing', 'package.json'), packageJson);
    }

    await c.fs.commit();
  }

  beforeEach(() => {
    (global as any).HTMLElement = class {};
  });

  afterEach(() => {
    delete (global as any).HTMLElement;
  });

});
