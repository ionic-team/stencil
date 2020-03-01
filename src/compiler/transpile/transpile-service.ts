import * as d from '../../declarations';
import { addExternalImportLegacy } from '../transformers/collections/add-external-import';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import { getComponentsDtsSrcFilePath } from '../output-targets/output-utils';
import { getModuleLegacy } from '../build/compiler-ctx';
import { getUserCompilerOptions } from './compiler-options';
import { loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import minimatch from 'minimatch';
import ts from 'typescript';


export const transpileService = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  let changedTsFiles: string[];

  if (shouldScanForTsChanges(compilerCtx, buildCtx)) {
    // either we haven't figured out all the root ts files yet
    // or we already know we need to do a full rebuild
    // or new files were added or deleted
    // so let's scan the entire src directory looking for ts files to transpile
    // rootTsFiles always used as a way to know the active modules being used
    // basically so our cache knows which stuff we can forget about
    compilerCtx.rootTsFiles = await scanDirForTsFiles(config, compilerCtx, buildCtx);
    changedTsFiles = compilerCtx.rootTsFiles.slice();

  } else {
    changedTsFiles = buildCtx.filesChanged.filter(filePath => {
      // do transpiling if one of the changed files is a ts file
      // and the changed file is not the components.d.ts file
      // when the components.d.ts file is written to disk it shouldn't cause a new build
      return isFileIncludePath(config, filePath);
    });
  }

  if (compilerCtx.tsService == null) {
    // create the typescript language service
    compilerCtx.tsService = await buildTsService(config, compilerCtx, buildCtx);
  }

  const doTranspile = (changedTsFiles.length > 0);
  if (doTranspile) {
    // we've found ts files we need to tranpsile
    // or at least one ts file has changed
    const timeSpan = buildCtx.createTimeSpan(`transpile started`);

    // only use the file system cache when it's enabled and this is the first build
    const useFsCache = config.enableCache && !buildCtx.isRebuild;

    // go ahead and kick off the ts service
    const changedContent = await compilerCtx.tsService(compilerCtx, buildCtx, changedTsFiles, true, useFsCache);

    timeSpan.finish(`transpile finished`);
    return changedContent;
  }

  return false;
};


