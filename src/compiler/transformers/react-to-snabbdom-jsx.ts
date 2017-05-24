import * as ts from 'typescript';
// import { JSX } from 'snabbdom-jsx';

export function reactToSnabbdomJsx(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    var sourceFile: ts.SourceFile;

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      if (sourceFile.fileName.indexOf('/components/button') !== -1) {
          return ts.visitEachChild(node, visit, transformContext);
      }

      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const callExpression = <ts.CallExpression>node;
          const expression = <ts.Identifier>callExpression.expression;

          if (expression.text === 'h') {
            const newArguments: ts.Expression[] = callExpression.arguments.map((ex: ts.Expression, index: number) => {
              console.log(index);
              console.log(ex.getText());
              return ex;
            });

            node = ts.updateCall(callExpression, expression, [], newArguments);
          }
        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    return (tsSourceFile) => {
      sourceFile = tsSourceFile;
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}

