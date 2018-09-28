import * as d from '../../declarations';
import { addCollection } from './datacollection/discover-collections';
import addComponentMetadata from './transformers/add-component-metadata';
import { componentDependencies } from './transformers/component-dependencies';
import { gatherMetadata } from './datacollection/gather-metadata';
import { getComponentsDtsSrcFilePath } from '../app/app-file-naming';
import { getModuleFile } from '../build/compiler-ctx';
import { getModuleImports } from './transformers/module-imports';
import { getUserCompilerOptions } from './compiler-options';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import minimatch from 'minimatch';
import { normalizePath, pathJoin } from '../util';
import { removeCollectionImports } from './transformers/remove-collection-imports';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';
import * as ts from 'typescript';


export async function transpileService(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
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

  if (!compilerCtx.tsService) {
    // create the typescript language service
    const timeSpan = buildCtx.createTimeSpan(`buildTsService started`, true);
    compilerCtx.tsService = await buildTsService(config, compilerCtx, buildCtx);
    timeSpan.finish(`buildTsService finished`);
  }

  const doTranspile = (changedTsFiles.length > 0);
  if (doTranspile) {
    // we've found ts files we need to tranpsile
    // or at least one ts file has changed
    const timeSpan = buildCtx.createTimeSpan(`transpile started`);

    // only use the file system cache when it's enabled and this is the first build
    const useFsCache = config.enableCache && !buildCtx.isRebuild;

    // go ahead and kick off the ts service
    await compilerCtx.tsService(compilerCtx, buildCtx, changedTsFiles, true, useFsCache);

    timeSpan.finish(`transpile finished`);
  }

  return doTranspile;
}


