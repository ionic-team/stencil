import { join } from 'path';
import { requireFunc } from '@utils';

export const patchNodeGlobal = (nodeGlobal: any, devServerHostUrl: string) => {
  if (typeof nodeGlobal.fetch !== 'function') {
    // webpack work-around/hack
    const nodeFetch = requireFunc(join(__dirname, '..', 'sys', 'node', 'node-fetch.js'));

    nodeGlobal.fetch = (input: any, init: any) => {
      if (typeof input === 'string') {
        // fetch(url) w/ url string
        const urlStr = normalizeUrl(input, devServerHostUrl);
        return nodeFetch.fetch(urlStr, init);
      } else {
        // fetch(Request) w/ request object
        input.url = normalizeUrl(input.url, devServerHostUrl);
        return nodeFetch.fetch(input, init);
      }
    };

    nodeGlobal.Headers = nodeFetch.Headers;
    nodeGlobal.Request = nodeFetch.Request;
    nodeGlobal.Response = nodeFetch.Response;
    nodeGlobal.FetchError = nodeFetch.FetchError;
  }
};

const normalizeUrl = (inputUrl: string, devServerHostUrl: string) => {
  const requestUrl = new URL(inputUrl, devServerHostUrl);
  return requestUrl.href;
};

export const patchWindowGlobal = (nodeGlobal: any, win: any) => {
  win.fetch = nodeGlobal.fetch;
  win.Headers = nodeGlobal.Headers;
  win.Request = nodeGlobal.Request;
  win.Response = nodeGlobal.Response;
  win.FetchError = nodeGlobal.FetchError;
};
