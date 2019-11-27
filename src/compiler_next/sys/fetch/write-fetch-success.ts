import * as d from '../../../declarations';
import { setPackageVersionByContent } from '../resolve/resolve-utils';
import path from 'path';


export const writeFetchSuccess = (inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string, content: string, pkgVersions: Map<string, string>) => {
  if (url.endsWith('package.json')) {
    setPackageVersionByContent(pkgVersions, content);
  }

  let dir = path.dirname(filePath);
  while (dir !== '/' && dir !== '') {
    inMemoryFs.clearFileCache(dir);
    inMemoryFs.sys.mkdirSync(dir);
    dir = path.dirname(dir);
  }

  inMemoryFs.clearFileCache(filePath);
  inMemoryFs.sys.writeFileSync(filePath, content);
};
