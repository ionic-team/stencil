import { isString, join, normalizePath, resolve } from '@utils';
import { basename, dirname } from 'path';
import ts from 'typescript';
import { isDtsFile, isJsFile, isJsxFile, isTsFile, isTsxFile } from '../resolve/resolve-utils';
import { patchTsSystemFileSystem } from './typescript-sys';
export const tsResolveModuleName = (config, compilerCtx, moduleName, containingFile) => {
    const resolveModuleName = ts.__resolveModuleName || ts.resolveModuleName;
    if (moduleName && resolveModuleName && config.tsCompilerOptions) {
        const host = patchTsSystemFileSystem(config, config.sys, compilerCtx.fs, ts.sys);
        const compilerOptions = { ...config.tsCompilerOptions };
        compilerOptions.resolveJsonModule = true;
        return resolveModuleName(moduleName, containingFile, compilerOptions, host);
    }
    return null;
};
export const tsResolveModuleNamePackageJsonPath = (config, compilerCtx, moduleName, containingFile) => {
    try {
        const resolvedModule = tsResolveModuleName(config, compilerCtx, moduleName, containingFile);
        if (resolvedModule && resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName) {
            const rootDir = resolve('/');
            let resolvedFileName = resolvedModule.resolvedModule.resolvedFileName;
            for (let i = 0; i < 30; i++) {
                if (rootDir === resolvedFileName) {
                    return null;
                }
                resolvedFileName = dirname(resolvedFileName);
                const pkgJsonPath = join(resolvedFileName, 'package.json');
                const exists = config.sys.accessSync(pkgJsonPath);
                if (exists) {
                    return normalizePath(pkgJsonPath);
                }
            }
        }
    }
    catch (e) {
        config.logger.error(e);
    }
    return null;
};
export const ensureExtension = (fileName, containingFile) => {
    if (!basename(fileName).includes('.') && isString(containingFile)) {
        containingFile = containingFile.toLowerCase();
        if (isJsFile(containingFile)) {
            fileName += '.js';
        }
        else if (isDtsFile(containingFile)) {
            fileName += '.d.ts';
        }
        else if (isTsxFile(containingFile)) {
            fileName += '.tsx';
        }
        else if (isTsFile(containingFile)) {
            fileName += '.ts';
        }
        else if (isJsxFile(containingFile)) {
            fileName += '.jsx';
        }
    }
    return fileName;
};
//# sourceMappingURL=typescript-resolve-module.js.map