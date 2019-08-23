import * as d from '../../declarations';
import ts from 'typescript';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
// import { getComponentsDtsSrcFilePath } from '../output-targets/output-utils';
// import { isFileIncludePath } from './transpile-service';


export async function runTsBuilder(config: d.Config, _compilerCtx: d.CompilerCtx) {
  console.log('runTsBuilder');
  let count = 1;


  const host = ts.createWatchCompilerHost<ts.EmitAndSemanticDiagnosticsBuilderProgram>(
    config.tsconfig, {
      incremental: true
    },
    ts.sys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
  function() {
    console.log('reporter', arguments);
  }, function() {
    console.timeEnd(count - 1 + '');
    console.log('reportWatchStatus', arguments);
    console.time(count + '');
    count++;
  });

  host.afterProgramCreate = (p) => {
    const typeChecker = p.getProgram().getTypeChecker();
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: null,
      componentMetadata: null,
      proxy: null,
      style: 'static'
    };

    const customTransforms = {
      before: [
        convertDecoratorsToStatic(config, [], typeChecker),
        updateStencilCoreImports(transformOpts.coreImportPath)
      ]
    };
    console.log([
      ...p.getSyntacticDiagnostics(),
      ...p.getSemanticDiagnostics(),
      ...p.getGlobalDiagnostics()
    ]);
    p.emit(undefined, undefined, undefined, false, customTransforms);
  };

  // const origin = host.readFile;
  // host.readFile = (path: string, encoding: string) => {
  //   console.log(path);
  //   return origin(path, encoding);
  // };


  // host.afterProgramEmitAndDiagnostics = function() {
  //   console.log('afterProgramEmitAndDiagnostics', arguments);
  // };
  // host.onWatchStatusChange = function() {
  //   console.log('onWatchStatusChange', arguments);
  // };
  host.watchDirectory()
  ts.createWatchProgram(host);
}


// const scanDirForTsFiles = async (config: d.Config, compilerCtx: d.CompilerCtx) => {

//   // loop through this directory and sub directories looking for
//   // files that need to be transpiled
//   const dirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: true });

//   // filter down to only the ts files we should include
//   const tsFileItems = dirItems.filter(item => {
//     return item.isFile && isFileIncludePath(config, item.absPath);
//   });

//   const componentsDtsSrcFilePath = getComponentsDtsSrcFilePath(config);

//   // return just the abs path
//   // make sure it doesn't include components.d.ts
//   const tsFilePaths = tsFileItems
//     .map(tsFileItem => tsFileItem.absPath)
//     .filter(tsFileAbsPath => tsFileAbsPath !== componentsDtsSrcFilePath);


//   if (tsFilePaths.length === 0) {
//     config.logger.warn(`No components found within: ${config.srcDir}`);
//   }

//   return tsFilePaths;
// };
