import * as d from '../../declarations';
import { catchError, normalizePath } from '@utils';
import { crawlAnchorsForNextUrlPaths } from './crawl-anchors';
import { MockWindow, cloneWindow, serializeNodeToHtml } from '@mock-doc';
import fs from 'fs';
import path from 'path';


export async function prerenderWorker(hydrateAppFilePath: string, templateId: string, writeToFilePath: string, hydrateOpts: d.HydrateOptions) {
  // worker thread!
  const results: d.HydrateResults = {
    diagnostics: [],
    url: hydrateOpts.url,
    anchors: null
  };

  try {
    const win = getWindow(templateId);

    // webpack work-around/hack
    const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
    const hydrateApp = requireFunc(hydrateAppFilePath);

    hydrateOpts.collectAnchors = true;
    hydrateOpts.collectComponents = false;
    hydrateOpts.collectImgs = false;
    hydrateOpts.collectScripts = false;
    hydrateOpts.collectStylesheets = false;

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    const hydrateResults = await hydrateApp.hydrateDocumentSync(win.document, hydrateOpts) as d.HydrateResults;
    results.url = hydrateResults.url;

    if (hydrateResults.diagnostics.length > 0) {
      hydrateResults.diagnostics.forEach(diagnostic => {
        results.diagnostics.push(diagnostic);
      });

    } else {
      const html = serializeNodeToHtml(win.document, {
        collapseBooleanAttributes: hydrateOpts.collapseBooleanAttributes,
        pretty: hydrateOpts.prettyHtml,
        removeHtmlComments: false
      });

      results.anchors = crawlAnchorsForNextUrlPaths(hydrateResults.anchors);

      // not waiting on the file to finish writing on purpose
      writePrerenderedHtml(writeToFilePath, html);
    }

  } catch (e) {
    // ahh man! what happened!
    catchError(results.diagnostics, e);
  }

  return results;
}


async function writePrerenderedHtml(writeToFilePath: string, html: string) {
  await ensureDir(writeToFilePath);

  fs.writeFile(writeToFilePath, html, err => {
    if (err != null) {
      console.error(err);
    }
  });
}


const ensuredDirs = new Set<string>();

async function ensureDir(p: string) {
  const allDirs: string[] = [];

  while (typeof p === 'string' && p.length > 0 && p !== '/' && !p.endsWith(':/')) {
    p = normalizePath(path.dirname(p));
    allDirs.push(p);
  }

  allDirs.reverse();

  for (let i = 0; i < allDirs.length; i++) {
    const dir = allDirs[i];
    if (ensuredDirs.has(dir) === false) {
      ensuredDirs.add(dir);

      try {
        await new Promise(resolve => {
          fs.mkdir(dir, _ => {
            resolve();
          });
        });
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
