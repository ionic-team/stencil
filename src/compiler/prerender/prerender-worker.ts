import type * as d from '../../declarations';
import { addModulePreloads, excludeStaticComponents, minifyScriptElements, minifyStyleElements, removeModulePreloads, removeStencilScripts } from './prerender-optimize';
import { catchError, isPromise, isRootPath, normalizePath, isFunction } from '@utils';
import { crawlAnchorsForNextUrls } from './crawl-urls';
import { getHydrateOptions } from './prerender-hydrate-options';
import { getPrerenderConfig } from './prerender-config';
import { requireFunc } from '../sys/environment';

const prerenderCtx = {
  componentGraph: null as Map<string, string[]>,
  prerenderConfig: null as d.PrerenderConfig,
  ensuredDirs: new Set<string>(),
  templateHtml: null as string,
};

export const prerenderWorker = async (sys: d.CompilerSystem, prerenderRequest: d.PrerenderUrlRequest) => {
  // worker thread!
  const results: d.PrerenderUrlResults = {
    id: prerenderRequest.id,
    diagnostics: [],
    anchorUrls: [],
    filePath: prerenderRequest.writeToFilePath,
  };

  try {
    const url = new URL(prerenderRequest.url, prerenderRequest.devServerHostUrl);
    const componentGraph = getComponentGraph(sys, prerenderRequest.componentGraphPath);

    // webpack work-around/hack
    const hydrateApp = requireFunc(prerenderRequest.hydrateAppFilePath);

    if (prerenderCtx.templateHtml == null) {
      // cache template html in this process
      prerenderCtx.templateHtml = sys.readFileSync(prerenderRequest.templateId);
    }

    // create a new window by cloning the cached parsed window
    const win = hydrateApp.createWindowFromHtml(prerenderCtx.templateHtml, prerenderRequest.templateId);
    const doc = win.document;

    // patch this new window
    if (isFunction(sys.applyPrerenderGlobalPatch)) {
      sys.applyPrerenderGlobalPatch({
        devServerHostUrl: prerenderRequest.devServerHostUrl,
        window: win,
      });
    }

    if (prerenderCtx.prerenderConfig == null) {
      prerenderCtx.prerenderConfig = getPrerenderConfig(results.diagnostics, prerenderRequest.prerenderConfigPath);
    }
    const prerenderConfig = prerenderCtx.prerenderConfig;

    const hydrateOpts = getHydrateOptions(prerenderConfig, url, results.diagnostics);

    if (prerenderRequest.staticSite || hydrateOpts.staticDocument) {
      hydrateOpts.addModulePreloads = false;
      hydrateOpts.clientHydrateAnnotations = false;
    }

    if (typeof prerenderConfig.beforeHydrate === 'function') {
      try {
        const rtn = prerenderConfig.beforeHydrate(doc, url);
        if (isPromise(rtn)) {
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

    if (hydrateOpts.staticDocument) {
      removeStencilScripts(doc);
      removeModulePreloads(doc);
    } else {
      if (Array.isArray(hydrateOpts.staticComponents)) {
        excludeStaticComponents(doc, hydrateOpts, hydrateResults);
      }

      if (hydrateOpts.addModulePreloads) {
        if (!prerenderRequest.isDebug) {
          addModulePreloads(doc, hydrateOpts, hydrateResults, componentGraph);
        }
      } else {
        // remove module preloads
        removeModulePreloads(doc);
      }
    }

    const minifyPromises: Promise<any>[] = [];
    if (hydrateOpts.minifyStyleElements && !prerenderRequest.isDebug) {
      minifyPromises.push(minifyStyleElements(doc, false));
    }

    if (hydrateOpts.minifyScriptElements && !prerenderRequest.isDebug) {
      minifyPromises.push(minifyScriptElements(doc, false));
    }

    if (minifyPromises.length > 0) {
      await Promise.all(minifyPromises);
    }

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

    if (prerenderConfig.crawlUrls !== false) {
      const baseUrl = new URL(prerenderRequest.baseUrl);
      results.anchorUrls = crawlAnchorsForNextUrls(prerenderConfig, results.diagnostics, baseUrl, url, hydrateResults.anchors);
    }

    if (typeof prerenderConfig.afterHydrate === 'function') {
      try {
        const rtn = prerenderConfig.afterHydrate(doc, url, results);
        if (isPromise(rtn)) {
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
    prerenderEnsureDir(sys, results.filePath);
    await sys.writeFile(results.filePath, html);

    try {
      win.close();
    } catch (e) {}
  } catch (e) {
    // ahh man! what happened!
    catchError(results.diagnostics, e);
  }

  return results;
};

const getComponentGraph = (sys: d.CompilerSystem, componentGraphPath: string) => {
  if (componentGraphPath == null) {
    return undefined;
  }
  if (prerenderCtx.componentGraph == null) {
    const componentGraphJson = JSON.parse(sys.readFileSync(componentGraphPath));
    prerenderCtx.componentGraph = new Map<string, string[]>(Object.entries(componentGraphJson));
  }
  return prerenderCtx.componentGraph;
};

const prerenderEnsureDir = (sys: d.CompilerSystem, p: string) => {
  const allDirs: string[] = [];

  while (true) {
    p = normalizePath(sys.platformPath.dirname(p));
    if (typeof p === 'string' && p.length > 0 && !isRootPath(p)) {
      allDirs.push(p);
    } else {
      break;
    }
  }

  allDirs.reverse();

  for (let i = 0; i < allDirs.length; i++) {
    const dir = allDirs[i];
    if (!prerenderCtx.ensuredDirs.has(dir)) {
      prerenderCtx.ensuredDirs.add(dir);
      sys.createDirSync(dir);
    }
  }
};
