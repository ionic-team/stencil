import * as d from '../../declarations';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import { isOutputTargetDistCollectionExperimental, isOutputTargetDistCustomElementExperimental } from '../output-targets/output-utils';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import ts from 'typescript';


export function emitBuilds(config: d.Config, compilerCtx: d.CompilerCtx, tsProgram: ts.Program, filesToWrite: Map<string, string>) {
  const tsTypeChecker = tsProgram.getTypeChecker();

  const outputTargetsDistCollection = config.outputTargets.filter(isOutputTargetDistCollectionExperimental);
  if (outputTargetsDistCollection.length > 0) {
    emitCollection(config, compilerCtx, tsProgram, tsTypeChecker, filesToWrite, outputTargetsDistCollection);
  }

  const outputTargetsCustomElement = config.outputTargets.filter(isOutputTargetDistCustomElementExperimental);
  if (outputTargetsCustomElement.length > 0) {
    emitCustomElements(config, compilerCtx, tsProgram, tsTypeChecker, filesToWrite, outputTargetsCustomElement);
  }
}


function emitCollection(config: d.Config, compilerCtx: d.CompilerCtx, tsProgram: ts.Program, tsTypeChecker: ts.TypeChecker, filesToWrite: Map<string, string>, outputTargets: d.ExperimentalOutputTargetDistCollection[]) {
  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    componentExport: null,
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };

  const writeToRootDirs = outputTargets.map(outputTarget => outputTarget.dir);
  const writeDts = true;
  const writeSourceMap = true;

  emitBuild(config, tsProgram, filesToWrite, writeToRootDirs, writeDts, writeSourceMap, {
    before: [
      convertDecoratorsToStatic(config, compilerCtx.activeBuildCtx.diagnostics, tsTypeChecker),
      updateStencilCoreImports(transformOpts.coreImportPath)
    ],
    after: [
      convertStaticToMeta(config, compilerCtx, compilerCtx.activeBuildCtx, tsTypeChecker, null, transformOpts)
    ]
  });
}


function emitCustomElements(config: d.Config, compilerCtx: d.CompilerCtx, tsProgram: ts.Program, tsTypeChecker: ts.TypeChecker, filesToWrite: Map<string, string>, outputTargets: d.ExperimentalOutputTargetDistCustomElement[]) {
  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    componentExport: 'customelement',
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };

  const writeToRootDirs = outputTargets.map(outputTarget => outputTarget.dir);
  const writeDts = true;
  const writeSourceMap = true;

  emitBuild(config, tsProgram, filesToWrite, writeToRootDirs, writeDts, writeSourceMap, {
    before: [
      convertDecoratorsToStatic(config, compilerCtx.activeBuildCtx.diagnostics, tsTypeChecker),
      updateStencilCoreImports(transformOpts.coreImportPath)
    ],
    after: [
      convertStaticToMeta(config, compilerCtx, compilerCtx.activeBuildCtx, tsTypeChecker, null, transformOpts)
    ]
  });
}


function emitBuild(config: d.Config, tsProgram: ts.Program, filesToWrite: Map<string, string>, writeToRootDirs: string[], writeDts: boolean, writeSourceMap: boolean, customTransformers: ts.CustomTransformers) {
  const emittedFiles = new Map<string, string>();

  // emit just once, but remember the content
  tsProgram.emit(undefined,
    (filePath, content) => {
      if (!writeDts && filePath.endsWith('.d.ts')) {
        return;
      }
      if (!writeSourceMap && filePath.endsWith('.map')) {
        return;
      }
      emittedFiles.set(filePath, content);
    },
    undefined,
    false,
    customTransformers
  );

  // loop through all the output targets and save the same content to different directories
  writeToRootDirs.forEach(writeToRootDir => {
    emittedFiles.forEach((transpiledContent, transpiledFilePath) => {
      const relPath = config.sys.path.relative(config.srcDir, transpiledFilePath);
      const distPath = config.sys.path.join(writeToRootDir, relPath);
      filesToWrite.set(distPath, transpiledContent);
    });
  });
}
