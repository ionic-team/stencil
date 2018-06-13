import * as d from '../../declarations';
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
  const ctx: { compilerCtx: d.CompilerCtx; buildCtx: d.BuildCtx } = { compilerCtx: null, buildCtx: null };

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
  // We are not doing a full typecheck, we are not resolving the whole context,
  // so pass --noResolve to avoid reporting missing file errors.
  options.noResolve = true;

  const snapshotVersions = new Map<string, string>();

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => {
      return ctx.compilerCtx.rootTsFiles;
    },
    getScriptVersion: (filePath) => {
      return snapshotVersions.get(filePath);
    },
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
    fileExists: (filePath) => {
      return ctx.compilerCtx.fs.accessSync(filePath);
    },
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

  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

  return async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[]) => {
    ctx.compilerCtx = compilerCtx;
    ctx.buildCtx = buildCtx;

    // do the snapshot verion checking here to avoid doing
    // the same work on source files that have already been modified (and cached)
    tsFilePaths = await Promise.all(tsFilePaths.map(async tsFilePath => {
      const oldHash = snapshotVersions.get(tsFilePath);
      const newHash = config.sys.generateContentHash(await compilerCtx.fs.readFile(tsFilePath), 32);

      snapshotVersions.set(tsFilePath, newHash);

      if (oldHash === newHash) {
        // file is unchanged
        return null;
      }

      return tsFilePath;
    }));

    // filter out unchanged so we don't even bother running
    // the service, which is important so we don't gather metadata
    // on ts files that have already been modified from previous transpiling
    tsFilePaths = tsFilePaths.filter(tsFilePath => tsFilePath != null);

    // ensure components.d.ts isn't in the transpile (for now)
    const componentsDtsSrcFilePath = getComponentsDtsSrcFilePath(config);
    tsFilePaths = tsFilePaths.filter(tsFilePath => tsFilePath !== componentsDtsSrcFilePath);

    // loop through each ts file that has changed
    await Promise.all(tsFilePaths.map(async tsFilePath => {
      await emitOutput(config, compilerCtx, buildCtx, services, tsFilePath);
    }));
  };
}


async function emitOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, services: ts.LanguageService, tsFilePath: string) {
  const output = services.getEmitOutput(tsFilePath);

  // keep track of how many files we transpiled (great for debugging/testing)
  buildCtx.transpileBuildCount++;

  if (output.emitSkipped) {
    const tsDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(tsFilePath));

    loadTypeScriptDiagnostics(config.cwd, buildCtx.diagnostics, tsDiagnostics);
    return;
  }

  await Promise.all(output.outputFiles.map(async outputFile => {
    await writeOutput(config, compilerCtx, tsFilePath, outputFile);
  }));
}


async function writeOutput(config: d.Config, compilerCtx: d.CompilerCtx, tsFilePath: string, outputFile: ts.OutputFile) {
  const outputPath = normalizePath(outputFile.name);

  // the in-memory .js version is be virtually next to the source ts file
  // but it never actually gets written to disk, just there in spirit
  await compilerCtx.fs.writeFile(
    outputPath,
    outputFile.text,
    { inMemoryOnly: true }
  );

  const moduleFile = getModuleFile(compilerCtx, tsFilePath);
  moduleFile.jsFilePath = outputPath;

  // also write the output to each of the output targets
  await Promise.all(config.outputTargets.map(async outputTarget => {
    if (outputTarget.type === 'dist') {
      await writeOutputTargetDist(config, compilerCtx, outputTarget, outputFile);
    }
  }));
}


async function writeOutputTargetDist(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, outputFile: ts.OutputFile) {
  const filePath = normalizePath(outputFile.name);

  const relPath = config.sys.path.relative(config.srcDir, filePath);
  const outputPath = pathJoin(config, outputTarget.collectionDir, relPath);

  await compilerCtx.fs.writeFile(outputPath, outputFile.text);
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

  // let's async read and cache the source file so it get's loaded up
  // into our in-memory file system to be used later during the actual transpile
  await Promise.all(tsFileItems.map(async tsFileItem => {
    await compilerCtx.fs.readFile(tsFileItem.absPath);
  }));

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
