import { BuildCtx, CompilerCtx } from '../../../declarations';
import { MEMBER_TYPE } from '../../../util/constants';
import { normalizePath } from '../../util';
import * as ts from 'typescript';


export function componentDependencies(compilerCtx: CompilerCtx, buildCtx: BuildCtx): ts.TransformerFactory<ts.SourceFile> {

  const allComponentTags = Object.keys(compilerCtx.moduleFiles)
    .map(filePath => compilerCtx.moduleFiles[filePath].cmpMeta)
    .filter(cmpMeta => cmpMeta && cmpMeta.tagNameMeta)
    .map(cmpMeta => cmpMeta.tagNameMeta);

  return (transformContext) => {

    function visit(node: ts.Node, filePath: string): ts.VisitResult<ts.Node> {
      if (node.kind === ts.SyntaxKind.CallExpression) {
        callExpression(buildCtx, allComponentTags, filePath, node as ts.CallExpression);

      } else if (node.kind === ts.SyntaxKind.StringLiteral) {
        stringLiteral(buildCtx, allComponentTags, filePath, node as ts.StringLiteral);
      }

      return ts.visitEachChild(node, (node) => {
        return visit(node, filePath);
      }, transformContext);
    }

    return (tsSourceFile) => {
      addPropConnects(compilerCtx, buildCtx, tsSourceFile.fileName);

      return visit(tsSourceFile, tsSourceFile.fileName) as ts.SourceFile;
    };
  };
}


function addPropConnects(compilerCtx: CompilerCtx, buildCtx: BuildCtx, filePath: string) {
  const moduleFile = compilerCtx.moduleFiles[filePath];

  const cmpMeta = (moduleFile && moduleFile.cmpMeta);
  if (!cmpMeta) {
    return;
  }

  if (cmpMeta.membersMeta) {
    Object.keys(cmpMeta.membersMeta).forEach(memberName => {
      const memberMeta = cmpMeta.membersMeta[memberName];
      if (memberMeta.memberType === MEMBER_TYPE.PropConnect) {
        buildCtx.componentRefs.push({
          tag: memberMeta.ctrlId,
          filePath: filePath
        });
      }
    });
  }
}


function callExpression(buildCtx: BuildCtx, allComponentTags: string[], filePath: string, node: ts.CallExpression) {
  if (node && node.arguments) {

    if (node.expression.kind === ts.SyntaxKind.Identifier) {
      // h('tag')
      callExpressionArg(buildCtx, allComponentTags, filePath, node.expression as ts.Identifier, node.arguments);

    } else if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      // document.createElement('tag')

      if ((node.expression as ts.PropertyAccessExpression).name) {
        // const
        callExpressionArg(buildCtx, allComponentTags, filePath, (node.expression as ts.PropertyAccessExpression).name as ts.Identifier, node.arguments);
      }
    }
  }
}


function callExpressionArg(buildCtx: BuildCtx, allComponentTags: string[], filePath: string, callExpressionName: ts.Identifier, args: ts.NodeArray<ts.Expression>) {
  if (TAG_CALL_EXPRESSIONS.includes(callExpressionName.escapedText as string)) {

    if (args[0] && args[0].kind === ts.SyntaxKind.StringLiteral) {
      addComponentReference(buildCtx, allComponentTags, filePath, (args[0] as ts.StringLiteral).text);
    }
  }
}


function stringLiteral(buildCtx: BuildCtx, allComponentTags: string[], filePath: string, node: ts.StringLiteral) {
  let t = node.text;

  if (typeof t === 'string' && t.includes('<')) {
    t = t.toLowerCase()
         .replace(/\s/g, '~');

    const foundTags = allComponentTags
      .filter(tag => {
        return t.includes('<' + tag + '>') ||
               t.includes('<' + tag + '~');
      });

    foundTags.forEach(foundTag => {
      addComponentReference(buildCtx, allComponentTags, filePath, foundTag);
    });
  }
}


function addComponentReference(buildCtx: BuildCtx, allComponentTags: string[], filePath: string, tag: string) {
  if (typeof tag === 'string') {
    tag = tag.toLowerCase().trim();

    if (allComponentTags.includes(tag)) {
      buildCtx.componentRefs.push({
        tag: tag,
        filePath: normalizePath(filePath)
      });
    }
  }
}


const TAG_CALL_EXPRESSIONS = [
  'h',
  'createElement',
  'createElementNS'
];
