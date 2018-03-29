import * as d from '../../declarations';
import { versionElementAssets } from './element-assets';
import { versionManifestAssets } from './manifest-assets';


export async function assetVersioning(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, windowLocationHref: string, doc: Document) {
  await versionElementAssets(config, compilerCtx, outputTarget, windowLocationHref, doc);
  await versionManifestAssets(config, compilerCtx, outputTarget, windowLocationHref, doc);
}
