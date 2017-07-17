import { BuildConfig } from '../../util/interfaces';
import { BuildContext } from '../interfaces';


export function inlineLoaderScript(config: BuildConfig, ctx: BuildContext, doc: Document) {
  const loaderExternalSrc = `${config.publicPath}${config.namespace.toLowerCase()}.js`;

  // remove the project loader script url request
  const removedLoader = removeExternalLoaderScript(config, doc, loaderExternalSrc);

  if (removedLoader) {
    // append the loader script content to the bottom of the document
    appendInlineLoaderScript(ctx, doc);

  } else {
    config.logger.error(`Loader script was not inlined into the index.html file.`);
  }
}


function removeExternalLoaderScript(config: BuildConfig, doc: Document, loaderExternalSrc: string) {
  let removedLoader = false;

  const scriptElements = doc.getElementsByTagName('script');

  for (var i = 0; i < scriptElements.length; i++) {
    if (scriptElements[i].src.indexOf(loaderExternalSrc) > -1) {
      // this is a script element with a src attribute which is
      // pointing to the project's external loader script
      // remove the script from the document, be gone with you
      scriptElements[i].parentNode.removeChild(scriptElements[i]);
      removedLoader = true;
    }
  }

  if (!removedLoader) {
    config.logger.error(`External loader script "${loaderExternalSrc}" was not found in the index.html file.`);
  }

  return removedLoader;
}


function appendInlineLoaderScript(ctx: BuildContext, doc: Document) {
  const scriptElm = doc.createElement('script');
  scriptElm.innerHTML = ctx.projectFiles.loader;
  doc.body.appendChild(scriptElm);
}
