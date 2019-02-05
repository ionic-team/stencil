import { BuildResults, InMemoryFileSystem } from '@declarations';
import { normalizePath } from '@utils';


export function expectFiles(fs: InMemoryFileSystem, filePaths: string[]) {
  filePaths.forEach(filePath => {
    fs.disk.statSync(filePath);
  });
}

export function doNotExpectFiles(fs: InMemoryFileSystem, filePaths: string[]) {
  filePaths.forEach(filePath => {
    try {
      fs.disk.statSync(filePath);
    } catch (e) {
      return;
    }

    if (fs.accessSync(filePath)) {
      throw new Error(`did not expect access: ${filePath}`);
    }
  });
}

export function wroteFile(r: BuildResults, p: string) {
  return r.filesWritten.some(f => {
    return normalizePath(f) === normalizePath(p);
  });
}
