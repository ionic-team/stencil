import * as d from '../../../declarations';
import { expectFilesWritten } from '../../../testing/utils';
import { TestingCompiler, TestingConfig } from '../../../testing/index';

jest.setTimeout(10000);

describe('prerender', () => {

  let c: TestingCompiler;
  let config: d.Config;
  let outputTarget: d.OutputTargetWww;

  fit('should prerender www dir w/ sub directory', async () => {
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
              <a href="/docs/about">About</a>
              <a href="/docs/components/toggle">Toggle</a>
            </div>
          );
        }
      }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFilesWritten(r,
      '/www/docs/build/app/app.core.js',
      '/www/docs/build/app/app.core.pf.js',
      '/www/docs/build/app/ionic-docs.es5.js',
      '/www/docs/build/app/app.registry.json',
      '/www/docs/build/app/ionic-docs.js',
      '/www/docs/host.config.json',
      '/www/docs/index.html',
      '/www/docs/about/index.html',
      '/www/docs/components/toggle/index.html'
    );

    const indexHtml = await c.fs.readFile('/www/docs/index.html');
    expect(indexHtml).toContain('<script data-resource-path="/build/app/">');

    const aboutHtml = await c.fs.readFile('/www/docs/about/index.html');
    expect(aboutHtml).toContain('<script data-resource-path="/build/app/">');

    const toggleHtml = await c.fs.readFile('/www/docs/components/toggle/index.html');
    expect(toggleHtml).toContain('<script data-resource-path="/build/app/">');
  });

});
