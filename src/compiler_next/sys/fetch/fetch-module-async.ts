import * as d from '../../../declarations';
import { known404Urls } from './fetch-utils';
import { skipFilePathFetch, skipUrlFetch } from '../fetch/fetch-utils';
import { writeFetchSuccess } from './write-fetch-success';


const fetchCacheAsync = new Map<string, Promise<string>>();


export const fetchModuleAsync = (inMemoryFs: d.InMemoryFileSystem, pkgVersions: Map<string, string>, url: string, filePath: string) => {
  if (skipFilePathFetch(filePath) || known404Urls.has(url) || skipUrlFetch(url)) {
    return Promise.resolve(undefined);
  }

  let fetchPromise = fetchCacheAsync.get(url);

  if (!fetchPromise) {
    fetchPromise = new Promise(resolve => {
      fetch(url)
        .then(async rsp => {
          if (rsp.status >= 200 && rsp.status < 300) {
            const content = await rsp.text();
            writeFetchSuccess(inMemoryFs, url, filePath, content, pkgVersions);
            resolve(content);

          } else {
            known404Urls.add(url);
            resolve(undefined);
          }
        })
        .catch(() => {
          known404Urls.add(url);
          resolve(undefined);
        });
    });
    fetchCacheAsync.set(url, fetchPromise);
  }

  return fetchPromise;
};
