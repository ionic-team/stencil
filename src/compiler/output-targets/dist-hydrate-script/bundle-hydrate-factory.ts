import type * as d from '../../../declarations';
import type { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { getHydrateBuildConditionals } from './hydrate-build-conditionals';
import { hydrateComponentTransform } from '../../transformers/component-hydrate/tranform-to-hydrate-component';
import { loadRollupDiagnostics } from '@utils';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_HYDRATE_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';

export const bundleHydrateFactory = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  _build: d.BuildConditionals,
  appFactoryEntryCode: string
) => {
  try {
    const bundleOpts: BundleOptions = {
      id: 'hydrate',
      platform: 'hydrate',
      conditionals: getHydrateBuildConditionals(buildCtx.components),
      customTransformers: getHydrateCustomTransformer(config, compilerCtx),
      inlineDynamicImports: true,
      inputs: {
        '@app-factory-entry': '@app-factory-entry',
      },
      loader: {
        '@app-factory-entry': appFactoryEntryCode,
      },
    };

    const rollupBuild = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    return rollupBuild;
  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }
  return undefined;
};

const getHydrateCustomTransformer = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_HYDRATE_ID,
    componentExport: null,
    componentMetadata: null,
    currentDirectory: config.sys.getCurrentDirectory(),
    proxy: null,
    style: 'static',
    styleImportData: 'queryparams',
  };

  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    hydrateComponentTransform(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};
