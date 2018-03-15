import * as d from '../../declarations';
import { pathJoin } from '../util';


export async function inlineExternalAssets(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTargetHydrate,
  windowLocationPath: string,
  doc: Document
) {
  const linkElements = doc.querySelectorAll('link[href][rel="stylesheet"]') as any;
  for (var i = 0; i < linkElements.length; i++) {
    inlineStyle(config, compilerCtx, outputTarget, windowLocationPath, doc, linkElements[i] as any);
  }

  const scriptElements = doc.querySelectorAll('script[src]') as any;
  for (i = 0; i < scriptElements.length; i++) {
    await inlineScript(config, compilerCtx, outputTarget, windowLocationPath, scriptElements[i] as any);
  }
}


async function inlineStyle(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationPath: string, doc: Document, linkElm: HTMLLinkElement) {
  const content = await getAssetContent(config, compilerCtx, outputTarget, windowLocationPath, linkElm.href);
  if (!content) {
    return;
  }

  config.logger.debug(`optimize ${windowLocationPath}, inline style: ${config.sys.url.parse(linkElm.href).pathname}`);

  const styleElm = doc.createElement('style');
  styleElm.innerHTML = content;

  linkElm.parentNode.insertBefore(styleElm, linkElm);
  linkElm.parentNode.removeChild(linkElm);
}


async function inlineScript(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationPath: string, scriptElm: HTMLScriptElement) {
  const content = await getAssetContent(config, compilerCtx, outputTarget, windowLocationPath, scriptElm.src);
  if (!content) {
    return;
  }

  config.logger.debug(`optimize ${windowLocationPath}, inline script: ${scriptElm.src}`);

  scriptElm.innerHTML = content;
  scriptElm.removeAttribute('src');
}


async function getAssetContent(config: d.Config, ctx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationPath: string, assetUrl: string) {
  if (typeof assetUrl !== 'string' || assetUrl.trim() === '') {
    return null;
  }

  // figure out the url's so we can check the hostnames
  const fromUrl = config.sys.url.parse(windowLocationPath);
  const toUrl = config.sys.url.parse(assetUrl);

  if (fromUrl.hostname !== toUrl.hostname) {
    // not the same hostname, so we wouldn't have the file content
    return null;
  }

  // figure out the local file path
  const filePath = getFilePathFromUrl(config, outputTarget, fromUrl, toUrl);

  // doesn't look like we've got it cached in app files
  try {
    // try looking it up directly
    const content = await ctx.fs.readFile(filePath);

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


export function getFilePathFromUrl(config: d.Config, outputTarget: d.OutputTargetHydrate, fromUrl: d.Url, toUrl: d.Url) {
  const resolvedUrl = '.' + config.sys.url.resolve(fromUrl.pathname, toUrl.pathname);
  return pathJoin(config, outputTarget.dir, resolvedUrl);
}
