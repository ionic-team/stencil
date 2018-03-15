import * as d from '../../declarations';
import { hasFileExtension } from '../util';
import { normalizePrerenderLocation } from '../prerender/prerender-utils';


export function assetVersioning(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, doc: Document) {
  return Promise.all([
    versionElementAssets(config, compilerCtx, outputTarget, windowLocationHref, doc)
  ]);
}


async function versionElementAssets(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, doc: Document) {
  if (!config.assetVersioning.versionHtml) {
    return;
  }

  await Promise.all([
    versionElementTypeAssets(config, compilerCtx, outputTarget, windowLocationHref, doc, 'img[src]', 'src'),
    versionElementTypeAssets(config, compilerCtx, outputTarget, windowLocationHref, doc, 'link[rel="apple-touch-icon"][href]', 'href'),
    versionElementTypeAssets(config, compilerCtx, outputTarget, windowLocationHref, doc, 'link[rel="icon"][href]', 'href'),
    versionElementTypeAssets(config, compilerCtx, outputTarget, windowLocationHref, doc, 'link[rel="manifest"][href]', 'href'),
    versionElementTypeAssets(config, compilerCtx, outputTarget, windowLocationHref, doc, 'link[rel="stylesheet"][href]', 'href'),
    versionElementTypeAssets(config, compilerCtx, outputTarget, windowLocationHref, doc, 'script[src]', 'src'),
  ]);
}


async function versionElementTypeAssets(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, doc: Document, selector: string, attrName: string) {
  const elements = doc.querySelectorAll(selector);

  const promises: Promise<any>[] = [];

  for (let i = 0; i < elements.length; i++) {
    promises.push(versionElementTypeAsset(config, compilerCtx, outputTarget, windowLocationHref, elements[i], attrName));
  }

  return Promise.all(promises);
}


async function versionElementTypeAsset(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, elm: Element, attrName: string) {
  const url = elm.getAttribute(attrName);

  const versionedUrl = await versionAsset(config, compilerCtx, outputTarget, windowLocationHref, url);
  if (versionedUrl) {
    elm.setAttribute(attrName, versionedUrl);
  }
}


async function versionAsset(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, url: string) {
  try {
    const orgFilePath = getFilePathFromUrl(config, outputTarget, windowLocationHref, url);
    if (!orgFilePath) {
      return null;
    }

    if (hasFileExtension(orgFilePath, TXT_EXT)) {
      const content = await compilerCtx.fs.readFile(orgFilePath);
      const hash = config.sys.generateContentHash(content, config.hashedFileNameLength);

      const dirName = config.sys.path.dirname(orgFilePath);
      const fileName = config.sys.path.basename(orgFilePath);
      const hashedFileName = createHashedFileName(fileName, hash);

      const hashedFilePath = config.sys.path.join(dirName, hashedFileName);
      await compilerCtx.fs.writeFile(hashedFilePath, content);

      await compilerCtx.fs.remove(orgFilePath);

      return hashedFileName;
    }

  } catch (e) {}

  return null;
}


function getFilePathFromUrl(config: d.Config, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, url: string) {
  if (typeof url !== 'string' || url.trim() === '') {
    return null;
  }

  const location = normalizePrerenderLocation(config, outputTarget, windowLocationHref, url);
  if (!location) {
    return null;
  }

  return config.sys.path.join(outputTarget.dir, location.path);
}


function createHashedFileName(fileName: string, hash: string) {
  const parts = fileName.split('.');
  parts.splice(parts.length - 1, 0, hash);
  return parts.join('.');
}


const TXT_EXT = ['js', 'css', 'svg', 'json'];
