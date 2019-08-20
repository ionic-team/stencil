import * as d from '../../declarations';
import { URL } from 'url';


export function normalizeHydrateOptions(inputOpts: d.HydrateDocumentOptions) {
  const outputOpts: d.HydrateDocumentOptions = Object.assign({}, inputOpts);

  if (typeof outputOpts.clientHydrateAnnotations !== 'boolean') {
    outputOpts.clientHydrateAnnotations = true;
  }

  if (typeof outputOpts.constrainTimeouts !== 'boolean') {
    outputOpts.constrainTimeouts = true;
  }

  if (typeof outputOpts.maxHydrateCount !== 'number') {
    outputOpts.maxHydrateCount = 300;
  }

  if (typeof outputOpts.timeout !== 'number') {
    outputOpts.timeout = 15000;
  }

  return outputOpts;
}


export function generateHydrateResults(opts: d.HydrateDocumentOptions) {
  if (typeof opts.url !== 'string') {
    opts.url = `https://hydrate.stenciljs.com/`;
  }

  const results: d.HydrateResults = {
    diagnostics: [],
    url: opts.url,
    host: null,
    hostname: null,
    href: null,
    port: null,
    pathname: null,
    search: null,
    hash: null,
    html: null,
    hydratedCount: 0,
    anchors: [],
    components: [],
    imgs: [],
    scripts: [],
    styles: [],
    title: null
  };

  try {
    const url = new URL(opts.url, `https://hydrate.stenciljs.com/`);
    results.url = url.href;
    results.host = url.host;
    results.hostname = url.hostname;
    results.href = url.href;
    results.port = url.port;
    results.pathname = url.pathname;
    results.search = url.search;
    results.hash = url.hash;

  } catch (e) {
    renderCatchError(results, e);
  }

  return results;
}


export function renderBuildError(results: d.HydrateResults, msg: string) {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Hydrate Error',
    messageText: msg,
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (results.pathname) {
    if (results.pathname !== '/') {
      diagnostic.header += ': ' + results.pathname;
    }

  } else if (results.url) {
    diagnostic.header += ': ' + results.url;
  }

  results.diagnostics.push(diagnostic);
  return diagnostic;
}


export function renderCatchError(results: d.HydrateResults, err: any) {
  const diagnostic = renderBuildError(results, null);

  if (err != null) {
    if (err.stack != null) {
      diagnostic.messageText = err.stack.toString();

    } else {
      if (err.message != null) {
        diagnostic.messageText = err.message.toString();

      } else {
        diagnostic.messageText = err.toString();
      }
    }
  }

  return diagnostic;
}
