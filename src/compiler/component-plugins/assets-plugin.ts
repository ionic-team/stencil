import { AssetsMeta, Config } from '../../declarations';
import { normalizePath, pathJoin } from '../util';


export function normalizeAssetsDir(config: Config, componentFilePath: string, assetsMetas: AssetsMeta[])  {
  return assetsMetas.map((assetMeta) => {
    return {
      ...assetMeta,
      ...normalizeAssetDir(config, componentFilePath, assetMeta.originalComponentPath)
    };
  });
}


function normalizeAssetDir(config: Config, componentFilePath: string, assetsDir: string): AssetsMeta {

  const assetsMeta: AssetsMeta = {};

  // get the absolute path of the directory which the component is sitting in
  const componentDir = normalizePath(config.sys.path.dirname(componentFilePath));

  // get the relative path from the component file to the assets directory
  assetsDir = normalizePath(assetsDir.trim());

  if (config.sys.path.isAbsolute(assetsDir)) {
    // this path is absolute already!
    // add as the absolute path
    assetsMeta.absolutePath = assetsDir;

    // if this is an absolute path already, let's convert it to be relative
    assetsMeta.cmpRelativePath = config.sys.path.relative(componentDir, assetsDir);

  } else {
    // this path is relative to the component
    assetsMeta.cmpRelativePath = assetsDir;

    // create the absolute path to the asset dir
    assetsMeta.absolutePath = pathJoin(config, componentDir, assetsDir);
  }

  return assetsMeta;
}
