import * as d from '../../../declarations';
import { gatherVdomMeta } from '../static-to-meta/vdom';
import { H } from '../core-runtime-apis';
import ts from 'typescript';


export const parseCallExpression = (m: d.Module | d.ComponentCompilerMeta, node: ts.CallExpression) => {
  if (node.arguments != null && node.arguments.length > 0) {

    if (node.expression.kind === ts.SyntaxKind.Identifier) {
      // h('tag')
      visitCallExpressionArgs(m, node.expression as ts.Identifier, node.arguments);

    } else if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      // document.createElement('tag')
      if ((node.expression as ts.PropertyAccessExpression).name) {
        visitCallExpressionArgs(m, (node.expression as ts.PropertyAccessExpression).name as ts.Identifier, node.arguments);
      }
    }
  }
};


const visitCallExpressionArgs = (m: d.Module | d.ComponentCompilerMeta, callExpressionName: ts.Identifier, args: ts.NodeArray<ts.Expression>) => {
  const fnName = callExpressionName.escapedText as string;

  if (fnName === 'h' || fnName === H || fnName === 'createElement') {
    visitCallExpressionArg(m, args[0]);

    if (fnName === 'h' || fnName === H) {
      gatherVdomMeta(m, args);
    }

  } else if (args.length > 1 && fnName === 'createElementNS') {
    visitCallExpressionArg(m, args[1]);
  }
};


const visitCallExpressionArg = (m: d.Module | d.ComponentCompilerMeta, arg: ts.Expression) => {
  if (arg.kind === ts.SyntaxKind.StringLiteral) {
    let tag = (arg as ts.StringLiteral).text;

    if (typeof tag === 'string') {
      tag = tag.toLowerCase();
      m.htmlTagNames.push(tag);

      if (tag.includes('-')) {
        m.potentialCmpRefs.push(tag);
      }
    }
  }
};
