import { BuildCtx, CompilerCtx, ComponentMeta, ComponentRegistry, Config, Diagnostic } from '../../../declarations';
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


export function gatherMetadata(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, typechecker: ts.TypeChecker, sourceFileList: ReadonlyArray<ts.SourceFile>): ComponentRegistry {
  const componentMetaList: ComponentRegistry = {};
  const diagnostics: Diagnostic[] = [];

  const visitFile = visitFactory(config, compilerCtx, buildCtx, typechecker, componentMetaList, diagnostics);

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFileList) {
    ts.forEachChild(sourceFile, (node) => {
      visitFile(node, node as ts.SourceFile);
    });
  }
  return componentMetaList;
}

function visitFactory(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, checker: ts.TypeChecker, componentMetaList: ComponentRegistry, diagnostics: Diagnostic[]) {

  return function visit(node: ts.Node, sourceFile: ts.SourceFile) {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
      getCollections(config, compilerCtx, buildCtx, node as ts.ImportDeclaration);
    }

    if (ts.isClassDeclaration(node)) {
      const cmpMeta = visitClass(config, checker, node as ts.ClassDeclaration, sourceFile, diagnostics);
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

export function visitClass(config: Config, checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: Diagnostic[]): ComponentMeta | undefined {
  let cmpMeta = getComponentDecoratorMeta(checker, classNode);

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
      ...getMethodDecoratorMeta(config, checker, classNode, sourceFile, componentClass),
      ...getStateDecoratorMeta(checker, classNode),
      ...getPropDecoratorMeta(config, checker, classNode, sourceFile, componentClass, diagnostics)
    },
    eventsMeta: getEventDecoratorMeta(config, checker, classNode, sourceFile),
    listenersMeta: getListenDecoratorMeta(checker, classNode)
  };

  getWatchDecoratorMeta(config, classNode, cmpMeta);

  // validate the user's component class for any common errors
  validateComponentClass(config, cmpMeta, classNode);

  // Return Class Declaration with Decorator removed and as default export
  return cmpMeta;
}
