import type * as d from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME, flatOne, normalizePath, sortBy } from '@utils';
import { join, relative } from 'path';
import { typescriptVersion, version } from '../../version';

export const writeCollectionManifests = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTargets: d.OutputTargetDistCollection[]
) => {
  const collectionData = JSON.stringify(serializeCollectionManifest(config, compilerCtx, buildCtx), null, 2);
  return Promise.all(outputTargets.map((o) => writeCollectionManifest(compilerCtx, collectionData, o)));
};

// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler
const writeCollectionManifest = async (
  compilerCtx: d.CompilerCtx,
  collectionData: string,
  outputTarget: d.OutputTargetDistCollection
) => {
  // get the absolute path to the directory where the collection will be saved
  const collectionDir = normalizePath(outputTarget.collectionDir);

  // create an absolute file path to the actual collection json file
  const collectionFilePath = normalizePath(join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));

  // don't bother serializing/writing the collection if we're not creating a distribution
  await compilerCtx.fs.writeFile(collectionFilePath, collectionData);
};

export const serializeCollectionManifest = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  // create the single collection we're going to fill up with data
  const collectionManifest: d.CollectionManifest = {
    entries: buildCtx.moduleFiles
      .filter((mod) => !mod.isCollectionDependency && mod.cmps.length > 0)
      .map((mod) => relative(config.srcDir, mod.jsFilePath)),
    compiler: {
      name: '@stencil/core',
      version,
      typescriptVersion,
    },
    collections: serializeCollectionDependencies(compilerCtx),
    bundles: config.bundles.map((b) => ({
      components: b.components.slice().sort(),
    })),
  };
  if (config.globalScript) {
    const mod = compilerCtx.moduleMap.get(normalizePath(config.globalScript));
    if (mod) {
      collectionManifest.global = relative(config.srcDir, mod.jsFilePath);
    }
  }
  return collectionManifest;
};

const serializeCollectionDependencies = (compilerCtx: d.CompilerCtx): d.CollectionDependencyData[] => {
  const collectionDeps = compilerCtx.collections.map((c) => ({
    name: c.collectionName,
    tags: flatOne(c.moduleFiles.map((m) => m.cmps))
      .map((cmp) => cmp.tagName)
      .sort(),
  }));

  return sortBy(collectionDeps, (item) => item.name);
};
