import * as d from '../../../declarations';
import { dirname } from 'path';
import { setPackageVersionByContent } from '../resolve/resolve-utils';

export const writeFetchSuccessSync = (
  sys: d.CompilerSystem,
  inMemoryFs: d.InMemoryFileSystem,
  url: string,
  filePath: string,
  content: string,
  pkgVersions: Map<string, string>,
) => {
  if (url.endsWith('package.json')) {
    setPackageVersionByContent(pkgVersions, content);
  }

  let dir = dirname(filePath);
  while (dir !== '/' && dir !== '') {
    if (inMemoryFs) {
      inMemoryFs.clearFileCache(dir);
      inMemoryFs.sys.mkdirSync(dir);
    } else {
      sys.mkdirSync(dir);
    }

    dir = dirname(dir);
  }

  if (inMemoryFs) {
    inMemoryFs.clearFileCache(filePath);
    inMemoryFs.sys.writeFileSync(filePath, content);
  } else {
    sys.writeFileSync(filePath, content);
  }
};

export const writeFetchSuccessAsync = async (
  sys: d.CompilerSystem,
  inMemoryFs: d.InMemoryFileSystem,
  url: string,
  filePath: string,
  content: string,
  pkgVersions: Map<string, string>,
) => {
  if (url.endsWith('package.json')) {
    setPackageVersionByContent(pkgVersions, content);
  }

  let dir = dirname(filePath);
  while (dir !== '/' && dir !== '') {
    if (inMemoryFs) {
      inMemoryFs.clearFileCache(dir);
      await inMemoryFs.sys.mkdir(dir);
    } else {
      await sys.mkdir(dir);
    }

    dir = dirname(dir);
  }

  if (inMemoryFs) {
    inMemoryFs.clearFileCache(filePath);
    await inMemoryFs.sys.writeFile(filePath, content);
  } else {
    await sys.writeFile(filePath, content);
  }
};
