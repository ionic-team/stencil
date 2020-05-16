import * as d from '../../../declarations';
import { createSystem } from '../stencil-sys';

describe('stencil system', () => {
  let sys: d.CompilerSystem;
  beforeEach(() => {
    sys = createSystem();
    sys.mkdirSync('/');
  });

  it('read/write', async () => {
    await sys.writeFile('/file1', 'file1');
    const content = await sys.readFile('/file1');
    expect(content).toBe('file1');

    const dirStat = await sys.stat('/');
    expect(dirStat.isFile()).toBe(false);
    expect(dirStat.isDirectory()).toBe(true);

    const fileStat = await sys.stat('/file1');
    expect(fileStat.isFile()).toBe(true);
    expect(fileStat.isDirectory()).toBe(false);
  });

  it('mkdir', async () => {
    const mkDirResults = await sys.mkdir('/a/b/c');
    expect(mkDirResults.basename).toBe('c');
    expect(mkDirResults.dirname).toBe('/a/b');
    expect(mkDirResults.path).toBe('/a/b/c');
    expect(mkDirResults.newDirs).toHaveLength(1);
    expect(mkDirResults.newDirs[0]).toBe('/a/b/c');
    expect(mkDirResults.error).toBe(null);
  });

  it('mkdir recursive', async () => {
    const mkDirResults = await sys.mkdir('/a/b/c', { recursive: true });
    expect(mkDirResults.basename).toBe('c');
    expect(mkDirResults.dirname).toBe('/a/b');
    expect(mkDirResults.path).toBe('/a/b/c');
    expect(mkDirResults.newDirs).toHaveLength(3);
    expect(mkDirResults.newDirs).toContain('/a');
    expect(mkDirResults.newDirs).toContain('/a/b');
    expect(mkDirResults.newDirs).toContain('/a/b/c');
    expect(mkDirResults.error).toBe(null);
  });

  it('rename file', async () => {
    await sys.mkdir('/dir');
    await sys.writeFile('/dir/file-old', 'content');
    const results = await sys.rename('/dir/file-old', '/dir/file-new');
    expect(results.error).toBe(null);
    expect(results.isDirectory).toBe(false);
    expect(results.isFile).toBe(true);
    expect(results.oldDirs).toHaveLength(0);
    expect(results.newDirs).toHaveLength(0);
    expect(results.oldFiles).toHaveLength(1);
    expect(results.newFiles).toHaveLength(1);
    expect(results.renamed).toEqual([
      {
        oldPath: '/dir/file-old',
        newPath: '/dir/file-new',
        isDirectory: false,
        isFile: true,
      },
    ]);

    expect(await sys.stat('/dir/file-old')).toBe(undefined);

    const newStat = await sys.stat('/dir/file-new');
    expect(newStat.isFile()).toBe(true);

    const content = await sys.readFile('/dir/file-new');
    expect('content').toBe('content');
  });

  it('rename directory', async () => {
    await sys.mkdir('/old');
    const results = await sys.rename('/old', '/new');
    expect(results.error).toBe(null);
    expect(results.isDirectory).toBe(true);
    expect(results.isFile).toBe(false);
    expect(results.oldDirs).toHaveLength(1);
    expect(results.oldDirs).toContain('/old');
    expect(results.newDirs).toHaveLength(1);
    expect(results.newDirs).toContain('/new');
    expect(results.oldFiles).toHaveLength(0);
    expect(results.newFiles).toHaveLength(0);
    expect(results.renamed).toEqual([
      {
        oldPath: '/old',
        newPath: '/new',
        isDirectory: true,
        isFile: false,
      },
    ]);

    const oldStat = await sys.stat('/old');
    expect(oldStat).toBe(undefined);

    const newStat = await sys.stat('/new');
    expect(newStat.isDirectory()).toBe(true);
  });

  it('rename directory, deep path', async () => {
    await sys.mkdir('/z');
    const results = await sys.rename('/z', '/a/b/c');
    expect(results.error).toBe(null);
    expect(results.isDirectory).toBe(true);
    expect(results.isFile).toBe(false);
    expect(results.oldDirs).toHaveLength(1);
    expect(results.oldDirs).toContain('/z');
    expect(results.newDirs).toHaveLength(3);
    expect(results.newDirs).toContain('/a');
    expect(results.newDirs).toContain('/a/b');
    expect(results.newDirs).toContain('/a/b/c');
    expect(results.oldFiles).toHaveLength(0);
    expect(results.newFiles).toHaveLength(0);
    expect(results.renamed).toEqual([
      {
        oldPath: '/z',
        newPath: '/a/b/c',
        isDirectory: true,
        isFile: false,
      },
    ]);

    const oldStat = await sys.stat('/z');
    expect(oldStat).toBe(undefined);

    const newAStat = await sys.stat('/a');
    expect(newAStat.isDirectory()).toBe(true);
    const newABStat = await sys.stat('/a/b');
    expect(newABStat.isDirectory()).toBe(true);
    const newABCStat = await sys.stat('/a/b/c');
    expect(newABCStat.isDirectory()).toBe(true);
  });

  it('rename directory, with files/subfolders', async () => {
    await sys.mkdir('/x/y/z', { recursive: true });
    await sys.mkdir('/x/y/y1-dir', { recursive: true });
    await sys.mkdir('/x/y/y2-dir', { recursive: true });
    await sys.writeFile('/x/y/y1-dir/y1-file', 'y1-file');
    await sys.writeFile('/x/y/y2-dir/y2-file', 'y2-file');
    await sys.writeFile('/x/x1-file', 'x1-file');
    await sys.writeFile('/x/x2-file', 'x2-file');
    await sys.writeFile('/x/y/z/z1-file', 'z1-file');

    const results = await sys.rename('/x', '/a/b/c');

    expect(await sys.stat('/x')).toBe(undefined);
    expect(await sys.stat('/x/y')).toBe(undefined);
    expect(await sys.stat('/x/y/z')).toBe(undefined);

    expect((await sys.stat('/a')).isDirectory()).toBe(true);
    expect((await sys.stat('/a/b')).isDirectory()).toBe(true);
    expect((await sys.stat('/a/b/c')).isDirectory()).toBe(true);
    expect((await sys.stat('/a/b/c/y')).isDirectory()).toBe(true);
    expect((await sys.stat('/a/b/c/y/y1-dir')).isDirectory()).toBe(true);
    expect((await sys.stat('/a/b/c/y/y2-dir')).isDirectory()).toBe(true);

    expect((await sys.stat('/a/b/c/y/y1-dir/y1-file')).isFile()).toBe(true);
    expect(await sys.readFile('/a/b/c/y/y1-dir/y1-file')).toBe('y1-file');

    expect((await sys.stat('/a/b/c/y/y2-dir/y2-file')).isFile()).toBe(true);
    expect(await sys.readFile('/a/b/c/y/y2-dir/y2-file')).toBe('y2-file');

    expect(await sys.stat('/x/x1-file')).toBe(undefined);
    expect((await sys.stat('/a/b/c/x1-file')).isFile()).toBe(true);
    expect(await sys.readFile('/a/b/c/x1-file')).toBe('x1-file');

    expect(await sys.stat('/x/x2-file')).toBe(undefined);
    expect((await sys.stat('/a/b/c/x2-file')).isFile()).toBe(true);
    expect(await sys.readFile('/a/b/c/x2-file')).toBe('x2-file');

    expect(await sys.stat('/x/y/z/z1-file')).toBe(undefined);
    expect((await sys.stat('/a/b/c/y/z/z1-file')).isFile()).toBe(true);
    expect(await sys.readFile('/a/b/c/y/z/z1-file')).toBe('z1-file');

    expect(results.error).toBe(null);
    expect(results.oldDirs).toEqual(['/x/y/y1-dir', '/x/y/y2-dir', '/x/y/z', '/x/y', '/x']);
    expect(results.oldFiles).toEqual(['/x/x1-file', '/x/x2-file', '/x/y/y1-dir/y1-file', '/x/y/y2-dir/y2-file', '/x/y/z/z1-file']);
    expect(results.newDirs).toEqual(['/a', '/a/b', '/a/b/c', '/a/b/c/y', '/a/b/c/y/y1-dir', '/a/b/c/y/y2-dir', '/a/b/c/y/z']);
    expect(results.newFiles).toEqual(['/a/b/c/x1-file', '/a/b/c/x2-file', '/a/b/c/y/y1-dir/y1-file', '/a/b/c/y/y2-dir/y2-file', '/a/b/c/y/z/z1-file']);

    expect(results.renamed).toEqual([
      {
        oldPath: '/x',
        newPath: '/a/b/c',
        isDirectory: true,
        isFile: false,
      },
      {
        oldPath: '/x/x1-file',
        newPath: '/a/b/c/x1-file',
        isDirectory: false,
        isFile: true,
      },
      {
        oldPath: '/x/x2-file',
        newPath: '/a/b/c/x2-file',
        isDirectory: false,
        isFile: true,
      },
      {
        oldPath: '/x/y',
        newPath: '/a/b/c/y',
        isDirectory: true,
        isFile: false,
      },
      {
        oldPath: '/x/y/y1-dir',
        newPath: '/a/b/c/y/y1-dir',
        isDirectory: true,
        isFile: false,
      },
      {
        oldPath: '/x/y/y1-dir/y1-file',
        newPath: '/a/b/c/y/y1-dir/y1-file',
        isDirectory: false,
        isFile: true,
      },
      {
        oldPath: '/x/y/y2-dir',
        newPath: '/a/b/c/y/y2-dir',
        isDirectory: true,
        isFile: false,
      },
      {
        oldPath: '/x/y/y2-dir/y2-file',
        newPath: '/a/b/c/y/y2-dir/y2-file',
        isDirectory: false,
        isFile: true,
      },
      {
        oldPath: '/x/y/z',
        newPath: '/a/b/c/y/z',
        isDirectory: true,
        isFile: false,
      },
      {
        oldPath: '/x/y/z/z1-file',
        newPath: '/a/b/c/y/z/z1-file',
        isDirectory: false,
        isFile: true,
      },
    ]);
  });
});
