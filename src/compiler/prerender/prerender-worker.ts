import * as d from '../../declarations';
import { catchError, normalizePath } from '@utils';
import { crawlAnchorsForNextUrls } from './crawl-anchors';
import { getPrerenderConfig } from './prerender-config';
import { MockWindow, cloneWindow, serializeNodeToHtml } from '@mock-doc';
import fs from 'fs';
import path from 'path';


export async function prerenderWorker(prerenderRequest: d.PrerenderRequest) {
  // worker thread!
  const results: d.PrerenderResults = {
    diagnostics: [],
    anchorUrls: null,
    filePath: prerenderRequest.writeToFilePath
  };

  try {
    const windowLocationUrl = new URL(prerenderRequest.url);
    const win = getWindow(prerenderRequest.templateId);

    // webpack work-around/hack
    const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
    const hydrateApp = requireFunc(prerenderRequest.hydrateAppFilePath);

    const prerenderConfig = getPrerenderConfig(results.diagnostics, prerenderRequest.prerenderConfigPath) as d.HydrateConfig;

    try {
      if (typeof prerenderConfig.beforeHydrate === 'function') {
        const rtn = prerenderConfig.beforeHydrate(win.document, windowLocationUrl);
        if (rtn != null) {
          await rtn;
        }
      }
    } catch (e) {
      catchError(results.diagnostics, e);
    }

    const hydrateOpts: d.HydrateOptions = {
      url: windowLocationUrl.href,
      collectAnchors: true
    };

    if (typeof prerenderConfig.hydrateOptions === 'function') {
      try {
        const userOpts = prerenderConfig.hydrateOptions(windowLocationUrl);
        Object.assign(hydrateOpts, userOpts);
      } catch (e) {
        catchError(results.diagnostics, e);
      }
    }

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    const hydrateResults = await hydrateApp.hydrateDocument(win.document, hydrateOpts) as d.HydrateResults;

    if (hydrateResults.diagnostics.length > 0) {
      results.diagnostics.push(...hydrateResults.diagnostics);

    } else {
      try {
        if (typeof prerenderConfig.afterHydrate === 'function') {
          const rtn = prerenderConfig.afterHydrate(win.document, windowLocationUrl);
          if (rtn != null) {
            await rtn;
          }
        }
      } catch (e) {
        catchError(results.diagnostics, e);
      }

      const html = serializeNodeToHtml(win.document, {
        collapseBooleanAttributes: hydrateOpts.collapseBooleanAttributes,
        pretty: hydrateOpts.prettyHtml
      });

      results.anchorUrls = crawlAnchorsForNextUrls(prerenderConfig, windowLocationUrl, hydrateResults.anchors);

      if (typeof prerenderConfig.filePath === 'function') {
        try {
          const userWriteToFilePath = prerenderConfig.filePath(windowLocationUrl);
          if (typeof userWriteToFilePath === 'string') {
            results.filePath = userWriteToFilePath;
          }
        } catch (e) {
          catchError(results.diagnostics, e);
        }
      }

      await writePrerenderedHtml(results, html);
    }

  } catch (e) {
    // ahh man! what happened!
    catchError(results.diagnostics, e);
  }

  return results;
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

function getWindow(templateId: string) {
  let templateWindow = templateWindows.get(templateId);
  if (templateWindow == null) {
    const templateHtml = fs.readFileSync(templateId, 'utf8');
    templateWindow = new MockWindow(templateHtml) as any;
    templateWindows.set(templateId, templateWindow);
  }

  return cloneWindow(templateWindow);
}

declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
