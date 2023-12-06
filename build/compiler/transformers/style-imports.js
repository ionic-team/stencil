import ts from 'typescript';
import { serializeImportPath } from './stencil-import-path';
import { retrieveTsModifiers } from './transform-utils';
export const updateStyleImports = (transformOpts, tsSourceFile, moduleFile) => {
    // add style imports built from @Component() styleUrl option
    if (transformOpts.module === 'cjs') {
        return updateCjsStyleRequires(transformOpts, tsSourceFile, moduleFile);
    }
    return updateEsmStyleImports(transformOpts, tsSourceFile, moduleFile);
};
const updateEsmStyleImports = (transformOpts, tsSourceFile, moduleFile) => {
    const styleImports = [];
    let statements = tsSourceFile.statements.slice();
    let updateSourceFile = false;
    moduleFile.cmps.forEach((cmp) => {
        cmp.styles.forEach((style) => {
            if (typeof style.styleIdentifier === 'string') {
                updateSourceFile = true;
                if (style.externalStyles.length > 0) {
                    // add style imports built from @Component() styleUrl option
                    styleImports.push(createEsmStyleImport(transformOpts, tsSourceFile, cmp, style));
                }
                else {
                    // update existing esm import of a style identifier
                    statements = updateEsmStyleImportPath(transformOpts, tsSourceFile, statements, cmp, style);
                }
            }
        });
    });
    if (updateSourceFile) {
        let lastImportIndex = -1;
        for (let i = 0; i < statements.length; i++) {
            if (ts.isImportDeclaration(statements[i])) {
                lastImportIndex = i;
            }
        }
        statements.splice(lastImportIndex + 1, 0, ...styleImports);
        return ts.factory.updateSourceFile(tsSourceFile, statements);
    }
    return tsSourceFile;
};
const updateEsmStyleImportPath = (transformOpts, tsSourceFile, statements, cmp, style) => {
    for (let i = 0; i < statements.length; i++) {
        const n = statements[i];
        if (ts.isImportDeclaration(n) && n.importClause && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
            if (n.importClause.name && n.importClause.name.escapedText === style.styleIdentifier) {
                const orgImportPath = n.moduleSpecifier.text;
                const importPath = getStyleImportPath(transformOpts, tsSourceFile, cmp, style, orgImportPath);
                statements[i] = ts.factory.updateImportDeclaration(n, retrieveTsModifiers(n), n.importClause, ts.factory.createStringLiteral(importPath), undefined);
                break;
            }
        }
    }
    return statements;
};
const createEsmStyleImport = (transformOpts, tsSourceFile, cmp, style) => {
    const importName = ts.factory.createIdentifier(style.styleIdentifier);
    const importPath = getStyleImportPath(transformOpts, tsSourceFile, cmp, style, style.externalStyles[0].absolutePath);
    return ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, importName, undefined), ts.factory.createStringLiteral(importPath));
};
const updateCjsStyleRequires = (transformOpts, tsSourceFile, moduleFile) => {
    const styleRequires = [];
    moduleFile.cmps.forEach((cmp) => {
        cmp.styles.forEach((style) => {
            if (typeof style.styleIdentifier === 'string' && style.externalStyles.length > 0) {
                // add style imports built from @Component() styleUrl option
                styleRequires.push(createCjsStyleRequire(transformOpts, tsSourceFile, cmp, style));
            }
        });
    });
    if (styleRequires.length > 0) {
        return ts.factory.updateSourceFile(tsSourceFile, [...styleRequires, ...tsSourceFile.statements]);
    }
    return tsSourceFile;
};
const createCjsStyleRequire = (transformOpts, tsSourceFile, cmp, style) => {
    const importName = ts.factory.createIdentifier(style.styleIdentifier);
    const importPath = getStyleImportPath(transformOpts, tsSourceFile, cmp, style, style.externalStyles[0].absolutePath);
    return ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(importName, undefined, undefined, ts.factory.createCallExpression(ts.factory.createIdentifier('require'), [], [ts.factory.createStringLiteral(importPath)])),
    ], ts.NodeFlags.Const));
};
const getStyleImportPath = (transformOpts, tsSourceFile, cmp, style, importPath) => {
    const importData = {
        importeePath: importPath,
        importerPath: tsSourceFile.fileName,
        tag: cmp.tagName,
        encapsulation: cmp.encapsulation,
        mode: style.modeName,
    };
    return serializeImportPath(importData, transformOpts.styleImportData);
};
//# sourceMappingURL=style-imports.js.map