const buildTsService = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const transpileCtx: TranspileContext = {
    compilerCtx: compilerCtx,
    buildCtx: buildCtx,
    configKey: null,
    snapshotVersions: new Map<string, string>(),
    filesFromFsCache: [],
    hasQueuedTsServicePrime: false
  };

  const userCompilerOptions = await getUserCompilerOptions(config, transpileCtx.compilerCtx, transpileCtx.buildCtx);
  const compilerOptions = Object.assign({}, userCompilerOptions) as ts.CompilerOptions;

  compilerOptions.isolatedModules = false;
  compilerOptions.suppressOutputPathCheck = true;
  compilerOptions.allowNonTsExtensions = true;
  compilerOptions.removeComments = false;
  compilerOptions.sourceMap = false;
  compilerOptions.lib = undefined;
  compilerOptions.types = undefined;
  compilerOptions.noEmit = undefined;
  compilerOptions.noEmitOnError = undefined;
  compilerOptions.rootDirs = undefined;
  compilerOptions.declaration = undefined;
  compilerOptions.declarationDir = undefined;
  compilerOptions.out = undefined;
  compilerOptions.outFile = undefined;
  compilerOptions.outDir = undefined;

  // create a config key that will be used as part of the file's cache key
  transpileCtx.configKey = await createConfigKey(config, compilerOptions);

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => transpileCtx.compilerCtx.rootTsFiles,
    getScriptVersion: (filePath) => transpileCtx.snapshotVersions.get(filePath),
    getScriptSnapshot: (filePath) => {
      try {
        const sourceText = transpileCtx.compilerCtx.fs.readFileSync(filePath);
        return ts.ScriptSnapshot.fromString(sourceText);
      } catch (e) {}
      return undefined;
    },
    getCurrentDirectory: () => config.cwd,
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: (filePath) => transpileCtx.compilerCtx.fs.accessSync(filePath),
    readFile: (filePath) => {
      try {
        return transpileCtx.compilerCtx.fs.readFileSync(filePath);
      } catch (e) {}
      return undefined;
    },
    readDirectory: ts.sys.readDirectory,
    getCustomTransformers: () => {
      const typeChecker = services.getProgram().getTypeChecker();

      const transformOpts: d.TransformOptions = {
        coreImportPath: '@stencil/core',
        componentExport: null,
        componentMetadata: null,
        currentDirectory: config.cwd,
        proxy: null,
        style: 'static',
      };

      return {
        before: [
          convertDecoratorsToStatic(config, transpileCtx.buildCtx.diagnostics, typeChecker),
          updateStencilCoreImports(transformOpts.coreImportPath)
        ],
        after: [
          convertStaticToMeta(config, transpileCtx.compilerCtx, transpileCtx.buildCtx, typeChecker, null, transformOpts)
        ]
      };
    }
  };

  // create our typescript language service to be reused
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

  // return the function we'll continually use on each rebuild
  return async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => {
    transpileCtx.compilerCtx = compilerCtx;
    transpileCtx.buildCtx = buildCtx;

    const cmpDts = getComponentsDtsSrcFilePath(config);
    if (!tsFilePaths.includes(cmpDts)) {
      tsFilePaths.push(cmpDts);
    }
    tsFilePaths = tsFilePaths.filter(tsFilePath => tsFilePath !== cmpDts);

    // loop through each ts file that has changed
    const changedContent = await Promise.all(tsFilePaths.map(tsFilePath => {
      return transpileTsFile(config, services, transpileCtx, tsFilePath, checkCacheKey, useFsCache);
    }));

    if (config.watch && !transpileCtx.hasQueuedTsServicePrime) {
      // prime the ts service cache for all the ts files pulled from the file system cache
      transpileCtx.hasQueuedTsServicePrime = true;
      primeTsServiceCache(transpileCtx);
    }
    return changedContent.some(Boolean);
  };
};


interface TranspileContext {
  compilerCtx: d.CompilerCtx;
  buildCtx: d.BuildCtx;
  configKey: string;
  snapshotVersions: Map<string, string>;
  filesFromFsCache: string[];
  hasQueuedTsServicePrime: boolean;
}


