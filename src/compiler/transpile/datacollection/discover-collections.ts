import { BuildCtx, CompilerCtx, Config } from '../../../declarations';
import { parseCollectionModule } from '../../collections/parse-collection-module';
import * as ts from 'typescript';


export function getCollections(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, importNode: ts.ImportDeclaration) {
  if (!importNode.moduleSpecifier || !compilerCtx || !buildCtx) {
    return;
  }

  const moduleId = (importNode.moduleSpecifier as ts.StringLiteral).text;

  if (moduleId.startsWith('.') || moduleId.startsWith('/')) {
    // not a node module import, so don't bother
    return;
  }

  if (compilerCtx.resolvedModuleIds.includes(moduleId)) {
    // we've already handled this import before
    return;
  }

  // cache that we've already parsed this already
  compilerCtx.resolvedModuleIds.push(moduleId);

  let packageJsonFilePath: string;

  try {
    // get the full package.json file path
    packageJsonFilePath = config.sys.resolveModule(config.rootDir, moduleId);

  } catch (e) {
    // it's someone else's job to handle unresolvable paths
    return;
  }

  if (packageJsonFilePath === 'package.json') {
    // the resolved package is actually this very same package, so whatever
    return;
  }

  // open up and parse the package.json
  // sync on purpose :(
  const packageJsonStr = compilerCtx.fs.readFileSync(packageJsonFilePath);
  const packageJsonData = JSON.parse(packageJsonStr);

  if (!packageJsonData.collection) {
    // this import is not a stencil collection
    return;
  }

  // this import is a stencil collection
  // let's parse it and gather all the module data about it
  // internally it'll cached collection data if we've already done this
  const collection = parseCollectionModule(config, compilerCtx, packageJsonFilePath, packageJsonData);

  // add the collection to the build context to be used later
  buildCtx.collections.push(collection);

  return;
}
