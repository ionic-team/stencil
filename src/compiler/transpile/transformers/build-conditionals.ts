import { BuildConditionals } from '../../../declarations';
import * as ts from 'typescript';


export function buildConditionalsTransform(coreBuild: BuildConditionals): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    function visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
      let variableName = node.getText();

      if (!variableName.startsWith('Build.')) {
        return node;
      }

      variableName = variableName.split('.')[1];
      if (!variableName) {
        return node;
      }

      if ((coreBuild as any)[variableName]) {
        return ts.createTrue();
      }

      return ts.createFalse();
    }

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.PropertyAccessExpression:
          return visitPropertyAccessExpression(node as any);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}
