import { dirname } from 'path';
import ts from 'typescript';
import { getModuleLegacy, resetModuleLegacy } from '../../build/compiler-ctx';
import { parseCallExpression } from './call-expression';
import { parseStaticComponentMeta } from './component';
import { parseModuleImport } from './import';
import { parseStringLiteral } from './string-literal';
export const convertStaticToMeta = (config, compilerCtx, buildCtx, typeChecker, collection, transformOpts) => {
    return (transformCtx) => {
        let dirPath;
        let moduleFile;
        const visitNode = (node) => {
            if (ts.isClassDeclaration(node)) {
                return parseStaticComponentMeta(compilerCtx, typeChecker, node, moduleFile, transformOpts);
            }
            else if (ts.isImportDeclaration(node)) {
                parseModuleImport(config, compilerCtx, buildCtx, moduleFile, dirPath, node, !transformOpts.isolatedModules);
            }
            else if (ts.isCallExpression(node)) {
                parseCallExpression(moduleFile, node);
            }
            else if (ts.isStringLiteral(node)) {
                parseStringLiteral(moduleFile, node);
            }
            return ts.visitEachChild(node, visitNode, transformCtx);
        };
        return (tsSourceFile) => {
            dirPath = dirname(tsSourceFile.fileName);
            moduleFile = getModuleLegacy(compilerCtx, tsSourceFile.fileName);
            resetModuleLegacy(moduleFile);
            if (collection != null) {
                moduleFile.isCollectionDependency = true;
                moduleFile.collectionName = collection.collectionName;
                collection.moduleFiles.push(moduleFile);
            }
            else {
                moduleFile.isCollectionDependency = false;
                moduleFile.collectionName = null;
            }
            return visitNode(tsSourceFile);
        };
    };
};
//# sourceMappingURL=visitor.js.map