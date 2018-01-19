import { COLLECTION_DEPENDENCIES_DIR, parseDependentManifest } from './manifest-data';
import { CompilerCtx, Config, DependentCollection, Manifest, ModuleFile } from '../../util/interfaces';
import { normalizePath } from '../util';


export function loadDependentManifests(config: Config, ctx: CompilerCtx): Promise<Manifest[]> {
  // load up all of the collections which this app is dependent on
  return Promise.all(config.collections.map(configCollection => {
    return loadDependentManifest(config, ctx, configCollection);
  }));
}


async function loadDependentManifest(config: Config, compilerCtx: CompilerCtx, dependentCollection: DependentCollection) {

  if (compilerCtx.dependentManifests[dependentCollection.name]) {
    // we've already cached the manifest, no need for another resolve/readFile/parse
    return compilerCtx.dependentManifests[dependentCollection.name];
  }

  // figure out the path to the dependent collection's package.json
  const dependentPackageJsonFilePath = config.sys.resolveModule(config.rootDir, dependentCollection.name);

  // parse the dependent collection's package.json
  const packageJsonStr = await compilerCtx.fs.readFile(dependentPackageJsonFilePath);
  const packageData = JSON.parse(packageJsonStr);

  // verify this package has a "collection" property in its package.json
  if (!packageData.collection) {
    throw new Error(`stencil collection "${dependentCollection.name}" is missing the "collection" key from its package.json: ${dependentPackageJsonFilePath}`);
  }

  // get the root directory of the dependency
  const dependentPackageRootDir = config.sys.path.dirname(dependentPackageJsonFilePath);

  // figure out the full path to the collection manifest file
  const dependentManifestFilePath = normalizePath(
    config.sys.path.join(dependentPackageRootDir, packageData.collection)
  );

  // we haven't cached the dependent manifest yet, let's read this file
  const dependentManifestJson = await compilerCtx.fs.readFile(dependentManifestFilePath);

  // get the directory where the collection manifest file is sitting
  const dependentManifestDir = normalizePath(config.sys.path.dirname(dependentManifestFilePath));

  // parse the json string into our Manifest data
  const dependentManifest = parseDependentManifest(
    config,
    dependentCollection.name,
    dependentCollection.includeBundledOnly,
    dependentManifestDir,
    dependentManifestJson
  );

  await copySourceCollectionComponentsToDistribution(config, compilerCtx, dependentManifest.modulesFiles);

  // cache it for later yo
  compilerCtx.dependentManifests[dependentCollection.name] = dependentManifest;

  // so let's recap: we've read the file, parsed it apart, and cached it, congrats
  return dependentManifest;
}


async function copySourceCollectionComponentsToDistribution(config: Config, compilerCtx: CompilerCtx, modulesFiles: ModuleFile[]) {
  // for any components that are dependencies, such as ionicons is a dependency of ionic
  // then we need to copy the dependency to the dist so it just works downstream
  const copyPromises = modulesFiles
          .filter(m => m.isCollectionDependency && m.originalCollectionComponentPath)
          .map(m => {
            const src = m.jsFilePath;
            const dest = config.sys.path.join(
              config.collectionDir,
              COLLECTION_DEPENDENCIES_DIR,
              m.originalCollectionComponentPath
            );
            return compilerCtx.fs.copy(src, dest);
          });

  await Promise.all(copyPromises);
  await compilerCtx.fs.commitCopy();
}