async function buildTsService(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const transpileCtx: TranspileContext = {
    compilerCtx: compilerCtx,
    buildCtx: buildCtx,
    configKey: null,
    snapshotVersions: new Map<string, string>(),
    filesFromFsCache: [],
    hasQueuedTsServicePrime: false
  };

  const userCompilerOptions = await getUserCompilerOptions(config, transpileCtx.compilerCtx);
  const compilerOptions = Object.assign({}, userCompilerOptions) as ts.CompilerOptions;

  compilerOptions.isolatedModules = false;
  compilerOptions.suppressOutputPathCheck = true;
  compilerOptions.allowNonTsExtensions = true;
  compilerOptions.removeComments = !config.devMode;
  compilerOptions.lib = undefined;
  compilerOptions.types = undefined;
  compilerOptions.noEmit = undefined;
  compilerOptions.noEmitOnError = undefined;
  compilerOptions.paths = undefined;
  compilerOptions.rootDirs = undefined;
  compilerOptions.declaration = undefined;
  compilerOptions.declarationDir = undefined;
  compilerOptions.out = undefined;
  compilerOptions.outFile = undefined;
  compilerOptions.outDir = undefined;

  // create a config key that will be used as part of the file's cache key
  transpileCtx.configKey = createConfiKey(config, compilerOptions);

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

      return {
        before: [
          gatherMetadata(config, transpileCtx.compilerCtx, transpileCtx.buildCtx, typeChecker),
          removeDecorators(),
          addComponentMetadata(transpileCtx.compilerCtx.moduleFiles),
        ],
        after: [
          removeStencilImports(),
          removeCollectionImports(transpileCtx.compilerCtx),
          getModuleImports(config, transpileCtx.compilerCtx),
          componentDependencies(transpileCtx.compilerCtx)
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

    // ensure components.d.ts isn't in the transpile (for now)
    const cmpDts = getComponentsDtsSrcFilePath(config);
    tsFilePaths = tsFilePaths.filter(tsFilePath => tsFilePath !== cmpDts);

    // loop through each ts file that has changed
    await Promise.all(tsFilePaths.map(async tsFilePath => {
      await tranpsileTsFile(config, services, transpileCtx, tsFilePath, checkCacheKey, useFsCache);
    }));

    if (config.watch && !transpileCtx.hasQueuedTsServicePrime) {
      // prime the ts service cache for all the ts files pulled from the file system cache
      transpileCtx.hasQueuedTsServicePrime = true;
      primeTsServiceCache(transpileCtx);
    }
  };
}


interface TranspileContext {
  compilerCtx: d.CompilerCtx;
  buildCtx: d.BuildCtx;
  configKey: string;
  snapshotVersions: Map<string, string>;
  filesFromFsCache: string[];
  hasQueuedTsServicePrime: boolean;
}


async function tranpsileTsFile(config: d.Config, services: ts.LanguageService, ctx: TranspileContext, tsFilePath: string, checkCacheKey: boolean, useFsCache: boolean) {
  if (!ctx.buildCtx.isActiveBuild) {
    ctx.buildCtx.debug(`tranpsileTsFile aborted, not active build: ${tsFilePath}`);
    return;
  }

  if (ctx.buildCtx.hasError) {
    ctx.buildCtx.debug(`tranpsileTsFile aborted: ${tsFilePath}`);
    return;
  }

  const hasWarning = ctx.buildCtx.hasWarning && !config._isTesting;

  // look up the old cache key using the ts file path
  const oldCacheKey = ctx.snapshotVersions.get(tsFilePath);

  // read the file content to be transpiled
  const content = await ctx.compilerCtx.fs.readFile(tsFilePath);

  // create a cache key out of the content and compiler options
  const cacheKey = `transpileService_${config.sys.generateContentHash(content + tsFilePath + ctx.configKey, 32)}` ;

  if (oldCacheKey === cacheKey && checkCacheKey && !hasWarning) {
    // file is unchanged, thanks typescript caching!
    return;
  }

  // save the cache key for future lookups
  ctx.snapshotVersions.set(tsFilePath, cacheKey);

  let ensureExternalImports: string[] = null;

  if (useFsCache && !hasWarning) {
    // let's check to see if we've already cached this in our filesystem
    // but only bother for the very first build
    const cachedStr = await ctx.compilerCtx.cache.get(cacheKey);
    if (cachedStr != null) {
      // remember which files we were able to get from cached versions
      // so we can later fully prime the ts service cache
      ctx.filesFromFsCache.push(tsFilePath);

      // whoa cool, we found we already cached this in our filesystem
      const cachedModuleFile = JSON.parse(cachedStr) as CachedModuleFile;

      // and there you go, thanks fs cache!
      // put the cached module file data in our context
      ctx.compilerCtx.moduleFiles[tsFilePath] = cachedModuleFile.moduleFile;

      // add any collections to the context which this cached file may know about
      cachedModuleFile.moduleFile.externalImports.forEach(moduleId => {
        addCollection(config, ctx.compilerCtx, ctx.compilerCtx.collections, cachedModuleFile.moduleFile, config.rootDir, moduleId);
      });

      // write the cached js output too
      await outputFile(config, ctx, cachedModuleFile.moduleFile.jsFilePath, cachedModuleFile.jsText);
      return;
    }

  } else {
    // purposely not using the fs cache
    // this is probably when we want to prime the
    // in-memory ts cache after the first build has completed
    const existingModuleFile = ctx.compilerCtx.moduleFiles[tsFilePath];
    if (existingModuleFile && Array.isArray(existingModuleFile.externalImports)) {
      ensureExternalImports = existingModuleFile.externalImports.slice();
    }
  }

  // let's do this!
  const output = services.getEmitOutput(tsFilePath);

  // keep track of how many files we transpiled (great for debugging/testing)
  ctx.buildCtx.transpileBuildCount++;

  if (output.emitSkipped) {
    // oh no! we've got some typescript diagnostics for this file!
    const tsDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(tsFilePath));

    loadTypeScriptDiagnostics(config, ctx.buildCtx.diagnostics, tsDiagnostics);
    return;
  }

  await Promise.all(output.outputFiles.map(async tsOutput => {
    const outputFilePath = normalizePath(tsOutput.name);

    if (!ctx.buildCtx.isActiveBuild) {
      ctx.buildCtx.debug(`tranpsileTsFile write aborted, not active build: ${tsFilePath}`);
      return;
    }

    if (ctx.buildCtx.hasError) {
      ctx.buildCtx.debug(`tranpsileTsFile write aborted: ${tsFilePath}`);
      return;
    }

    if (outputFilePath.endsWith('.js')) {
      // this is the JS output of the typescript file transpiling
      const moduleFile = getModuleFile(ctx.compilerCtx, tsFilePath);
      moduleFile.jsFilePath = outputFilePath;

      if (Array.isArray(ensureExternalImports)) {
        ensureExternalImports.forEach(moduleId => {
          addCollection(config, ctx.compilerCtx, ctx.compilerCtx.collections, moduleFile, config.rootDir, moduleId);
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
    await outputFile(config, ctx, outputFilePath, tsOutput.text);
  }));
}


async function outputFile(config: d.Config, ctx: TranspileContext, outputFilePath: string, outputText: string) {
  // the in-memory .js version is be virtually next to the source ts file
  // but it never actually gets written to disk, just there in spirit
  await ctx.compilerCtx.fs.writeFile(
    outputFilePath,
    outputText,
    { inMemoryOnly: true }
  );

  // also write the output to each of the output targets
  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.type === 'dist');
  await Promise.all(outputTargets.map(async outputTarget => {
    const relPath = config.sys.path.relative(config.srcDir, outputFilePath);
    const outputTargetFilePath = pathJoin(config, outputTarget.collectionDir, relPath);

    await ctx.compilerCtx.fs.writeFile(outputTargetFilePath, outputText);
  }));
}


interface CachedModuleFile {
  moduleFile: d.ModuleFile;
  jsText: string;
}


function shouldScanForTsChanges(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
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
}


async function scanDirForTsFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
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
}


function primeTsServiceCache(transpileCtx: TranspileContext) {
  if (transpileCtx.filesFromFsCache.length === 0) {
    return;
  }

  // if this is a watch build and we have files that were pulled directly from the cache
  // let's go through and run the ts service on these files again again so
  // that the ts service cache is all updated and ready to go. But this can
  // happen after the first build since so far we're good to go w/ the fs cache
  const unsubscribe = transpileCtx.compilerCtx.events.subscribe('buildFinish' as any, () => {
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
}

// how long we should wait after the first build
// to go ahead and prime the in-memory TS cache
const PRIME_TS_CACHE_TIMEOUT = 1000;


export function isFileIncludePath(config: d.Config, readPath: string) {
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
}


function createConfiKey(config: d.Config, compilerOptions: ts.CompilerOptions) {
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
      config.assetVersioning,
      config.buildAppCore,
      config.excludeSrc,
      config.includeSrc,
      compilerOptions,
      '__BUILDID:TRANSPILE__'
    ]
  ), 32);
}
