import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../../build/app-data';
import { isOutputTargetDistCustomElementsBundle } from '../../../compiler/output-targets/output-utils';
import { nativeComponentTransform } from '../../../compiler/transformers/component-native/tranform-to-native-component';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import { STENCIL_INTERNAL_CLIENT_ID } from '../../bundle/entry-alias-ids';
import { writeBuildOutputs } from '../../bundle/write-outputs';
import path from 'path';


export const customElementsBundleOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElementsBundle);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom element started`, true);

  try {
    const bundleOpts: BundleOptions = {
      id: 'customElements',
      platform: 'client',
      conditionals: getBuildConditionals(config, buildCtx.components),
      customTransformers: getCustomTransformer(compilerCtx),
      inputs: getEntries(compilerCtx),
    };


    const build = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    const rollupOutput = await build.generate({
      format: 'es',
      sourcemap: config.sourceMap,
    });
    await writeBuildOutputs(compilerCtx, buildCtx, outputTargets, rollupOutput);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate custom element finished`);
};


const getEntries = (compilerCtx: d.CompilerCtx) => {
  const inputs: any = {};

  compilerCtx.moduleMap.forEach(m => {
    if (m.cmps.length > 0) {
      const fileName = path.basename(m.sourceFilePath);
      const nameParts = fileName.split('.');
      nameParts.pop();
      const entryName = nameParts.join('.');
      inputs[entryName] = m.sourceFilePath;
    }
  });

  return inputs;
};

const getBuildConditionals = (config: d.Config, cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  updateBuildConditionals(config, build);

  return build;
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
