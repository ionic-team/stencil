import * as d from '../../../declarations';
import { known404Urls } from './fetch-utils';
import { isString } from '@utils';
import { skipFilePathFetch, skipUrlFetch } from '../fetch/fetch-utils';
import { writeFetchSuccess } from './write-fetch-success';


export const fetchModuleSync = (inMemoryFs: d.InMemoryFileSystem, pkgVersions: Map<string, string>, url: string, filePath: string) => {
  if (skipFilePathFetch(filePath)) {
    return undefined;
  }

  const content = fetchUrlSync(url);
  if (isString(content)) {
    writeFetchSuccess(inMemoryFs, url, filePath, content, pkgVersions);
  }

  return content;
};


export const fetchUrlSync = (url: string) => {
  if (known404Urls.has(url) || skipUrlFetch(url)) {
    return undefined;
  }

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);

    if (xhr.status >= 200 && xhr.status < 300) {
      return xhr.responseText;
    }
  } catch (e) {}

  known404Urls.add(url);

  return undefined;
};
