import * as d from '../../../declarations';
import { mockElement, mockHtml } from '../../../testing/mocks';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';
import * as path from 'path';


describe('stats and docs', () => {

  let c: TestingCompiler;
  let config: TestingConfig;

  it('build multiple stats and docs', async () => {
    config = new TestingConfig();
    config.flags.docs = true;
    config.buildAppCore = true;
    config.rootDir = '/User/testing/';
    config.outputTargets = [
      { type: 'www' } as d.OutputTargetWww,
      { type: 'stats' } as d.OutputTargetStats,
      { type: 'stats', file: 'my-stats.json' } as d.OutputTargetStats,
      { type: 'stats', file: '/I/do/what/I/want/some-stats.json' } as d.OutputTargetStats,
      { type: 'docs' } as d.OutputTargetDocs,
      { type: 'docs', readmeDir: '/docs/' } as d.OutputTargetDocs
    ];

    c = new TestingCompiler(config);

    await c.fs.writeFile('/User/testing/src/components/cmp-a/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const statsJson = JSON.parse(await c.fs.readFile('/User/testing/stencil-stats.json'));
    const myStatsJson = JSON.parse(await c.fs.readFile('/User/testing/my-stats.json'));
    const whereEverJson = JSON.parse(await c.fs.readFile('/I/do/what/I/want/some-stats.json'));

    expect(statsJson.app.namespace).toBe('App');
    expect(myStatsJson.app.fsNamespace).toBe('app');
    expect(whereEverJson.app.components).toBe(1);

    const cmpAReadme = await c.fs.readFile('/User/testing/src/components/cmp-a/readme.md');
    expect(cmpAReadme).toContain('# cmp-a');

    const cmpACustomReadme = await c.fs.readFile('/docs/components/cmp-a/readme.md');
    expect(cmpACustomReadme).toContain('# cmp-a');
  });

});
