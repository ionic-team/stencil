import * as path from 'path';
import * as d from '../../declarations';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


describe('service worker', () => {

  let c: TestingCompiler;
  let config: d.Config;
  const root = path.resolve('/');


  it('dev service worker', async () => {
    config = new TestingConfig();
    config.devMode = true;
    config.outputTargets = [
      {
        type: 'www',
        serviceWorker: {
          swSrc: path.join('src', 'sw.js'),
          globPatterns: [
            '**/*.{html,js,css,json,ico,png}'
          ]
        }
      } as d.OutputTargetWww
    ];

    c = new TestingCompiler(config);
    await c.fs.writeFile(path.join(root, 'www', 'script.js'), `/**/`);
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
    await c.fs.writeFile(path.join(root, 'src', 'components', 'cmp-a', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA { render() { return <p>cmp-a</p>; } }
    `);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const indexHtml = await c.fs.readFile(path.join(root, 'www', 'index.html'));
    expect(indexHtml).toContain(`registration.unregister()`);
  });

});
