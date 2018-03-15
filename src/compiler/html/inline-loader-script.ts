import * as d from '../../declarations';
import { getLoaderFileName, getLoaderPath } from '../app/app-file-naming';
import { normalizePath } from '../util';


export async function inlineLoaderScript(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTargetHydrate,
  windowLocationPath: string,
  doc: Document
) {
  // create the script url we'll be looking for
  const loaderFileName = getLoaderFileName(config);

  // find the external loader script
  // which is usually in the <head> and a pretty small external file
  // now that we're prerendering the html, and all the styles and html
  // will get hardcoded in the output, it's safe to now put the
  // loader script at the bottom of <body>
  const scriptElm = findExternalLoaderScript(doc, loaderFileName);

  if (scriptElm) {
    // append the loader script content to the bottom of <body>
    await updateInlineLoaderScriptElement(config, compilerCtx, outputTarget, doc, windowLocationPath, scriptElm);
  }
}


function findExternalLoaderScript(doc: Document, loaderFileName: string) {
  const scriptElements = doc.getElementsByTagName('script');

  for (let i = 0; i < scriptElements.length; i++) {
    const src = scriptElements[i].getAttribute('src');

    if (isLoaderScriptSrc(loaderFileName, src)) {
      // this is a script element with a src attribute which is
      // pointing to the app's external loader script
      // remove the script from the document, be gone with you
      return scriptElements[i];
    }
  }

  return null;
}


export function isLoaderScriptSrc(loaderFileName: string, scriptSrc: string) {
  try {
    if (typeof scriptSrc !== 'string' || scriptSrc.trim() === '') {
      return false;
    }

    scriptSrc = scriptSrc.toLowerCase();

    if (scriptSrc.startsWith('http') || scriptSrc.startsWith('file')) {
      return false;
    }

    scriptSrc = scriptSrc.split('?')[0].split('#')[0];
    loaderFileName = loaderFileName.split('?')[0].split('#')[0];

    if (scriptSrc === loaderFileName || scriptSrc.endsWith('/' + loaderFileName)) {
      return true;
    }

  } catch (e) {}

  return false;
}


async function updateInlineLoaderScriptElement(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, doc: Document, windowLocationPath: string, scriptElm: HTMLScriptElement) {
  // get the file path
  const appLoaderPath = getLoaderPath(config, outputTarget);

  // get the loader content
  let content: string = null;
  try {
    // let's look it up directly
    content = await compilerCtx.fs.readFile(appLoaderPath);

  } catch (e) {
    config.logger.debug(`unable to inline loader: ${appLoaderPath}`, e);
  }

  if (!content) {
    // didn't get good loader content, don't bother
    return;
  }

  config.logger.debug(`optimize ${windowLocationPath}, inline loader`);

  // remove the external src
  scriptElm.removeAttribute('src');

  // only add the data-resource-path attr if we don't already have one
  const existingResourcePathAttr = scriptElm.getAttribute('data-resource-path');
  if (!existingResourcePathAttr) {
    let resourcePath = outputTarget.resourcePath;
    if (!resourcePath) {
      resourcePath = config.sys.path.join(outputTarget.buildDir, config.fsNamespace);
      resourcePath = normalizePath(config.sys.path.relative(outputTarget.dir, resourcePath));

      if (!resourcePath.startsWith('/')) {
        resourcePath = '/' + resourcePath;
      }

      if (!resourcePath.endsWith('/')) {
        resourcePath = resourcePath + '/';
      }
    }

    // add the resource path data attribute
    scriptElm.setAttribute('data-resource-path', resourcePath);
  }

  // inline the js content
  scriptElm.innerHTML = content;

  if (outputTarget.hydrateComponents) {
    // remove the script element from where it's currently at in the dom
    scriptElm.parentNode.removeChild(scriptElm);

    // place it back in the dom, but at the bottom of the body
    doc.body.appendChild(scriptElm);
  }
}
