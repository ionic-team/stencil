import { isString, normalizeFsPath, normalizePath } from '@utils';
import { dirname } from 'path';
import resolve from 'resolve';
import { getPackageDirPath } from './resolve-utils';
export const resolveModuleIdAsync = (sys, inMemoryFs, opts) => {
    const resolverOpts = createCustomResolverAsync(sys, inMemoryFs, opts.exts);
    resolverOpts.basedir = dirname(normalizeFsPath(opts.containingFile));
    if (opts.packageFilter) {
        resolverOpts.packageFilter = opts.packageFilter;
    }
    else if (opts.packageFilter !== null) {
        resolverOpts.packageFilter = (pkg) => {
            if (!isString(pkg.main) || pkg.main === '') {
                pkg.main = 'package.json';
            }
            return pkg;
        };
    }
    return new Promise((resolvePromise, rejectPromise) => {
        resolve(opts.moduleId, resolverOpts, (err, resolveId, pkgData) => {
            if (err) {
                rejectPromise(err);
            }
            else {
                resolveId = normalizePath(resolveId);
                const results = {
                    moduleId: opts.moduleId,
                    resolveId,
                    pkgData,
                    pkgDirPath: getPackageDirPath(resolveId, opts.moduleId),
                };
                resolvePromise(results);
            }
        });
    });
};
export const createCustomResolverAsync = (sys, inMemoryFs, exts) => {
    return {
        async isFile(filePath, cb) {
            const fsFilePath = normalizeFsPath(filePath);
            const stat = await inMemoryFs.stat(fsFilePath);
            if (stat.isFile) {
                cb(null, true);
                return;
            }
            cb(null, false);
        },
        async isDirectory(dirPath, cb) {
            const fsDirPath = normalizeFsPath(dirPath);
            const stat = await inMemoryFs.stat(fsDirPath);
            if (stat.isDirectory) {
                cb(null, true);
                return;
            }
            cb(null, false);
        },
        async readFile(p, cb) {
            const fsFilePath = normalizeFsPath(p);
            const data = await inMemoryFs.readFile(fsFilePath);
            if (isString(data)) {
                return cb(null, data);
            }
            return cb(`readFile not found: ${p}`);
        },
        async realpath(p, cb) {
            const fsFilePath = normalizeFsPath(p);
            const results = await sys.realpath(fsFilePath);
            if (results.error && results.error.code !== 'ENOENT') {
                cb(results.error);
            }
            else {
                cb(null, results.error ? fsFilePath : results.path);
            }
        },
        extensions: exts,
    };
};
//# sourceMappingURL=resolve-module-async.js.map