import * as ts from 'typescript';
import * as d from '../../../declarations';

export function createCustomElements(compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitComponentClass(classNode: ts.ClassDeclaration) {
      return ts.updateClassDeclaration(
        classNode,
        classNode.decorators,
        classNode.modifiers,
        classNode.name,
        classNode.typeParameters,
        [ts.createHeritageClause(
          ts.SyntaxKind.ExtendsKeyword,
          [ts.createExpressionWithTypeArguments(
            [],
            ts.createIdentifier('StencilElement')
          )]
        )],
        classNode.members
      );
    }

    return (tsSourceFile) => {
      const fileName = tsSourceFile.getSourceFile().fileName;
      const importDeclaration = ts.createImportDeclaration(
          undefined,
          undefined,
          ts.createImportClause(undefined, ts.createNamedImports([
            ts.createImportSpecifier(undefined, ts.createIdentifier('h')),
            ts.createImportSpecifier(undefined, ts.createIdentifier('StencilElement'))
          ])),
          ts.createLiteral('@stencil/core')
        );

      function visit(node: ts.Node): ts.VisitResult<ts.Node> {
        if (!ts.isClassDeclaration(node) ||
           (<ts.ClassDeclaration>node).name.escapedText !== compilerCtx.moduleFiles[fileName].cmpMeta.componentClass) {
          return ts.visitEachChild(node, visit, transformContext);
        }

        return visitComponentClass(node as ts.ClassDeclaration);
      }

      const sourceFile = visit(tsSourceFile) as ts.SourceFile;
      return ts.updateSourceFileNode(sourceFile, [
        importDeclaration,
        ...sourceFile.statements
      ]);
    };
  };
}
