import * as d from '../../../declarations';
import { cachedFetch } from './fetch-cache';
import { known404Urls } from './fetch-utils';
import { skipFilePathFetch, skipUrlFetch } from './fetch-utils';
import { writeFetchSuccessAsync } from './write-fetch-success';

export const fetchModuleAsync = async (inMemoryFs: d.InMemoryFileSystem, pkgVersions: Map<string, string>, url: string, filePath: string) => {
  if (skipFilePathFetch(filePath) || known404Urls.has(url) || skipUrlFetch(url)) {
    return undefined;
  }

  try {
    const rsp = await cachedFetch(url);
    if (rsp) {
      if (rsp.ok) {
        const content = await rsp.clone().text();
        writeFetchSuccessAsync(inMemoryFs, url, filePath, content, pkgVersions);
        return content;
      }

      if (rsp.status === 404) {
        known404Urls.add(url);
      }
    }
  } catch (e) {
    console.error(e);
  }

  return undefined;
};
