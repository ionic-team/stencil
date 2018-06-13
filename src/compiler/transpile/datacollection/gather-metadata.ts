import * as d from '../../../declarations';
import { getCollections } from './discover-collections';
import { getComponentDecoratorMeta } from './component-decorator';
import { getElementDecoratorMeta } from './element-decorator';
import { getEventDecoratorMeta } from './event-decorator';
import { getListenDecoratorMeta } from './listen-decorator';
import { getMethodDecoratorMeta } from './method-decorator';
import { getModuleFile } from '../../build/compiler-ctx';
import { getPropDecoratorMeta } from './prop-decorator';
import { getStateDecoratorMeta } from './state-decorator';
import { getWatchDecoratorMeta } from './watch-decorator';
import { normalizeAssetsDir } from '../../component-plugins/assets-plugin';
import { normalizeStyles } from '../../style/normalize-styles';
import { validateComponentClass } from './validate-component';
import * as ts from 'typescript';


export function gatherMetadata(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(node: ts.Node, tsSourceFile: ts.SourceFile, moduleFile: d.ModuleFile): ts.VisitResult<ts.Node> {

      if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        getCollections(config, compilerCtx, buildCtx.collections, moduleFile, node as ts.ImportDeclaration);
      }

      if (ts.isClassDeclaration(node)) {
        const cmpMeta = visitClass(buildCtx.diagnostics, typeChecker, node as ts.ClassDeclaration, tsSourceFile);
        if (cmpMeta) {
          moduleFile.cmpMeta = cmpMeta;

          cmpMeta.stylesMeta = normalizeStyles(config, moduleFile.sourceFilePath, cmpMeta.stylesMeta);
          cmpMeta.assetsDirsMeta = normalizeAssetsDir(config, moduleFile.sourceFilePath, cmpMeta.assetsDirsMeta);
        }
      }

      return ts.visitEachChild(node, (node) => {
        return visit(node, tsSourceFile, moduleFile);
      }, transformContext);
    }

    return (tsSourceFile) => {
      const moduleFile = getModuleFile(compilerCtx, tsSourceFile.fileName);
      moduleFile.externalImports.length = 0;
      moduleFile.localImports.length = 0;

      return visit(tsSourceFile, tsSourceFile, moduleFile) as ts.SourceFile;
    };
  };
}


export function visitClass(diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile): d.ComponentMeta | undefined {
  const cmpMeta = getComponentDecoratorMeta(diagnostics, typeChecker, classNode);

  if (!cmpMeta) {
    return null;
  }

  const componentClass = classNode.name.getText().trim();

  cmpMeta.componentClass = componentClass;

  cmpMeta.membersMeta = {
    // membersMeta is shared with @Prop, @State, @Method, @Element
    ...getElementDecoratorMeta(typeChecker, classNode),
    ...getMethodDecoratorMeta(diagnostics, typeChecker, classNode, sourceFile, componentClass),
    ...getStateDecoratorMeta(classNode),
    ...getPropDecoratorMeta(diagnostics, typeChecker, classNode, sourceFile, componentClass)
  };

  cmpMeta.eventsMeta = getEventDecoratorMeta(diagnostics, typeChecker, classNode, sourceFile);
  cmpMeta.listenersMeta = getListenDecoratorMeta(typeChecker, classNode);

  // watch meta collection MUST happen after prop/state decorator meta collection
  getWatchDecoratorMeta(diagnostics, classNode, cmpMeta);

  // validate the user's component class for any common errors
  validateComponentClass(diagnostics, cmpMeta, classNode);

  // Return Class Declaration with Decorator removed and as default export
  return cmpMeta;
}
