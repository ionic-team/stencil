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


export function componentClass(config: BuildConfig, moduleFiles: ModuleFiles, diagnostics: Diagnostic[]): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(moduleFile: ModuleFile, classNode: ts.ClassDeclaration) {
      const cmpMeta = getComponentDecoratorData(config, moduleFile, diagnostics, classNode);

      if (cmpMeta) {
        if (moduleFile.cmpMeta && moduleFile.cmpMeta.tagNameMeta !== cmpMeta.tagNameMeta) {
          const relPath = config.sys.path.relative(config.rootDir, moduleFile.tsFilePath);
          const d = buildError(diagnostics);
          d.messageText = `Cannot have multiple @Components in the same source file: ${relPath}`;
          d.absFilePath = moduleFile.tsFilePath;
          return classNode;
        }

        moduleFile.cmpMeta = cmpMeta;
        moduleFile.cmpMeta.componentClass = classNode.name.getText().trim();

        // membersMeta is shared with @Prop, @State, @Method, @Element
        moduleFile.cmpMeta.membersMeta = {};
        getElementDecoratorMeta(moduleFile, classNode);
        getMethodDecoratorMeta(moduleFile, classNode);
        getStateDecoratorMeta(moduleFile, classNode);
        getPropDecoratorMeta(moduleFile, diagnostics, classNode);

        // others
        getEventDecoratorMeta(moduleFile, diagnostics, classNode);
        getListenDecoratorMeta(moduleFile, diagnostics, classNode);
        getPropChangeDecoratorMeta(moduleFile, classNode);

        return removeClassDecorator(classNode);
      }

      return classNode;
    }


    function visit(fileMeta: ModuleFile, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(fileMeta, node as ts.ClassDeclaration);

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
