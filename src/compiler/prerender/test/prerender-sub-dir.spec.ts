import * as d from '../../../declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


jest.setTimeout(10000);

describe('prerender', () => {

  let c: TestingCompiler;
  let config: d.Config;
  let outputTarget: d.OutputTargetWww;

  it('should prerender www dir w/ sub directory', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;
    outputTarget = {
      type: 'www',
      dir: 'www/docs',
      baseUrl: '/docs'
    };
    config.outputTargets = [outputTarget];

    c = new TestingCompiler(config);

    await c.fs.writeFile('/src/index.html', `
      <script src="/docs/build/app.js"></script>
      <ionic-docs></ionic-docs>
    `);
    await c.fs.writeFile('/src/components/ionic-docs/ionic-docs.tsx', `
      @Component({ tag: 'ionic-docs' })
      export class IonicDocs {
        render() {
          return (
            <div>
              <a href="/docs">Overview</a>
              <a HREF="/docs/about">About</a>
              <a hReF="/docs/components/toggle" targeT="_self">Toggle</a>
              <a href="/docs/components/button" target="_blank">Button</a>
              <a href="/docs/data.pdf">Download PDF</a>
            </div>
          );
        }
      }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      '/www/docs/build/app.js',
      '/www/docs/build/app/app.core.js',
      '/www/docs/build/app/app.core.pf.js',
      '/www/docs/build/app/ionic-docs.es5.js',
      '/www/docs/build/app/app.registry.json',
      '/www/docs/build/app/ionic-docs.js',
      '/www/docs/host.config.json',
      '/www/docs/index.html',
      '/www/docs/about/index.html',
      '/www/docs/components/toggle/index.html'
    ]);

    doNotExpectFiles(c.fs, [
      '/www/docs/docs/index.html',
      '/www/docs/docs/build/app.js',
      '/www/docs/data.pdf',
      '/www/docs/data.pdf/index.html',
      '/www/docs/components/button/index.html'
    ]);

    const indexHtml = await c.fs.readFile('/www/docs/index.html');
    expect(indexHtml).toContain('<script data-resources-url="/docs/build/app/">');

    const aboutHtml = await c.fs.readFile('/www/docs/about/index.html');
    expect(aboutHtml).toContain('<script data-resources-url="/docs/build/app/">');

    const toggleHtml = await c.fs.readFile('/www/docs/components/toggle/index.html');
    expect(toggleHtml).toContain('<script data-resources-url="/docs/build/app/">');
  });

});
