import * as d from '../../../declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


jest.setTimeout(10000);

describe('prerender index', () => {

  let c: TestingCompiler;
  let config: d.Config;


  it('should pass properties down in prerendering', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;

    c = new TestingCompiler(config);
    await c.fs.writeFile('/src/index.html', `
      <script src="/build/app.js"></script>
      <cmp-a></cmp-a>
    `);
    await c.fs.writeFile('/src/components/cmp-a/cmp-a.tsx', `
      @Component({ tag: 'cmp-a' }) export class CmpA {

        render() {
          return <cmp-b someProp="data from parent" />;
        }
      }
    `);
    await c.fs.writeFile('/src/components/cmp-b/cmp-b.tsx', `
      @Component({ tag: 'cmp-b' }) export class CmpB {
        @Prop() someProp = 'unset';

        render() {
          return <p>{this.someProp}</p>;
        }
      }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const index = await c.fs.readFile('/www/index.html');

    expect(index).toContain('data from parent');
    expect(index).not.toContain('unset');
  });

  it('should prerender w/ defaults', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;
    config.outputTargets = [
      {
        dir: 'assets',
        indexHtml: 'out.html',
        buildDir: 'web-components'
      } as d.OutputTargetWww
    ];

    c = new TestingCompiler(config);
    await c.fs.writeFile('/src/index.html', `
      <script src="/build/app.js"></script>
      <cmp-a></cmp-a>
    `);
    await c.fs.writeFile('/src/components/cmp-a/cmp-a.tsx', `
      @Component({ tag: 'cmp-a' }) export class CmpA { render() { return <p>cmp-a</p>; } }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      '/assets/out.html',
      '/assets/web-components/app.js',
      '/assets/web-components/app/app.core.js',
      '/assets/web-components/app/app.core.pf.js',
      '/assets/web-components/app/app.registry.json',
      '/assets/web-components/app/cmp-a.es5.js',
      '/assets/web-components/app/cmp-a.js'
    ]);

    doNotExpectFiles(c.fs, [
      '/assets/index.html'
    ]);
  });

});
