import type * as d from '../../declarations';
import { basename, dirname, join, relative } from 'path';
import { BuildContext } from '../build/build-ctx';
import { getRollupOptions } from './bundle-output';
import { OutputOptions, PartialResolvedId, rollup } from 'rollup';
import { generatePreamble } from '@utils';
import { InMemoryFileSystem } from '../sys/in-memory-fs';

export const devNodeModuleResolveId = async (
  config: d.Config,
  inMemoryFs: InMemoryFileSystem,
  resolvedId: PartialResolvedId,
  importee: string
) => {
  if (!shouldCheckDevModule(resolvedId, importee)) {
    return resolvedId;
  }
  const resolvedPath = resolvedId.id;

  const pkgPath = getPackageJsonPath(resolvedPath, importee);
  if (!pkgPath) {
    return resolvedId;
  }

  const pkgJsonStr = await inMemoryFs.readFile(pkgPath);
  if (!pkgJsonStr) {
    return resolvedId;
  }

  let pkgJsonData: d.PackageJsonData;
  try {
    pkgJsonData = JSON.parse(pkgJsonStr);
  } catch (e) {}

  if (!pkgJsonData || !pkgJsonData.version) {
    return resolvedId;
  }

  resolvedId.id = serializeDevNodeModuleUrl(config, pkgJsonData.name, pkgJsonData.version, resolvedPath);
  resolvedId.external = true;

  return resolvedId;
};

const getPackageJsonPath = (resolvedPath: string, importee: string): string => {
  let currentPath = resolvedPath;
  for (let i = 0; i < 10; i++) {
    currentPath = dirname(currentPath);
    const aBasename = basename(currentPath);

    const upDir = dirname(currentPath);
    const bBasename = basename(upDir);
    if (aBasename === importee && bBasename === 'node_modules') {
      return join(currentPath, 'package.json');
    }
  }
  return null;
};

export const compilerRequest = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  data: d.CompilerRequest
) => {
  const results: d.CompilerRequestResponse = {
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

      let cachePath: string = null;
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
    } else {
      results.content = `/* invalid dev module */`;
      results.status = 400;
      return results;
    }
  } catch (e: unknown) {
    if (e) {
      if (e instanceof Error && e.stack) {
        results.content = `/*\n${e.stack}\n*/`;
      } else {
        results.content = `/*\n${e}\n*/`;
      }
    }
    results.status = 500;
  }

  return results;
};

const bundleDevModule = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  parsedUrl: ParsedDevModuleUrl,
  results: d.CompilerRequestResponse
) => {
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

    const outputOpts: OutputOptions = {
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
    } else if (r && r.output && r.output.length > 0) {
      results.content = r.output[0].code;
      results.status = 200;
    }
  } catch (e) {
    results.status = 500;
    const errorMsg = e instanceof Error ? e.stack : e + '';
    results.content = `console.error(${JSON.stringify(errorMsg)})`;
  }
};

const useDevModuleCache = async (config: d.Config, p: string) => {
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

const writeCachedFile = async (config: d.Config, results: d.CompilerRequestResponse) => {
  try {
    await config.sys.createDir(config.cacheDir);
    config.sys.writeFile(results.cachePath, results.content);
  } catch (e) {
    console.error(e);
  }
};

const serializeDevNodeModuleUrl = (config: d.Config, moduleId: string, moduleVersion: string, resolvedPath: string) => {
  resolvedPath = relative(config.rootDir, resolvedPath);

  let id = `/${DEV_MODULE_DIR}/`;
  id += encodeURIComponent(moduleId) + '@';
  id += encodeURIComponent(moduleVersion) + '.js';
  id += '?p=' + encodeURIComponent(resolvedPath);
  return id;
};

const parseDevModuleUrl = (config: d.Config, u: string) => {
  const parsedUrl: ParsedDevModuleUrl = {
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

const getDevModuleCachePath = (config: d.Config, parsedUrl: ParsedDevModuleUrl) => {
  return join(
    config.cacheDir,
    `dev_module_${parsedUrl.nodeModuleId}_${parsedUrl.nodeModuleVersion}_${DEV_MODULE_CACHE_BUSTER}.log`
  );
};

const DEV_MODULE_CACHE_BUSTER = 0;

const DEV_MODULE_DIR = `~dev-module`;

const shouldCheckDevModule = (resolvedId: PartialResolvedId, importee: string) =>
  resolvedId &&
  importee &&
  resolvedId.id &&
  resolvedId.id.includes('node_modules') &&
  (resolvedId.id.endsWith('.js') || resolvedId.id.endsWith('.mjs')) &&
  !resolvedId.external &&
  !importee.startsWith('.') &&
  !importee.startsWith('/');

interface ParsedDevModuleUrl {
  nodeModuleId: string;
  nodeModuleVersion: string;
  nodeResolvedPath: string;
}
