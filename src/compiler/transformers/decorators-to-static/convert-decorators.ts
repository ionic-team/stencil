import * as d from '@declarations';
import { isDecoratorNamed } from '../transform-utils';
import { componentDecoratorToStatic } from './component-decorator';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { listenDecoratorsToStatic } from './listen-decorator';
import { methodDecoratorsToStatic } from './method-decorator';
import { propDecoratorsToStatic } from './prop-decorator';
import { stateDecoratorsToStatic } from './state-decorator';
import { transformHostData } from '../transforms/host-data-transform';
import ts from 'typescript';


export function convertDecoratorsToStatic(diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    function visit(tsSourceFile: ts.SourceFile, node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isClassDeclaration(node)) {
        node = visitClass(diagnostics, typeChecker, tsSourceFile, node);
      }

      return ts.visitEachChild(node, node => visit(tsSourceFile, node), transformCtx);
    }

    return tsSourceFile => {
      return visit(tsSourceFile, tsSourceFile) as ts.SourceFile;
    };
  };
}


function visitClass(diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, tsSourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration) {
  if (!cmpNode.decorators) {
    return cmpNode;
  }

  const componentDecorator = cmpNode.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return cmpNode;
  }

  const newMembers: ts.ClassElement[] = [...cmpNode.members];

  transformHostData(newMembers);
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
    newMembers
  );
}

