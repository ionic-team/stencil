import * as d from '../../../declarations';
import { catchError, normalizePath } from '@utils';
import { crawlAnchorsForNextUrls } from '../crawl-urls';
import { getPrerenderConfig } from '../prerender-config';
import { MockWindow, cloneWindow, serializeNodeToHtml } from '@mock-doc';
import { patchNodeGlobal, patchWindowGlobal } from '../prerender-global-patch';
import { generateModulePreloads } from '../prerender-modulepreload';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';


export async function prerenderWorker(prerenderRequest: d.PrerenderRequest) {
  // worker thread!
  const results: d.PrerenderResults = {
    diagnostics: [],
    anchorUrls: [],
    filePath: prerenderRequest.writeToFilePath
  };

  try {
    const url = new URL(prerenderRequest.url, prerenderRequest.devServerHostUrl);
    const componentGraph = getComponentGraph(prerenderRequest.componentGraphPath);
    const win = getWindow(prerenderRequest);
    const doc = win.document;

    // webpack work-around/hack
    const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
    const hydrateApp = requireFunc(prerenderRequest.hydrateAppFilePath);

    const prerenderConfig = getPrerenderConfig(
      results.diagnostics,
      prerenderRequest.prerenderConfigPath
    );

    const opts = getRenderToStringOptions(prerenderConfig, url, results);

    if (typeof prerenderConfig.beforeHydrate === 'function') {
      try {
        const rtn = prerenderConfig.beforeHydrate(doc, url);
        if (rtn != null && typeof rtn.then === 'function') {
          await rtn;
        }
      } catch (e) {
        catchError(results.diagnostics, e);
      }
    }

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    const hydrateResults = await hydrateApp.hydrateDocument(doc, opts) as d.HydrateResults;
    results.diagnostics.push(...hydrateResults.diagnostics);

    generateModulePreloads(doc, hydrateResults, componentGraph);

    if (typeof prerenderConfig.afterHydrate === 'function') {
      try {
        const rtn = prerenderConfig.afterHydrate(doc, url);
        if (rtn != null && typeof rtn.then === 'function') {
          await rtn;
        }
      } catch (e) {
        catchError(results.diagnostics, e);
      }
    }

    if (typeof hydrateResults.httpStatus === 'number' && hydrateResults.httpStatus >= 400) {
      try {
        win.close();
      } catch (e) {}
      return results;
    }

    const html = serializeNodeToHtml(doc, {
      approximateLineWidth: opts.approximateLineWidth,
      outerHtml: false,
      prettyHtml: opts.prettyHtml,
      removeAttributeQuotes: opts.removeAttributeQuotes,
      removeBooleanAttributeQuotes: opts.removeBooleanAttributeQuotes,
      removeEmptyAttributes: opts.removeEmptyAttributes,
      removeHtmlComments: opts.removeHtmlComments,
      serializeShadowRoot: false
    });

    const baseUrl = new URL(prerenderRequest.baseUrl);
    results.anchorUrls = crawlAnchorsForNextUrls(prerenderConfig, results.diagnostics, baseUrl, url, hydrateResults.anchors);

    if (typeof prerenderConfig.filePath === 'function') {
      try {
        const userWriteToFilePath = prerenderConfig.filePath(url, results.filePath);
        if (typeof userWriteToFilePath === 'string') {
          results.filePath = userWriteToFilePath;
        }
      } catch (e) {
        catchError(results.diagnostics, e);
      }
    }

    await writePrerenderedHtml(results, html);

    try {
      win.close();
    } catch (e) {}

  } catch (e) {
    // ahh man! what happened!
    catchError(results.diagnostics, e);
  }

  return results;
}


function getRenderToStringOptions(prerenderConfig: d.PrerenderConfig, url: URL, results: d.PrerenderResults) {
  const prerenderUrl = url.href;

  const opts: d.RenderToStringOptions = {
    url: prerenderUrl,
    approximateLineWidth: 100,
    removeAttributeQuotes: true,
    removeBooleanAttributeQuotes: true,
    removeEmptyAttributes: true,
    removeHtmlComments: true,
  };

  if (typeof prerenderConfig.canonicalUrl === 'function') {
    try {
      opts.canonicalUrl = prerenderConfig.canonicalUrl(url);
    } catch (e) {
      catchError(results.diagnostics, e);
    }
  } else {
    opts.canonicalUrl = prerenderUrl;
  }

  if (typeof prerenderConfig.hydrateOptions === 'function') {
    try {
      const userOpts = prerenderConfig.hydrateOptions(url);
      if (userOpts != null) {
        if (userOpts.prettyHtml && typeof userOpts.removeAttributeQuotes !== 'boolean') {
          opts.removeAttributeQuotes = false;
        }
        Object.assign(opts, userOpts);
      }
    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }

  return opts;
}


function writePrerenderedHtml(results: d.PrerenderResults, html: string) {
  ensureDir(results.filePath);

  return new Promise(resolve => {
    fs.writeFile(results.filePath, html, err => {
      if (err != null) {
        results.filePath = null;
        catchError(results.diagnostics, err);
      }
      resolve();
    });
  });
}


const ensuredDirs = new Set<string>();

function ensureDir(p: string) {
  const allDirs: string[] = [];

  while (true) {
    p = normalizePath(path.dirname(p));
    if (typeof p === 'string' && p.length > 0 && p !== '/' && !p.endsWith(':/')) {
      allDirs.push(p);
    } else {
      break;
    }
  }

  allDirs.reverse();

  for (let i = 0; i < allDirs.length; i++) {
    const dir = allDirs[i];
    if (!ensuredDirs.has(dir)) {
      ensuredDirs.add(dir);

      try {
        fs.mkdirSync(dir);
      } catch (e) {}
    }
  }
}

const templateWindows = new Map<string, Window>();

function getWindow(prerenderRequest: d.PrerenderRequest) {
  let templateWindow = templateWindows.get(prerenderRequest.templateId);
  if (templateWindow == null) {
    const templateHtml = fs.readFileSync(prerenderRequest.templateId, 'utf8');
    templateWindow = new MockWindow(templateHtml) as any;
    templateWindows.set(prerenderRequest.templateId, templateWindow);
  }

  const win = cloneWindow(templateWindow);

  patchNodeGlobal(global, prerenderRequest.devServerHostUrl);
  patchWindowGlobal(global, win);

  return win;
}

let componentGraph: Map<string, string[]>;

function getComponentGraph(componentGraphPath: string) {
  if (componentGraphPath == null) {
    return undefined;
  }
  if (componentGraph == null) {
    const componentGraphJson = JSON.parse(fs.readFileSync(componentGraphPath, 'utf8'));
    componentGraph = new Map<string, string[]>(
      Object.entries(componentGraphJson)
    );
  }
  return componentGraph;
}





declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
