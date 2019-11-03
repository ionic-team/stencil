import * as d from '../../../declarations';
import { catchError } from '@utils';
import { DIST_CUSTOM_ELEMENTS, isOutputTargetDistCustomElements } from '../../../compiler/output-targets/output-utils';
import { nativeComponentTransform } from '../../../compiler/transformers/component-native/tranform-to-native-component';
import { STENCIL_INTERNAL_CLIENT_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import path from 'path';
import ts from 'typescript';


export const customElementOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, changedModuleFiles: d.Module[]) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElements);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom elements started`, true);
  const printer = ts.createPrinter();
  try {
    const buildOutput: d.BuildOutput = {
      type: DIST_CUSTOM_ELEMENTS,
      files: [],
    };

    await Promise.all(changedModuleFiles.map(async mod => {
      const transformed = ts.transform(mod.staticSourceFile, getCustomTransformer(compilerCtx)).transformed[0];
      const code = printer.printFile(transformed);

      await Promise.all(outputTargets.map(async outputTarget => {
        const filePath = path.join(outputTarget.dir, mod.jsFilePath);
        await compilerCtx.fs.writeFile(filePath, code);
        buildOutput.files.push(filePath);
      }));
    }));

    buildCtx.outputs.push(buildOutput);

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
