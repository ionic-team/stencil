import { isComponentClass } from './util';
import * as ts from 'typescript';


export function injectRenderH() {

  return (transformContext: ts.TransformationContext) => {

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          if (!isComponentClass(node as ts.ClassDeclaration)) {
            return node;
          }
          return visitComponentClass(node as ts.ClassDeclaration);

        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    function visitComponentClass(classNode: ts.ClassDeclaration): ts.ClassDeclaration {
      return ts.visitEachChild(classNode, visitClassMethods, transformContext);
    }

    function visitClassMethods(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
          if (node.getFirstToken().getText() === 'render') {
            return updateRenderArgs(node as ts.MethodDeclaration);
          }
          return node;

        default:
          return node;
      }
    }

    return (tsSourceFile: ts.SourceFile) => visit(tsSourceFile) as ts.SourceFile;
  };

}


function updateRenderArgs(renderMethodNode: ts.MethodDeclaration): ts.VisitResult<ts.Node> {

  const param = ts.createParameter(
    undefined,
    undefined,
    undefined,
    'h'
  );

  return ts.updateMethod(
    renderMethodNode,
    undefined,
    renderMethodNode.modifiers,
    renderMethodNode.asteriskToken,
    renderMethodNode.name,
    renderMethodNode.questionToken,
    undefined,
    [param],
    renderMethodNode.type,
    renderMethodNode.body
  );
}
