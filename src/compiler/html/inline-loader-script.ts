import { CompilerCtx, Config, HydrateResults } from '../../declarations';
import { getLoaderFileName, getLoaderWWW } from '../app/app-file-naming';


export async function inlineLoaderScript(config: Config, ctx: CompilerCtx, doc: Document, results: HydrateResults) {
  // create the script url we'll be looking for
  const loaderFileName = getLoaderFileName(config);

  // find the external loader script
  // which is usually in the <head> and a pretty small external file
  // now that we're prerendering the html, and all the styles and html
  // will get hardcoded in the output, it's safe to now put the
  // loader script at the bottom of <body>
  const scriptElm = findExternalLoaderScript(config, doc, loaderFileName);

  if (scriptElm) {
    // append the loader script content to the bottom of <body>
    await relocateInlineLoaderScript(config, ctx, doc, results, scriptElm);
  }
}


function findExternalLoaderScript(config: Config, doc: Document, loaderFileName: string) {
  const scriptElements = doc.getElementsByTagName('script');

  for (let i = 0; i < scriptElements.length; i++) {
    if (isLoaderScriptSrc(config.publicPath, loaderFileName, scriptElements[i].getAttribute('src'))) {
      // this is a script element with a src attribute which is
      // pointing to the app's external loader script
      // remove the script from the document, be gone with you
      return scriptElements[i];
    }
  }

  return null;
}


export function isLoaderScriptSrc(publicPath: string, loaderFileName: string, scriptSrc: string) {
  try {
    if (typeof scriptSrc !== 'string' || scriptSrc.trim() === '') {
      return false;
    }

    scriptSrc = scriptSrc.toLowerCase();

    if (!scriptSrc.includes(loaderFileName)) {
      return false;
    }

    if (scriptSrc.startsWith('http') || scriptSrc.startsWith('file')) {
      return false;
    }

    const pathDirs = publicPath.toLowerCase().split('/');
    const firstPublicPathDir = pathDirs.find(pathDir => pathDir.length > 0);

    const scriptSrcDirs = scriptSrc.split('/');
    const firstScriptSrcDir = scriptSrcDirs.find(scriptSrcDir => scriptSrcDir.length > 0);

    if (firstPublicPathDir !== null && firstScriptSrcDir !== null) {
      return firstPublicPathDir === firstScriptSrcDir;
    }

    return true;

  } catch (e) {
    return false;
  }
}


async function relocateInlineLoaderScript(config: Config, ctx: CompilerCtx, doc: Document, results: HydrateResults, scriptElm: HTMLScriptElement) {
  // get the file path
  const appLoaderWWW = getLoaderWWW(config);

  // get the loader content
  let content: string = null;
  try {
    // let's look it up directly
    content = await ctx.fs.readFile(appLoaderWWW);

  } catch (e) {
    config.logger.debug(`unable to inline loader: ${appLoaderWWW}`, e);
  }

  if (!content) {
    // didn't get good loader content, don't bother
    return;
  }

  config.logger.debug(`optimize ${results.pathname}, inline loader`);

  // remove the external src
  scriptElm.removeAttribute('src');

  // inline the js content
  scriptElm.innerHTML = content;

  if (results.opts.hydrateComponents) {
    // remove the script element from where it's currently at in the dom
    scriptElm.parentNode.removeChild(scriptElm);

    // place it back in the dom, but at the bottom of the body
    doc.body.appendChild(scriptElm);
  }
}
