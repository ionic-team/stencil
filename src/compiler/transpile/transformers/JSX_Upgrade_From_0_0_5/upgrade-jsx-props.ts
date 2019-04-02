import * as util from '../util';
import ts from 'typescript';
/* tslint:disable */


export default function upgradeJsxProps(transformContext: ts.TransformationContext) {

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

  return ts.updateCall(
    callNode,
    callNode.expression,
    undefined,
    newArgs
  );
}

function upgradeTagName(tagName: ts.Expression) {
  if (ts.isNumericLiteral(tagName) &&
      (<ts.NumericLiteral>tagName).text === '0') {
    return ts.createLiteral('slot');
  }
  return tagName;
}

function upgradeProps(props: ts.Expression): ts.NullLiteral | ts.ObjectLiteralExpression | ts.CallExpression {

  let upgradedProps: util.ObjectMap = {};
  let propHackValue: any;

  if (!ts.isObjectLiteralExpression(props)) {
    return ts.createNull();
  }
  const objectProps = util.objectLiteralToObjectMap(<ts.ObjectLiteralExpression>props);

  upgradedProps = Object.keys(objectProps).reduce((newProps, propName) => {
    const propValue = objectProps[propName];

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
    if (propName === 'a') {
      return {
        ...newProps,
        ...(propValue as util.ObjectMap)
      };
    }

    if (propName === 'p') {
      if (util.isInstanceOfObjectMap(propValue)) {
        return {
          ...newProps,
          ...(propValue as util.ObjectMap)
        };
      } else {
        propHackValue = propValue;
      }
    }

    // If the propname is o then we need to update names and then spread into props
    if (propName === 'o') {
      const eventListeners = Object.keys(propValue).reduce((newValue, eventName) => {
        return {
          ...newValue,
          [`on${eventName}`]: (propValue as util.ObjectMap)[eventName]
        };
      }, {});
      return {
        ...newProps,
        ...eventListeners
      };
    }
    return newProps;
  }, upgradedProps);

  try {
    Object.keys(upgradedProps);
  } catch (e) {
    console.log(upgradedProps);
    console.log(objectProps);
    console.log(props);
    throw e;
  }

  const response = util.objectMapToObjectLiteral(upgradedProps);

  // Looks like someone used the props hack. So we need to create the following code:
  // Object.assign({}, upgradedProps, propHackValue);
  if (propHackValue) {
    const emptyObjectLiteral = ts.createObjectLiteral();
    return ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier('Object'),
        ts.createIdentifier('assign')
      ),
      undefined,
      [emptyObjectLiteral, response, propHackValue]
    );
  }

  return response;
}

function upgradeChildren(children: ts.Expression[]): ts.Expression[] {
  return children.map(upgradeChild);
}

function upgradeChild(child: ts.Expression): ts.Expression {
  if (ts.isCallExpression(child) && (<ts.Identifier>child.expression).text === 't') {
    return (<ts.CallExpression>child).arguments[0];
  }

  return child;
}