const transpileTsFile = async (config: d.Config, services: ts.LanguageService, ctx: TranspileContext, sourceFilePath: string, checkCacheKey: boolean, useFsCache: boolean) => {
  if (ctx.buildCtx.hasError) {
    ctx.buildCtx.debug(`tranpsileTsFile aborted: ${sourceFilePath}`);
    return false;
  }

  const hasWarning = ctx.buildCtx.hasWarning && !config._isTesting;

  // look up the old cache key using the ts file path
  const oldCacheKey = ctx.snapshotVersions.get(sourceFilePath);

  // read the file content to be transpiled
  const content = await ctx.compilerCtx.fs.readFile(sourceFilePath);

  // create a cache key out of the content and compiler options
  const contentHash = await config.sys.generateContentHash(content + sourceFilePath + ctx.configKey, 32);
  const cacheKey = `transpileService_${contentHash}` ;

  if (oldCacheKey === cacheKey && checkCacheKey && !hasWarning) {
    // file is unchanged, thanks typescript caching!
    return false;
  }

  // save the cache key for future lookups
  ctx.snapshotVersions.set(sourceFilePath, cacheKey);

  let ensureExternalImports: string[] = null;

  if (useFsCache && !hasWarning) {
    // let's check to see if we've already cached this in our filesystem
    // but only bother for the very first build
    const cachedStr = await ctx.compilerCtx.cache.get(cacheKey);
    if (cachedStr != null) {
      // remember which files we were able to get from cached versions
      // so we can later fully prime the ts service cache
      ctx.filesFromFsCache.push(sourceFilePath);

      // whoa cool, we found we already cached this in our filesystem
      const cachedModuleFile = JSON.parse(cachedStr) as CachedModuleFile;

      // and there you go, thanks fs cache!
      // put the cached module file data in our context
      ctx.compilerCtx.moduleMap.set(sourceFilePath, cachedModuleFile.moduleFile);

      // add any collections to the context which this cached file may know about
      cachedModuleFile.moduleFile.externalImports.forEach(moduleId => {
        addExternalImportLegacy(config, ctx.compilerCtx, ctx.buildCtx, cachedModuleFile.moduleFile, config.rootDir, moduleId);
      });

      // write the cached js output too
      await outputFile(ctx, cachedModuleFile.moduleFile.jsFilePath, cachedModuleFile.jsText);
      return true;
    }

  } else {
    // purposely not using the fs cache
    // this is probably when we want to prime the
    // in-memory ts cache after the first build has completed
    const existingModuleFile = ctx.compilerCtx.moduleMap.get(sourceFilePath);
    if (existingModuleFile && Array.isArray(existingModuleFile.externalImports)) {
      ensureExternalImports = existingModuleFile.externalImports.slice();
    }
  }

  // let's do this!
  const output = services.getEmitOutput(sourceFilePath);

  // keep track of how many files we transpiled (great for debugging/testing)
  ctx.buildCtx.transpileBuildCount++;

  if (output.emitSkipped) {
    // oh no! we've got some typescript diagnostics for this file!
    const tsDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(sourceFilePath));

    ctx.buildCtx.diagnostics.push(
      ...loadTypeScriptDiagnostics(tsDiagnostics)
    );

    return false;
  }

  const changedContent = await Promise.all(output.outputFiles.map(async tsOutput => {
    const outputFilePath = normalizePath(tsOutput.name);

    if (ctx.buildCtx.hasError) {
      ctx.buildCtx.debug(`transpileTsFile write aborted: ${sourceFilePath}`);
      return false;
    }

    if (outputFilePath.endsWith('.js')) {
      // this is the JS output of the typescript file transpiling
      const moduleFile = getModuleLegacy(config, ctx.compilerCtx, sourceFilePath);
      if (Array.isArray(ensureExternalImports)) {
        ensureExternalImports.forEach(moduleId => {
          addExternalImportLegacy(config, ctx.compilerCtx, ctx.buildCtx, moduleFile, config.rootDir, moduleId);
        });
      }

      if (config.enableCache && !hasWarning) {
        // cache this module file and js text for later
        const cacheModuleFile: CachedModuleFile = {
          moduleFile: moduleFile,
          jsText: tsOutput.text
        };

        // let's turn our data into a string to be cached for later fs lookups
        const cachedStr = JSON.stringify(cacheModuleFile);
        await ctx.compilerCtx.cache.put(cacheKey, cachedStr);
      }
    }

    // write the text to our in-memory fs and output targets
    return outputFile(ctx, outputFilePath, tsOutput.text);
  }));
  return changedContent.some(Boolean);
};


const outputFile = async (ctx: TranspileContext, outputFilePath: string, outputText: string) => {
  // the in-memory .js version is be virtually next to the source ts file
  // but it never actually gets written to disk, just there in spirit
  const { changedContent } = await ctx.compilerCtx.fs.writeFile(
    outputFilePath,
    outputText,
    { inMemoryOnly: true }
  );
  return changedContent;
};


interface CachedModuleFile {
  moduleFile: d.Module;
  jsText: string;
}


const shouldScanForTsChanges = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!compilerCtx.rootTsFiles) {
    return true;
  }
  if (buildCtx.requiresFullBuild) {
    return true;
  }
  if (buildCtx.filesAdded.length > 0 || buildCtx.filesDeleted.length > 0) {
    return true;
  }
  if (buildCtx.dirsAdded.length > 0 || buildCtx.dirsDeleted.length > 0) {
    return true;
  }
  return false;
};


