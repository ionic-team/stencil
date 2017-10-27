import { BuildConfig, BuildContext, Diagnostic, ModuleFiles, ModuleFile } from '../../../util/interfaces';
import { buildError } from '../../util';
import { getComponentDecoratorData } from './component-decorator';
import { getElementDecoratorMeta } from './element-decorator';
import { getEventDecoratorMeta } from './event-decorator';
import { getListenDecoratorMeta } from './listen-decorator';
import { getMethodDecoratorMeta } from './method-decorator';
import { getPropDecoratorMeta } from './prop-decorator';
import { getPropChangeDecoratorMeta } from './prop-change-decorator';
import { getStateDecoratorMeta } from './state-decorator';
import { loadComponentBuildSections } from './component-build-sections';
import { updateComponentClass } from './util';
import * as ts from 'typescript';


export function componentModuleFileClass(config: BuildConfig, ctx: BuildContext, fileMeta: ModuleFile, diagnostics: Diagnostic[]): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(fileMeta: ModuleFile, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(config, ctx, fileMeta, diagnostics, node as ts.ClassDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileMeta, node);
          }, transformContext);
      }
    }


    return (tsSourceFile) => {
      return visit(fileMeta, tsSourceFile) as ts.SourceFile;
    };
  };

}


export function componentTsFileClass(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFiles, diagnostics: Diagnostic[]): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(fileMeta: ModuleFile, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(config, ctx, fileMeta, diagnostics, node as ts.ClassDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileMeta, node);
          }, transformContext);
      }
    }


    return (tsSourceFile) => {
      const moduleFile = moduleFiles[tsSourceFile.fileName];
      if (moduleFile) {
        moduleFile.cmpMeta = null;
        return visit(moduleFile, tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    };
  };

}



function visitClass(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration) {
  const cmpMeta = getComponentDecoratorData(config, moduleFile, diagnostics, classNode);

  if (!cmpMeta) {
    return classNode;
  }

  if (moduleFile.cmpMeta && moduleFile.cmpMeta.tagNameMeta !== cmpMeta.tagNameMeta) {
    const relPath = config.sys.path.relative(config.rootDir, moduleFile.tsFilePath);
    const d = buildError(diagnostics);
    d.messageText = `Cannot have multiple @Components in the same source file: ${relPath}`;
    d.absFilePath = moduleFile.tsFilePath;
    return classNode;
  }

  moduleFile.cmpMeta = {
    ...cmpMeta,
    componentClass: classNode.name.getText().trim(),
    membersMeta: {
      // membersMeta is shared with @Prop, @State, @Method, @Element
      ...getElementDecoratorMeta(classNode),
      ...getMethodDecoratorMeta(classNode),
      ...getStateDecoratorMeta(classNode),
      ...getPropDecoratorMeta(moduleFile.tsFilePath, diagnostics, classNode)
    },
    eventsMeta: getEventDecoratorMeta(moduleFile.tsFilePath, diagnostics, classNode),
    listenersMeta: getListenDecoratorMeta(moduleFile.tsFilePath, diagnostics, classNode),
    ...getPropChangeDecoratorMeta(classNode)
  };

  // figure out all the build sections that we'll need
  // by parsing apart the user's components and figuring
  // out what features they will and will not need in the core
  loadComponentBuildSections(ctx, classNode);

  // Return Class Declaration with Decorator removed and as default export
  return updateComponentClass(classNode);
}
