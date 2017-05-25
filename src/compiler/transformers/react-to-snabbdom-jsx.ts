import * as ts from 'typescript';
 import * as util from './util';

export function reactToSnabbdomJsx(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {

    let sourceFile: ts.SourceFile;

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      if (sourceFile.fileName.indexOf('/components/button') === -1) {
          return ts.visitEachChild(node, visit, transformContext);
      }


      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          var expression = (<ts.CallExpression>node).expression;
          if (expression.parent && (expression.parent.kind === ts.SyntaxKind.JsxOpeningElement)) {
            return substituteCallExpression(<ts.CallExpression>node);
          }
        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    function substituteCallExpression(node: ts.CallExpression): ts.CallExpression {
      const convertedArgs = convertReactToSnabbDom(node.arguments);
      return ts.createCall(
         node.expression,
         undefined,
         convertedArgs
      );
    }

    function convertReactToSnabbDom(args: ts.NodeArray<ts.Expression>): ts.Expression[] {
      const [tag, props, ...children] = args;

      let newArgs: ts.Expression[] = [tag];

      if (props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        const jsxObjectMap = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);
        const snabbDomObjectMap = normalizeObjectMap(jsxObjectMap);
        const objectLiteral = util.objectMapToObjectLiteral(snabbDomObjectMap);
        newArgs.push(objectLiteral);

      } else if (typeof props !== 'undefined' && props !== null) {
        children.unshift(props);
      }

      const updatedChildren: ts.Expression[] = children
        .filter((node: ts.Expression) => node.kind === ts.SyntaxKind.CallExpression)
        .map((node: ts.Expression) => {
          return substituteCallExpression(node as ts.CallExpression);
        });

      if (updatedChildren.length > 0) {
        newArgs.push(ts.createArrayLiteral(updatedChildren));
      }
      return newArgs;
    }

    return (tsSourceFile) => {
      sourceFile = tsSourceFile;
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}



export function normalizeObjectMap(attrs: util.ObjectMap): util.ObjectMap {
  var modules = ['hook', 'on', 'style', 'class', 'props', 'attrs', 'dataset'];
  var map: util.ObjectMap = {};

  for (var i = 0, len = modules.length; i < len; i++) {
    var mod = modules[i];

    if (attrs[mod]) {
      map[mod] = attrs[mod];
    }
  }

  for (var key in attrs) {
    if (key !== 'key' && key !== 'classNames' && key !== 'selector') {
      var idx = key.indexOf('-');
      if (idx > 0) {
        addAttr(
          key.slice(0, idx),
          key.slice(idx + 1),
          attrs[key]
        );
      }
    }
  }
  return map;

  function addAttr(namespace: string, key: any, val: any) {
    var ns = <util.ObjectMap>(map[namespace] || (map[namespace] = {}));
    ns[key] = val;
  }
}
