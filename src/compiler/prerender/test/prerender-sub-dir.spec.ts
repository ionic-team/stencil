import * as path from 'path';
import * as d from '@declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


jest.setTimeout(10000);

describe('prerender', () => {

  let c: TestingCompiler;
  let config: d.Config;
  let outputTarget: d.OutputTargetWww;
  const root = path.resolve('/');

  it('should prerender www dir w/ sub directory', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.flags.prerender = true;
    outputTarget = {
      type: 'www',
      dir: path.join('www', 'docs'),
      baseUrl: '/docs'
    };
    config.outputTargets = [outputTarget];

    c = new TestingCompiler(config);

    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `
      <script src="/docs/build/app.js"></script>
      <ionic-docs></ionic-docs>
    `);
    await c.fs.writeFile(path.join(root, 'src', 'components', 'ionic-docs', 'ionic-docs.tsx'), `
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
      path.join(root, 'www', 'docs', 'build', 'app.js'),
      path.join(root, 'www', 'docs', 'build', 'app', 'app.core.js'),
      path.join(root, 'www', 'docs', 'build', 'app', 'app.core.pf.js'),
      path.join(root, 'www', 'docs', 'build', 'app', 'ionic-docs.es5.entry.js'),
      path.join(root, 'www', 'docs', 'build', 'app', 'app.registry.json'),
      path.join(root, 'www', 'docs', 'build', 'app', 'ionic-docs.entry.js'),
      path.join(root, 'www', 'docs', 'host.config.json'),
      path.join(root, 'www', 'docs', 'index.html'),
      path.join(root, 'www', 'docs', 'about', 'index.html'),
      path.join(root, 'www', 'docs', 'components', 'toggle', 'index.html')
    ]);

    doNotExpectFiles(c.fs, [
      path.join(root, 'www', 'docs', 'docs', 'index.html'),
      path.join(root, 'www', 'docs', 'docs', 'build', 'app.js'),
      path.join(root, 'www', 'docs', 'data.pdf'),
      path.join(root, 'www', 'docs', 'data.pdf', 'index.html'),
      path.join(root, 'www', 'docs', 'components', 'button', 'index.html')
    ]);

    const indexHtml = await c.fs.readFile(path.join(root, 'www', 'docs', 'index.html'));
    expect(indexHtml).toContain('<script data-resources-url="/docs/build/app/">');

    const aboutHtml = await c.fs.readFile(path.join(root, 'www', 'docs', 'about', 'index.html'));
    expect(aboutHtml).toContain('<script data-resources-url="/docs/build/app/">');

    const toggleHtml = await c.fs.readFile(path.join(root, 'www', 'docs', 'components', 'toggle', 'index.html'));
    expect(toggleHtml).toContain('<script data-resources-url="/docs/build/app/">');
  });

});
