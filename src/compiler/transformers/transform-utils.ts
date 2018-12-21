import ts from 'typescript';


export function convertValueToLiteral(val: any) {
  if (val === String) {
    return ts.createIdentifier('String');
  }
  if (val === Number) {
    return ts.createIdentifier('Number');
  }
  if (val === Boolean) {
    return ts.createIdentifier('Boolean');
  }
  if (Array.isArray(val)) {
    return arrayToArrayLiteral(val);
  }
  if (typeof val === 'object') {
    return objectToObjectLiteral(val);
  }
  return ts.createLiteral(val);
}


function arrayToArrayLiteral(list: any[]): ts.ArrayLiteralExpression {
  const newList: any[] = list.map(convertValueToLiteral);
  return ts.createArrayLiteral(newList);
}


function objectToObjectLiteral(obj: { [key: string]: any }): ts.ObjectLiteralExpression {
  if (Object.keys(obj).length === 0) {
    return ts.createObjectLiteral([]);
  }
  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(obj).map((key: string): ts.ObjectLiteralElementLike => {
    return ts.createPropertyAssignment(ts.createLiteral(key), convertValueToLiteral(obj[key]) as ts.Expression);
  });

  return ts.createObjectLiteral(newProperties, true);
}


export function isDecoratorNamed(name: string) {
  return (dec: ts.Decorator): boolean => {
    return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === name);
  };
}


export function createStaticGetter(name: string, returnExpression: ts.Expression) {
  return ts.createGetAccessor(
    undefined,
    [ts.createToken(ts.SyntaxKind.StaticKeyword)],
    name,
    undefined,
    undefined,
    ts.createBlock([
      ts.createReturn(returnExpression)
    ])
  );
}

export interface GetDeclarationParameters {
  <T>(decorator: ts.Decorator): [T];
  <T, T1>(decorator: ts.Decorator): [T, T1];
  <T, T1, T2>(decorator: ts.Decorator): [T, T1, T2];
}
export const getDeclarationParameters: GetDeclarationParameters = (decorator: ts.Decorator): any => {
  if (!ts.isCallExpression(decorator.expression)) {
    return [];
  }

  return decorator.expression.arguments.map((arg) => {
    return evalText(arg.getText().trim());
  });
};


export function evalText(text: string) {
  const fnStr = `return ${text};`;
  return new Function(fnStr)();
}


export function removeDecorator(node: ts.Node, decoratorName: string) {
  if (node.decorators) {
    const updatedDecoratorList = node.decorators.filter(dec => {
      const toRemove = ts.isCallExpression(dec.expression) &&
        ts.isIdentifier(dec.expression.expression) &&
        dec.expression.expression.text === decoratorName;
      return !toRemove;
    });

    if (updatedDecoratorList.length !== node.decorators.length) {
      node.decorators = ts.createNodeArray(updatedDecoratorList);
      if (node.decorators.length === 0) {
        node.decorators = undefined;
      }
    }
  }
}


export function getStaticValue(staticMembers: ts.ClassElement[], staticName: string): any {
  const staticMember: ts.GetAccessorDeclaration = staticMembers.find(member => (member.name as any).escapedText === staticName) as any;
  if (!staticMember || !staticMember.body || !staticMember.body.statements) {
    return null;
  }

  const rtnStatement: ts.ReturnStatement = staticMember.body.statements.find(s => s.kind === ts.SyntaxKind.ReturnStatement) as any;
  if (!rtnStatement || !rtnStatement.expression) {
    return null;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.StringLiteral) {
    return (rtnStatement.expression as ts.StringLiteral).text;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    return objectLiteralToObjectMap(rtnStatement.expression as any);
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.ArrayLiteralExpression && (rtnStatement.expression as ts.ArrayLiteralExpression).elements) {
    return arrayLiteralToArray(rtnStatement.expression as any);
  }

  return null;
}


export function arrayLiteralToArray(arr: ts.ArrayLiteralExpression) {
  return arr.elements.map(element => {
    let val: any;

    switch (element.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        val = objectLiteralToObjectMap(element as ts.ObjectLiteralExpression);
        break;

      case ts.SyntaxKind.StringLiteral:
        val = (element as ts.StringLiteral).text;
        break;

      case ts.SyntaxKind.TrueKeyword:
        val = true;
        break;

      case ts.SyntaxKind.FalseKeyword:
        val = false;
        break;

      case ts.SyntaxKind.Identifier:
        const escapedText = (element as ts.Identifier).escapedText;
        if (escapedText === 'String') {
          val = String;
        } else if (escapedText === 'Number') {
          val = Number;
        } else if (escapedText === 'Boolean') {
          val = Boolean;
        }
        break;

      case ts.SyntaxKind.PropertyAccessExpression:
      default:
        val = element;
    }

    return val;
  });
}


export function objectLiteralToObjectMap(objectLiteral: ts.ObjectLiteralExpression): ObjectMap {
  const attrs: ts.ObjectLiteralElementLike[] = (objectLiteral.properties as any);

  return attrs.reduce((final: ObjectMap, attr: ts.PropertyAssignment) => {
    const name = getTextOfPropertyName(attr.name);
    let val: any;

    switch (attr.initializer.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        val = objectLiteralToObjectMap(attr.initializer as ts.ObjectLiteralExpression);
        break;

      case ts.SyntaxKind.StringLiteral:
        val = (attr.initializer as ts.StringLiteral).text;
        break;

      case ts.SyntaxKind.TrueKeyword:
        val = true;
        break;

      case ts.SyntaxKind.FalseKeyword:
        val = false;
        break;

      case ts.SyntaxKind.Identifier:
        const escapedText = (attr.initializer as ts.Identifier).escapedText;
        if (escapedText === 'String') {
          val = String;
        } else if (escapedText === 'Number') {
          val = Number;
        } else if (escapedText === 'Boolean') {
          val = Boolean;
        }
        break;

      case ts.SyntaxKind.PropertyAccessExpression:
      default:
        val = attr.initializer;
    }

    final[name] = val;
    return final;

  }, <ObjectMap>{});
}

function getTextOfPropertyName(name: ts.PropertyName): string {
  switch (name.kind) {
  case ts.SyntaxKind.Identifier:
    return (<ts.Identifier>name).text;
  case ts.SyntaxKind.StringLiteral:
  case ts.SyntaxKind.NumericLiteral:
    return (<ts.LiteralExpression>name).text;
  case ts.SyntaxKind.ComputedPropertyName:
    const expression = (<ts.ComputedPropertyName>name).expression;
    if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) {
      return (<ts.LiteralExpression>(<ts.ComputedPropertyName>name).expression).text;
    }
  }
  return undefined;
}

export class ObjectMap {
  [key: string]: ts.Expression | ObjectMap
}
