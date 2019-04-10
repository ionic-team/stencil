

export function patchNodeGlobal(nodeGlobal: any, originUrl: string) {
  if (typeof nodeGlobal.fetch !== 'function') {
    const path = require('path');

    // webpack work-around/hack
    const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
    const nodeFetch = requireFunc(path.join(__dirname, 'node-fetch.js'));

    nodeGlobal.fetch = (input: any, init: any) => {
      if (typeof input === 'string') {
        // fetch(url)
        return nodeFetch.fetch(normalizeUrl(input, originUrl), init);

      } else {
        // fetch(Request)
        input.url = normalizeUrl(input.url, originUrl);
        return nodeFetch.fetch(input, init);
      }
    };

    nodeGlobal.Headers = nodeFetch.Headers;
    nodeGlobal.Request = nodeFetch.Request;
    nodeGlobal.Response = nodeFetch.Response;
    nodeGlobal.FetchError = nodeFetch.FetchError;
  }
}


function normalizeUrl(inputUrl: string, originUrl: string) {
  const requestUrl = new URL(inputUrl, originUrl);
  return requestUrl.href;
}


export function patchWindowGlobal(nodeGlobal: any, win: any) {
  win.fetch = nodeGlobal.fetch;
  win.Headers = nodeGlobal.Headers;
  win.Request = nodeGlobal.Request;
  win.Response = nodeGlobal.Response;
  win.FetchError = nodeGlobal.FetchError;
}

declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
