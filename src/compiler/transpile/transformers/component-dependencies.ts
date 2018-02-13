import { BuildCtx, CompilerCtx, SourceString } from '../../../declarations';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function componentDependencies(compilerCtx: CompilerCtx, buildCtx: BuildCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(node: ts.Node, filePath: string): ts.VisitResult<ts.Node> {
      if (node.kind === ts.SyntaxKind.StringLiteral) {
        buildCtx.sourceStrings.push({
          str: (node as ts.StringLiteral).text,
          filePath: filePath
        });
      }

      return ts.visitEachChild(node, (node) => {
        return visit(node, filePath);
      }, transformContext);
    }

    return (tsSourceFile) => {
      addPropConnects(compilerCtx, buildCtx.sourceStrings, tsSourceFile.fileName);

      return visit(tsSourceFile, tsSourceFile.fileName) as ts.SourceFile;
    };
  };
}


function addPropConnects(compilerCtx: CompilerCtx, sourceStrings: SourceString[], filePath: string) {
  const moduleFile = compilerCtx.moduleFiles[filePath];

  const cmpMeta = (moduleFile && moduleFile.cmpMeta);
  if (!cmpMeta) {
    return;
  }

  if (cmpMeta.membersMeta) {
    Object.keys(cmpMeta.membersMeta).forEach(memberName => {
      const memberMeta = cmpMeta.membersMeta[memberName];
      if (memberMeta.memberType === MEMBER_TYPE.PropConnect) {
        sourceStrings.push({
          str: memberMeta.ctrlId,
          filePath: filePath
        });
      }
    });
  }
}
