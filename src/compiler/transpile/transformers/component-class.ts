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
import * as ts from 'typescript';


export function componentClass(config: BuildConfig, moduleFiles: ModuleFiles, diagnostics: Diagnostic[]): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(moduleFile: ModuleFile, classNode: ts.ClassDeclaration) {
      const cmpMeta = getComponentDecoratorData(config, moduleFile, diagnostics, classNode);

      if (cmpMeta) {
        if (moduleFile.cmpMeta) {
          const d = buildError(diagnostics);
          d.messageText = `Cannot have multiple @Components in the same source file`;
          d.absFilePath = moduleFile.tsFilePath;
          return classNode;
        }

        moduleFile.cmpMeta = cmpMeta;
        moduleFile.cmpMeta.componentClass = classNode.name.getText().trim();
        moduleFile.hasCmpClass = true;

        getElementDecoratorMeta(moduleFile, classNode);
        getEventDecoratorMeta(moduleFile, diagnostics, classNode);
        getMethodDecoratorMeta(moduleFile, classNode);
        getStateDecoratorMeta(moduleFile, classNode);
        getPropDecoratorMeta(moduleFile, diagnostics, classNode);
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
        moduleFile.hasCmpClass = false;
        return visit(moduleFile, tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    };
  };

}


function removeClassDecorator(classNode: ts.ClassDeclaration) {
  return ts.createClassDeclaration(
      undefined!, // <-- that's what's removing the decorator

      // everything else should be the same
      classNode.modifiers!,
      classNode.name!,
      classNode.typeParameters!,
      classNode.heritageClauses!,
      classNode.members);
}
