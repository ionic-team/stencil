import * as d from '../../../declarations';
import { catchError } from '@utils';
import { nativeComponentTransform } from '../../../compiler/transformers/component-native/tranform-to-native-component';
import { STENCIL_INTERNAL_CLIENT_ID } from '../../bundle/entry-alias-ids';
import path from 'path';
import ts from 'typescript';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import { isOutputTargetDistCustomElements } from '../../../compiler/output-targets/output-utils';


export const customElementOutput = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, changedModuleFiles: d.Module[]) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElements);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom elements started`, true);
  const printer = ts.createPrinter();
  try {
    changedModuleFiles.forEach(mod => {
      const transformed = ts.transform(mod.staticSourceFile, getCustomTransformer(compilerCtx)).transformed[0];
      const code = printer.printFile(transformed);
      outputTargets.forEach(outputTarget => {
        const collectionFilePath = path.join(outputTarget.dir, mod.jsFilePath);
        compilerCtx.fs.writeFile(collectionFilePath, code);
      });
    });

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate custom elements finished`);
};


const getCustomTransformer = (compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_CLIENT_ID,
    componentExport: null,
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    nativeComponentTransform(compilerCtx, transformOpts)
  ];
};
