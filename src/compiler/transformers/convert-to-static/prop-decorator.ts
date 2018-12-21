import * as d from '../../../declarations';
import { catchError } from '../../util';
import { createStaticGetter, isDecoratorNamed, removeDecorator } from '../transform-utils';
import { toDashCase } from '../../../util/helpers';
import ts from 'typescript';


export function propDecoratorsToStatic(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration, typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const decoratedProps = cmpNode.members.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);

  if (decoratedProps.length === 0) {
    return;
  }

  const properties: ts.ObjectLiteralElementLike[] = decoratedProps.map((prop: ts.PropertyDeclaration) => {
    return propDecoratorToStatic(diagnostics, typeChecker, prop);
  }).filter(prop => prop != null);

  if (properties.length > 0) {
    newMembers.push(createStaticGetter('properties', ts.createObjectLiteral(properties, true)));
  }
}


function propDecoratorToStatic(diagnostics: d.Diagnostic[], _typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) {
  const propDecorator = prop.decorators.find(isDecoratorNamed('Prop'));
  if (propDecorator == null) {
    return null;
  }

  removeDecorator(prop, 'Prop');

  const propName = (prop.name as ts.Identifier).text;

  const propData: ts.ObjectLiteralElementLike[] = [];

  const propOptions = getPropOptions(propDecorator, diagnostics);

  // const type = typeChecker.getTypeAtLocation(prop);
  let canHaveAttribute = false;

  if (!prop.type) {
    const expression = prop.initializer;
    if (expression != null) {
      if (ts.isStringLiteral(expression)) {
        propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('string')));
        canHaveAttribute = true;

      } else if (ts.isNumericLiteral(expression)) {
        propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('number')));
        canHaveAttribute = true;

      } else if (BOOLEAN_KEYWORD.includes(expression.kind)) {
        propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('boolean')));
        canHaveAttribute = true;

      } else if (ts.isRegularExpressionLiteral(expression)) {
        propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('regex')));

      } else if (ts.isArrayLiteralExpression(expression)) {
        propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('array')));

      } else if (ts.isObjectLiteralExpression(expression)) {
        propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('object')));

      } else {
        // unknown type
        canHaveAttribute = true;
      }
    }

  } else {
    const type = prop.type.getText();
    if (type === 'string' || type === 'number' || type === 'boolean') {
      propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral(type)));
      canHaveAttribute = true;

    } else if (prop.type.kind === ts.SyntaxKind.ArrayType) {
      propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('array')));

    } else if (prop.type.kind === ts.SyntaxKind.TypeReference) {
      propData.push(ts.createPropertyAssignment(ts.createLiteral('type'), ts.createLiteral('object')));

    } else {
      // unknown type
      canHaveAttribute = true;
    }
  }

  if (canHaveAttribute) {
    let attrName: string;
    if (propOptions && typeof propOptions.attr === 'string' && propOptions.attr.trim().length > 0) {
      attrName = propOptions.attr.trim();

    } else {
      attrName = toDashCase(propName);
    }

    propData.push(ts.createPropertyAssignment(ts.createLiteral('attr'), ts.createLiteral(attrName)));

    if (propOptions && propOptions.reflectToAttr) {
      propData.push(ts.createPropertyAssignment(ts.createLiteral('reflectToAttr'), ts.createLiteral(true)));
    }
  }

  if (propOptions && propOptions.mutable) {
    propData.push(ts.createPropertyAssignment(ts.createLiteral('mutable'), ts.createLiteral(true)));
  }

  if (prop.exclamationToken !== undefined && propName !== 'mode') {
    propData.push(ts.createPropertyAssignment(ts.createLiteral('required'), ts.createLiteral(true)));
  }

  if (prop.questionToken !== undefined) {
    propData.push(ts.createPropertyAssignment(ts.createLiteral('optional'), ts.createLiteral(true)));
  }

  // // extract default value
  // const initializer = prop.initializer;
  // if (initializer) {
  //   memberData.jsdoc.default = initializer.getText();
  // }


  const propertyAssignment = ts.createPropertyAssignment(ts.createLiteral(propName), ts.createObjectLiteral(propData, true));

  // const symbol = typeChecker.getSymbolAtLocation(prop.name);
  // const jsdoc = serializeSymbol(typeChecker, symbol);

  return propertyAssignment;
}


export


function getPropOptions(propDecorator: ts.Decorator, diagnostics: d.Diagnostic[]) {
  if (propDecorator.expression == null) {
    return null;
  }

  const suppliedOptions = (propDecorator.expression as ts.CallExpression).arguments
  .map(arg => {
    try {
      const fnStr = `return ${arg.getText()};`;
      return new Function(fnStr)();

    } catch (e) {
      catchError(diagnostics, e, `parse prop options: ${e}`);
    }
  });

  const propOptions: d.PropOptions = suppliedOptions[0];
  return propOptions;
}


export function propTypeFromTSType(type: ts.Type) {
  const isAnyType = checkType(type, isAny);

  if (isAnyType) {
    return 'Any';
  }

  const isStr = checkType(type, isString);
  const isNu = checkType(type, isNumber);
  const isBool = checkType(type, isBoolean);

  // if type is more than a primitive type at the same time, we mark it as any
  if (Number(isStr) + Number(isNu) + Number(isBool) > 1) {
    return 'Any';
  }

  // at this point we know the prop's type is NOT the mix of primitive types
  if (isStr) {
    return String;
  }
  if (isNu) {
    return Number;
  }
  if (isBool) {
    return Boolean;
  }
  return 'Unknown';
}

const BOOLEAN_KEYWORD = [ ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword ];

function checkType(type: ts.Type, check: (type: ts.Type) => boolean ): boolean {
  if (type.flags & ts.TypeFlags.Union) {
    const union = type as ts.UnionType;
    if (union.types.some(type => checkType(type, check))) {
      return true;
    }
  }
  return check(type);
}

function isBoolean(t: ts.Type) {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLike | ts.TypeFlags.BooleanLike));
  }
  return false;
}

function isNumber(t: ts.Type) {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral));
  }
  return false;
}

function isString(t: ts.Type) {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral));
  }
  return false;
}

function isAny(t: ts.Type) {
  if (t) {
    return !!(t.flags & ts.TypeFlags.Any);
  }
  return false;
}
