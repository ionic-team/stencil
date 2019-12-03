import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { getBuildFeatures } from '../../build/app-data';
import { getRollupOptions } from '../../bundle/bundle-output';
import { hydrateComponentTransform } from '../../transformers/component-hydrate/tranform-to-hydrate-component';

import { loadRollupDiagnostics } from '@utils';
import { rollup } from 'rollup';
import { STENCIL_INTERNAL_HYDRATE_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';


export const bundleHydrateFactory = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, _build: d.BuildConditionals, appFactoryEntryCode: string) => {
  try {
    const bundleOpts: BundleOptions = {
      id: 'hydrate',
      platform: 'hydrate',
      conditionals: getBuildConditionals(buildCtx.components),
      customTransformers: getCustomTransformer(compilerCtx),
      inputs: {
        '@app-factory-entry': '@app-factory-entry'
      },
      loader: {
        '@app-factory-entry': appFactoryEntryCode
      }
    };

    const rollupOptions = getRollupOptions(config, compilerCtx, buildCtx, bundleOpts);
    rollupOptions.inlineDynamicImports = true;

    const rollupBuild = await rollup(rollupOptions);

    compilerCtx.rollupCache.set(
      bundleOpts.id,
      rollupBuild.cache,
    );
    return rollupBuild;

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(compilerCtx, buildCtx, e);
    }
  }
  return undefined;
};


const getBuildConditionals = (cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateServerSide = true;
  build.cssVarShim = false;
  build.hydrateClientSide = true;
  build.isDebug = false;
  build.isDev = false;
  build.devTools = false;
  build.lifecycleDOMEvents = false;
  build.profile = false;
  build.hotModuleReplacement = false;
  build.updatable = true;
  build.member = true;
  build.constructableCSS = false;
  build.asyncLoading = true;
  build.cssAnnotations = true;

  return build;
};


const getCustomTransformer = (compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_HYDRATE_ID,
    componentExport: null,
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };

  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    hydrateComponentTransform(compilerCtx, transformOpts),
  ];
};

