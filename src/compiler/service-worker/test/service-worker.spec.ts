import type * as d from '@stencil/core/declarations';
import { Compiler, Config } from '@stencil/core/compiler';
import { mockConfig } from '@stencil/core/testing';
import path from 'path';

xdescribe('service worker', () => {
  jest.setTimeout(20000);
  let compiler: Compiler;
  let config: Config;
  const root = path.resolve('/');

  it('dev service worker', async () => {
    config = mockConfig();
    config.devMode = true;
    config.outputTargets = [
      {
        type: 'www',
        serviceWorker: {
          swSrc: path.join('src', 'sw.js'),
          globPatterns: ['**/*.{html,js,css,json,ico,png}'],
        },
      } as d.OutputTargetWww,
    ];

    compiler = new Compiler(config);
    await compiler.fs.writeFile(path.join(root, 'www', 'script.js'), `/**/`);
    await compiler.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
    await compiler.fs.writeFile(
      path.join(root, 'src', 'components', 'cmp-a', 'cmp-a.tsx'),
      `
      @Component({ tag: 'cmp-a' }) export class CmpA { render() { return <p>cmp-a</p>; } }
    `
    );
    await compiler.fs.commit();

    const r = await compiler.build();
    expect(r.diagnostics).toEqual([]);

    const indexHtml = await compiler.fs.readFile(path.join(root, 'www', 'index.html'));
    expect(indexHtml).toContain(`registration.unregister()`);
  });
});
