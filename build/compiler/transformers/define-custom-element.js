import { formatComponentRuntimeMeta } from '@utils';
import ts from 'typescript';
import { addCoreRuntimeApi, DEFINE_CUSTOM_ELEMENT, RUNTIME_APIS } from './core-runtime-apis';
import { convertValueToLiteral } from './transform-utils';
export const defineCustomElement = (tsSourceFile, moduleFile, transformOpts) => {
    let statements = tsSourceFile.statements.slice();
    statements.push(...moduleFile.cmps.map((cmp) => {
        return addDefineCustomElement(moduleFile, cmp);
    }));
    if (transformOpts.module === 'cjs') {
        // remove commonjs exports keyword from component classes
        statements = removeComponentCjsExport(statements, moduleFile);
    }
    return ts.factory.updateSourceFile(tsSourceFile, statements);
};
const addDefineCustomElement = (moduleFile, compilerMeta) => {
    if (compilerMeta.isPlain) {
        // add customElements.define('cmp-a', CmpClass);
        return ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('customElements'), ts.factory.createIdentifier('define')), [], [
            ts.factory.createStringLiteral(compilerMeta.tagName),
            ts.factory.createIdentifier(compilerMeta.componentClassName),
        ]));
    }
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.defineCustomElement);
    const compactMeta = formatComponentRuntimeMeta(compilerMeta, true);
    const liternalCmpClassName = ts.factory.createIdentifier(compilerMeta.componentClassName);
    const liternalMeta = convertValueToLiteral(compactMeta);
    return ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createIdentifier(DEFINE_CUSTOM_ELEMENT), [], [liternalCmpClassName, liternalMeta]));
};
const removeComponentCjsExport = (statements, moduleFile) => {
    const cmpClassNames = new Set(moduleFile.cmps.map((cmp) => cmp.componentClassName));
    return statements.filter((s) => {
        if (s.kind === ts.SyntaxKind.ExpressionStatement) {
            const exp = s.expression;
            if (exp && exp.kind === ts.SyntaxKind.BinaryExpression) {
                const left = exp.left;
                if (left && left.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    if (left.expression && left.expression.kind === ts.SyntaxKind.Identifier) {
                        const leftText = left.expression;
                        if (leftText.text === 'exports') {
                            const right = exp.right;
                            if (right && cmpClassNames.has(right.text)) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    });
};
//# sourceMappingURL=define-custom-element.js.map