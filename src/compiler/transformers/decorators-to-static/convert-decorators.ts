import * as d from '../../../declarations';
import { isDecoratorNamed, removeDecorators } from '../transform-utils';
import { componentDecoratorToStatic } from './component-decorator';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { listenDecoratorsToStatic } from './listen-decorator';
import { methodDecoratorsToStatic } from './method-decorator';
import { propDecoratorsToStatic } from './prop-decorator';
import { stateDecoratorsToStatic } from './state-decorator';
import { watchDecoratorsToStatic } from './watch-decorator';
import { removeStencilImport } from '../remove-stencil-import';
import ts from 'typescript';


export function convertDecoratorsToStatic(config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    function visit(tsSourceFile: ts.SourceFile, node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isClassDeclaration(node)) {
        node = visitClass(config, diagnostics, typeChecker, tsSourceFile, node);
      } else if (ts.isImportDeclaration(node)) {
        return removeStencilImport(node);
      }

      return ts.visitEachChild(node, node => visit(tsSourceFile, node), transformCtx);
    }

    return tsSourceFile => {
      return visit(tsSourceFile, tsSourceFile) as ts.SourceFile;
    };
  };
}


function visitClass(config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, tsSourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration) {
  if (!cmpNode.decorators) {
    return cmpNode;
  }

  const componentDecorator = cmpNode.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return cmpNode;
  }

  const newMembers: ts.ClassElement[] = [...cmpNode.members];

  // parser component decorator (Component)
  componentDecoratorToStatic(config, cmpNode, newMembers, componentDecorator);

  // parse member decorators (Prop, State, Listen, Event, Method, Element and Watch)
  const decoratedMembers = newMembers.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);
  if (decoratedMembers.length > 0) {
    propDecoratorsToStatic(config, diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    stateDecoratorsToStatic(diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    eventDecoratorsToStatic(diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    methodDecoratorsToStatic(config, diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    elementDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, newMembers);
    watchDecoratorsToStatic(diagnostics, decoratedMembers, newMembers);
    listenDecoratorsToStatic(diagnostics, tsSourceFile, decoratedMembers, newMembers);

    removeStencilDecorators(decoratedMembers);
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

function removeStencilDecorators(classMembers: ts.ClassElement[]) {
  classMembers.forEach(member => removeDecorators(member, STENCIL_MEMBER_DECORATORS));
}

const STENCIL_MEMBER_DECORATORS = [
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'PropDidChange',
  'PropWillChange',
  'State',
  'Watch',
];
