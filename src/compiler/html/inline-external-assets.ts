import * as d from '@declarations';
import { logger, sys } from '@sys';


export async function inlineExternalAssets(
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTargetHydrate,
  windowLocationPath: string,
  doc: Document
) {
  const linkElements = doc.querySelectorAll('link[href][rel="stylesheet"]') as any;
  for (var i = 0; i < linkElements.length; i++) {
    inlineStyle(compilerCtx, outputTarget, windowLocationPath, doc, linkElements[i] as any);
  }

  const scriptElements = doc.querySelectorAll('script[src]') as any;
  for (i = 0; i < scriptElements.length; i++) {
    await inlineScript(compilerCtx, outputTarget, windowLocationPath, scriptElements[i] as any);
  }
}


async function inlineStyle(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationPath: string, doc: Document, linkElm: HTMLLinkElement) {
  const content = await getAssetContent(compilerCtx, outputTarget, windowLocationPath, linkElm.href);
  if (!content) {
    return;
  }

  logger.debug(`optimize ${windowLocationPath}, inline style: ${sys.url.parse(linkElm.href).pathname}`);

  const styleElm = doc.createElement('style');
  styleElm.innerHTML = content;

  linkElm.parentNode.insertBefore(styleElm, linkElm);
  linkElm.parentNode.removeChild(linkElm);
}


async function inlineScript(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationPath: string, scriptElm: HTMLScriptElement) {
  const content = await getAssetContent(compilerCtx, outputTarget, windowLocationPath, scriptElm.src);
  if (!content) {
    return;
  }

  logger.debug(`optimize ${windowLocationPath}, inline script: ${scriptElm.src}`);

  scriptElm.innerHTML = content;
  scriptElm.removeAttribute('src');
}


async function getAssetContent(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationPath: string, assetUrl: string) {
  if (typeof assetUrl !== 'string' || assetUrl.trim() === '') {
    return null;
  }

  // figure out the url's so we can check the hostnames
  const fromUrl = sys.url.parse(windowLocationPath);
  const toUrl = sys.url.parse(assetUrl);

  if (fromUrl.hostname !== toUrl.hostname) {
    // not the same hostname, so we wouldn't have the file content
    return null;
  }

  // figure out the local file path
  const filePath = getFilePathFromUrl(outputTarget, fromUrl, toUrl);

  // doesn't look like we've got it cached in app files
  try {
    // try looking it up directly
    const content = await compilerCtx.fs.readFile(filePath);

    // rough estimate of size
    const fileSize = content.length;

    if (fileSize > outputTarget.inlineAssetsMaxSize) {
      // welp, considered too big, don't inline
      return null;
    }

    return content;

  } catch (e) {
    // never found the content for this file
    return null;
  }
}


export function getFilePathFromUrl(outputTarget: d.OutputTargetHydrate, fromUrl: d.Url, toUrl: d.Url) {
  const resolvedUrl = '.' + sys.url.resolve(fromUrl.pathname, toUrl.pathname);
  return sys.path.join(outputTarget.dir, resolvedUrl);
}
