import * as d from '../../../declarations';
import { gatherVdomMeta } from '../static-to-meta/vdom';
import ts from 'typescript';
import { H } from '../exports';


export function parseCallExpression(cmpMeta: d.ComponentCompilerMeta, node: ts.CallExpression) {
  if (node.arguments != null && node.arguments.length > 0) {

    if (node.expression.kind === ts.SyntaxKind.Identifier) {
      // h('tag')
      visitCallExpressionArgs(cmpMeta, node.expression as ts.Identifier, node.arguments);

    } else if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      // document.createElement('tag')
      if ((node.expression as ts.PropertyAccessExpression).name) {
        visitCallExpressionArgs(cmpMeta, (node.expression as ts.PropertyAccessExpression).name as ts.Identifier, node.arguments);
      }
    }
  }
}


function visitCallExpressionArgs(cmpMeta: d.ComponentCompilerMeta, callExpressionName: ts.Identifier, args: ts.NodeArray<ts.Expression>) {
  const fnName = callExpressionName.escapedText as string;

  if (fnName === 'h' || fnName === H || fnName === 'createElement') {
    visitCallExpressionArg(cmpMeta, args[0]);

    if (fnName === 'h' || fnName === H) {
      gatherVdomMeta(cmpMeta, args);
    }

  } else if (args.length > 1 && fnName === 'createElementNS') {
    visitCallExpressionArg(cmpMeta, args[1]);
  }
}


function visitCallExpressionArg(cmpMeta: d.ComponentCompilerMeta, arg: ts.Expression) {
  if (arg.kind === ts.SyntaxKind.StringLiteral) {
    let tag = (arg as ts.StringLiteral).text;

    if (typeof tag === 'string') {
      tag = tag.toLowerCase();
      if (!cmpMeta.htmlTagNames.includes(tag)) {
        cmpMeta.htmlTagNames.push(tag);
      }

      if (tag.includes('-')) {
        if (!cmpMeta.potentialCmpRefs.some(cr => cr.tag === tag)) {
          cmpMeta.potentialCmpRefs.push({
            tag: tag
          });
        }
      }
    }
  }
}
