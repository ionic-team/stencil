import type * as d from '../../../declarations';
import type { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError } from '@utils';
import { generateEntryModules } from '../../entries/entry-modules';
import { getLazyBuildConditionals } from './lazy-build-conditionals';
import { isOutputTargetDistLazy, isOutputTargetDist } from '../output-utils';
import {
  LAZY_BROWSER_ENTRY_ID,
  LAZY_EXTERNAL_ENTRY_ID,
  STENCIL_APP_GLOBALS_ID,
  STENCIL_CORE_ID,
  STENCIL_INTERNAL_CLIENT_PATCH_BROWSER_ID,
  STENCIL_INTERNAL_CLIENT_PATCH_ESM_ID,
  USER_INDEX_ENTRY_ID,
} from '../../bundle/entry-alias-ids';
import { lazyComponentTransform } from '../../transformers/component-lazy/transform-lazy-component';
import { generateCjs } from './generate-cjs';
import { generateEsmBrowser } from './generate-esm-browser';
import { generateEsm } from './generate-esm';
import { generateSystem } from './generate-system';
import { generateModuleGraph } from '../../entries/component-graph';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';
import MagicString from 'magic-string';

export const outputLazy = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<void> => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazy);
  if (outputTargets.length === 0) {
    return;
  }

  const bundleEventMessage = `generate lazy${config.sourceMap ? ' + source maps' : ''}`;
  const timespan = buildCtx.createTimeSpan(`${bundleEventMessage} started`);

  try {
    const bundleOpts: BundleOptions = {
      id: 'lazy',
      platform: 'client',
      conditionals: getLazyBuildConditionals(config, buildCtx.components),
      customTransformers: getLazyCustomTransformer(config, compilerCtx),
      inlineWorkers: config.outputTargets.some(isOutputTargetDist),
      inputs: {
        [config.fsNamespace]: LAZY_BROWSER_ENTRY_ID,
        loader: LAZY_EXTERNAL_ENTRY_ID,
        index: USER_INDEX_ENTRY_ID,
      },
      loader: {
        [LAZY_EXTERNAL_ENTRY_ID]: getLazyEntry(false),
        [LAZY_BROWSER_ENTRY_ID]: getLazyEntry(true),
      },
    };

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    generateEntryModules(config, buildCtx);
    buildCtx.entryModules.forEach((entryModule) => {
      bundleOpts.inputs[entryModule.entryKey] = entryModule.entryKey;
    });

    const rollupBuild = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    if (rollupBuild != null) {
      const results: d.UpdatedLazyBuildCtx[] = await Promise.all([
        generateEsmBrowser(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
        generateEsm(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
        generateSystem(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
        generateCjs(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
      ]);

      results.forEach((result) => {
        if (result.name === 'cjs') {
          buildCtx.commonJsComponentBundle = result.buildCtx.commonJsComponentBundle;
        } else if (result.name === 'system') {
          buildCtx.systemComponentBundle = result.buildCtx.systemComponentBundle;
        } else if (result.name === 'esm') {
          buildCtx.esmComponentBundle = result.buildCtx.esmComponentBundle;
          buildCtx.es5ComponentBundle = result.buildCtx.es5ComponentBundle;
        } else if (result.name === 'esm-browser') {
          buildCtx.esmBrowserComponentBundle = result.buildCtx.esmBrowserComponentBundle;
          buildCtx.buildResults = result.buildCtx.buildResults;
          buildCtx.components = result.buildCtx.components;
        }
      });

      if (buildCtx.esmBrowserComponentBundle != null) {
        buildCtx.componentGraph = generateModuleGraph(buildCtx.components, buildCtx.esmBrowserComponentBundle);
      }
    }
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`${bundleEventMessage} finished`);
};

const getLazyCustomTransformer = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_CORE_ID,
    componentExport: 'lazy',
    componentMetadata: null,
    currentDirectory: config.sys.getCurrentDirectory(),
    proxy: null,
    style: 'static',
    styleImportData: 'queryparams',
  };
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    lazyComponentTransform(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};

const getLazyEntry = (isBrowser: boolean): string => {
  const s = new MagicString(``);
  s.append(`import { bootstrapLazy } from '${STENCIL_CORE_ID}';\n`);

  if (isBrowser) {
    s.append(`import { patchBrowser } from '${STENCIL_INTERNAL_CLIENT_PATCH_BROWSER_ID}';\n`);
    s.append(`import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';\n`);
    s.append(`patchBrowser().then(options => {\n`);
    s.append(`  globalScripts();\n`);
    s.append(`  return bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/], options);\n`);
    s.append(`});\n`);
  } else {
    s.append(`import { patchEsm } from '${STENCIL_INTERNAL_CLIENT_PATCH_ESM_ID}';\n`);
    s.append(`import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';\n`);
    s.append(`export const defineCustomElements = (win, options) => {\n`);
    s.append(`  if (typeof window === 'undefined') return Promise.resolve();\n`);
    s.append(`  return patchEsm().then(() => {\n`);
    s.append(`    globalScripts();\n`);
    s.append(`    return bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/], options);\n`);
    s.append(`  });\n`);
    s.append(`};\n`);
  }

  return s.toString();
};
