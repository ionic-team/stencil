import ts from 'typescript';

import type * as d from '../../../declarations';
import { componentDecoratorToStatic } from './component-decorator';
import { isDecoratorNamed } from './decorator-utils';
import { CLASS_DECORATORS_TO_REMOVE, MEMBER_DECORATORS_TO_REMOVE } from './decorators-constants';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { listenDecoratorsToStatic } from './listen-decorator';
import { methodDecoratorsToStatic, validateMethods } from './method-decorator';
import { propDecoratorsToStatic } from './prop-decorator';
import { stateDecoratorsToStatic } from './state-decorator';
import { watchDecoratorsToStatic } from './watch-decorator';

export const convertDecoratorsToStatic = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  typeChecker: ts.TypeChecker
): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (ts.isClassDeclaration(node)) {
        return visitClassDeclaration(config, diagnostics, typeChecker, node);
      }
      return ts.visitEachChild(node, visit, transformCtx);
    };

    return (tsSourceFile) => {
      return ts.visitEachChild(tsSourceFile, visit, transformCtx);
    };
  };
};

export const visitClassDeclaration = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  typeChecker: ts.TypeChecker,
  classNode: ts.ClassDeclaration
) => {
  if (!classNode.decorators) {
    return classNode;
  }

  const componentDecorator = classNode.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return classNode;
  }

  const classMembers = classNode.members;
  const decoratedMembers = classMembers.filter(
    (member) => Array.isArray(member.decorators) && member.decorators.length > 0
  );

  // create an array of all class members which do _not_ have a Stencil
  // decorator on them. we do this so we can transform the decorated class
  // fields into static getters while preserving other class members (like
  // methods and so on).
  const newMembers = removeStencilDecorators(Array.from(classMembers));

  // parser component decorator (Component)
  componentDecoratorToStatic(config, typeChecker, diagnostics, classNode, newMembers, componentDecorator);

  // stores a reference to fields that should be watched for changes
  const watchable = new Set<string>();
  // parse member decorators (Prop, State, Listen, Event, Method, Element and Watch)
  if (decoratedMembers.length > 0) {
    propDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, watchable, newMembers);
    stateDecoratorsToStatic(decoratedMembers, watchable, newMembers);
    eventDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, newMembers);
    methodDecoratorsToStatic(config, diagnostics, classNode, decoratedMembers, typeChecker, newMembers);
    elementDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, newMembers);
    watchDecoratorsToStatic(config, diagnostics, decoratedMembers, watchable, newMembers);
    listenDecoratorsToStatic(diagnostics, decoratedMembers, newMembers);
  }

  validateMethods(diagnostics, classMembers);

  return ts.updateClassDeclaration(
    classNode,
    filterDecorators(classNode, CLASS_DECORATORS_TO_REMOVE),
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    newMembers
  );
};

const removeStencilDecorators = (classMembers: ts.ClassElement[]) => {
  return classMembers.map((m) => {
    const currentDecorators = m.decorators;
    const newDecorators = filterDecorators(m, MEMBER_DECORATORS_TO_REMOVE);
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
        return ts.updateProperty(m, newDecorators, m.modifiers, m.name, m.questionToken, m.type, m.initializer);
      } else {
        console.log('unknown class node');
      }
    }
    return m;
  });
};

/**
 * Generate a list of decorators from an AST node that are not in a provided list
 *
 * @param node the AST node whose decorators should be inspected
 * @param decoratorNames the decorators that should _not_ be included in the returned list
 * @returns a list of decorators on the AST node that are not in the provided list, or `undefined` if:
 * - there are no decorators on the node
 * - the node contains only decorators in the provided list
 */
const filterDecorators = (node: ts.Node, decoratorNames: Set<string>): ts.NodeArray<ts.Decorator> | undefined => {
  if (node.decorators) {
    const updatedDecoratorList = node.decorators.filter((dec) => {
      const name =
        ts.isCallExpression(dec.expression) &&
        ts.isIdentifier(dec.expression.expression) &&
        dec.expression.expression.text;
      return typeof name === 'boolean' || !decoratorNames.has(name);
    });
    if (updatedDecoratorList.length === 0) {
      return undefined;
    } else if (updatedDecoratorList.length !== node.decorators.length) {
      return ts.factory.createNodeArray(updatedDecoratorList);
    }
  }
  return node.decorators;
};
