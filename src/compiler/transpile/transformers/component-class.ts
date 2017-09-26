import { BuildConfig, Diagnostic, ModuleFiles, ModuleFile } from '../../../util/interfaces';
import { buildError } from '../../util';
import { getComponentDecoratorData } from './component-decorator';
import { getElementDecoratorMeta } from './element-decorator';
import { getEventDecoratorMeta } from './event-decorator';
import { getListenDecoratorMeta } from './listen-decorator';
import { getMethodDecoratorMeta } from './method-decorator';
import { getPropDecoratorMeta } from './prop-decorator';
import { getPropChangeDecoratorMeta } from './prop-change-decorator';
import { getStateDecoratorMeta } from './state-decorator';
import { removeClassDecorator } from './util';
import * as ts from 'typescript';


export function componentModuleFileClass(config: BuildConfig, fileMeta: ModuleFile, diagnostics: Diagnostic[]): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(fileMeta: ModuleFile, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(config, fileMeta, diagnostics, node as ts.ClassDeclaration);

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


export function componentTsFileClass(config: BuildConfig, moduleFiles: ModuleFiles, diagnostics: Diagnostic[]): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(fileMeta: ModuleFile, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(config, fileMeta, diagnostics, node as ts.ClassDeclaration);

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


function visitClass(config: BuildConfig, fileMeta: ModuleFile, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration) {
  const cmpMeta = getComponentDecoratorData(config, fileMeta, diagnostics, classNode);

  if (cmpMeta) {
    if (fileMeta.cmpMeta && fileMeta.cmpMeta.tagNameMeta !== cmpMeta.tagNameMeta) {
      const relPath = config.sys.path.relative(config.rootDir, fileMeta.tsFilePath);
      const d = buildError(diagnostics);
      d.messageText = `Cannot have multiple @Components in the same source file: ${relPath}`;
      d.absFilePath = fileMeta.tsFilePath;
      return classNode;
    }

    fileMeta.cmpMeta = cmpMeta;
    fileMeta.cmpMeta.componentClass = classNode.name.getText().trim();

    // membersMeta is shared with @Prop, @State, @Method, @Element
    fileMeta.cmpMeta.membersMeta = {};
    getElementDecoratorMeta(fileMeta, classNode);
    getMethodDecoratorMeta(fileMeta, classNode);
    getStateDecoratorMeta(fileMeta, classNode);
    getPropDecoratorMeta(fileMeta, diagnostics, classNode);

    // others
    getEventDecoratorMeta(fileMeta, diagnostics, classNode);
    getListenDecoratorMeta(fileMeta, diagnostics, classNode);
    getPropChangeDecoratorMeta(fileMeta, classNode);

    return removeClassDecorator(classNode);
  }

  return classNode;
}
