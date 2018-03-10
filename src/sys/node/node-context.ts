import { CompilerCtx } from '../../declarations';


export function createContext(compilerCtx: CompilerCtx, wwwDir: string, sandbox: any) {
  const vm = require('vm');
  // https://github.com/tmpvar/jsdom/issues/1724
  // manually adding a fetch polyfill until jsdom adds it
  patchFetch(compilerCtx, wwwDir, sandbox);

  patchRaf(sandbox);

  return vm.createContext(sandbox);
}


function patchFetch(compilerCtx: CompilerCtx, wwwDir: string, sandbox: any) {

  function fetch(input: any, init: any) {
    const path = require('path');
    const nf = require(path.join(__dirname, './node-fetch.js'));
    createServer(compilerCtx, wwwDir);

    if (typeof input === 'string') {
      // fetch(url)
      return nf.nodeFetch(normalizeUrl(input), init);

    } else {
      // fetch(Request)
      input.url = normalizeUrl(input.url);
      return nf.nodeFetch(input, init);
    }
  }

  sandbox.fetch = fetch;
}


function normalizeUrl(url: string) {
  const Url = require('url');
  const parsedUrl = Url.parse(url);

  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    parsedUrl.protocol = 'http:';
    parsedUrl.host = 'localhost:' + PORT;
    url = Url.format(parsedUrl);
  }

  return url;
}


function patchRaf(sandbox: any) {
  if (!sandbox.requestAnimationFrame) {
    sandbox.requestAnimationFrame = function(callback: Function) {
      const id = sandbox.setTimeout(function() {
        callback(Date.now());
      }, 0);

      return id;
    };

    sandbox.cancelAnimationFrame = function(id: any) {
      clearTimeout(id);
    };
  }
}


function createServer(compilerCtx: CompilerCtx, wwwDir: string) {
  if (compilerCtx.localPrerenderServer) return;

  const fs = require('fs');
  const path = require('path');
  const http = require('http');
  const Url = require('url');

  compilerCtx.localPrerenderServer = http.createServer((request: any, response: any) => {
    const parsedUrl = Url.parse(request.url);
    const filePath = path.join(wwwDir, parsedUrl.pathname);

    fs.readFile(filePath, 'utf-8', (err: any, data: any) => {
      if (err) {
        response.write('Error fetching: ' + parsedUrl.pathname + ' : ' + err);
      } else {
        response.write(data);
      }
      response.end();
    });

  });

  compilerCtx.localPrerenderServer.listen(PORT);
}

const PORT = 53536;


export function runInContext(code: string, contextifiedSandbox: any, options: any) {
  const vm = require('vm');
  vm.runInContext(code, contextifiedSandbox, options);
}
