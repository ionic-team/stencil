import * as d from '../../../declarations';
import { normalizePath } from '../../util';
import { parseCollectionModule } from '../../collections/parse-collection-module';
import * as ts from 'typescript';


export function getCollections(config: d.Config, compilerCtx: d.CompilerCtx, collections: d.Collection[], moduleFile: d.ModuleFile, importNode: ts.ImportDeclaration) {
  if (!importNode.moduleSpecifier || !compilerCtx || !collections) {
    return;
  }

  const moduleId = (importNode.moduleSpecifier as ts.StringLiteral).text;

  // see if we can add this collection dependency
  addCollection(config, compilerCtx, collections, moduleFile, config.rootDir, moduleId);
}


export function addCollection(config: d.Config, compilerCtx: d.CompilerCtx, collections: d.Collection[], moduleFile: d.ModuleFile, resolveFromDir: string, moduleId: string) {
  if (moduleId.startsWith('.') || moduleId.startsWith('/')) {
    // not a node module import, so don't bother
    return;
  }

  moduleFile.externalImports = moduleFile.externalImports || [];
  if (!moduleFile.externalImports.includes(moduleId)) {
    moduleFile.externalImports.push(moduleId);
    moduleFile.externalImports.sort();
  }

  if (compilerCtx.resolvedCollections.includes(moduleId)) {
    // we've already handled this collection moduleId before
    return;
  }

  // cache that we've already parsed this
  compilerCtx.resolvedCollections.push(moduleId);

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

  if (!pkgData.collection || !pkgData.types) {
    // this import is not a stencil collection
    return;
  }

  // this import is a stencil collection
  // let's parse it and gather all the module data about it
  // internally it'll cached collection data if we've already done this
  const collection = parseCollectionModule(config, compilerCtx, pkgJsonFilePath, pkgData);

  // check if we already added this collection to the build context
  const alreadyHasCollection = collections.some(c => {
    return c.collectionName === collection.collectionName;
  });

  if (alreadyHasCollection) {
    // we already have this collection in our build context
    return;
  }

  // let's add the collection to the build context
  collections.push(collection);

  if (Array.isArray(collection.dependencies)) {
    // this collection has more collections
    // let's keep digging down and discover all of them
    collection.dependencies.forEach(dependencyModuleId => {
      const resolveFromDir = config.sys.path.dirname(pkgJsonFilePath);
      addCollection(config, compilerCtx, collections, moduleFile, resolveFromDir, dependencyModuleId);
    });
  }
}
