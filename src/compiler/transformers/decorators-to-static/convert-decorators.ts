import { methodDecoratorsToStatic } from './method-decorator';
import * as d from '../../../declarations';
import { componentDecoratorToStatic } from './component-decorator';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { listenDecoratorsToStatic } from './listen-decorator';
import { isDecoratorNamed, removeDecorators } from '../transform-utils';
import { propDecoratorsToStatic } from './prop-decorator';
import { stateDecoratorsToStatic } from './state-decorator';
import { watchDecoratorsToStatic } from './watch-decorator';
import ts from 'typescript';


export const convertDecoratorsToStatic = (config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    function visit(tsSourceFile: ts.SourceFile, node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isClassDeclaration(node)) {
        node = visitClass(config, diagnostics, typeChecker, tsSourceFile, node);
      }

      return ts.visitEachChild(node, node => visit(tsSourceFile, node), transformCtx);
    }

    return tsSourceFile => {
      return visit(tsSourceFile, tsSourceFile) as ts.SourceFile;
    };
  };
};


const visitClass = (config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, tsSourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration) => {
  if (!cmpNode.decorators) {
    return cmpNode;
  }

  const componentDecorator = cmpNode.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return cmpNode;
  }

  const newMembers: ts.ClassElement[] = [...cmpNode.members];

  // parser component decorator (Component)
  componentDecoratorToStatic(config, typeChecker, diagnostics, cmpNode, newMembers, componentDecorator);

  // parse member decorators (Prop, State, Listen, Event, Method, Element and Watch)
  const decoratedMembers = newMembers.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);
  if (decoratedMembers.length > 0) {
    propDecoratorsToStatic(config, diagnostics, decoratedMembers, typeChecker, newMembers);
    stateDecoratorsToStatic(diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    eventDecoratorsToStatic(config, diagnostics, decoratedMembers, typeChecker, newMembers);
    methodDecoratorsToStatic(config, diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    elementDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, newMembers);
    watchDecoratorsToStatic(diagnostics, decoratedMembers, newMembers);
    listenDecoratorsToStatic(config, diagnostics, decoratedMembers, newMembers);

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
};

const removeStencilDecorators = (classMembers: ts.ClassElement[]) => {
  classMembers.forEach(member => removeDecorators(member, MEMBER_DECORATORS_TO_REMOVE));
};

export const CLASS_DECORATORS_TO_REMOVE = new Set(['Component']);
export const MEMBER_DECORATORS_TO_REMOVE = new Set([
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'PropDidChange',
  'PropWillChange',
  'State',
  'Watch'
]);
