import type * as d from '../../../declarations';
import type { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import {
  catchError,
  dashToPascalCase,
  formatComponentRuntimeMeta,
  hasError,
  rollupSrcMapToObj,
  stringifyRuntimeData,
} from '@utils';
import { getCustomElementsBuildConditionals } from '../dist-custom-elements-bundle/custom-elements-build-conditionals';
import { isOutputTargetDistCustomElements } from '../output-utils';
import { join } from 'path';
import { nativeComponentTransform } from '../../transformers/component-native/tranform-to-native-component';
import { optimizeModule } from '../../optimize/optimize-module';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID, STENCIL_APP_GLOBALS_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';

export const outputCustomElements = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!config.buildDist) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElements);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom elements started`);

  await Promise.all(outputTargets.map((o) => bundleCustomElements(config, compilerCtx, buildCtx, o)));

  timespan.finish(`generate custom elements finished`);
};

const bundleCustomElements = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCustomElements
) => {
  try {
    const bundleOpts: BundleOptions = {
      id: 'customElements',
      platform: 'client',
      conditionals: getCustomElementsBuildConditionals(config, buildCtx.components),
      customTransformers: getCustomElementBundleCustomTransformer(config, compilerCtx),
      externalRuntime: !!outputTarget.externalRuntime,
      inlineWorkers: true,
      inputs: {
        index: '\0core',
      },
      loader: {
        '\0core': generateEntryPoint(outputTarget, buildCtx),
      },
      inlineDynamicImports: outputTarget.inlineDynamicImports,
      preserveEntrySignatures: 'allow-extension',
    };

    addCustomElementInputs(outputTarget, buildCtx, bundleOpts);

    const build = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    if (build) {
      const rollupOutput = await build.generate({
        format: 'esm',
        sourcemap: config.sourceMap,
        chunkFileNames: outputTarget.externalRuntime || !config.hashFileNames ? '[name].js' : 'p-[hash].js',
        entryFileNames: '[name].js',
        hoistTransitiveImports: false,
        preferConst: true,
      });

      const minify = outputTarget.externalRuntime || outputTarget.minify !== true ? false : config.minifyJs;
      const files = rollupOutput.output.map(async (bundle) => {
        if (bundle.type === 'chunk') {
          let code = bundle.code;
          let sourceMap = rollupSrcMapToObj(bundle.map);
          const optimizeResults = await optimizeModule(config, compilerCtx, {
            input: code,
            isCore: bundle.isEntry,
            minify,
            sourceMap,
          });
          buildCtx.diagnostics.push(...optimizeResults.diagnostics);
          if (!hasError(optimizeResults.diagnostics) && typeof optimizeResults.output === 'string') {
            code = optimizeResults.output;
            sourceMap = optimizeResults.sourceMap;
          }
          if (sourceMap) {
            code = code + '\n//# sourceMappingURL=' + bundle.fileName + '.map';
            await compilerCtx.fs.writeFile(
              join(outputTarget.dir, bundle.fileName + '.map'),
              JSON.stringify(sourceMap),
              {
                outputTargetType: outputTarget.type,
              }
            );
          }
          await compilerCtx.fs.writeFile(join(outputTarget.dir, bundle.fileName), code, {
            outputTargetType: outputTarget.type,
          });
        }
      });
      await Promise.all(files);
    }
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
};

const addCustomElementInputs = (
  _outputTarget: d.OutputTargetDistCustomElements,
  buildCtx: d.BuildCtx,
  bundleOpts: BundleOptions
) => {
  const components = buildCtx.components;
  components.forEach((cmp) => {
    const exp: string[] = [];
    const exportName = dashToPascalCase(cmp.tagName);
    const importName = cmp.componentClassName;
    const importAs = `$Cmp${exportName}`;
    const coreKey = `\0${exportName}`;

    if (cmp.isPlain) {
      exp.push(`export { ${importName} as ${exportName} } from '${cmp.sourceFilePath}';`);
    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));

      exp.push(`import { proxyCustomElement } from '${STENCIL_INTERNAL_CLIENT_ID}';`);
      exp.push(`import { ${importName} as ${importAs} } from '${cmp.sourceFilePath}';`);
      exp.push(`export const ${exportName} = /*@__PURE__*/proxyCustomElement(${importAs}, ${meta});`);
    }

    bundleOpts.inputs[cmp.tagName] = coreKey;
    bundleOpts.loader[coreKey] = exp.join('\n');
  });
};

const generateEntryPoint = (outputTarget: d.OutputTargetDistCustomElements, _buildCtx: d.BuildCtx) => {
  const imp: string[] = [];
  const exp: string[] = [];

  imp.push(
    `export { setAssetPath, setPlatformOptions } from '${STENCIL_INTERNAL_CLIENT_ID}';`,
    `export * from '${USER_INDEX_ENTRY_ID}';`
  );

  if (outputTarget.includeGlobalScripts !== false) {
    imp.push(`import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';`, `globalScripts();`);
  }

  return [...imp, ...exp].join('\n') + '\n';
};

const getCustomElementBundleCustomTransformer = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_CLIENT_ID,
    componentExport: null,
    componentMetadata: null,
    currentDirectory: config.sys.getCurrentDirectory(),
    proxy: null,
    style: 'static',
    styleImportData: 'queryparams',
  };
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    nativeComponentTransform(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};
