import * as d from '@declarations';
import { componentDecoratorToStatic } from './component-decorator';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { isDecoratorNamed } from '../transform-utils';
import { listenDecoratorsToStatic } from './listen-decorator';
import { methodDecoratorsToStatic } from './method-decorator';
import { propDecoratorsToStatic } from './prop-decorator';
import { stateDecoratorsToStatic } from './state-decorator';
import ts from 'typescript';


export function convertDecoratorsToStatic(diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(tsSourceFile: ts.SourceFile, node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isClassDeclaration(node)) {
        node = visitClass(diagnostics, typeChecker, tsSourceFile, node as ts.ClassDeclaration);
      }

      return ts.visitEachChild(node, node => {
        return visit(tsSourceFile, node);
      }, transformContext);
    }

    return tsSourceFile => visit(tsSourceFile, tsSourceFile) as ts.SourceFile;
  };
}


function visitClass(diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, tsSourceFile: ts.SourceFile, classNode: ts.ClassDeclaration) {
  if (!classNode.decorators) {
    return classNode;
  }

  const componentDecorator = classNode.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return classNode;
  }

  return visitComponentClass(diagnostics, typeChecker, tsSourceFile, classNode, componentDecorator);
}


function visitComponentClass(diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, tsSourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration, componentDecorator: ts.Decorator) {
  const newMembers: ts.ClassElement[] = [];

  componentDecoratorToStatic(cmpNode, newMembers, componentDecorator);

  const decoratedProps = cmpNode.members.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);
  if (decoratedProps.length > 0) {
    propDecoratorsToStatic(diagnostics, tsSourceFile, decoratedProps, typeChecker, newMembers);
    stateDecoratorsToStatic(diagnostics, tsSourceFile, decoratedProps, typeChecker, newMembers);
    listenDecoratorsToStatic(diagnostics, tsSourceFile, decoratedProps, typeChecker, newMembers);
    eventDecoratorsToStatic(diagnostics, tsSourceFile, decoratedProps, typeChecker, newMembers);
    methodDecoratorsToStatic(diagnostics, tsSourceFile, decoratedProps, typeChecker, newMembers);
    elementDecoratorsToStatic(diagnostics, decoratedProps, typeChecker, newMembers);
  }

  return ts.updateClassDeclaration(
    cmpNode,
    cmpNode.decorators,
    cmpNode.modifiers,
    cmpNode.name,
    cmpNode.typeParameters,
    cmpNode.heritageClauses,
    [ ...cmpNode.members, ...newMembers]
  );
}

