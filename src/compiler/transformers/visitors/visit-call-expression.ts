import * as d from '../../../declarations';
import { gatherVdomMeta } from '../static-to-meta/vdom';
import ts from 'typescript';


export function visitCallExpression(moduleFile: d.Module, node: ts.CallExpression) {
  if (node.arguments != null && node.arguments.length > 0) {

    if (node.expression.kind === ts.SyntaxKind.Identifier) {
      // h('tag')
      visitCallExpressionArgs(moduleFile, node.expression as ts.Identifier, node.arguments);

    } else if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      // document.createElement('tag')
      if ((node.expression as ts.PropertyAccessExpression).name) {
        visitCallExpressionArgs(moduleFile, (node.expression as ts.PropertyAccessExpression).name as ts.Identifier, node.arguments);
      }
    }
  }
}


function visitCallExpressionArgs(moduleFile: d.Module, callExpressionName: ts.Identifier, args: ts.NodeArray<ts.Expression>) {
  const fnName = callExpressionName.escapedText as string;

  if (fnName === 'h' || fnName === 'createElement') {
    visitCallExpressionArg(moduleFile, args[0]);

    if (fnName === 'h') {
      gatherVdomMeta(moduleFile, args);
    }

  } else if (args.length > 1 && fnName === 'createElementNS') {
    visitCallExpressionArg(moduleFile, args[1]);
  }
}


function visitCallExpressionArg(moduleFile: d.Module, arg: ts.Expression) {
  if (arg.kind === ts.SyntaxKind.StringLiteral) {
    let tag = (arg as ts.StringLiteral).text;

    if (typeof tag === 'string') {
      tag = tag.toLowerCase();
      if (!moduleFile.htmlTagNames.includes(tag)) {
        moduleFile.htmlTagNames.push(tag);
      }

      if (tag.includes('-')) {
        if (!moduleFile.potentialCmpRefs.some(cr => cr.tag === tag)) {
          moduleFile.potentialCmpRefs.push({
            tag: tag
          });
        }
      }
    }
  }
}
