import { BuildConfig } from '../../util/interfaces';
import { BuildContext } from '../interfaces';


export function inlineLoaderScript(config: BuildConfig, ctx: BuildContext, doc: Document) {
  const loaderExternalSrc = `${config.publicPath}${config.namespace.toLowerCase()}.js`;

  // remove the project loader script url request
  removeExternalLoaderScript(doc, loaderExternalSrc);

  // append the loader script content to the bottom of the document
  appendInlineLoaderScript(ctx, doc);
}


function removeExternalLoaderScript(doc: Document, loaderExternalSrc: string) {
  const scriptElements = doc.getElementsByTagName('script');

  for (var i = 0; i < scriptElements.length; i++) {
    console.log(scriptElements[i].src, loaderExternalSrc, scriptElements[i].src.indexOf(loaderExternalSrc) > -1)
    if (scriptElements[i].src.indexOf(loaderExternalSrc) > -1) {
      // this is a script element with a src attribute which is
      // pointing to the project's external loader script
      // remove the script from the document, be gone with you
      scriptElements[i].parentNode.removeChild(scriptElements[i]);
    }
  }
}


function appendInlineLoaderScript(ctx: BuildContext, doc: Document) {
  const scriptElm = doc.createElement('script');
  scriptElm.innerHTML = ctx.projectFiles.loader;
  doc.body.appendChild(scriptElm);
}
