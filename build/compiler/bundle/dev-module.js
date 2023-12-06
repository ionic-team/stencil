import { generatePreamble, join, relative } from '@utils';
import { basename, dirname } from 'path';
import { rollup } from 'rollup';
import { BuildContext } from '../build/build-ctx';
import { getRollupOptions } from './bundle-output';
import { DEV_MODULE_CACHE_BUSTER, DEV_MODULE_DIR } from './constants';
export const compilerRequest = async (config, compilerCtx, data) => {
    const results = {
        path: data.path,
        nodeModuleId: null,
        nodeModuleVersion: null,
        nodeResolvedPath: null,
        cachePath: null,
        cacheHit: false,
        content: '',
        status: 404,
    };
    try {
        const parsedUrl = parseDevModuleUrl(config, data.path);
        Object.assign(results, parsedUrl);
        if (parsedUrl.nodeModuleId) {
            if (!parsedUrl.nodeModuleVersion) {
                results.content = `/* invalid module version */`;
                results.status = 400;
                return results;
            }
            if (!parsedUrl.nodeResolvedPath) {
                results.content = `/* invalid resolved path */`;
                results.status = 400;
                return results;
            }
            const useCache = await useDevModuleCache(config, parsedUrl.nodeResolvedPath);
            let cachePath = null;
            if (useCache) {
                cachePath = getDevModuleCachePath(config, parsedUrl);
                const cachedContent = await config.sys.readFile(cachePath);
                if (typeof cachedContent === 'string') {
                    results.content = cachedContent;
                    results.cachePath = cachePath;
                    results.cacheHit = true;
                    results.status = 200;
                    return results;
                }
            }
            await bundleDevModule(config, compilerCtx, parsedUrl, results);
            if (results.status === 200 && useCache) {
                results.cachePath = cachePath;
                writeCachedFile(config, results);
            }
        }
        else {
            results.content = `/* invalid dev module */`;
            results.status = 400;
            return results;
        }
    }
    catch (e) {
        if (e) {
            if (e instanceof Error && e.stack) {
                results.content = `/*\n${e.stack}\n*/`;
            }
            else {
                results.content = `/*\n${e}\n*/`;
            }
        }
        results.status = 500;
    }
    return results;
};
const bundleDevModule = async (config, compilerCtx, parsedUrl, results) => {
    const buildCtx = new BuildContext(config, compilerCtx);
    try {
        const inputOpts = getRollupOptions(config, compilerCtx, buildCtx, {
            id: parsedUrl.nodeModuleId,
            platform: 'client',
            inputs: {
                index: parsedUrl.nodeResolvedPath,
            },
        });
        const rollupBuild = await rollup(inputOpts);
        const outputOpts = {
            banner: generatePreamble(config),
            format: 'es',
        };
        if (parsedUrl.nodeModuleId) {
            const commentPath = relative(config.rootDir, parsedUrl.nodeResolvedPath);
            outputOpts.intro = `/**\n * Dev Node Module: ${parsedUrl.nodeModuleId}, v${parsedUrl.nodeModuleVersion}\n * Entry: ${commentPath}\n * DEVELOPMENT PURPOSES ONLY!!\n */`;
            inputOpts.input = parsedUrl.nodeResolvedPath;
        }
        const r = await rollupBuild.generate(outputOpts);
        if (buildCtx.hasError) {
            results.status = 500;
            results.content = `console.error(${JSON.stringify(buildCtx.diagnostics)})`;
        }
        else if (r && r.output && r.output.length > 0) {
            results.content = r.output[0].code;
            results.status = 200;
        }
    }
    catch (e) {
        results.status = 500;
        const errorMsg = e instanceof Error ? e.stack : e + '';
        results.content = `console.error(${JSON.stringify(errorMsg)})`;
    }
};
const useDevModuleCache = async (config, p) => {
    if (config.enableCache) {
        for (let i = 0; i < 10; i++) {
            const n = basename(p);
            if (n === 'node_modules') {
                return true;
            }
            const isSymbolicLink = await config.sys.isSymbolicLink(p);
            if (isSymbolicLink) {
                return false;
            }
            p = dirname(p);
        }
    }
    return false;
};
const writeCachedFile = async (config, results) => {
    try {
        await config.sys.createDir(config.cacheDir);
        config.sys.writeFile(results.cachePath, results.content);
    }
    catch (e) {
        console.error(e);
    }
};
const parseDevModuleUrl = (config, u) => {
    const parsedUrl = {
        nodeModuleId: null,
        nodeModuleVersion: null,
        nodeResolvedPath: null,
    };
    if (u && u.includes(DEV_MODULE_DIR) && u.endsWith('.js')) {
        const url = new URL(u, 'https://stenciljs.com');
        let reqPath = basename(url.pathname);
        reqPath = reqPath.substring(0, reqPath.length - 3);
        const splt = reqPath.split('@');
        if (splt.length === 2) {
            parsedUrl.nodeModuleId = decodeURIComponent(splt[0]);
            parsedUrl.nodeModuleVersion = decodeURIComponent(splt[1]);
            parsedUrl.nodeResolvedPath = url.searchParams.get('p');
            if (parsedUrl.nodeResolvedPath) {
                parsedUrl.nodeResolvedPath = decodeURIComponent(parsedUrl.nodeResolvedPath);
                parsedUrl.nodeResolvedPath = join(config.rootDir, parsedUrl.nodeResolvedPath);
            }
        }
    }
    return parsedUrl;
};
const getDevModuleCachePath = (config, parsedUrl) => {
    return join(config.cacheDir, `dev_module_${parsedUrl.nodeModuleId}_${parsedUrl.nodeModuleVersion}_${DEV_MODULE_CACHE_BUSTER}.log`);
};
//# sourceMappingURL=dev-module.js.map