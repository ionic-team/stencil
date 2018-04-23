import * as path from 'path';
import * as d from '../../../declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


jest.setTimeout(10000);

describe('prerender, defaults', () => {

  let c: TestingCompiler;
  let config: d.Config;


  it('should prerender w/ defaults', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;

    c = new TestingCompiler(config);
    await c.fs.writeFile(path.join('/', 'src', 'index.html'), `
      <script src="/build/app.js"></script>
      <ionic-docs></ionic-docs>
    `);
    await c.fs.writeFile(path.join('/', 'src', 'components', 'ionic-docs', 'ionic-docs.tsx'), `
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
      path.join('/', 'www', 'build', 'app.js'),
      path.join('/', 'www', 'build', 'app', 'app.core.js'),
      path.join('/', 'www', 'build', 'app', 'app.core.pf.js'),
      path.join('/', 'www', 'build', 'app', 'ionic-docs.es5.js'),
      path.join('/', 'www', 'build', 'app', 'app.registry.json'),
      path.join('/', 'www', 'build', 'app', 'ionic-docs.js'),
      path.join('/', 'www', 'host.config.json'),
      path.join('/', 'www', 'index.html'),
      path.join('/', 'www', 'about', 'index.html'),
      path.join('/', 'www', 'components', 'toggle', 'index.html')
    ]);

    doNotExpectFiles(c.fs, [
      path.join('/', 'www', 'components', 'button', 'index.html')
    ]);

    const indexHtml = await c.fs.readFile(path.join('/', 'www', 'index.html'));
    expect(indexHtml).toContain('<script data-resources-url="/build/app/">');

    const aboutHtml = await c.fs.readFile(path.join('/', 'www', 'about', 'index.html'));
    expect(aboutHtml).toContain('<script data-resources-url="/build/app/">');

    const toggleHtml = await c.fs.readFile(path.join('/', 'www', 'components', 'toggle', 'index.html'));
    expect(toggleHtml).toContain('<script data-resources-url="/build/app/">');
  });

});