const scanDirForTsFiles = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const scanDirTimeSpan = buildCtx.createTimeSpan(`scan ${config.srcDir} started`, true);

  // loop through this directory and sub directories looking for
  // files that need to be transpiled
  const dirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: true });

  // filter down to only the ts files we should include
  const tsFileItems = dirItems.filter(item => {
    return item.isFile && isFileIncludePath(config, item.absPath);
  });

  const componentsDtsSrcFilePath = getComponentsDtsSrcFilePath(config);

  // return just the abs path
  // make sure it doesn't include components.d.ts
  const tsFilePaths = tsFileItems
    .map(tsFileItem => tsFileItem.absPath)
    .filter(tsFileAbsPath => tsFileAbsPath !== componentsDtsSrcFilePath);

  scanDirTimeSpan.finish(`scan for ts files finished: ${tsFilePaths.length}`);

  if (tsFilePaths.length === 0) {
    config.logger.warn(`No components found within: ${config.srcDir}`);
  }

  return tsFilePaths;
};


const primeTsServiceCache = (transpileCtx: TranspileContext) => {
  if (transpileCtx.filesFromFsCache.length === 0) {
    return;
  }

  // if this is a watch build and we have files that were pulled directly from the cache
  // let's go through and run the ts service on these files again again so
  // that the ts service cache is all updated and ready to go. But this can
  // happen after the first build since so far we're good to go w/ the fs cache
  const unsubscribe = transpileCtx.compilerCtx.events.on('buildFinish', () => {
    unsubscribe();

    if (transpileCtx.buildCtx.hasError) {
      return;
    }

    // we can wait a bit and let things cool down on the main thread first
    setTimeout(async () => {
      if (transpileCtx.buildCtx.hasError) {
        return;
      }

      const timeSpan = transpileCtx.buildCtx.createTimeSpan(`prime ts service cache started, ${transpileCtx.filesFromFsCache.length} file(s)`, true);

      // loop through each file system cached ts files and run the transpile again
      // so that we get the ts service's cache all up to speed
      await transpileCtx.compilerCtx.tsService(transpileCtx.compilerCtx, transpileCtx.buildCtx, transpileCtx.filesFromFsCache, false, false);

      timeSpan.finish(`prime ts service cache finished`);
    }, PRIME_TS_CACHE_TIMEOUT);
  });
};

// how long we should wait after the first build
// to go ahead and prime the in-memory TS cache
const PRIME_TS_CACHE_TIMEOUT = 1000;


export const isFileIncludePath = (config: d.Config, readPath: string) => {
  // filter e2e tests
  if (readPath.includes('.e2e.') || readPath.includes('/e2e.')) {
    // keep this test if it's an e2e file and we should be testing e2e
    return false;
  }

  // filter spec tests
  if (readPath.includes('.spec.') || readPath.includes('/spec.')) {
    return false;
  }

  if (!/\.(ts|tsx|js|mjs|jsx)$/.test(readPath)) {
    return false;
  }

  for (var i = 0; i < config.excludeSrc.length; i++) {
    if (minimatch(readPath, config.excludeSrc[i])) {
      // this file is a file we want to exclude
      return false;
    }
  }

  for (i = 0; i < config.includeSrc.length; i++) {
    if (minimatch(readPath, config.includeSrc[i])) {
      // this file is a file we want to include
      return true;
    }
  }

  // not a file we want to include, let's not add it
  return false;
};


const createConfigKey = (config: d.Config, compilerOptions: ts.CompilerOptions) => {
  // create a unique config key with stuff that "might" matter for typescript builds
  // not using the entire config object
  // since not everything is a primitive and could have circular references
  return config.sys.generateContentHash(JSON.stringify(
    [
      config.devMode,
      config.minifyCss,
      config.minifyJs,
      config.buildEs5,
      config.rootDir,
      config.srcDir,
      config.autoprefixCss,
      config.preamble,
      config.namespace,
      config.hashedFileNameLength,
      config.hashFileNames,
      config.outputTargets,
      config.enableCache,
      config.buildAppCore,
      config.excludeSrc,
      config.includeSrc,
      compilerOptions,
      COMPILER_BUILD.id
    ]
  ), 32);
};
