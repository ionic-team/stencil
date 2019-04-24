import * as d from '@stencil/core/declarations';
import { generateBuildFromFsWatch } from '../fs-watch-rebuild';
import { mockCompilerCtx, mockConfig } from '@stencil/core/testing';
import { normalizePath } from '@stencil/core/utils';
import path from 'path';


describe('fs-watch, rebuild', () => {
  const config = mockConfig();
  let compilerCtx: d.CompilerCtx;

  beforeEach(() => {
    compilerCtx = mockCompilerCtx();
  });

  it('should combine files added, deleted, updated to in filesChanged', () => {
    compilerCtx.activeFilesAdded = ['added'];
    compilerCtx.activeFilesDeleted = ['deleted'];
    compilerCtx.activeFilesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx.filesChanged).toEqual(['added', 'deleted', 'updated']);
  });

  it('should get all the scripts added', () => {
    compilerCtx.activeFilesAdded = ['file1.jpg', 'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx', 'file6.css'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx.scriptsAdded).toEqual([
      'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx'
    ]);
  });

  it('should get all the scripts deleted', () => {
    compilerCtx.activeFilesDeleted = ['file1.jpg', 'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx', 'file6.css'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx.scriptsDeleted).toEqual([
      'file2.tsx', 'file3.ts', 'file4.js', 'file5.jsx'
    ]);
  });

  it('hasScriptChanges', () => {
    compilerCtx.activeFilesUpdated = ['file.tsx'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.hasScriptChanges).toBe(true);
  });

  it('hasStyleChanges', () => {
    compilerCtx.activeFilesUpdated = ['file.css'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
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

    compilerCtx.activeDirsAdded = [normalizePath(path.join(root, 'added-1'))];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
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
    compilerCtx.activeDirsDeleted = ['deleted'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.dirsDeleted).toEqual(['deleted']);
  });

  it('should rebuild for filesAdded', () => {
    compilerCtx.activeFilesAdded = ['added'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.filesAdded).toEqual(['added']);
    expect(buildCtx.filesChanged).toEqual(['added']);
  });

  it('should rebuild for filesDeleted', () => {
    compilerCtx.activeFilesDeleted = ['deleted'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.filesDeleted).toEqual(['deleted']);
    expect(buildCtx.filesChanged).toEqual(['deleted']);
  });

  it('should rebuild for filesUpdated', () => {
    compilerCtx.activeFilesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx).toBeDefined();
    expect(buildCtx.isRebuild).toBe(true);
    expect(buildCtx.filesUpdated).toEqual(['updated']);
    expect(buildCtx.filesChanged).toEqual(['updated']);
  });

  it('should requiresFullBuild if hasSuccessfulBuild but also has config update', () => {
    compilerCtx.hasSuccessfulBuild = true;
    config.configPath = 'stencil.config.js';
    compilerCtx.activeFilesUpdated = ['stencil.config.js'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx.requiresFullBuild).toBe(true);
  });

  it('should not requiresFullBuild if hasSuccessfulBuild', () => {
    compilerCtx.hasSuccessfulBuild = true;
    compilerCtx.activeFilesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx.requiresFullBuild).toBe(false);
  });

  it('should requiresFullBuild if no hasSuccessfulBuild', () => {
    compilerCtx.hasSuccessfulBuild = false;
    compilerCtx.activeFilesUpdated = ['updated'];
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx.requiresFullBuild).toBe(true);
  });

  it('should not rebuild for no changes', () => {
    const buildCtx = generateBuildFromFsWatch(config, compilerCtx);
    expect(buildCtx).toBe(null);
  });

});
