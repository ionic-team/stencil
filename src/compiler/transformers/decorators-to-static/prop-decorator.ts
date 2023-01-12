import { augmentDiagnosticWithNode, buildError, buildWarn, toDashCase } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { validatePublicName } from '../reserved-public-members';
import {
  convertValueToLiteral,
  createStaticGetter,
  getAttributeTypeInfo,
  isMemberPrivate,
  resolveType,
  retrieveTsDecorators,
  retrieveTsModifiers,
  serializeSymbol,
  typeToString,
  validateReferences,
} from '../transform-utils';
import { getDeclarationParameters, isDecoratorNamed } from './decorator-utils';

/**
 * Parse a collection of class members decorated with `@Prop()`
 *
 * @param diagnostics a collection of compiler diagnostics. During the parsing process, any errors detected must be
 * added to this collection
 * @param decoratedProps a collection of class elements that may or may not my class members decorated with `@Prop`.
 * Only those decorated with `@Prop()` will be parsed.
 * @param typeChecker a reference to the TypeScript type checker
 * @param watchable a collection of class members that can be watched for changes using Stencil's `@Watch` decorator
 * @param newMembers a collection that parsed `@Prop` annotated class members should be pushed to as a side effect of
 * calling this function
 */
export const propDecoratorsToStatic = (
  diagnostics: d.Diagnostic[],
  decoratedProps: ts.ClassElement[],
  typeChecker: ts.TypeChecker,
  watchable: Set<string>,
  newMembers: ts.ClassElement[]
): void => {
  const properties = decoratedProps
    .filter(ts.isPropertyDeclaration)
    .map((prop) => parsePropDecorator(diagnostics, typeChecker, prop, watchable))
    .filter((prop): prop is ts.PropertyAssignment => prop != null);

  if (properties.length > 0) {
    newMembers.push(createStaticGetter('properties', ts.factory.createObjectLiteralExpression(properties, true)));
  }
};

/**
 * Parse a single `@Prop` decorator annotated class member
 * @param diagnostics a collection of compiler diagnostics. During the parsing process, any errors detected must be
 * added to this collection
 * @param typeChecker a reference to the TypeScript type checker
 * @param prop the TypeScript `PropertyDeclaration` to parse
 * @param watchable a collection of class members that can be watched for changes using Stencil's `@Watch` decorator
 * @returns a property assignment expression to be added to the Stencil component's class
 */
