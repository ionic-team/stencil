import type * as d from '../../../declarations';
import { augmentDiagnosticWithNode, buildError, buildWarn, toDashCase } from '@utils';
import {
  convertValueToLiteral,
  createStaticGetter,
  getAttributeTypeInfo,
  isMemberPrivate,
  resolveType,
  serializeSymbol,
  typeToString,
  validateReferences,
} from '../transform-utils';
import { isDecoratorNamed, getDeclarationParameters } from './decorator-utils';
import { validatePublicName } from '../reserved-public-members';
import ts from 'typescript';

export const propDecoratorsToStatic = (
  diagnostics: d.Diagnostic[],
  decoratedProps: ts.ClassElement[],
  typeChecker: ts.TypeChecker,
  watchable: Set<string>,
  newMembers: ts.ClassElement[],
) => {
  const properties = decoratedProps
    .filter(prop => (ts.isPropertyDeclaration(prop) && !!prop.name) || ts.isGetAccessor(prop))
    .map(prop => parsePropDecorator(diagnostics, typeChecker, prop as ts.PropertyDeclaration | ts.GetAccessorDeclaration, watchable, newMembers))
    .filter(prop => prop != null);

  if (properties.length > 0) {
    newMembers.push(createStaticGetter('properties', ts.createObjectLiteral(properties, true)));
  }
};

const parsePropDecorator = (diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration | ts.GetAccessorDeclaration, watchable: Set<string>, newMembers: ts.ClassElement[]) => {
  const propDecorator = prop.decorators.find(isDecoratorNamed('Prop'));
  if (propDecorator == null) {
    return null;
  }

  const decoratorParms = getDeclarationParameters<d.PropOptions>(propDecorator);
  const propOptions: d.PropOptions = decoratorParms[0] || {};

  const propName = prop.name.getText();

  if (isMemberPrivate(prop)) {
    const err = buildError(diagnostics);
    err.messageText = 'Properties decorated with the @Prop() decorator cannot be "private" nor "protected". More info: https://stenciljs.com/docs/properties';
    augmentDiagnosticWithNode(err, prop.modifiers[0]);
  }

  if (/^on(-|[A-Z])/.test(propName)) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `The @Prop() name "${propName}" looks like an event. Please use the "@Event()" decorator to expose events instead, not properties or methods.`;
    augmentDiagnosticWithNode(warn, prop.name);
  } else {
    validatePublicName(diagnostics, propName, '@Prop()', 'prop', prop.name);
  }

  const symbol = typeChecker.getSymbolAtLocation(prop.name);
  const type = typeChecker.getTypeAtLocation(prop);
  const typeStr = propTypeFromTSType(type);
  const foundSetter = ts.isGetAccessor(prop) ? findSetter(propName, newMembers) : null;

  const propMeta: d.ComponentCompilerStaticProperty = {
    type: typeStr as any,
    mutable: !!propOptions.mutable,
    complexType: getComplexType(typeChecker, prop, type),
    required: prop.exclamationToken !== undefined && propName !== 'mode',
    optional: prop.questionToken !== undefined,
    docs: serializeSymbol(typeChecker, symbol),
    getter: ts.isGetAccessor(prop),
    setter: !!foundSetter,
  };
  validateReferences(diagnostics, propMeta.complexType.references, prop.type);

  // prop can have an attribute if type is NOT "unknown"
  if (typeStr !== 'unknown') {
    propMeta.attribute = getAttributeName(propName, propOptions);
    propMeta.reflect = getReflect(diagnostics, propDecorator, propOptions);
  }

  // extract default value
  if (ts.isPropertyDeclaration(prop) && prop.initializer) {
    propMeta.defaultValue = prop.initializer.getText();
  } else if (ts.isGetAccessorDeclaration(prop)) {
    // shallow comb to find default value for a getter
    const returnSt = prop.body.statements.find(st => ts.isReturnStatement(st)) as ts.ReturnStatement;
    const retExp = returnSt.expression;
    if (ts.isLiteralExpression(retExp))  {
      propMeta.defaultValue = retExp.getText();
    } else if (ts.isPropertyAccessExpression(retExp)) {
      const nameToFind = retExp.name.getText();
      const foundProp = findGetProp(nameToFind, newMembers);
      if (foundProp.initializer) propMeta.defaultValue = foundProp.initializer.getText();
    }
  }

  const staticProp = ts.createPropertyAssignment(ts.createLiteral(propName), convertValueToLiteral(propMeta));
  watchable.add(propName);
  return staticProp;
};

const findSetter = (propName: string, members: ts.ClassElement[]) => {
  return members.find(m => ts.isSetAccessor(m) && m.name.getText() === propName) as ts.SetAccessorDeclaration
}

const findGetProp = (propName: string, members: ts.ClassElement[]) => {
  return members.find(m => ts.isPropertyDeclaration(m) && m.name.getText() === propName) as ts.PropertyDeclaration
}

const getAttributeName = (propName: string, propOptions: d.PropOptions) => {
  if (propOptions.attribute === null) {
    return undefined;
  }

  if (typeof propOptions.attribute === 'string' && propOptions.attribute.trim().length > 0) {
    return propOptions.attribute.trim().toLowerCase();
  }

  return toDashCase(propName);
};

const getReflect = (diagnostics: d.Diagnostic[], propDecorator: ts.Decorator, propOptions: d.PropOptions) => {
  if (typeof propOptions.reflect === 'boolean') {
    return propOptions.reflect;
  }
  if (typeof (propOptions as any).reflectToAttr === 'boolean') {
    const err = buildError(diagnostics);
    err.header = `Rename "reflectToAttr" to "reflect"`;
    err.messageText = `@Prop option "reflectToAttr" should be renamed to "reflect".`;
    augmentDiagnosticWithNode(err, propDecorator);
    return (propOptions as any).reflectToAttr;
  }
  return false;
};

const getComplexType = (typeChecker: ts.TypeChecker, node: ts.PropertyDeclaration | ts.GetAccessorDeclaration, type: ts.Type): d.ComponentCompilerPropertyComplexType => {
  const nodeType = node.type;
  return {
    original: nodeType ? nodeType.getText() : typeToString(typeChecker, type),
    resolved: resolveType(typeChecker, type),
    references: getAttributeTypeInfo(node, node.getSourceFile()),
  };
};

export const propTypeFromTSType = (type: ts.Type) => {
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
};

const checkType = (type: ts.Type, check: (type: ts.Type) => boolean) => {
  if (type.flags & ts.TypeFlags.Union) {
    const union = type as ts.UnionType;
    if (union.types.some(type => checkType(type, check))) {
      return true;
    }
  }
  return check(type);
};

const isBoolean = (t: ts.Type) => {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLike | ts.TypeFlags.BooleanLike));
  }
  return false;
};

const isNumber = (t: ts.Type) => {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral));
  }
  return false;
};

const isString = (t: ts.Type) => {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral));
  }
  return false;
};

const isAny = (t: ts.Type) => {
  if (t) {
    return !!(t.flags & ts.TypeFlags.Any);
  }
  return false;
};
