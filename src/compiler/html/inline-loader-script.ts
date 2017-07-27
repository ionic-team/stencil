import { BuildConfig, BuildContext } from '../../util/interfaces';


export function inlineLoaderScript(config: BuildConfig, ctx: BuildContext, doc: Document) {
  if (!ctx.appFiles || !ctx.appFiles.loader) {
    // don't bother if we don't have good loader content for whatever reason
    return;
  }

  // create the script url we'll be looking for
  const loaderExternalSrcUrl = `${config.publicPath}/${config.namespace.toLowerCase()}.js`;

  // remove the app loader script url request
  const removedLoader = removeExternalLoaderScript(config, doc, loaderExternalSrcUrl);

  if (removedLoader) {
    // append the loader script content to the bottom of the document
    appendInlineLoaderScript(ctx, doc);

  } else {
    config.logger.error(`Loader script was not inlined into the index.html file.`);
  }
}


function removeExternalLoaderScript(config: BuildConfig, doc: Document, loaderExternalSrcUrl: string) {
  let removedLoader = false;

  const scriptElements = doc.getElementsByTagName('script');

  for (var i = 0; i < scriptElements.length; i++) {
    if (scriptElements[i].src.indexOf(loaderExternalSrcUrl) > -1) {
      // this is a script element with a src attribute which is
      // pointing to the app's external loader script
      // remove the script from the document, be gone with you
      scriptElements[i].parentNode.removeChild(scriptElements[i]);
      removedLoader = true;
    }
  }

  if (!removedLoader) {
    config.logger.error(`External loader script "${loaderExternalSrcUrl}" was not found in the index.html file.`);
  }

  return removedLoader;
}


function appendInlineLoaderScript(ctx: BuildContext, doc: Document) {
  // now that we've removed the external script
  // let's add the loader script back in, except let's
  // inline the js directly into the document
  // and append it as the last child in the body
  const scriptElm = doc.createElement('script');
  scriptElm.innerHTML = ctx.appFiles.loader;
  doc.body.appendChild(scriptElm);
}
