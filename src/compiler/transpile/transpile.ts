import * as d from '../../declarations';
import addComponentMetadata from './transformers/add-component-metadata';
import { buildConditionalsTransform } from './transformers/build-conditionals';
import { componentDependencies } from './transformers/component-dependencies';
import { generateComponentTypes } from './create-component-types';
import { getComponentsDtsSrcFilePath } from '../distribution/distribution';
import { getTsHost } from './compiler-host';
import { getUserTsConfig } from './compiler-options';
import { hasError } from '../util';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { moduleGraph } from './transformers/module-graph';
import { removeCollectionImports } from './transformers/remove-collection-imports';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';
import * as ts from 'typescript';


export async function transpileModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[]) {
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

  const writeQueue: Promise<d.FsWriteResults>[] = [];

  // get the ts compiler host we'll use, which patches file operations
  // with our in-memory file system
  const tsHost = getTsHost(config, compilerCtx, writeQueue, tsOptions);

  // fire up the typescript program
  const componentsDtsSrcFilePath = getComponentsDtsSrcFilePath(config);

  // create the components.d.ts file from the component metadata
  const checkProgram = await generateComponentTypes(config, compilerCtx, buildCtx, tsOptions, tsHost, tsFilePaths, componentsDtsSrcFilePath);

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


function transpileProgram(program: ts.Program, tsHost: ts.CompilerHost, config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // this is the big one, let's go ahead and kick off the transpiling
  const buildConditionals: any = {
    isDev: !!config.devMode
  };
  program.emit(undefined, tsHost.writeFile, undefined, false, {

    // NOTE! order of transforms and being in either "before" or "after" is very important!!!!
    before: [
      removeDecorators(),
      addComponentMetadata(compilerCtx.moduleFiles),
      buildConditionalsTransform(buildConditionals)
    ],
    after: [
      removeStencilImports(),
      removeCollectionImports(compilerCtx),
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

    loadTypeScriptDiagnostics(config.cwd, buildCtx.diagnostics, tsDiagnostics);
  }
}
