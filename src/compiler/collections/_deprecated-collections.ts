import { BuildCtx, Collection, CompilerCtx, Config, ConfigCollection } from '../../declarations';
import { catchError } from '../util';
import { copySourceCollectionComponentsToDistribution } from './copy-collection';
import { parseCollectionData } from './collection-data';
import { normalizePath, pathJoin } from '../util';
import { upgradeCollection } from './upgrade-collection';


/**
 * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
 */
export async function _deprecatedConfigCollections(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  const timeSpan = config.logger.createTimeSpan(`load collections started`, true);

  try {
    buildCtx.collections = await loadConfigCollections(config, compilerCtx, buildCtx);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`load collections finished`);
}


function loadConfigCollections(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): Promise<Collection[]> {
  // load up all of the collections which this app is dependent on
  return Promise.all(config._deprecatedCollections.map(configCollection => {
    return loadConfigCollection(config, compilerCtx, buildCtx, configCollection);
  }));
}


async function loadConfigCollection(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, configCollection: ConfigCollection) {
  let collection = compilerCtx.collections.find(c => c.collectionName === configCollection.name);
  if (collection) {
    // we've already cached the collection, no need for another resolve/readFile/parse
    return collection;
  }

  // figure out the path to the dependent collection's package.json
  const collectionJsonFilePath = config.sys.resolveModule(config.rootDir, configCollection.name);

  // parse the dependent collection's package.json
  const packageJsonStr = await compilerCtx.fs.readFile(collectionJsonFilePath);
  const packageData = JSON.parse(packageJsonStr);

  // verify this package has a "collection" property in its package.json
  if (!packageData.collection) {
    throw new Error(`stencil collection "${configCollection.name}" is missing the "collection" key from its package.json: ${collectionJsonFilePath}`);
  }

  // get the root directory of the dependency
  const collectionPackageRootDir = config.sys.path.dirname(collectionJsonFilePath);

  // figure out the full path to the collection collection file
  const collectionFilePath = pathJoin(config, collectionPackageRootDir, packageData.collection);

  config.logger.debug(`load colleciton: ${collectionFilePath}`);

  // we haven't cached the collection yet, let's read this file
  const collectionJsonStr = await compilerCtx.fs.readFile(collectionFilePath);

  // get the directory where the collection collection file is sitting
  const collectionDir = normalizePath(config.sys.path.dirname(collectionFilePath));

  // parse the json string into our collection data
  collection = parseCollectionData(
    config,
    configCollection.name,
    collectionDir,
    collectionJsonStr
  );

  // append any collection data
  collection.moduleFiles.forEach(collectionModuleFile => {
    if (!compilerCtx.moduleFiles[collectionModuleFile.jsFilePath]) {
      compilerCtx.moduleFiles[collectionModuleFile.jsFilePath] = collectionModuleFile;
    }
  });

  // Look at all dependent components from outside collections and
  // upgrade the components to be compatible with this version if need be
  await upgradeCollection(config, compilerCtx, buildCtx, collection);

  if (config.generateDistribution) {
    await copySourceCollectionComponentsToDistribution(config, compilerCtx, collection.moduleFiles);
  }

  // cache it for later yo
  compilerCtx.collections.push(collection);

  // so let's recap: we've read the file, parsed it apart, and cached it, congrats
  return collection;
}
