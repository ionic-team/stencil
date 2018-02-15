import { Collection, CompilerCtx, Config } from '../../declarations';
import { normalizePath, pathJoin } from '../util';
import { parseCollectionData } from './collection-data';


export function parseCollectionModule(config: Config, compilerCtx: CompilerCtx, packageJsonFilePath: string, packageJsonData: any) {
  // note this MUST be synchronous because this is used during transpile
  const collectionName = packageJsonData.name;

  let collection: Collection = compilerCtx.collections.find(c => c.collectionName === collectionName);
  if (collection) {
    // we've already cached the collection, no need for another resolve/readFile/parse
    // thought being that /node_modules/ isn't changing between watch builds
    return collection;
  }

  // get the root directory of the dependency
  const collectionPackageRootDir = config.sys.path.dirname(packageJsonFilePath);

  // figure out the full path to the collection collection file
  const collectionFilePath = pathJoin(config, collectionPackageRootDir, packageJsonData.collection);

  config.logger.debug(`load colleciton: ${collectionFilePath}`);

  // we haven't cached the collection yet, let's read this file
  // sync on purpose :(
  const collectionJsonStr = compilerCtx.fs.readFileSync(collectionFilePath);

  // get the directory where the collection collection file is sitting
  const collectionDir = normalizePath(config.sys.path.dirname(collectionFilePath));

  // parse the json string into our collection data
  collection = parseCollectionData(
    config,
    collectionName,
    collectionDir,
    collectionJsonStr
  );

  // remember the source of this collection node_module
  collection.moduleDir = collectionPackageRootDir;

  // append any collection data
  collection.moduleFiles.forEach(collectionModuleFile => {
    if (!compilerCtx.moduleFiles[collectionModuleFile.jsFilePath]) {
      compilerCtx.moduleFiles[collectionModuleFile.jsFilePath] = collectionModuleFile;
    }
  });

  // cache it for later yo
  compilerCtx.collections.push(collection);

  return collection;
}
