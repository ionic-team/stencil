import * as path from 'path';
import * as d from '../../../declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


jest.setTimeout(10000);

describe('prerender index', () => {

  let c: TestingCompiler;
  let config: d.Config;
  const root = path.resolve('/');

  it('should pass properties down in prerendering', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;

    c = new TestingCompiler(config);
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `
      <script src="/build/app.js"></script>
      <cmp-a></cmp-a>
    `);
    await c.fs.writeFile(path.join(root, 'src', 'components', 'cmp-a', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA {

        render() {
          return <cmp-b someProp="property from parent" some-attr="attr from parent" somecrazy-ATTR="custom attr from parent" />;
        }
      }
    `);
    await c.fs.writeFile(path.join(root, 'src', 'components', 'cmp-b', 'cmp-b.tsx'), `
      @Component({ tag: 'cmp-b' }) export class CmpB {
        @Prop() someProp = 'unset';
        @Prop() someAttr = 'unset';
        @Prop({ attr: 'somecrazy-ATTR' }) someCustomAttr = 'unset';

        render() {
          return (
            <div>
              <p>{this.someProp}</p>
              <p>{this.someAttr}</p>
              <p>{this.someCustomAttr}</p>
            </div>
          );
        }
      }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const index = await c.fs.readFile(path.join(root, 'www', 'index.html'));

    expect(index).toContain('<p data-ssrc=\"1.0\"><!--s.1.0-->property from parent<!--/--> </p>');
    expect(index).toContain('<p data-ssrc=\"1.1\"><!--s.1.0-->attr from parent<!--/--> </p>');
    expect(index).toContain('<p data-ssrc=\"1.2\"><!--s.1.0-->custom attr from parent<!--/--> </p>');
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
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `
      <script src="/build/app.js"></script>
      <cmp-a></cmp-a>
    `);
    await c.fs.writeFile(path.join(root, 'src', 'components', 'cmp-a', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA { render() { return <p>cmp-a</p>; } }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join(root, 'assets', 'out.html'),
      path.join(root, 'assets', 'web-components', 'app.js'),
      path.join(root, 'assets', 'web-components', 'app', 'app.core.js'),
      path.join(root, 'assets', 'web-components', 'app', 'app.core.pf.js'),
      path.join(root, 'assets', 'web-components', 'app', 'app.registry.json'),
      path.join(root, 'assets', 'web-components', 'app', 'cmp-a.es5.js'),
      path.join(root, 'assets', 'web-components', 'app', 'cmp-a.js')
    ]);

    doNotExpectFiles(c.fs, [
      path.join(root, 'assets', 'index.html')
    ]);
  });

});
