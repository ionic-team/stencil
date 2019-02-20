import * as d from '@declarations';
import { catchError } from '@utils';
import { crawlAnchorsForNextUrlPaths } from './crawl-anchors';
import { MockWindow, cloneWindow, serializeNodeToHtml } from '@mock-doc';
import fs from 'fs';


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
    hydrateOpts.collectImgUrls = false;
    hydrateOpts.collectScriptUrls = false;
    hydrateOpts.collectStylesheetUrls = false;

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
        pretty: hydrateOpts.pretty,
        removeHtmlComments: hydrateOpts.removeUnusedStyles
      });

      results.anchors = crawlAnchorsForNextUrlPaths(hydrateResults.anchors);

      await new Promise((resolve, reject) => {
        fs.writeFile(writeToFilePath, html, err => {
          if (err != null) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

  } catch (e) {
    // ahh man! what happened!
    catchError(results.diagnostics, e);
  }

  return results;
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
