import * as d from '../../declarations';
import { createHashedFileName, getFilePathFromUrl } from './util';
import { hasFileExtension } from '../util';


export async function versionElementAssets(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, doc: Document) {
  if (!config.assetVersioning.versionHtml) {
    return;
  }

  await Promise.all(ELEMENT_TYPES.map(async elmType => {
    await versionElementTypeAssets(config, compilerCtx, outputTarget, windowLocationHref, doc, elmType.selector, elmType.selector);
  }));
}


const ELEMENT_TYPES: { selector: string; attr: string; }[] = [
  { selector: 'link[rel="apple-touch-icon"][href]', attr: 'href' },
  { selector: 'link[rel="icon"][href]', attr: 'href' },
  { selector: 'link[rel="manifest"][href]', attr: 'href' },
  { selector: 'link[rel="stylesheet"][href]', attr: 'href' }
];


async function versionElementTypeAssets(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, doc: Document, selector: string, attrName: string) {
  const elements = doc.querySelectorAll(selector);

  const promises: Promise<any>[] = [];

  for (let i = 0; i < elements.length; i++) {
    promises.push(versionElementAsset(config, compilerCtx, outputTarget, windowLocationHref, elements[i], attrName));
  }

  await Promise.all(promises);
}


async function versionElementAsset(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, elm: Element, attrName: string) {
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


const TXT_EXT = ['js', 'css', 'svg', 'json'];
