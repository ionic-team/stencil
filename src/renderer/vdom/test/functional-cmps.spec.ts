import * as d from '../../../declarations';
import { doNotExpectFiles, expectFilesWritten } from '../../../testing/utils';
import { mockHtml } from '../../../testing/mocks';
import { TestingCompiler, TestingConfig, mockDocument } from '../../../testing/index';


jest.setTimeout(10000);

describe('functional components', () => {

  let c: TestingCompiler;
  let config: d.Config;


  it('should handle functional cmp which returns null', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;
    config.outputTargets = [
      {
        type: 'www',
        inlineLoaderScript: false,
        inlineAssetsMaxSize: 0,
      } as d.OutputTargetWww
    ];

    c = new TestingCompiler(config);

    await c.fs.writeFile('/src/index.html', `
      <script src="/build/app.js"></script>
      <cmp-a></cmp-a>
    `);

    await c.fs.writeFile('/src/my-functional-component.tsx', `
    export default () => null;`);

    await c.fs.writeFile('/src/cmp-a.tsx', `
    import MyFunctionalComponent from './my-functional-component';
    @Component({ tag: 'cmp-a' }) export class CmpA {
      render() {
        return <MyFunctionalComponent/>
      }
    }`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const doc = mockDocument();
    doc.body.innerHTML = c.fs.readFileSync('/www/index.html');

    const cmpA = doc.querySelector('cmp-a');
    expect(cmpA.textContent).toBe('');
  });

  it('should render functional cmp content', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;
    config.outputTargets = [
      {
        type: 'www',
        inlineLoaderScript: false,
        inlineAssetsMaxSize: 0,
      } as d.OutputTargetWww
    ];

    c = new TestingCompiler(config);

    await c.fs.writeFile('/src/index.html', `
      <script src="/build/app.js"></script>
      <cmp-a></cmp-a>
    `);

    await c.fs.writeFile('/src/my-functional-component.tsx', `
    export default () => {
      return <div id="fn-cmp">fn-cmp</div>
    };`);

    await c.fs.writeFile('/src/cmp-a.tsx', `
    import MyFunctionalComponent from './my-functional-component';
    @Component({ tag: 'cmp-a' }) export class CmpA {
      render() {
        return <MyFunctionalComponent/>
      }
    }`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const doc = mockDocument();
    doc.body.innerHTML = c.fs.readFileSync('/www/index.html');

    const cmpA = doc.querySelector('cmp-a');
    expect(cmpA.textContent.trim()).toBe('fn-cmp');
  });

});
