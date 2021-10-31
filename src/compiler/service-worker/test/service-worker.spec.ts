import type * as d from '@stencil/core/declarations';
import { mockCreateCompiler, MockCompiler, mockCompilerRoot } from '../../../testing/mock-compiler';
import path from 'path';

describe('service worker', () => {
  jest.setTimeout(20000);
  let compiler: MockCompiler;
  let config: d.Config = {};

  it('dev service worker', async () => {
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

    compiler = await mockCreateCompiler(config);
    config = compiler.config;

    await config.sys.writeFile(path.join(mockCompilerRoot, 'www', 'script.js'), `/**/`);
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' })
      export class CmpA { render() { return <p>cmp-a</p>; } }
    `
    );
    await config.sys.writeFile(path.join(config.srcDir, 'index.html'), `<cmp-a></cmp-a>`);

    const r = await compiler.build();
    expect(r.diagnostics).toEqual([]);

    const indexHtml = await config.sys.readFile(path.join(mockCompilerRoot, 'www', 'index.html'));
    expect(indexHtml).toContain(`registration.unregister()`);

    compiler.destroy();
  });
});
