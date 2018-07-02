import * as d from '../../../declarations';
import { BuildEvents } from '../../events';
import { generateBuildFromFsWatch, shouldRebuild } from '../fs-watch-rebuild';
import { mockCompilerCtx, mockConfig } from '../../../testing/mocks';
import * as path from 'path';
import { normalizePath } from '../../util';


describe('watch-rebuild', () => {
  const config = mockConfig();
  let compilerCtx: d.CompilerCtx;
  let fsWatchResults: d.FsWatchResults;
  let events: BuildEvents;

  beforeEach(() => {
    compilerCtx = mockCompilerCtx();
    events = new BuildEvents();
    fsWatchResults = {
      dirsAdded: [],
      dirsDeleted: [],
      filesAdded: [],
      filesDeleted: [],
      filesUpdated: [],
    };
  });

  it('should combine files added, deleted, updated to in filesChanged', () => {
    fsWatchResults.filesAdded = ['added'];
    fsWatchResults.filesDeleted = ['deleted'];
    fsWatchResults.filesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx.filesChanged).toEqual(['added', 'deleted', 'updated']);
  });

  it('should get all the scripts added', () => {
    fsWatchResults.filesAdded = ['file1.jpg', 'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx', 'file6.css'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx.scriptsAdded).toEqual([
      'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx'
    ]);
  });

  it('should get all the scripts deleted', () => {
    fsWatchResults.filesDeleted = ['file1.jpg', 'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx', 'file6.css'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx.scriptsDeleted).toEqual([
      'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx'
    ]);
  });

  it('hasScriptChanges', () => {
    fsWatchResults.filesUpdated = ['file.tsx'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.hasScriptChanges).toBe(true);
  });

  it('hasStyleChanges', () => {
    fsWatchResults.filesUpdated = ['file.css'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.hasStyleChanges).toBe(true);
  });

  it('should rebuild for dirsAdded, and recursive add files/dirs', async () => {
    const root = path.resolve('/');
    await compilerCtx.fs.disk.mkdir(path.join(root, 'added-1'));
    await compilerCtx.fs.disk.mkdir(path.join(root, 'added-1', 'added-2'));
    await compilerCtx.fs.disk.mkdir(path.join(root, 'added-1', 'added-2', 'added-3'));
    await compilerCtx.fs.disk.writeFile(path.join(root, 'added-1', 'file-1.tsx'), '');
    await compilerCtx.fs.disk.writeFile(path.join(root, 'added-1', 'added-2', 'file-2.tsx'), '');
    await compilerCtx.fs.disk.writeFile(path.join(root, 'added-1', 'added-2', 'added-3', 'file-3.tsx'), '');

    fsWatchResults.dirsAdded = [path.join(root, 'added-1')];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBeDefined();

    expect(buildCtx.dirsAdded).toEqual([
      normalizePath(path.join(root, 'added-1')),
      normalizePath(path.join(root, 'added-1', 'added-2')),
      normalizePath(path.join(root, 'added-1', 'added-2', 'added-3'))
    ]);

    expect(buildCtx.filesAdded).toEqual([
      normalizePath(path.join(root, 'added-1', 'added-2', 'added-3', 'file-3.tsx')),
      normalizePath(path.join(root, 'added-1', 'added-2', 'file-2.tsx')),
      normalizePath(path.join(root, 'added-1', 'file-1.tsx')),
    ]);

    expect(buildCtx.filesChanged).toEqual([
      normalizePath(path.join(root, 'added-1', 'added-2', 'added-3', 'file-3.tsx')),
      normalizePath(path.join(root, 'added-1', 'added-2', 'file-2.tsx')),
      normalizePath(path.join(root, 'added-1', 'file-1.tsx')),
    ]);
  });

  it('should rebuild for dirsDeleted', () => {
    fsWatchResults.dirsDeleted = ['deleted'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.dirsDeleted).toEqual(['deleted']);
  });

  it('should rebuild for filesAdded', () => {
    fsWatchResults.filesAdded = ['added'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.filesAdded).toEqual(['added']);
    expect(buildCtx.filesChanged).toEqual(['added']);
  });

  it('should rebuild for filesDeleted', () => {
    fsWatchResults.filesDeleted = ['deleted'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.filesDeleted).toEqual(['deleted']);
    expect(buildCtx.filesChanged).toEqual(['deleted']);
  });

  it('should rebuild for filesUpdated', () => {
    fsWatchResults.filesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.isRebuild).toBe(true);
    expect(buildCtx.filesUpdated).toEqual(['updated']);
    expect(buildCtx.filesChanged).toEqual(['updated']);
  });

  it('should requiresFullBuild if hasSuccessfulBuild but also has config update', () => {
    compilerCtx.hasSuccessfulBuild = true;
    config.configPath = 'stencil.config.js';
    fsWatchResults.filesUpdated = ['stencil.config.js'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx.requiresFullBuild).toBe(true);
  });

  it('should not requiresFullBuild if hasSuccessfulBuild', () => {
    compilerCtx.hasSuccessfulBuild = true;
    fsWatchResults.filesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx.requiresFullBuild).toBe(false);
  });

  it('should requiresFullBuild if no hasSuccessfulBuild', () => {
    compilerCtx.hasSuccessfulBuild = false;
    fsWatchResults.filesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx.requiresFullBuild).toBe(true);
  });

  it('should not rebuild for no changes', () => {
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx, fsWatchResults);
    expect(buildCtx).toBe(null);
  });

});
