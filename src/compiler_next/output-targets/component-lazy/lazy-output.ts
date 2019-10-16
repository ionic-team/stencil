import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../../build/app-data';
import { generateEntryModules } from '../../..//compiler/entries/entry-modules';
import { LAZY_BROWSER_ENTRY_ID, LAZY_EXTERNAL_ENTRY_ID, STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID } from '../../bundle/entry-alias-ids';
import { isOutputTargetHydrate } from '../../../compiler/output-targets/output-utils';
import { lazyComponentTransform } from '../../transformers/component-lazy/transform-lazy-component';
import ts from 'typescript';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';


export const lazyOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram, outputTargets: d.OutputTargetDistLazy[]) => {
  const timespan = buildCtx.createTimeSpan(`generate lazy started`, true);

  try {

    // const criticalBundles = getCriticalPath(buildCtx);

    const bundleOpts: BundleOptions = {
      id: 'lazy',
      platform: 'client',
      conditionals: getBuildConditionals(config, buildCtx.components),
      customTransformers: getCustomTransformer(compilerCtx),
      inputs: {
        [config.fsNamespace]: LAZY_BROWSER_ENTRY_ID,
        'loader': LAZY_EXTERNAL_ENTRY_ID,
        'index': USER_INDEX_ENTRY_ID
      },
      outputOptions: {
        format: 'es',
        sourcemap: config.sourceMap,
      },
      outputTargets,
      tsBuilder,
    };

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    generateEntryModules(config, buildCtx);
    buildCtx.entryModules.forEach(entryModule => {
      bundleOpts.inputs[entryModule.entryKey] = entryModule.entryKey;
    });

    await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate lazy finished`);
};


const getBuildConditionals = (config: d.Config, cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateServerSide = false;
  build.cssVarShim = true;

  const hasHydrateOutputTargets = config.outputTargets.some(isOutputTargetHydrate);
  build.hydrateClientSide = hasHydrateOutputTargets;

  updateBuildConditionals(config, build);

  return build;
};

// function getCriticalPath(buildCtx: d.BuildCtx) {
//   const componentGraph = buildCtx.componentGraph;
//   if (!buildCtx.indexDoc || !componentGraph) {
//     return [];
//   }
//   return unique(
//     flatOne(
//       getUsedComponents(buildCtx.indexDoc, buildCtx.components)
//         .map(tagName => getScopeId(tagName))
//         .map(scopeId => buildCtx.componentGraph.get(scopeId) || [])
//     )
//   ).sort();
// }


const getCustomTransformer = (compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_CLIENT_ID,
    componentExport: 'lazy',
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    lazyComponentTransform(compilerCtx, transformOpts)
  ];
};
