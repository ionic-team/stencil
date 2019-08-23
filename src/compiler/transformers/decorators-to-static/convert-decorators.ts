import { methodDecoratorsToStatic } from './method-decorator';
import * as d from '../../../declarations';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { listenDecoratorsToStatic } from './listen-decorator';
import { CLASS_DECORATORS_TO_REMOVE, MEMBER_DECORATORS_TO_REMOVE, isDecoratorNamed } from './decorator-utils';
import { componentDecoratorToStatic } from './component-decorator';
import { propDecoratorsToStatic } from './prop-decorator';
import { removeDecorators } from '../transform-utils';
import { stateDecoratorsToStatic } from './state-decorator';
import { watchDecoratorsToStatic } from './watch-decorator';
import ts from 'typescript';


export const convertDecoratorsToStatic = (config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      const tsSourceFile = node.getSourceFile();
      if (ts.isClassDeclaration(node)) {
        return visitClass(config, diagnostics, typeChecker, tsSourceFile, node);
      }
      return ts.visitEachChild(node, visit, transformCtx);
    };

    return tsSourceFile => {
      return ts.visitEachChild(tsSourceFile, visit, transformCtx);
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

  const decoratedMembers = cmpNode.members.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);
  const newMembers = removeStencilDecorators(Array.from(cmpNode.members));

  // parser component decorator (Component)
  componentDecoratorToStatic(config, typeChecker, diagnostics, cmpNode, newMembers, componentDecorator);

  // parse member decorators (Prop, State, Listen, Event, Method, Element and Watch)
  if (decoratedMembers.length > 0) {
    propDecoratorsToStatic(config, diagnostics, decoratedMembers, typeChecker, newMembers);
    stateDecoratorsToStatic(diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    eventDecoratorsToStatic(config, diagnostics, decoratedMembers, typeChecker, newMembers);
    methodDecoratorsToStatic(config, diagnostics, tsSourceFile, decoratedMembers, typeChecker, newMembers);
    elementDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, newMembers);
    watchDecoratorsToStatic(diagnostics, decoratedMembers, newMembers);
    listenDecoratorsToStatic(config, diagnostics, decoratedMembers, newMembers);
  }

  return ts.updateClassDeclaration(
    cmpNode,
    removeDecorators(cmpNode, CLASS_DECORATORS_TO_REMOVE),
    cmpNode.modifiers,
    cmpNode.name,
    cmpNode.typeParameters,
    cmpNode.heritageClauses,
    newMembers
  );
};

const removeStencilDecorators = (classMembers: ts.ClassElement[]) => {
  return classMembers.map(m => {
    const currentDecorators = m.decorators;
    const newDecorators = removeDecorators(m, MEMBER_DECORATORS_TO_REMOVE);
    if (currentDecorators !== newDecorators) {
      if (ts.isMethodDeclaration(m)) {
        return ts.updateMethod(
          m,
          newDecorators,
          m.modifiers,
          m.asteriskToken,
          m.name,
          m.questionToken,
          m.typeParameters,
          m.parameters,
          m.type,
          m.body
        );
      } else if (ts.isPropertyDeclaration(m)) {
        return ts.updateProperty(
          m,
          newDecorators,
          m.modifiers,
          m.name,
          m.questionToken,
          m.type,
          m.initializer
        );
      } else {
        console.log('unknown class node');
      }
    }
    return m;
  });
};
