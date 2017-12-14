import { BuildConfig, BuildContext, HydrateOptions, Url } from '../../util/interfaces';
import { pathJoin } from '../util';


export function inlineExternalAssets(config: BuildConfig, ctx: BuildContext, opts: HydrateOptions, doc: Document) {
  const linkElements = doc.querySelectorAll('link[href][rel="stylesheet"]') as any;
  for (var i = 0; i < linkElements.length; i++) {
    inlineStyle(config, ctx, opts, doc, linkElements[i] as any);
  }

  const scriptElements = doc.querySelectorAll('script[src]') as any;
  for (i = 0; i < scriptElements.length; i++) {
    inlineScript(config, ctx, opts, scriptElements[i] as any);
  }
}


function inlineStyle(config: BuildConfig, ctx: BuildContext, opts: HydrateOptions, doc: Document, linkElm: HTMLLinkElement) {
  const content = getAssetContent(config, ctx, opts, linkElm.href);
  if (!content) {
    return;
  }

  const styleElm = doc.createElement('style');
  styleElm.innerHTML = content;

  linkElm.parentNode.insertBefore(styleElm, linkElm);
  linkElm.parentNode.removeChild(linkElm);
}


function inlineScript(config: BuildConfig, ctx: BuildContext, opts: HydrateOptions, scriptElm: HTMLScriptElement) {
  const content = getAssetContent(config, ctx, opts, scriptElm.src);
  if (!content) {
    return;
  }

  scriptElm.innerHTML = content;
  scriptElm.removeAttribute('src');
}


function getAssetContent(config: BuildConfig, ctx: BuildContext, opts: HydrateOptions, assetUrl: string) {
  const fromUrl = config.sys.url.parse(opts.url);
  const toUrl = config.sys.url.parse(assetUrl);

  if (fromUrl.hostname !== toUrl.hostname) {
    return null;
  }

  const filePath = getFilePathFromUrl(config, fromUrl, toUrl);

  const toWriteContent = ctx.filesToWrite[filePath];
  if (!toWriteContent) {
    return null;
  }

  const fileSize = toWriteContent.length;

  if (fileSize > opts.inlineAssetsMaxSize) {
    return null;
  }

  return toWriteContent;
}


export function getFilePathFromUrl(config: BuildConfig, fromUrl: Url, toUrl: Url) {
  const resolvedUrl = '.' + config.sys.url.resolve(fromUrl.pathname, toUrl.pathname);
  return pathJoin(config, config.wwwDir, resolvedUrl);
}
