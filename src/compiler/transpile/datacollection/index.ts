import { ComponentRegistry, ComponentMeta, Diagnostic } from '../../../util/interfaces';
import { getComponentDecoratorMeta } from './componentDecorator';
import { getElementDecoratorMeta } from './elementDecorator';
import { getMethodDecoratorMeta } from './methodDecorator';
import { getStateDecoratorMeta } from './stateDecorator';
import { getPropDecoratorMeta } from './propDecorator';
import { getEventDecoratorMeta } from './eventDecorator';
import { getListenDecoratorMeta } from './listenDecorator';
import { getPropChangeDecoratorMeta } from './propChangeDecorator';

import * as ts from 'typescript';

export function gatherMetadata(typechecker: ts.TypeChecker, sourceFileList: ReadonlyArray<ts.SourceFile>): ComponentRegistry {
  const componentMetaList: ComponentRegistry = {};
  const diagnostics: Diagnostic[] = [];

  const visitFile = visitFactory(typechecker, componentMetaList, diagnostics);

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFileList) {
    ts.forEachChild(sourceFile, (node) => {
      visitFile(node, node as ts.SourceFile);
    });
  }
  return componentMetaList;
}

function visitFactory(checker: ts.TypeChecker, componentMetaList: ComponentRegistry, diagnostics: Diagnostic[]) {

  return function visit(node: ts.Node, sourceFile: ts.SourceFile) {
    if (ts.isClassDeclaration(node)) {
      const cmpMeta = visitClass(checker, node as ts.ClassDeclaration, sourceFile, diagnostics);
      if (cmpMeta) {
        componentMetaList[sourceFile.getSourceFile().fileName] = cmpMeta;
      }
    }
    ts.forEachChild(node, (node) => {
      visit(node, sourceFile);
    });
  };
}

export function visitClass(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: Diagnostic[]): ComponentMeta | undefined {
  let componentMeta: ComponentMeta = getComponentDecoratorMeta(checker, classNode);

  if (!componentMeta) {
    return undefined;
  }

  componentMeta = {
    ...componentMeta,
    componentClass: classNode.name.getText().trim(),
    membersMeta: {
      // membersMeta is shared with @Prop, @State, @Method, @Element
      ...getElementDecoratorMeta(checker, classNode),
      ...getMethodDecoratorMeta(checker, classNode),
      ...getStateDecoratorMeta(classNode),
      ...getPropDecoratorMeta(checker, classNode, sourceFile, diagnostics)
    },
    eventsMeta: getEventDecoratorMeta(checker, classNode),
    listenersMeta: getListenDecoratorMeta(checker, classNode),
    ...getPropChangeDecoratorMeta(classNode)
  };

  // Return Class Declaration with Decorator removed and as default export
  return componentMeta;
}
