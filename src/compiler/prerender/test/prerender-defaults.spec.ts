import * as d from '../../../declarations';
import { doNotExpectFiles, expectFilesWritten } from '../../../testing/utils';
import { TestingCompiler, TestingConfig } from '../../../testing/index';


jest.setTimeout(10000);

describe('prerender, defaults', () => {

  let c: TestingCompiler;
  let config: d.Config;


  it('should prerender w/ defaults', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;

    c = new TestingCompiler(config);
    await c.fs.writeFile('/src/index.html', `
      <script src="/build/app.js"></script>
      <ionic-docs></ionic-docs>
    `);
    await c.fs.writeFile('/src/components/ionic-docs/ionic-docs.tsx', `
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

    expectFilesWritten(r,
      '/www/build/app.js',
      '/www/build/app/app.core.js',
      '/www/build/app/app.core.pf.js',
      '/www/build/app/ionic-docs.es5.js',
      '/www/build/app/app.registry.json',
      '/www/build/app/ionic-docs.js',
      '/www/host.config.json',
      '/www/index.html',
      '/www/about/index.html',
      '/www/components/toggle/index.html'
    );

    doNotExpectFiles(c.fs, [
      '/www/components/button/index.html'
    ]);

    const indexHtml = await c.fs.readFile('/www/index.html');
    expect(indexHtml).toContain('<script data-resources-url="/build/app/">');

    const aboutHtml = await c.fs.readFile('/www/about/index.html');
    expect(aboutHtml).toContain('<script data-resources-url="/build/app/">');

    const toggleHtml = await c.fs.readFile('/www/components/toggle/index.html');
    expect(toggleHtml).toContain('<script data-resources-url="/build/app/">');
  });

});
