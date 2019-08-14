import * as d from '../../../declarations';
import { normalizePath } from '@utils';
import { parseCollectionManifest } from './parse-collection-manifest';


export const parseCollection = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgJsonFilePath: string, pkgData: d.PackageJsonData) => {
  // note this MUST be synchronous because this is used during transpile
  const collectionName = pkgData.name;

  let collection: d.CollectionCompilerMeta = compilerCtx.collections.find(c => c.collectionName === collectionName);
  if (collection != null) {
    // we've already cached the collection, no need for another resolve/readFile/parse
    // thought being that /node_modules/ isn't changing between watch builds
    return collection;
  }

  // get the root directory of the dependency
  const collectionPackageRootDir = config.sys.path.dirname(pkgJsonFilePath);

  // figure out the full path to the collection collection file
  const collectionFilePath = config.sys.path.join(collectionPackageRootDir, pkgData.collection);

  const relPath = config.sys.path.relative(config.rootDir, collectionFilePath);
  config.logger.debug(`load collection: ${collectionName}, ${relPath}`);

  // we haven't cached the collection yet, let's read this file
  // sync on purpose :(
  const collectionJsonStr = compilerCtx.fs.readFileSync(collectionFilePath);

  // get the directory where the collection collection file is sitting
  const collectionDir = normalizePath(config.sys.path.dirname(collectionFilePath));

  // parse the json string into our collection data
  collection = parseCollectionManifest(
    config,
    compilerCtx,
    buildCtx,
    collectionName,
    collectionDir,
    collectionJsonStr
  );

  if (pkgData.module && pkgData.module !== pkgData.main) {
    collection.hasExports = true;
  }

  // remember the source of this collection node_module
  collection.moduleDir = collectionPackageRootDir;

  // cache it for later yo
  compilerCtx.collections.push(collection);

  return collection;
};
