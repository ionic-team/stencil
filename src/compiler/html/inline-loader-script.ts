import { Config, CompilerCtx, HydrateResults } from '../../util/interfaces';
import { getLoaderFileName, getLoaderWWW } from '../app/app-file-naming';


export async function inlineLoaderScript(config: Config, ctx: CompilerCtx, doc: Document, results: HydrateResults) {
  // create the script url we'll be looking for
  let loaderExternalSrcUrl = config.publicPath;
  if (loaderExternalSrcUrl.charAt(loaderExternalSrcUrl.length - 1) !== '/') {
    loaderExternalSrcUrl += '/';
  }
  loaderExternalSrcUrl += getLoaderFileName(config);

  // find the external loader script
  // which is usually in the <head> and a pretty small external file
  // now that we're prerendering the html, and all the styles and html
  // will get hardcoded in the output, it's safe to now put the
  // loader script at the bottom of <body>
  const scriptElm = findExternalLoaderScript(doc, loaderExternalSrcUrl);

  if (scriptElm) {
    // append the loader script content to the bottom of <body>
    await relocateInlineLoaderScript(config, ctx, doc, results, scriptElm);
  }
}


function findExternalLoaderScript(doc: Document, loaderExternalSrcUrl: string) {
  const scriptElements = doc.getElementsByTagName('script');

  for (var i = 0; i < scriptElements.length; i++) {
    if (scriptElements[i].src.indexOf(loaderExternalSrcUrl) > -1) {
      // this is a script element with a src attribute which is
      // pointing to the app's external loader script
      // remove the script from the document, be gone with you
      //
      return scriptElements[i];
    }
  }

  return null;
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

  // remove the script element from where it's currently at in the dom
  scriptElm.parentNode.removeChild(scriptElm);

  // place it back in the dom, but at the bottom of the body
  doc.body.appendChild(scriptElm);
}
