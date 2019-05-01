

export function patchNodeGlobal(nodeGlobal: any, devServerHostUrl: string) {
  if (typeof nodeGlobal.fetch !== 'function') {
    const path = require('path');

    // webpack work-around/hack
    const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
    const nodeFetch = requireFunc(path.join(__dirname, 'node-fetch.js'));

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
}


function normalizeUrl(inputUrl: string, devServerHostUrl: string) {
  const requestUrl = new URL(inputUrl, devServerHostUrl);
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
