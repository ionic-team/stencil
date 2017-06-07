import * as ts from 'typescript';
import * as util from './util';


export function reactToSnabbdomJsx(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {

    let sourceFile: ts.SourceFile;

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {

      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const callNode = node as ts.CallExpression;
          if ((<ts.Identifier>callNode.expression).text === 'h') {
            const convertedArgs = convertReactToSnabbDom(callNode.arguments);
            node = ts.updateCall(callNode, callNode.expression, null, convertedArgs);
          }
        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    function convertReactToSnabbDom(args: ts.NodeArray<ts.Expression>): ts.Expression[] {
      const [tag, props, ...children] = args;

      let newArgs: ts.Expression[] = [tag];

      if (args.length === 1) {
        return newArgs;
      }

      if (props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        const jsxObjectMap = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);
        const snabbDomObjectMap = normalizeObjectMap(jsxObjectMap);
        const snabbDomFinal = snabbDomStyle(snabbDomObjectMap);
        const objectLiteral = util.objectMapToObjectLiteral(snabbDomFinal);
        newArgs.push(objectLiteral);

      } else if (props.kind !== ts.SyntaxKind.NullKeyword) {
        children.unshift(props);
      }

      if (children.length === 0) {
        return newArgs;
      }

      newArgs.push(
        children.length > 1 ? ts.createArrayLiteral(children) : children[0]
      );
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
  var attributeList = ['slot'];
  var map: util.ObjectMap = {};

  for (var i = 0, len = modules.length; i < len; i++) {
    var mod = modules[i];

    if (attrs[mod]) {
      map[mod] = attrs[mod];
    }
  }

  for (var key in attrs) {
    if (key !== 'key' && key !== 'classNames' && key !== 'selector' &&
      !map.hasOwnProperty(key)) {

      var idx = key.indexOf('-');
      if (idx > 0) {
        addAttr(
          key.slice(0, idx),
          key.slice(idx + 1),
          attrs[key]
        );
      } else if (attributeList.indexOf(key) !== -1) {
        addAttr('attrs', key, attrs[key]);
      } else {
        addAttr('props', key, attrs[key]);
      }
    }
  }
  return map;

  function addAttr(namespace: string, key: any, val: any) {
    var ns = <util.ObjectMap>(map[namespace] || (map[namespace] = {}));
    ns[key] = val;
  }
}

export function snabbDomStyle(attrs: util.ObjectMap): util.ObjectMap {
  if (!attrs.hasOwnProperty('class') ||
      (<ts.Expression>attrs.class).kind !== ts.SyntaxKind.StringLiteral) {
    return {
      ...attrs
    };
  }

  const classNameString = (<ts.StringLiteral>attrs.class).text;

  return {
    ...attrs,
    class: classStringToClassObj(classNameString),
  };
}

function classStringToClassObj(className: string): {[key: string]: ts.BooleanLiteral} {
  return className
    .split(' ')
    .reduce((obj: {[key: string]: ts.BooleanLiteral}, className: string): {[key: string]: ts.BooleanLiteral} => {
      return {
        ...obj,
        [className]: ts.createTrue()
      };
    }, <{[key: string]: ts.BooleanLiteral}>{});
}
