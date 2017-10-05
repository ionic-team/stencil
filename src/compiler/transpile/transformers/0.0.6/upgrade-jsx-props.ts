import { SLOT_TAG } from '../../../../util/constants';
import * as ts from 'typescript';
import * as util from '../util';


export function upgradJsxProps(transformContext: ts.TransformationContext) {

  return (tsSourceFile: ts.SourceFile) => {
    return visit(tsSourceFile) as ts.SourceFile;

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const callNode = node as ts.CallExpression;

          if ((<ts.Identifier>callNode.expression).text === 'h') {
            const tag = callNode.arguments[0];
            if (tag && typeof (tag as ts.StringLiteral).text === 'string') {
              node = upgradeCall(callNode);
            }
          }

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node);
          }, transformContext);
      }
    }
  };
}

function upgradeCall(callNode: ts.CallExpression): ts.CallExpression {
  const [tag, props, ...children] = callNode.arguments;
  let newArgs: ts.Expression[] = [];

  newArgs.push(upgradeTagName(tag));
  newArgs.push(upgradeProps(props));


  if (children != null) {
    newArgs = newArgs.concat(upgradeChildren(children));
  }

  return ts.updateCall(callNode, callNode.expression, null, newArgs);
}

function upgradeTagName(tagName: ts.Expression) {
  if (ts.isNumericLiteral(tagName) &&
      (<ts.NumericLiteral>tagName).text === '0') {
    return ts.createLiteral('slot');
  }
  return tagName;
}

function upgradeProps(props: ts.Expression): ts.NullLiteral | ts.ObjectLiteralExpression {
  let upgradedProps: util.ObjectMap = {};
  let propName: string;

  if (ts.isNumericLiteral(props) &&
      (<ts.NumericLiteral>props).text === '0') {
    return ts.createNull();
  }

  const objectProps = util.objectLiteralToObjectMap(<ts.ObjectLiteralExpression>props);

  upgradedProps = Object.keys(props).reduce((newProps, propName) => {
    const propValue = props[propName];

    // If the propname is c, s, or k then map to proper name
    if (propName === 'c') {
      return {
        ...newProps,
        'class': propValue
      };
    }
    if (propName === 's') {
      return {
        ...newProps,
        'style': propValue
      };
    }
    if (propName === 'k') {
      return {
        ...newProps,
        'key': propValue
      };
    }

    // If the propname is p or a then spread the value into props
    if (propName === 'p' || propName === 'a') {
      return {
        ...newProps,
        ...propValue
      };
    }

    // If the propname is o then we need to update names and then spread into props
    if (propName === 'o') {
      const eventListeners = Object.keys(propValue).reduce((newValue, eventName) => {
        return {
          ...newValue,
          [`on${eventName}`]: propValue[eventName]
        };
      }, {});
      return {
        ...newProps,
        ...eventListeners
      };
    }
  }, upgradedProps);

  return util.objectMapToObjectLiteral(upgradedProps);
}

function upgradeChildren(children: ts.Expression[]): ts.Expression[] {
  return children.map(upgradeChild);
}

function upgradeChild(child: ts.Expression): ts.Expression {
  if (ts.isStringLiteral(child) || ts.isNumericLiteral(child)) {
    return child;
  }

  if (ts.isCallExpression(child) && (<ts.Identifier>child.expression).text === 't') {
    return (<ts.CallExpression>child).arguments[0];
  }

  if (ts.isCallExpression(child) && (<ts.Identifier>child.expression).text === 'h') {
    return upgradeCall(child);
  }
}
