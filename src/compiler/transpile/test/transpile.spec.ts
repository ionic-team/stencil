import { TestingCompiler } from '../../../testing';
import { wroteFile } from '../../../testing/utils';
import * as path from 'path';
import * as ts from 'typescript';


describe('transpile', () => {

  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });


  it('should rebuild transpile for deleted directory', async () => {
    c.config.watch = true;
    await c.fs.writeFiles({
      '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
      '/src/some-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      '/src/some-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`
    });
    await c.fs.commit();

    // kick off the initial build, wait for it to finish
    let r = await c.build();
    expect(r.diagnostics).toEqual([]);

    // create a rebuild listener
    const rebuildListener = c.once('rebuild');

    await c.fs.remove('/src/some-dir');
    await c.fs.commit();

    // kick off a rebuild
    c.trigger('dirDelete', '/src/some-dir');

    // wait for the rebuild to finish
    // get the rebuild results
    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);

    expect(wroteFile(r, '/www/build/app/cmp-a.js')).toBe(false);
    expect(wroteFile(r, '/www/build/app/cmp-b.js')).toBe(false);
    expect(wroteFile(r, '/www/build/app/cmp-c.js')).toBe(false);

    expect(r.entries[0].components[0].tag).toEqual('cmp-a');
  });

  it('should rebuild transpile for added directory', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.watch = true;
    await c.fs.writeFiles({
      '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`
    }, { clearFileCache: true });
    await c.fs.commit();

    // kick off the initial build, wait for it to finish
    let r = await c.build();
    expect(r.diagnostics).toEqual([]);

    // create a rebuild listener
    const rebuildListener = c.once('rebuild');

    // add directory
    await c.fs.writeFiles({
      '/src/new-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      '/src/new-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`
    }, { clearFileCache: true });
    await c.fs.commit();

    // kick off a rebuild
    c.trigger('dirAdd', '/src/new-dir');

    // wait for the rebuild to finish
    // get the rebuild results
    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);

    expect(wroteFile(r, '/www/build/app/cmp-a.js')).toBe(false);
    expect(wroteFile(r, '/www/build/app/cmp-b.js')).toBe(true);
    expect(wroteFile(r, '/www/build/app/cmp-c.js')).toBe(true);
    expect(r.entries[0].components[0].tag).toEqual('cmp-a');
    expect(r.entries[1].components[0].tag).toEqual('cmp-b');
    expect(r.entries[2].components[0].tag).toEqual('cmp-c');
    expect(r.hasChangedJsText).toBe(true);
  });

  it('should rebuild transpile for changed typescript file', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.watch = true;
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`, { clearFileCache: true });
    await c.fs.commit();

    // kick off the initial build, wait for it to finish
    let r = await c.build();
    expect(r.diagnostics).toEqual([]);

    // create a rebuild listener
    const rebuildListener = c.once('rebuild');

    // write an actual change
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { constructor() { console.log('changed!!'); } }`, { clearFileCache: true });
    await c.fs.commit();

    // kick off a rebuild
    c.trigger('fileUpdate', '/src/cmp-a.tsx');

    // wait for the rebuild to finish
    // get the rebuild results
    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);

    expect(wroteFile(r, '/www/build/app/cmp-a.js')).toBe(true);
    expect(r.entries[0].components[0].tag).toEqual('cmp-a');
    expect(r.transpileBuildCount).toBe(1);
    expect(r.hasChangedJsText).toBe(true);
  });

  it('should not rebuild transpile for unchanged typescript file', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.watch = true;
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`, { clearFileCache: true });
    await c.fs.commit();

    // kick off the build, wait for it to finish
    let r = await c.build();

    // initial build finished
    expect(r.diagnostics).toEqual([]);
    expect(r.buildId).toBe(0);
    expect(r.isRebuild).toBe(false);

    // create a rebuild listener
    const rebuildListener = c.once('rebuild');

    // write the same darn thing, no actual change
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`, { clearFileCache: true });
    await c.fs.commit();

    // kick off a rebuild
    c.trigger('fileUpdate', '/src/cmp-a.tsx');

    // wait for the rebuild to finish
    // get the rebuild results
    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);
    expect(r.buildId).toBe(1);
    expect(r.isRebuild).toBe(true);
    expect(r.entries[0].components[0].tag).toEqual('cmp-a');
    expect(r.transpileBuildCount).toBe(1);
    expect(r.transpileBuildCount).toBe(1);
    expect(r.hasChangedJsText).toBe(false);
  });

});
