import * as d from '../../../declarations';
import { getCollections } from './discover-collections';
import { getComponentDecoratorMeta } from './component-decorator';
import { getElementDecoratorMeta } from './element-decorator';
import { getEventDecoratorMeta } from './event-decorator';
import { getListenDecoratorMeta } from './listen-decorator';
import { getMethodDecoratorMeta } from './method-decorator';
import { getPropDecoratorMeta } from './prop-decorator';
import { getStateDecoratorMeta } from './state-decorator';
import { getWatchDecoratorMeta } from './watch-decorator';
import { normalizePath } from '../../util';
import { validateComponentClass } from './validate-component';
import * as ts from 'typescript';


export function gatherMetadata(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], collections: d.Collection[], typechecker: ts.TypeChecker, sourceFileList: ReadonlyArray<ts.SourceFile>) {
  const componentMetaList: d.ComponentRegistry = {};

  const visitFile = visitFactory(config, diagnostics, compilerCtx, collections, typechecker, componentMetaList);

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFileList) {
    ts.forEachChild(sourceFile, (node) => {
      visitFile(node, node as ts.SourceFile);
    });
  }
  return componentMetaList;
}

function visitFactory(config: d.Config, diagnostics: d.Diagnostic[], compilerCtx: d.CompilerCtx, collections: d.Collection[], checker: ts.TypeChecker, componentMetaList: d.ComponentRegistry) {

  return function visit(node: ts.Node, sourceFile: ts.SourceFile) {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
      getCollections(config, compilerCtx, collections, node as ts.ImportDeclaration);
    }

    if (ts.isClassDeclaration(node)) {
      const cmpMeta = visitClass(diagnostics, checker, node as ts.ClassDeclaration, sourceFile);
      if (cmpMeta) {
        const tsFilePath = normalizePath(sourceFile.getSourceFile().fileName);
        componentMetaList[tsFilePath] = cmpMeta;
      }
    }

    ts.forEachChild(node, (node) => {
      visit(node, sourceFile);
    });
  };
}

export function visitClass(diagnostics: d.Diagnostic[], checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile): d.ComponentMeta | undefined {
  let cmpMeta = getComponentDecoratorMeta(diagnostics, checker, classNode);

  if (!cmpMeta) {
    return undefined;
  }

  const componentClass = classNode.name.getText().trim();

  cmpMeta = {
    ...cmpMeta,
    componentClass: componentClass,
    membersMeta: {
      // membersMeta is shared with @Prop, @State, @Method, @Element
      ...getElementDecoratorMeta(checker, classNode),
      ...getMethodDecoratorMeta(diagnostics, checker, classNode, sourceFile, componentClass),
      ...getStateDecoratorMeta(classNode),
      ...getPropDecoratorMeta(diagnostics, checker, classNode, sourceFile, componentClass)
    },
    eventsMeta: getEventDecoratorMeta(diagnostics, checker, classNode, sourceFile),
    listenersMeta: getListenDecoratorMeta(checker, classNode)
  };

  getWatchDecoratorMeta(diagnostics, classNode, cmpMeta);

  // validate the user's component class for any common errors
  validateComponentClass(diagnostics, cmpMeta, classNode);

  // Return Class Declaration with Decorator removed and as default export
  return cmpMeta;
}
