import * as ts from 'typescript';
import * as util from './util';

export function reactToSnabbdomJsx(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {

  const options = transformContext.getCompilerOptions();
  const callExpressionText = options.jsxFactory;
    var sourceFile: ts.SourceFile;

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      if (sourceFile.fileName.indexOf('/components/button') === -1) {
          return ts.visitEachChild(node, visit, transformContext);
      }

      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          console.log(callExpressionText);
          var expression = (<ts.CallExpression>node).expression;
          if (expression.parent && (expression.parent.kind === ts.SyntaxKind.JsxOpeningElement)) {
            substituteCallExpression(<ts.CallExpression>node);
          }
        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    function substituteCallExpression(node: ts.CallExpression) { // ts.CallExpression {
      debugger;
      const convertedArgs = convertReact2SnabbDom(node.arguments);
      console.log(convertedArgs);
      /*
      return ts.createCall(
         node.expression,
         undefined,
         [
           ...convertedArgs
         ]
      );
      */
    }

    function convertReact2SnabbDom(args: ts.NodeArray<ts.Expression>): ts.Expression[] {
      const [tag, props, ...children] = args;

      let newArgs: ts.Expression[] = [tag];

      if (props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        reactPropsToSnabbDomData(props as ts.ObjectLiteralExpression);

      } else if (typeof props !== 'undefined') {
        children.unshift(props);
      }

      if (children.length > 0) {
        newArgs.push(ts.createArrayLiteral(children));
      }

      return newArgs;
    }

    function reactPropsToSnabbDomData(props: ts.ObjectLiteralExpression): ts.ObjectLiteralExpression {
      const attrs: ts.PropertyAssignment[] = props.properties;

      attrs.map((item: PropertyAssignment))



      const modules = ['hook', 'on', 'style', 'class', 'props', 'attrs', 'dataset'];
      const map = {};

      for (var i = 0, len = modules.length; i < len; i++) {
        var mod = modules[i];
        var foundAttr = attrs.find(attr  => util.getTextOfPropertyName(mod) === mod);
        if (foundAttr) {
          ts.createPropertyAssignment(mod, foundAttr.);
          map[mod] = foundAttr;
        }
      }

      for (var key in attrs) {
        if (key !== 'key' && key !== 'classNames' && key !== 'selector') {
          var idx = key.indexOf('-');
          if (idx > 0) {
            addAttr(key.slice(0, idx), key.slice(idx + 1), attrs[key]);
          }
        }
      }
      return ts.createObjectLiteral();

      function addAttr(namespace: string, key: any, val: any) {
        var ns = map[namespace] || (map[namespace] = {});
        ns[key] = val;
      }
    }

    return (tsSourceFile) => {
      sourceFile = tsSourceFile;
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}


function normalizeAttrs(attrs: any) {
  var modules = ['hook', 'on', 'style', 'class', 'props', 'attrs', 'dataset'];
  var map: any = {};

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
        addAttr(key.slice(0, idx), key.slice(idx + 1), attrs[key]);
      }
    }
  }
  return map;

  function addAttr(namespace: string, key: any, val: any) {
    var ns = map[namespace] || (map[namespace] = {});
    ns[key] = val;
  }
}
