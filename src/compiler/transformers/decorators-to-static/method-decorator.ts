import * as d from '@declarations';
import { createStaticGetter, isDecoratorNamed, removeDecorator } from '../transform-utils';
import ts from 'typescript';


export function methodDecoratorsToStatic(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const methods: ts.ObjectLiteralElementLike[] = decoratedProps.map((prop: ts.PropertyDeclaration) => {
    return methodDecoratorToStatic(diagnostics, typeChecker, prop);
  }).filter(method => !!method);

  if (methods.length > 0) {
    newMembers.push(createStaticGetter('methods', ts.createObjectLiteral(methods, true)));
  }
}


function methodDecoratorToStatic(_diagnostics: d.Diagnostic[], _typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) {
  const methodDecorator = prop.decorators && prop.decorators.find(isDecoratorNamed('Method'));

  if (methodDecorator == null) {
    return null;
  }

  removeDecorator(prop, 'Method');

  const methodName = (prop.name as ts.Identifier).text;

  const propertyAssignment = ts.createPropertyAssignment(ts.createLiteral(methodName), ts.createObjectLiteral([], true));

  return propertyAssignment;
}
