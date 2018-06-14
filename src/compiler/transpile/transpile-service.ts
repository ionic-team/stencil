import * as d from '../../declarations';
import { addCollection } from './datacollection/discover-collections';
import addComponentMetadata from './transformers/add-component-metadata';
import { buildConditionalsTransform } from './transformers/build-conditionals';
import { componentDependencies } from './transformers/component-dependencies';
import { gatherMetadata } from './datacollection/gather-metadata';
import { getComponentsDtsSrcFilePath } from '../distribution/distribution';
import { getModuleFile } from '../build/compiler-ctx';
import { getModuleImports } from './transformers/module-imports';
import { getUserTsConfig } from './compiler-options';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
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
    compilerCtx.tsService = await buildTsService(config);
    timeSpan.finish(`buildTsService finished`);
  }

  const doTranspile = (changedTsFiles.length > 0);
  if (doTranspile) {
    // we've found ts files we need to tranpsile
    // or at least one ts file has changed
    const timeSpan = buildCtx.createTimeSpan(`transpile started`);

    await compilerCtx.tsService(compilerCtx, buildCtx, changedTsFiles);

    timeSpan.finish(`transpile finished`);
  }

  return doTranspile;
}


async function buildTsService(config: d.Config) {
  const ctx: TranspileContext = {
    compilerCtx: null,
    buildCtx: null,
    configKey: null,
    snapshotVersions: new Map<string, string>()
  };

  const options = Object.assign({}, await getUserTsConfig(config, ctx.compilerCtx));

  options.isolatedModules = true;
  // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
  options.suppressOutputPathCheck = true;
  // Filename can be non-ts file.
  options.allowNonTsExtensions = true;
  // Clear out other settings that would not be used in transpiling this module
  options.lib = undefined;
  options.types = undefined;
  options.noEmit = undefined;
  options.noEmitOnError = undefined;
  options.paths = undefined;
  options.rootDirs = undefined;
  options.declaration = undefined;
  options.declarationDir = undefined;
  options.out = undefined;
  options.outFile = undefined;
  options.outDir = undefined;

  // create a config key that will be used as part of the file's cache key
  ctx.configKey = createConfiKey(config, options);

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => ctx.compilerCtx.rootTsFiles,
    getScriptVersion: (filePath) => ctx.snapshotVersions.get(filePath),
    getScriptSnapshot: (filePath) => {
      try {
        const sourceText = ctx.compilerCtx.fs.readFileSync(filePath);
        return ts.ScriptSnapshot.fromString(sourceText);
      } catch (e) {}
      return undefined;
    },
    getCurrentDirectory: () => config.cwd,
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: (filePath) => ctx.compilerCtx.fs.accessSync(filePath),
    readFile: (filePath) => {
      try {
        return ctx.compilerCtx.fs.readFileSync(filePath);
      } catch (e) {}
      return undefined;
    },
    readDirectory: ts.sys.readDirectory,
    getCustomTransformers: () => {
      const typeChecker = services.getProgram().getTypeChecker();

      const buildConditionals = {
        isDev: !!config.devMode
      } as d.BuildConditionals;

      return {
        before: [
          gatherMetadata(config, ctx.compilerCtx, ctx.buildCtx, typeChecker),
          removeDecorators(),
          addComponentMetadata(ctx.compilerCtx.moduleFiles),
          buildConditionalsTransform(buildConditionals)
        ],
        after: [
          removeStencilImports(),
          removeCollectionImports(ctx.compilerCtx),
          getModuleImports(config, ctx.compilerCtx),
          componentDependencies(ctx.compilerCtx)
        ]
      };
    }
  };

  // create our typescript language service to be reused
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

  // return the function we'll continually use on each rebuild
  return async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[]) => {
    ctx.compilerCtx = compilerCtx;
    ctx.buildCtx = buildCtx;

    // ensure components.d.ts isn't in the transpile (for now)
    const cmpDts = getComponentsDtsSrcFilePath(config);
    tsFilePaths = tsFilePaths.filter(tsFilePath => tsFilePath !== cmpDts);

    // loop through each ts file that has changed
    await Promise.all(tsFilePaths.map(async tsFilePath => {
      await tranpsileTsFile(config, services, ctx, tsFilePath);
    }));
  };
}


interface TranspileContext {
  compilerCtx: d.CompilerCtx;
  buildCtx: d.BuildCtx;
  configKey: string;
  snapshotVersions: Map<string, string>;
}


async function tranpsileTsFile(config: d.Config, services: ts.LanguageService, ctx: TranspileContext, tsFilePath: string) {
  // look up the old cache key using the ts file path
  const oldCacheKey = ctx.snapshotVersions.get(tsFilePath);

  // read the file content to be transpiled
  const content = await ctx.compilerCtx.fs.readFile(tsFilePath);

  // create a cache key out of the content and compiler options
  const cacheKey = `transpileService_${config.sys.generateContentHash(content + tsFilePath + ctx.configKey, 32)}` ;

  if (oldCacheKey === cacheKey) {
    // file is unchanged, thanks typescript caching!
    return;
  }

  // save the cache key for future lookups
  ctx.snapshotVersions.set(tsFilePath, cacheKey);

  if (config.enableCache && !ctx.compilerCtx.isRebuild) {
    // let's check to see if we've already cached this in our filesystem
    // but only bother for the very first build
    const cachedStr = await ctx.compilerCtx.cache.get(cacheKey);
    if (cachedStr != null) {
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
  }

  // let's do this!
  const output = services.getEmitOutput(tsFilePath);

  // keep track of how many files we transpiled (great for debugging/testing)
  ctx.buildCtx.transpileBuildCount++;

  if (output.emitSkipped) {
    // oh no! we've got some typescript diagnostics for this file!
    const tsDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(tsFilePath));

    loadTypeScriptDiagnostics(config.cwd, ctx.buildCtx.diagnostics, tsDiagnostics);
    return;
  }

  await Promise.all(output.outputFiles.map(async tsOutput => {
    const outputFilePath = normalizePath(tsOutput.name);

    if (outputFilePath.endsWith('.js')) {
      // this is the JS output of the typescript file transpiling
      const moduleFile = getModuleFile(ctx.compilerCtx, tsFilePath);
      moduleFile.jsFilePath = outputFilePath;

      if (config.enableCache) {
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
  if (buildCtx.dirsAdded.length > 0) {
    return true;
  }
  if (buildCtx.dirsDeleted.length > 0) {
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

  scanDirTimeSpan.finish(`scan for ts files finished`);

  const componentsDtsSrcFilePath = getComponentsDtsSrcFilePath(config);

  // return just the abs path
  // make sure it doesn't include components.d.ts
  return tsFileItems
    .map(tsFileItem => tsFileItem.absPath)
    .filter(tsFilePath => {
      return tsFilePath !== componentsDtsSrcFilePath;
    });
}


export function isFileIncludePath(config: d.Config, readPath: string) {
  for (var i = 0; i < config.excludeSrc.length; i++) {
    if (config.sys.minimatch(readPath, config.excludeSrc[i])) {
      // this file is a file we want to exclude
      return false;
    }
  }

  for (i = 0; i < config.includeSrc.length; i++) {
    if (config.sys.minimatch(readPath, config.includeSrc[i])) {
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
      compilerOptions
    ]
  ), 32);
}
