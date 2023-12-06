import ts from 'typescript';
import { H } from '../core-runtime-apis';
import { gatherVdomMeta } from './vdom';
export const parseCallExpression = (m, node) => {
    if (node.arguments != null && node.arguments.length > 0) {
        if (ts.isIdentifier(node.expression)) {
            // h('tag')
            visitCallExpressionArgs(m, node.expression, node.arguments);
        }
        else if (ts.isPropertyAccessExpression(node.expression)) {
            // document.createElement('tag')
            const n = node.expression.name;
            if (ts.isIdentifier(n) && n) {
                visitCallExpressionArgs(m, n, node.arguments);
            }
        }
    }
};
const visitCallExpressionArgs = (m, callExpressionName, args) => {
    const fnName = callExpressionName.escapedText;
    if (fnName === 'h' || fnName === H || fnName === 'createElement') {
        visitCallExpressionArg(m, args[0]);
        if (fnName === 'h' || fnName === H) {
            gatherVdomMeta(m, args);
        }
    }
    else if (args.length > 1 && fnName === 'createElementNS') {
        visitCallExpressionArg(m, args[1]);
    }
    else if (fnName === 'require' && args.length > 0 && m.originalImports) {
        const arg = args[0];
        if (ts.isStringLiteral(arg)) {
            if (!m.originalImports.includes(arg.text)) {
                m.originalImports.push(arg.text);
            }
        }
    }
};
const visitCallExpressionArg = (m, arg) => {
    if (ts.isStringLiteral(arg)) {
        let tag = arg.text;
        if (typeof tag === 'string') {
            tag = tag.toLowerCase();
            m.htmlTagNames.push(tag);
            if (tag.includes('-')) {
                m.potentialCmpRefs.push(tag);
            }
        }
    }
};
//# sourceMappingURL=call-expression.js.map