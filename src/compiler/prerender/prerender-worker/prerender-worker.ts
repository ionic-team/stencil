import * as d from '../../../declarations';
import { catchError, normalizePath } from '@utils';
import { getPrerenderConfig, normalizeHref } from '../prerender-config';
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
    anchorUrls: null,
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
      prerenderRequest.prerenderConfigPath,
      prerenderRequest.devServerHostUrl
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

    const html = serializeNodeToHtml(doc, {
      approximateLineWidth: opts.approximateLineWidth,
      outerHtml: false,
      prettyHtml: opts.prettyHtml,
      removeBooleanAttributeQuotes: opts.removeBooleanAttributeQuotes,
      removeEmptyAttributes: opts.removeEmptyAttributes,
      removeHtmlComments: false,
      serializeShadowRoot: false
    });

    results.anchorUrls = crawlAnchorsForNextUrls(prerenderConfig, results.diagnostics, url, hydrateResults.anchors);

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
    removeBooleanAttributeQuotes: true,
    removeEmptyAttributes: true
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
      Object.assign(opts, userOpts);
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

function crawlAnchorsForNextUrls(prerenderConfig: d.PrerenderConfig, diagnostics: d.Diagnostic[], base: URL, parsedAnchors: d.HydrateAnchorElement[]) {
  if (!Array.isArray(parsedAnchors) || parsedAnchors.length === 0) {
    return [];
  }

  return parsedAnchors
    .filter(anchor => prerenderConfig.filterAnchor(anchor, base))
    .map(anchor => prerenderConfig.normalizeUrl(anchor.href, base))
    .filter(url => prerenderConfig.filterUrl(url, base))
    .map(url => normalizeHref(prerenderConfig, diagnostics, url))
    .reduce((hrefs, href) => {
      if (!hrefs.includes(href)) {
        hrefs.push(href);
      }
      return hrefs;
    }, [] as string[])
    .sort(sortHrefs);
}


function sortHrefs(a: string, b: string) {
  const partsA = a.split('/').length;
  const partsB = b.split('/').length;
  if (partsA < partsB) return -1;
  if (partsA > partsB) return 1;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}


declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
