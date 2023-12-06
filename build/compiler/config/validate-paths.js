import { join, normalizePath } from '@utils';
import { isAbsolute } from 'path';
/**
 * Do logical-level validation (as opposed to type-level validation)
 * for various properties in the user-supplied config which represent
 * filesystem paths.
 *
 * @param config a validated user-supplied configuration
 * @returns an object holding the validated paths
 */
export const validatePaths = (config) => {
    const rootDir = typeof config.rootDir !== 'string' ? '/' : config.rootDir;
    let srcDir = typeof config.srcDir !== 'string' ? DEFAULT_SRC_DIR : config.srcDir;
    if (!isAbsolute(srcDir)) {
        srcDir = join(rootDir, srcDir);
    }
    let cacheDir = typeof config.cacheDir !== 'string' ? DEFAULT_CACHE_DIR : config.cacheDir;
    if (!isAbsolute(cacheDir)) {
        cacheDir = join(rootDir, cacheDir);
    }
    else {
        cacheDir = normalizePath(cacheDir);
    }
    let srcIndexHtml = typeof config.srcIndexHtml !== 'string' ? join(srcDir, DEFAULT_INDEX_HTML) : config.srcIndexHtml;
    if (!isAbsolute(srcIndexHtml)) {
        srcIndexHtml = join(rootDir, srcIndexHtml);
    }
    const packageJsonFilePath = join(rootDir, 'package.json');
    const validatedPaths = {
        rootDir,
        srcDir,
        cacheDir,
        srcIndexHtml,
        packageJsonFilePath,
    };
    if (typeof config.globalScript === 'string' && !isAbsolute(config.globalScript)) {
        validatedPaths.globalScript = join(rootDir, config.globalScript);
    }
    if (typeof config.globalStyle === 'string' && !isAbsolute(config.globalStyle)) {
        validatedPaths.globalStyle = join(rootDir, config.globalStyle);
    }
    if (config.writeLog) {
        validatedPaths.buildLogFilePath =
            typeof config.buildLogFilePath === 'string' ? config.buildLogFilePath : DEFAULT_BUILD_LOG_FILE_NAME;
        if (!isAbsolute(validatedPaths.buildLogFilePath)) {
            validatedPaths.buildLogFilePath = join(rootDir, config.buildLogFilePath);
        }
    }
    return validatedPaths;
};
const DEFAULT_BUILD_LOG_FILE_NAME = 'stencil-build.log';
const DEFAULT_CACHE_DIR = '.stencil';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_SRC_DIR = 'src';
//# sourceMappingURL=validate-paths.js.map