const parsePropDecorator = (
  diagnostics: d.Diagnostic[],
  typeChecker: ts.TypeChecker,
  prop: ts.PropertyDeclaration,
  watchable: Set<string>
): ts.PropertyAssignment | null => {
  const propDecorator = retrieveTsDecorators(prop)?.find(isDecoratorNamed('Prop'));
  if (propDecorator == null) {
    return null;
  }

  const decoratorParams = getDeclarationParameters<d.PropOptions>(propDecorator);
  const propOptions: d.PropOptions = decoratorParams[0] || {};

  const propName = prop.name.getText();

  if (isMemberPrivate(prop)) {
    const err = buildError(diagnostics);
    err.messageText =
      'Properties decorated with the @Prop() decorator cannot be "private" nor "protected". More info: https://stenciljs.com/docs/properties';
    augmentDiagnosticWithNode(err, retrieveTsModifiers(prop)![0]);
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

  const propMeta: d.ComponentCompilerStaticProperty = {
    type: typeStr,
    mutable: !!propOptions.mutable,
    complexType: getComplexType(typeChecker, prop, type),
    required: prop.exclamationToken !== undefined && propName !== 'mode',
    optional: prop.questionToken !== undefined,
    docs: serializeSymbol(typeChecker, symbol),
  };
  validateReferences(diagnostics, propMeta.complexType.references, prop.type);

  // prop can have an attribute if type is NOT "unknown"
  if (typeStr !== 'unknown') {
    propMeta.attribute = getAttributeName(propName, propOptions);
    propMeta.reflect = getReflect(diagnostics, propDecorator, propOptions);
  }

  // extract default value
  const initializer = prop.initializer;
  if (initializer) {
    propMeta.defaultValue = initializer.getText();
  }

  const staticProp = ts.factory.createPropertyAssignment(
    ts.factory.createStringLiteral(propName),
    convertValueToLiteral(propMeta)
  );
  watchable.add(propName);
  return staticProp;
};

/**
 * Format the attribute name provided as an argument to `@Prop({attribute: ''}`
 * @param propName the prop's name, used as a fallback value
 * @param propOptions the options passed in to the `@Prop` call expression
 * @returns the formatted attribute name
 */
const getAttributeName = (propName: string, propOptions: d.PropOptions): string | undefined => {
  if (propOptions.attribute === null) {
    return undefined;
  }

  if (typeof propOptions.attribute === 'string' && propOptions.attribute.trim().length > 0) {
    return propOptions.attribute.trim().toLowerCase();
  }

  return toDashCase(propName);
};

/**
 * Determines if the 'reflect' property should be applied to the class member decorated with `@Prop`
 * @param diagnostics a collection of compiler diagnostics. Any errors detected with setting 'reflect' must be added to
 * this collection
 * @param propDecorator the AST containing the Prop decorator
 * @param propOptions the options passed in to the `@Prop` call expression
 * @returns `true` if the prop should be reflected in the DOM, `false` otherwise
 */
const getReflect = (diagnostics: d.Diagnostic[], propDecorator: ts.Decorator, propOptions: d.PropOptions): boolean => {
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

const getComplexType = (
  typeChecker: ts.TypeChecker,
  node: ts.PropertyDeclaration,
  type: ts.Type
): d.ComponentCompilerPropertyComplexType => {
  const nodeType = node.type;
  return {
    original: nodeType ? nodeType.getText() : typeToString(typeChecker, type),
    resolved: resolveType(typeChecker, type),
    references: getAttributeTypeInfo(node, node.getSourceFile()),
  };
};

/**
 * Derives a Stencil-permitted prop type from the TypeScript compiler's output. This function may narrow the type of a
 * prop, as the types that can be returned from the TypeScript compiler may be more complex than what Stencil can/should
 * handle for props.
 * @param type the prop type to narrow
 * @returns a valid Stencil prop type
 */
export const propTypeFromTSType = (type: ts.Type): 'any' | 'boolean' | 'number' | 'string' | 'unknown' => {
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

/**
 * Determines if a TypeScript compiler given `Type` is of a particular type according to the provided `check` parameter.
 * Union types (e.g. `boolean | number | string`) will be evaluated one type at a time.
 * @param type the TypeScript `Type` entity to evaluate
 * @param check a function that takes a TypeScript `Type` as its only argument and returns `true` if the `Type` conforms
 * to a particular type
 * @returns the result of the `check` argument. The result of `check` is `true` for one or more types in a union type,
 * return `true`.
 */
const checkType = (type: ts.Type, check: (type: ts.Type) => boolean): boolean => {
  if (type.flags & ts.TypeFlags.Union) {
    // if the type is a union, check each type in the union
    const union = type as ts.UnionType;
    if (union.types.some((type) => checkType(type, check))) {
      return true;
    }
  }
  return check(type);
};

/**
 * Determine if a TypeScript compiler `Type` is a boolean
 * @param t the `Type` to evaluate
 * @returns `true` if the `Type` has any boolean-similar flags, `false` otherwise
 */
const isBoolean = (t: ts.Type): boolean => {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLike));
  }
  return false;
};

/**
 * Determine if a TypeScript compiler `Type` is a number
 * @param t the `Type` to evaluate
 * @returns `true` if the `Type` has any number-similar flags, `false` otherwise
 */
const isNumber = (t: ts.Type): boolean => {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral));
  }
  return false;
};

/**
 * Determine if a TypeScript compiler `Type` is a string
 * @param t the `Type` to evaluate
 * @returns `true` if the `Type` has any string-similar flags, `false` otherwise
 */
const isString = (t: ts.Type): boolean => {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral));
  }
  return false;
};

/**
 * Determine if a TypeScript compiler `Type` is of type any
 * @param t the `Type` to evaluate
 * @returns `true` if the `Type` has the `Any` flag set on it, `false` otherwise
 */
const isAny = (t: ts.Type): boolean => {
  if (t) {
    return !!(t.flags & ts.TypeFlags.Any);
  }
  return false;
};
