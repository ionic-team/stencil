import type * as d from '../../declarations';
// import { isOutputTargetDistTypes } from '../output-targets/output-utils';
import ts from 'typescript';

export const getTsOptionsToExtend = (config: d.Config) => {
  const tsOptions: ts.CompilerOptions = {
    experimentalDecorators: true,
    // declaration: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    outDir: config.cacheDir || config.sys.tmpDirSync(),
    // sourceMap: true,
  };
  console.log('here are the things we sending', config)
  return tsOptions;
};
