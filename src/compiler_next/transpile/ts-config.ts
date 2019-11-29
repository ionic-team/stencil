import * as d from '../../declarations';
import { isOutputTargetDistTypes } from '../../compiler/output-targets/output-utils';
import ts from 'typescript';


export const getTsOptionsToExtend = (config: d.Config) => {
  const tsOptions: ts.CompilerOptions = {
    experimentalDecorators: true,
    declaration: config.outputTargets.some(isOutputTargetDistTypes),
    incremental: false,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    outDir: config.cacheDir,
    rootDir: config.srcDir,
    sourceMap: config.sourceMap,
    target: ts.ScriptTarget.ES2017,
  };
  return tsOptions;
};
