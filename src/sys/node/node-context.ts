import * as d from '@declarations';
import { createServer, normalizeUrl } from './node-http-server';


export function createContext(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, sandbox: any) {
  const vm = require('vm');
  // https://github.com/tmpvar/jsdom/issues/1724
  // manually adding a fetch polyfill until jsdom adds it
  patchFetch(compilerCtx, outputTarget, sandbox);

  patchRaf(sandbox);

  return vm.createContext(sandbox);
}


function patchFetch(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, sandbox: any) {

  function fetch(input: any, init: any) {
    const path = require('path');
    const nf = require(path.join(__dirname, './node-fetch.js'));
    createServer(compilerCtx, outputTarget);

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





export function runInContext(code: string, contextifiedSandbox: any, options: any) {
  const vm = require('vm');
  vm.runInContext(code, contextifiedSandbox, options);
}
