import * as d from '../../../declarations';
import { ensureDirs } from '../copy-tasks-worker';
import { normalizePath } from '../../util';
import * as path from 'path';

const ROOT = path.resolve('/');


describe('ensureDirs', () => {

  it('w/ dest file', () => {
    const copyTasks: d.CopyTask[] = [
      { dest: path.join(ROOT, 'dist', 'imgs', 'img.png') },
      { dest: path.join(ROOT, 'dist', 'imgs', 'icons', 'icon.png') },
      { dest: path.join(ROOT, 'dist', 'file.txt') },
      { dest: path.join(ROOT, 'dist', 'file2.txt') },
      { dest: path.join(ROOT, 'rootfile.txt') },
    ];
    const mkDirs = ensureDirs(copyTasks);
    expect(mkDirs).toHaveLength(3);
    expect(mkDirs[0]).toBe(normalizePath(path.join(ROOT, 'dist')));
    expect(mkDirs[1]).toBe(normalizePath(path.join(ROOT, 'dist', 'imgs')));
    expect(mkDirs[2]).toBe(normalizePath(path.join(ROOT, 'dist', 'imgs', 'icons')));
  });

});
