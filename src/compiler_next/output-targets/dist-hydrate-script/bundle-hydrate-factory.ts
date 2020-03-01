import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { getBuildFeatures } from '../../build/app-data';
import { bundleOutput } from '../../bundle/bundle-output';
import { hydrateComponentTransform } from '../../transformers/component-hydrate/tranform-to-hydrate-component';
import { loadRollupDiagnostics } from '@utils';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_HYDRATE_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';


export const bundleHydrateFactory = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, _build: d.BuildConditionals, appFactoryEntryCode: string) => {
  try {
    const bundleOpts: BundleOptions = {
      id: 'hydrate',
      platform: 'hydrate',
      conditionals: getHydrateBuildConditionals(buildCtx.components),
      customTransformers: getHydrateCustomTransformer(config, compilerCtx),
      inlineDynamicImports: true,
      inputs: {
        '@app-factory-entry': '@app-factory-entry'
      },
      loader: {
        '@app-factory-entry': appFactoryEntryCode
      }
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


const getHydrateBuildConditionals = (cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateServerSide = true;
  build.cssVarShim = false;
  build.hydrateClientSide = true;
  build.isDebug = false;
  build.isDev = false;
  build.isTesting = false;
  build.devTools = false;
  build.lifecycleDOMEvents = false;
  build.profile = false;
  build.hotModuleReplacement = false;
  build.updatable = true;
  build.member = true;
  build.constructableCSS = false;
  build.asyncLoading = true;
  build.appendChildSlotFix = false;
  build.cloneNodeFix = false;
  build.cssAnnotations = true;
  build.shadowDomShim = true;
  build.safari10 = true;
  build.hydratedAttribute = false;
  build.hydratedClass = true;

  return build;
};


const getHydrateCustomTransformer = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_HYDRATE_ID,
    componentExport: null,
    componentMetadata: null,
    currentDirectory: config.cwd,
    proxy: null,
    style: 'static',
  };

  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    hydrateComponentTransform(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};

