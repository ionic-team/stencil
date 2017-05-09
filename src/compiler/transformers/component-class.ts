import { BuildContext, FileMeta } from '../interfaces';
import { getComponentDecoratorData } from './component-decorator';
import { getListenDecoratorMeta } from './listen-decorator';
import { getMethodDecoratorMeta } from './method-decorator';
import { getPropertyDecoratorMeta } from './prop-decorator';
import { getWatchDecoratorMeta } from './watch-decorator';
import * as ts from 'typescript';


export function componentClass(ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(srcContext: SourceContext, fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
      const cmpMeta = getComponentDecoratorData(classNode);

      if (cmpMeta) {
        if (fileMeta.cmpMeta) {
          throw `file cannot have multiple @Components: ${fileMeta.filePath}`;
        }

        fileMeta.cmpMeta = cmpMeta;

        srcContext.cmpClassCount++;
        fileMeta.hasCmpClass = true;
        fileMeta.cmpClassName = classNode.name.getText().trim();

        getMethodDecoratorMeta(fileMeta, classNode);
        getPropertyDecoratorMeta(fileMeta, classNode);
        getListenDecoratorMeta(fileMeta, classNode);
        getWatchDecoratorMeta(fileMeta, classNode);

        return removeClassDecorator(classNode);

      } else if (!fileMeta.cmpMeta) {
        fileMeta.hasCmpClass = false;
      }

      return classNode;
    }


    function visit(srcContext: SourceContext, fileMeta: FileMeta, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(srcContext, fileMeta, node as ts.ClassDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(srcContext, fileMeta, node);
          }, transformContext);
      }
    }


    return (tsSourceFile) => {
      const srcContext: SourceContext = {
        cmpClassCount: 0
      };

      const fileMeta = ctx.files.get(tsSourceFile.fileName);
      if (fileMeta && fileMeta.hasCmpClass) {
        return visit(srcContext, fileMeta, tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    };
  };

}


function removeClassDecorator(classNode: ts.ClassDeclaration) {
  const classWithoutDecorators = ts.createClassDeclaration(
      undefined!, classNode.modifiers!, classNode.name!, classNode.typeParameters!,
      classNode.heritageClauses!, classNode.members);

  return classWithoutDecorators;
}


interface SourceContext {
  cmpClassCount: number;
}
