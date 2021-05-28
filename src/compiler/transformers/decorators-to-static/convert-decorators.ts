import type * as d from '../../../declarations';
import { CLASS_DECORATORS_TO_REMOVE, MEMBER_DECORATORS_TO_REMOVE } from './decorators-constants';
import { mixinClassMembers, hasMixins, mixinStatements, VisitedFiles, FoundMixins } from './mixin-decorator';
import { componentDecoratorToStatic } from './component-decorator';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { listenDecoratorsToStatic } from './listen-decorator';
import { isDecoratorNamed } from './decorator-utils';
import { methodDecoratorsToStatic, validateMethods } from './method-decorator';
import { propDecoratorsToStatic } from './prop-decorator';
import { stateDecoratorsToStatic } from './state-decorator';
import { watchDecoratorsToStatic } from './watch-decorator';
import { cloneNode } from '@wessberg/ts-clone-node';
import ts from 'typescript';

const visitedFiles: VisitedFiles = new Map();
const allMixins: FoundMixins = new Map();

export const convertDecoratorsToStatic = (config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, compilerHost?: ts.CompilerHost): ts.TransformerFactory<ts.SourceFile> => {
  return transformCtx => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (ts.isClassDeclaration(node)) {
        return visitClassDeclaration(config, diagnostics, typeChecker, node);
      }
      return ts.visitEachChild(node, visit, transformCtx);
    };

    return tsSourceFile => {
      const sourceFile = visitSourceFile(tsSourceFile, diagnostics, compilerHost);
      return ts.visitEachChild(sourceFile, visit, transformCtx);
    };
  };
};

export const visitSourceFile = (sourceNode: ts.SourceFile, diagnostics: d.Diagnostic[], compilerHost?: ts.CompilerHost) => {
  visitedFiles.set(sourceNode.fileName, sourceNode);
  const mixinsFound = hasMixins(sourceNode, diagnostics, visitedFiles, compilerHost);
  if (!mixinsFound) {
    return sourceNode;
  }

  const statements = mixinStatements(sourceNode, mixinsFound, diagnostics);
  allMixins.set(sourceNode.fileName, mixinsFound);

  return ts.factory.updateSourceFile(
    sourceNode,
    statements,
  );
}

export const visitClassDeclaration = (config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, classNode: ts.ClassDeclaration) => {
  if (!classNode.decorators) {
    return classNode;
  }

  const componentDecorator = classNode.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return classNode;
  }

  const classMembers = mixinClassMembers(classNode, allMixins);
  const decoratedMembers = classMembers.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);
  const newMembers = removeStencilDecorators(Array.from(classMembers));

  // parser component decorator (Component)
  componentDecoratorToStatic(config, typeChecker, diagnostics, classNode, newMembers, componentDecorator);

  // parse member decorators (Prop, State, Listen, Event, Method, Element and Watch)
  const watchable = new Set<string>();
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

  return ts.factory.updateClassDeclaration(
    classNode,
    removeDecorators(classNode, CLASS_DECORATORS_TO_REMOVE),
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    newMembers.map(member => cloneNode(member, {typescript: ts, setOriginalNodes: true })),
  );
};

const removeStencilDecorators = (classMembers: ts.ClassElement[]) => {
  return classMembers.map(m => {
    const currentDecorators = m.decorators;
    const newDecorators = removeDecorators(m, MEMBER_DECORATORS_TO_REMOVE);
    if (currentDecorators !== newDecorators) {
      if (ts.isMethodDeclaration(m)) {
        return ts.updateMethod(m, newDecorators, m.modifiers, m.asteriskToken, m.name, m.questionToken, m.typeParameters, m.parameters, m.type, m.body);
      } else if (ts.isPropertyDeclaration(m)) {
        return ts.updateProperty(m, newDecorators, m.modifiers, m.name, m.questionToken, m.type, m.initializer);
      } else {
        console.log('unknown class node');
      }
    }
    return m;
  });
};

const removeDecorators = (node: ts.Node, decoratorNames: Set<string>) => {
  if (node.decorators) {
    const updatedDecoratorList = node.decorators.filter(dec => {
      const name = ts.isCallExpression(dec.expression) && ts.isIdentifier(dec.expression.expression) && dec.expression.expression.text;
      return !decoratorNames.has(name);
    });
    if (updatedDecoratorList.length === 0) {
      return undefined;
    } else if (updatedDecoratorList.length !== node.decorators.length) {
      return ts.createNodeArray(updatedDecoratorList);
    }
  }
  return node.decorators;
};
