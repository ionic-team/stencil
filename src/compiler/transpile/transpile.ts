import addComponentMetadata from './transformers/add-component-metadata';
import { BuildCtx, CompilerCtx, Config, Diagnostic, FsWriteResults, ModuleFiles, TranspileResults } from '../../declarations';
import { componentDependencies } from './transformers/component-dependencies';
import { discoverCollections } from './transformers/discover-collections';
import { gatherMetadata } from './datacollection/index';
import { generateComponentTypesFile } from './create-component-types';
import { getComponentsDtsSrcFilePath } from '../build/distribution';
import { getTsHost } from './compiler-host';
import { getUserTsConfig } from './compiler-options';
import { hasError, normalizePath } from '../util';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { moduleGraph } from './transformers/module-graph';
import { normalizeAssetsDir } from '../component-plugins/assets-plugin';
import { normalizeStyles } from './normalize-styles';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';
import * as ts from 'typescript';


export async function transpileModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, tsFilePaths: string[]) {
  if (hasError(buildCtx.diagnostics)) {
    // we've already got an error, let's not continue
    return;
  }

  if (tsFilePaths.length === 0) {
    // don't bother if there are no ts files to transpile
    return;
  }

  // fire up the typescript program
  const timespace = config.logger.createTimeSpan('transpileModules start', true);

  // get the tsconfig compiler options we'll use
  const tsOptions = await getUserTsConfig(config, compilerCtx);

  if (config.suppressTypeScriptErrors) {
    // suppressTypeScriptErrors mainly for unit testing
    tsOptions.lib = [];
  }

  const writeQueue: Promise<FsWriteResults>[] = [];

  // get the ts compiler host we'll use, which patches file operations
  // with our in-memory file system
  const tsHost = getTsHost(config, compilerCtx, writeQueue, tsOptions);

  // fire up the typescript program
  const componentsDtsSrcFilePath = getComponentsDtsSrcFilePath(config);

  // get all of the ts files paths to transpile
  // ensure the components.d.ts file is always excluded from this transpile program
  const checkProgramTsFiles = tsFilePaths.filter(filePath => filePath !== componentsDtsSrcFilePath);

  // keep track of how many files we transpiled (great for debugging/testing)
  buildCtx.transpileBuildCount = checkProgramTsFiles.length;

  // run the first program that only does the checking
  const checkProgram = ts.createProgram(checkProgramTsFiles, tsOptions, tsHost);

  // Gather component metadata and type info
  const metadata = gatherMetadata(config, checkProgram.getTypeChecker(), checkProgram.getSourceFiles());

  Object.keys(metadata).forEach(key => {
    const tsFilePath = normalizePath(key);
    const fileMetadata = metadata[tsFilePath];
    // normalize metadata
    fileMetadata.stylesMeta = normalizeStyles(config, tsFilePath, fileMetadata.stylesMeta);
    fileMetadata.assetsDirsMeta = normalizeAssetsDir(config, tsFilePath, fileMetadata.assetsDirsMeta);

    // assign metadata to module files
    if (!compilerCtx.moduleFiles[tsFilePath]) {
      compilerCtx.moduleFiles[tsFilePath] = {};
    }
    compilerCtx.moduleFiles[tsFilePath].cmpMeta = fileMetadata;
  });

  // Generate d.ts files for component types
  const componentTypesFileContent = generateComponentTypesFile(config, metadata);

  // queue the components.d.ts async file write and put it into memory
  await compilerCtx.fs.writeFile(componentsDtsSrcFilePath, componentTypesFileContent);

  // get all of the ts files paths to transpile
  // ensure the components.d.ts file is always included to this transpile program
  const programTsFiles = tsFilePaths.slice();
  if (programTsFiles.indexOf(componentsDtsSrcFilePath) === -1) {
    // we must always include the components.d.ts file in this tranpsile program
    programTsFiles.push(componentsDtsSrcFilePath);
  }

  // create another program, but use the previous checkProgram to speed it up
  const program = ts.createProgram(programTsFiles, tsOptions, tsHost, checkProgram);

  // run the second program again with our new typed info
  transpileProgram(program, tsHost, config, compilerCtx, buildCtx);

  // figure out if we actually have changed JS text that was written
  const writeResults = await Promise.all(writeQueue);
  buildCtx.hasChangedJsText = writeResults.some(r => r.changedContent);

  // done and done
  timespace.finish(`transpileModules finished`);
}


function transpileProgram(program: ts.Program, tsHost: ts.CompilerHost, config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  // this is the big one, let's go ahead and kick off the transpiling
  program.emit(undefined, tsHost.writeFile, undefined, false, {

    // NOTE! order of transforms and being in either "before" or "after" is very important!!!!
    before: [
      removeDecorators(),
      addComponentMetadata(compilerCtx.moduleFiles),
      discoverCollections(config, compilerCtx, buildCtx)
    ],
    after: [
      removeStencilImports(),
      moduleGraph(config, buildCtx),
      componentDependencies(compilerCtx, buildCtx)
    ]

  });

  if (!config.suppressTypeScriptErrors) {
    // suppressTypeScriptErrors mainly for unit testing
    const tsDiagnostics: ts.Diagnostic[] = [];
    program.getSyntacticDiagnostics().forEach(d => tsDiagnostics.push(d));
    program.getSemanticDiagnostics().forEach(d => tsDiagnostics.push(d));
    program.getOptionsDiagnostics().forEach(d => tsDiagnostics.push(d));

    loadTypeScriptDiagnostics(config.rootDir, buildCtx.diagnostics, tsDiagnostics);
  }
}


/**
 * This is only used during TESTING
 */
export function transpileModule(config: Config, compilerOptions: ts.CompilerOptions, path: string, input: string) {
  const moduleFiles: ModuleFiles = {};
  const diagnostics: Diagnostic[] = [];
  const results: TranspileResults = {
    code: null,
    diagnostics: null,
    cmpMeta: null
  };

  const checkProgram = ts.createProgram([path], compilerOptions);

  // Gather component metadata and type info
  const files = checkProgram.getSourceFiles().filter(sf => sf.getSourceFile().fileName === path);
  const metadata = gatherMetadata(config, checkProgram.getTypeChecker(), files);

  if (Object.keys(metadata).length > 0) {
    const fileMetadata = metadata[path];

    // normalize metadata
    fileMetadata.stylesMeta = normalizeStyles(config, path, fileMetadata.stylesMeta);
    fileMetadata.assetsDirsMeta = normalizeAssetsDir(config, path, fileMetadata.assetsDirsMeta);

    // assign metadata to module files
    moduleFiles['module.tsx'] = {
      cmpMeta: fileMetadata
    };
  }

  const transpileOpts = {
    compilerOptions: compilerOptions,
    transformers: {
      before: [
        removeDecorators(),
        addComponentMetadata(moduleFiles)
      ],
      after: [
        removeStencilImports()
      ]
    }
  };
  const tsResults = ts.transpileModule(input, transpileOpts);

  loadTypeScriptDiagnostics('', diagnostics, tsResults.diagnostics);

  if (diagnostics.length) {
    results.diagnostics = diagnostics;
  }

  results.code = tsResults.outputText;
  results.cmpMeta = moduleFiles['module.tsx'] ? moduleFiles['module.tsx'].cmpMeta : null;

  return results;
}
