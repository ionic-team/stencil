import * as d from '../../../declarations';
import { normalizePath } from '../../util';
import { parseCollection } from './parse-collection-module';


export function addCollection(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.Module, resolveFromDir: string, moduleId: string) {
  moduleFile.externalImports = moduleFile.externalImports || [];
  if (!moduleFile.externalImports.includes(moduleId)) {
    moduleFile.externalImports.push(moduleId);
    moduleFile.externalImports.sort();
  }

  compilerCtx.resolvedCollections = compilerCtx.resolvedCollections || new Set();
  if (compilerCtx.resolvedCollections.has(moduleId)) {
    // we've already handled this collection moduleId before
    return;
  }

  // cache that we've already parsed this
  compilerCtx.resolvedCollections.add(moduleId);

  let pkgJsonFilePath: string;
  try {
    // get the full package.json file path
    pkgJsonFilePath = normalizePath(config.sys.resolveModule(resolveFromDir, moduleId));

  } catch (e) {
    // it's someone else's job to handle unresolvable paths
    return;
  }

  if (pkgJsonFilePath === 'package.json') {
    // the resolved package is actually this very same package, so whatever
    return;
  }

  // open up and parse the package.json
  // sync on purpose :(
  const pkgJsonStr = compilerCtx.fs.readFileSync(pkgJsonFilePath);
  const pkgData: d.PackageJsonData = JSON.parse(pkgJsonStr);

  if (typeof pkgData.collection !== 'string' || !pkgData.collection.endsWith('.json')) {
    // this import is not a stencil collection
    return;
  }

  if (typeof pkgData.types !== 'string' || !pkgData.types.endsWith('.d.ts')) {
    // this import should have types
    return;
  }

  // this import is a stencil collection
  // let's parse it and gather all the module data about it
  // internally it'll cached collection data if we've already done this
  const collection = parseCollection(config, compilerCtx, buildCtx, pkgJsonFilePath, pkgData);

  // check if we already added this collection to the build context
  const alreadyHasCollection = buildCtx.collections.some(c => {
    return c.collectionName === collection.collectionName;
  });

  if (alreadyHasCollection) {
    // we already have this collection in our build context
    return;
  }

  // let's add the collection to the build context
  buildCtx.collections.push(collection);

  if (Array.isArray(collection.dependencies)) {
    // this collection has more collections
    // let's keep digging down and discover all of them
    collection.dependencies.forEach(dependencyModuleId => {
      const resolveFromDir = config.sys.path.dirname(pkgJsonFilePath);
      addCollection(config, compilerCtx, buildCtx, moduleFile, resolveFromDir, dependencyModuleId);
    });
  }
}
