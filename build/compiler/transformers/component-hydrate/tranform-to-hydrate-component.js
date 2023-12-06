import ts from 'typescript';
import { addImports } from '../add-imports';
import { addLegacyApis } from '../core-runtime-apis';
import { updateStyleImports } from '../style-imports';
import { getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { updateHydrateComponentClass } from './hydrate-component';
export const hydrateComponentTransform = (compilerCtx, transformOpts) => {
    return (transformCtx) => {
        return (tsSourceFile) => {
            const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
            const visitNode = (node) => {
                if (ts.isClassDeclaration(node)) {
                    const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
                    if (cmp != null) {
                        return updateHydrateComponentClass(node, moduleFile, cmp);
                    }
                }
                return ts.visitEachChild(node, visitNode, transformCtx);
            };
            tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
            if (moduleFile.cmps.length > 0) {
                tsSourceFile = updateStyleImports(transformOpts, tsSourceFile, moduleFile);
            }
            if (moduleFile.isLegacy) {
                addLegacyApis(moduleFile);
            }
            tsSourceFile = addImports(transformOpts, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);
            return tsSourceFile;
        };
    };
};
//# sourceMappingURL=tranform-to-hydrate-component.js.map