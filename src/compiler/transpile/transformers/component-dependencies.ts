import { BuildCtx, CompilerCtx, PotentialComponentRef } from '../../../declarations';
import { MEMBER_TYPE } from '../../../util/constants';
import { normalizePath } from '../../util';
import * as ts from 'typescript';


export function componentDependencies(compilerCtx: CompilerCtx, buildCtx: BuildCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(node: ts.Node, filePath: string): ts.VisitResult<ts.Node> {
      if (node.kind === ts.SyntaxKind.CallExpression) {
        callExpression(buildCtx, filePath, node as ts.CallExpression);

      } else if (node.kind === ts.SyntaxKind.StringLiteral) {
        stringLiteral(buildCtx, filePath, node as ts.StringLiteral);
      }

      return ts.visitEachChild(node, (node) => {
        return visit(node, filePath);
      }, transformContext);
    }

    return (tsSourceFile) => {
      const filePath = normalizePath(tsSourceFile.fileName);

      addPropConnects(compilerCtx, buildCtx.componentRefs, filePath);

      return visit(tsSourceFile, filePath) as ts.SourceFile;
    };
  };
}


function addPropConnects(compilerCtx: CompilerCtx, sourceStrings: PotentialComponentRef[], filePath: string) {
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
          tag: memberMeta.ctrlId,
          filePath: filePath
        });
      }
    });
  }
}


function callExpression(buildCtx: BuildCtx, filePath: string, node: ts.CallExpression) {
  if (node.arguments && node.arguments[0]) {

    if (node.expression.kind === ts.SyntaxKind.Identifier) {
      // h('tag')
      callExpressionArg(buildCtx, filePath, node.expression as ts.Identifier, node.arguments);

    } else if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      // document.createElement('tag')
      if ((node.expression as ts.PropertyAccessExpression).name) {
        // const
        callExpressionArg(buildCtx, filePath, (node.expression as ts.PropertyAccessExpression).name as ts.Identifier, node.arguments);
      }
    }
  }
}


function callExpressionArg(buildCtx: BuildCtx, filePath: string, callExpressionName: ts.Identifier, args: ts.NodeArray<ts.Expression>) {
  if (TAG_CALL_EXPRESSIONS.includes(callExpressionName.escapedText as string)) {

    if (args[0].kind === ts.SyntaxKind.StringLiteral) {
      const tag = (args[0] as ts.StringLiteral).text;

      if (typeof tag === 'string') {
        buildCtx.componentRefs.push({
          tag: tag,
          filePath: filePath
        });
      }
    }
  }
}


function stringLiteral(buildCtx: BuildCtx, filePath: string, node: ts.StringLiteral) {
  if (typeof node.text === 'string' && node.text.includes('<')) {
    buildCtx.componentRefs.push({
      html: node.text,
      filePath: filePath
    });
  }
}


const TAG_CALL_EXPRESSIONS = [
  'h',
  'createElement',
  'createElementNS'
];
