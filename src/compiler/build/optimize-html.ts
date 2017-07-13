import { BuildConfig, BuildContext, OptimizeHtmlResults } from '../interfaces';
import { catchError, readFile, normalizePath } from '../util';


export function optimizeIndexHtml(config: BuildConfig, ctx: BuildContext) {
  const optimizeHtmlResults: OptimizeHtmlResults = {
    diagnostics: []
  };

  if (ctx.isRebuild && ctx.projectFileBuildCount === 0 && config.inlineAppLoader) {
    // no need to rebuild index.html if there were no project file changes
    return Promise.resolve(optimizeHtmlResults);
  }

  const timeSpan = config.logger.createTimeSpan(`optimize html started`, true);

  return readIndexSrc(config).then(indexSrcHtml => {
    optimizeHtmlResults.html = indexSrcHtml;

    try {
      optimizeHtml(config, ctx, optimizeHtmlResults);
    } catch (e) {
      catchError(optimizeHtmlResults.diagnostics, e);
    }

  }).catch(() => {
    // it's ok if there's no index file
    config.logger.debug(`index html not found: ${config.indexSrc}`);

  }).then(() => {
    timeSpan.finish(`optimize html finished`);
    return optimizeHtmlResults;
  });
}


function optimizeHtml(config: BuildConfig, ctx: BuildContext, optimizeHtmlResults: OptimizeHtmlResults) {
  // only parse/serialize if we need to
  if (config.inlineAppLoader) {

    // parse html into dom nodes
    const doc = config.sys.htmlParser.parse(optimizeHtmlResults.html);

    // inline the loader js file into the document
    inlineAppLoader(config, ctx, doc);

    // serialize back into html
    optimizeHtmlResults.html = config.sys.htmlParser.serialize(doc);
  }

  writeIndexDest(config, ctx, optimizeHtmlResults);
}


function inlineAppLoader(config: BuildConfig, ctx: BuildContext, doc: Node) {
  const path = config.sys.path;

  if (!ctx.projectFiles.loader) {
    // this shouldn't happen, but just in case let's check
    config.logger.error(`inlineAppLoader, missing loader content`);
    return doc;
  }

  // figure out what the client side script url would be
  let loaderExternalSrc = path.join(config.buildDest, `${config.namespace.toLowerCase()}.js`);
  loaderExternalSrc = path.relative(path.dirname(config.indexDest), loaderExternalSrc);
  loaderExternalSrc = normalizePath(loaderExternalSrc);

  // remove the project loader script url request
  removeExternalLoaderScript(config, doc, loaderExternalSrc);

  // append the loader script content to the bottom of the document
  appendInlineLoaderScript(config, doc, ctx.projectFiles.loader);

  return doc;
}


function removeExternalLoaderScript(config: BuildConfig, doc: any, loaderExternalSrc: string) {
  // this is as parse5 JS object, not a node within the actual DOM
  const htmlParser = config.sys.htmlParser;

  const scriptElements = htmlParser.getElementsByTagName(doc, 'script');

  scriptElements.forEach(scriptElement => {
    var scriptSrc = htmlParser.getAttribute(scriptElement, 'src');
    if (scriptSrc === loaderExternalSrc) {
      // this is a script element with a src attribute which is
      // pointing to the project's external loader script
      // remove the script from the document, be gone with you
      htmlParser.removeNode(scriptElement);
    }
  });
}


function appendInlineLoaderScript(config: BuildConfig, doc: any, loaderScriptContent: string) {
  // this is as parse5 JS object, not a node within the actual DOM
  const htmlParser = config.sys.htmlParser;

  const bodyElement = htmlParser.getElementsByTagName(doc, 'body')[0];
  if (!bodyElement) {
    config.logger.error(`inlineAppLoader, index html missing body element`);
  }

  const scriptElm = htmlParser.createElement('script');
  const scriptText = htmlParser.createText(`\n${loaderScriptContent}\n`);

  htmlParser.appendChild(scriptElm, scriptText);

  htmlParser.appendChild(bodyElement, scriptElm);
}


function readIndexSrc(config: BuildConfig) {
  return readFile(config.sys, config.indexSrc);
}


function writeIndexDest(config: BuildConfig, ctx: BuildContext, optimizeHtmlResults: OptimizeHtmlResults) {
  if (ctx.projectFiles.indexHtml !== optimizeHtmlResults.html) {
    ctx.filesToWrite[config.indexDest] = ctx.projectFiles.indexHtml = optimizeHtmlResults.html;
    config.logger.debug(`optimizeHtml, write: ${config.indexDest}`);
    ctx.indexBuildCount++;
  }
}
