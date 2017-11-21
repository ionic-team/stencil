import { ComponentMeta, ModuleFile, Diagnostic } from '../../../util/interfaces';
import { getComponentDecoratorMeta } from './componentDecorator';
import { getElementDecoratorMeta } from './elementDecorator';
import { getMethodDecoratorMeta } from './methodDecorator';
import { getStateDecoratorMeta } from './stateDecorator';
import { getPropDecoratorMeta } from './propDecorator';
import { getEventDecoratorMeta } from './eventDecorator';
import { getListenDecoratorMeta } from './listenDecorator';
import { getPropChangeDecoratorMeta } from './propChangeDecorator';

import * as ts from 'typescript';

export function gatherMetadata(program) {
  const checker = program.getTypeChecker();
  const componentMetaList: ComponentMeta[] = [];
  const diagnostics: Diagnostic[] = [];

  const visitFile = visitFactory(checker, componentMetaList, diagnostics);

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    ts.forEachChild(sourceFile, (node) => {
      return visitFile(node, node as ts.SourceFile);
    });
  }
}

function visitFactory(checker: ts.TypeChecker, componentMetaList: ComponentMeta[], diagnostics: Diagnostic[]) {

  return function visit(node: ts.Node, sourceFile: ts.SourceFile) {
    if (ts.isClassDeclaration(node)) {
      const cmpMeta = visitClass(checker, node as ts.ClassDeclaration, sourceFile, diagnostics);
      if (cmpMeta) {
        componentMetaList[sourceFile.fileName] = cmpMeta;
      }
      return node;
    }
    return ts.forEachChild(node, (node) => {
      return visit(node, sourceFile);
    });
  };
}

export function visitClass(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: Diagnostic[]): ComponentMeta | undefined {
  let componentMeta: ComponentMeta = getComponentDecoratorMeta(checker, classNode);

  if (!componentMeta) {
    return;
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
    ...getPropChangeDecoratorMeta(checker, classNode)
  };

  // Return Class Declaration with Decorator removed and as default export
  return componentMeta;
}
