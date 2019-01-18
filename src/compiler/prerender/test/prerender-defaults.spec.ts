import * as path from 'path';
import * as d from '@declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


jest.setTimeout(20000);

describe('prerender, defaults', () => {
  const root = path.resolve('/');

  let c: TestingCompiler;
  let config: d.Config;


  it('should prerender w/ defaults', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;

    c = new TestingCompiler(config);
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `
      <script src="/build/app.js"></script>
      <ionic-docs></ionic-docs>
    `);
    await c.fs.writeFile(path.join(root, 'src', 'components', 'ionic-docs', 'ionic-docs.tsx'), `
      @Component({ tag: 'ionic-docs' })
      export class IonicDocs {
        render() {
          return (
            <div>
              <a href="/about">About</a>
              <a href="/components/toggle" target="_SELF">Toggle</a>
              <a href="/components/button" target="_BLANK">Button</a>
            </div>
          );
        }
      }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join(root, 'www', 'build', 'app.js'),
      path.join(root, 'www', 'build', 'app', 'app.core.js'),
      path.join(root, 'www', 'build', 'app', 'app.core.pf.js'),
      path.join(root, 'www', 'build', 'app', 'ionic-docs.es5.entry.js'),
      path.join(root, 'www', 'build', 'app', 'app.registry.json'),
      path.join(root, 'www', 'build', 'app', 'ionic-docs.entry.js'),
      path.join(root, 'www', 'host.config.json'),
      path.join(root, 'www', 'index.html'),
      path.join(root, 'www', 'about', 'index.html'),
      path.join(root, 'www', 'components', 'toggle', 'index.html')
    ]);

    doNotExpectFiles(c.fs, [
      path.join(root, 'www', 'components', 'button', 'index.html')
    ]);

    const indexHtml = await c.fs.readFile(path.join(root, 'www', 'index.html'));
    expect(indexHtml).toContain('<script data-resources-url="/build/app/">');

    const aboutHtml = await c.fs.readFile(path.join(root, 'www', 'about', 'index.html'));
    expect(aboutHtml).toContain('<script data-resources-url="/build/app/">');

    const toggleHtml = await c.fs.readFile(path.join(root, 'www', 'components', 'toggle', 'index.html'));
    expect(toggleHtml).toContain('<script data-resources-url="/build/app/">');
  });

});
