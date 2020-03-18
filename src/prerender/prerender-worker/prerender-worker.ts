import * as d from '../../declarations';
import { addModulePreloads, minifyScriptElements, minifyStyleElements } from '../prerender-optimize';
import { catchError, normalizePath } from '@utils';
import { crawlAnchorsForNextUrls } from '../crawl-urls';
import { getHydrateOptions, getPrerenderConfig } from '../prerender-config';
import { initNodeWorkerThread } from '../../sys/node/worker/worker-child';
import { patchNodeGlobal, patchWindowGlobal } from '../prerender-global-patch';
import fs from 'graceful-fs';
import path from 'path';
import { URL } from 'url';

let componentGraph: Map<string, string[]>;
let templateHtml: string = null;

export async function prerenderWorker(prerenderRequest: d.PrerenderRequest) {
  // worker thread!
  const results: d.PrerenderResults = {
    diagnostics: [],
    anchorUrls: [],
    filePath: prerenderRequest.writeToFilePath,
  };

  try {
    const url = new URL(prerenderRequest.url, prerenderRequest.devServerHostUrl);
    const componentGraph = getComponentGraph(prerenderRequest.componentGraphPath);

    // webpack work-around/hack
    const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
    const hydrateApp = requireFunc(prerenderRequest.hydrateAppFilePath);

    if (templateHtml == null) {
      // cache template html in this process
      templateHtml = fs.readFileSync(prerenderRequest.templateId, 'utf8');
    }

    // create a new window by cloning the cached parsed window
    const win = hydrateApp.createWindowFromHtml(templateHtml, prerenderRequest.templateId);
    const doc = win.document;

    // patch this new window
    patchNodeGlobal(global, prerenderRequest.devServerHostUrl);
    patchWindowGlobal(global, win);

    const prerenderConfig = getPrerenderConfig(results.diagnostics, prerenderRequest.prerenderConfigPath);

    const hydrateOpts = getHydrateOptions(prerenderConfig, url, results.diagnostics);

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
    const hydrateResults = (await hydrateApp.hydrateDocument(doc, hydrateOpts)) as d.HydrateResults;
    results.diagnostics.push(...hydrateResults.diagnostics);

    if (hydrateOpts.addModulePreloads && !prerenderRequest.isDebug) {
      addModulePreloads(doc, hydrateResults, componentGraph);
    }

    if (hydrateOpts.minifyStyleElements && !prerenderRequest.isDebug) {
      await minifyStyleElements(doc);
    }

    if (hydrateOpts.minifyScriptElements && !prerenderRequest.isDebug) {
      await minifyScriptElements(doc);
    }

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

    const html = hydrateApp.serializeDocumentToString(doc, hydrateOpts);

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

function getComponentGraph(componentGraphPath: string) {
  if (componentGraphPath == null) {
    return undefined;
  }
  if (componentGraph == null) {
    const componentGraphJson = JSON.parse(fs.readFileSync(componentGraphPath, 'utf8'));
    componentGraph = new Map<string, string[]>(Object.entries(componentGraphJson));
  }
  return componentGraph;
}

function initPrerenderWorker(prcs: NodeJS.Process) {
  if (prcs.argv.includes('stencil-cli-worker')) {
    // cmd line arg used to start the worker
    // and attached a message handler to the process
    initNodeWorkerThread(prcs, msgFromMain => {
      const fnName: string = msgFromMain.args[0];
      const fnArgs = msgFromMain.args.slice(1);

      switch (fnName) {
        case 'prerenderWorker':
          return prerenderWorker.apply(null, fnArgs);

        default:
          throw new Error(`invalid prerender worker msg: ${JSON.stringify(msgFromMain)}`);
      }
    });
  }
}

initPrerenderWorker(process);

declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
