import * as d from '@declarations';
import { catchError, toDashCase } from '@utils';
import { convertValueToLiteral, createStaticGetter, getAttributeTypeInfo, isDecoratorNamed, removeDecorator, resolveType, serializeSymbol, typeToString } from '../transform-utils';
import ts from 'typescript';


export function propDecoratorsToStatic(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const properties = decoratedProps.filter(ts.isPropertyDeclaration).map((prop: ts.PropertyDeclaration) => {
    return propDecoratorToStatic(diagnostics, typeChecker, prop);
  }).filter(prop => prop != null);

  if (properties.length > 0) {
    newMembers.push(createStaticGetter('properties', ts.createObjectLiteral(properties, true)));
  }
}


function propDecoratorToStatic(diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) {
  const propDecorator = prop.decorators && prop.decorators.find(isDecoratorNamed('Prop'));
  if (propDecorator == null) {
    return null;
  }

  removeDecorator(prop, 'Prop');

  const propName = prop.name.getText();
  const propOptions = getPropOptions(propDecorator, diagnostics);
  const symbol = typeChecker.getSymbolAtLocation(prop.name);
  const type = typeChecker.getTypeAtLocation(prop);
  const typeStr = propTypeFromTSType(type);

  const propMeta: d.ComponentCompilerStaticProperty = {
    type: typeStr,
    mutable: !!propOptions.mutable,
    complexType: getComplexType(typeChecker, prop, type),
    required: prop.exclamationToken !== undefined && propName !== 'mode',
    optional: prop.questionToken !== undefined,
    docs: serializeSymbol(typeChecker, symbol)
  };

  // prop can have an attribute if type is NOT "unknown"
  if (typeStr !== 'unknown') {
    propMeta.attribute = getAttributeName(diagnostics, propName, propOptions);
    propMeta.reflect = getReflect(diagnostics, propOptions);
  }

  // extract default value
  const initializer = prop.initializer;
  if (initializer) {
    propMeta.defaultValue = initializer.getText();
  }

  const staticProp = ts.createPropertyAssignment(
    ts.createLiteral(propName),
    convertValueToLiteral(propMeta)
  );

  return staticProp;
}

function getAttributeName(_diagnostics: d.Diagnostic[], propName: string, propOptions: d.PropOptions) {
  if (typeof propOptions.attribute === 'string' && propOptions.attribute.trim().length > 0) {
    return propOptions.attribute.trim();
  }

  if (typeof (propOptions as any).attr === 'string' && (propOptions as any).attr.trim().length > 0) {
    // const diagnostic = buildWarn(diagnostics);
    // diagnostic.messageText = `@Prop option "attr" has been depreciated. Please use "attribute" instead.`;
    return (propOptions as any).attr.trim();
  }

  return toDashCase(propName);
}

function getReflect(_diagnostics: d.Diagnostic[], propOptions: d.PropOptions) {
  if (typeof propOptions.reflect === 'boolean') {
    return propOptions.reflect;
  }

  if (typeof (propOptions as any).reflectToAttr === 'boolean') {
    // const diagnostic = buildWarn(diagnostics);
    // diagnostic.messageText = `@Prop option "reflectToAttr" has been depreciated. Please use "reflect" instead.`;
    return (propOptions as any).reflectToAttr;
  }

  return false;
}

function getPropOptions(propDecorator: ts.Decorator, diagnostics: d.Diagnostic[]) {
  if (propDecorator.expression == null) {
    return {};
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
  return propOptions || {};
}


function getComplexType(typeChecker: ts.TypeChecker, node: ts.PropertyDeclaration, type: ts.Type): d.ComponentCompilerPropertyComplexType {
  const sourceFile = node.getSourceFile();
  const nodeType = node.type;
  return {
    text: nodeType ? nodeType.getText() : typeToString(typeChecker, type),
    resolved: resolveType(typeChecker, type),
    references: getAttributeTypeInfo(node, sourceFile)
  };
}

export function propTypeFromTSType(type: ts.Type) {
  const isAnyType = checkType(type, isAny);

  if (isAnyType) {
    return 'any';
  }

  const isStr = checkType(type, isString);
  const isNu = checkType(type, isNumber);
  const isBool = checkType(type, isBoolean);

  // if type is more than a primitive type at the same time, we mark it as any
  if (Number(isStr) + Number(isNu) + Number(isBool) > 1) {
    return 'any';
  }

  // at this point we know the prop's type is NOT the mix of primitive types
  if (isStr) {
    return 'string';
  }
  if (isNu) {
    return 'number';
  }
  if (isBool) {
    return 'boolean';
  }
  return 'unknown';
}

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
