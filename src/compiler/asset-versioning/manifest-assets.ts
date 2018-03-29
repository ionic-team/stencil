import * as d from '../../declarations';
import { getFilePathFromUrl } from './util';
import { hasFileExtension } from '../util';


export async function versionManifestAssets(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, doc: Document) {
  if (!config.assetVersioning.versionManifest) {
    return;
  }

  const manifestLink = doc.querySelector('link[rel="manifest"][href]') as any;
  if (!manifestLink) {
    return;
  }

  return versionManifest(config, compilerCtx, outputTarget, windowLocationHref, manifestLink);
}


async function versionManifest(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, linkElm: HTMLLinkElement) {
  const url = linkElm.getAttribute('href');
  if (!url) {
    return;
  }

  const orgFilePath = getFilePathFromUrl(config, outputTarget, windowLocationHref, url);
  if (!orgFilePath) {
    return;
  }

  if (!hasFileExtension(orgFilePath, ['json'])) {
    return;
  }

  try {
    const jsonStr = await compilerCtx.fs.readFile(orgFilePath);
    const manifest: Manifest = JSON.parse(jsonStr);

    if (Array.isArray(manifest.icons)) {
      await Promise.all(manifest.icons.map(async manifestIcon => {
        await versionManifestIcon(config, compilerCtx, outputTarget, windowLocationHref, manifest, manifestIcon);
      }));
    }

    await generateVersionedManifest(config, compilerCtx, linkElm, orgFilePath, manifest);

  } catch (e) {
    config.logger.error(`versionManifest: ${e}`);
  }
}


async function versionManifestIcon(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, manifest: Manifest, manifestIcon: ManifestIcon) {
  config; compilerCtx; outputTarget; windowLocationHref; manifest; manifestIcon;
}


async function generateVersionedManifest(config: d.Config, compilerCtx: d.CompilerCtx, linkElm: HTMLLinkElement, orgFilePath: string, manifest: Manifest) {
  const jsonStr = JSON.stringify(manifest);

  const dir = config.sys.path.dirname(orgFilePath);
  const orgFileName = config.sys.path.basename(orgFilePath);

  const hash = config.sys.generateContentHash(jsonStr, config.hashedFileNameLength);

  const newFileName = orgFileName.toLowerCase().replace(`.json`, `.${hash}.json`);

  const newFilePath = config.sys.path.join(dir, newFileName);

  await Promise.all([
    compilerCtx.fs.remove(orgFilePath),
    compilerCtx.fs.writeFile(newFilePath, jsonStr)
  ]);

  let url = linkElm.getAttribute('href');

  url = url.replace(orgFileName, newFileName);

  linkElm.setAttribute('href', url);
}


interface Manifest {
  icons?: ManifestIcon[];
}


interface ManifestIcon {
  src?: string;
}
