import { BuildCtx, CompilerCtx, Config } from '../../../declarations';
import { parseCollectionModule } from '../../collections/parse-collection-module';
import * as ts from 'typescript';


export function discoverCollections(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(importNode: ts.ImportDeclaration) {
      if (!importNode.moduleSpecifier) {
        return importNode;
      }

      const moduleId = importNode.moduleSpecifier.getText().replace(/(\'|\"|\`)/g, '');

      if (moduleId.startsWith('.') || moduleId.startsWith('/')) {
        // not a node module import, so don't bother
        return importNode;
      }

      if (compilerCtx.resolvedModuleIds.includes(moduleId)) {
        // we've already handled this import before
        return importNode;
      }

      // cache that we've already parsed this already
      compilerCtx.resolvedModuleIds.push(moduleId);

      let packageJsonFilePath: string;

      try {
        // get the full package.json file path
        packageJsonFilePath = config.sys.resolveModule(config.rootDir, moduleId);

      } catch (e) {
        // it's someone else's job to handle unresolvable paths
        return importNode;
      }

      // open up and parse the package.json
      // sync on purpose :(
      const packageJsonStr = compilerCtx.fs.readFileSync(packageJsonFilePath);
      const packageJsonData = JSON.parse(packageJsonStr);

      if (!packageJsonData.collection) {
        // this import is not a stencil collection
        return importNode;
      }

      // this import is a stencil collection
      // let's parse it and gather all the module data about it
      // internally it'll cached collection data if we've already done this
      const collection = parseCollectionModule(config, compilerCtx, packageJsonFilePath, packageJsonData);

      // add the collection to the build context to be used later
      buildCtx.collections.push(collection);

      return importNode;
    }


    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(node as ts.ImportDeclaration);
        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    return (tsSourceFile) => {
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };

}
