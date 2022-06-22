import type * as d from '../../../declarations';
import type { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import {
  catchError,
  dashToPascalCase,
  formatComponentRuntimeMeta,
  generatePreamble,
  getSourceMappingUrlForEndOfFile,
  hasError,
  rollupToStencilSourceMap,
  stringifyRuntimeData,
} from '@utils';
import { getCustomElementsBuildConditionals } from './custom-elements-build-conditionals';
import { isOutputTargetDistCustomElementsBundle } from '../output-utils';
import { join } from 'path';
import { nativeComponentTransform } from '../../transformers/component-native/tranform-to-native-component';
import { optimizeModule } from '../../optimize/optimize-module';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID, STENCIL_APP_GLOBALS_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';

export const outputCustomElementsBundle = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx
): Promise<void> => {
  if (!config.buildDist) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElementsBundle);
  if (outputTargets.length === 0) {
    return;
  }

  const bundlingEventMessage = `generate custom elements bundle${config.sourceMap ? ' + source maps' : ''}`;
  const timespan = buildCtx.createTimeSpan(`${bundlingEventMessage} started`);

  await Promise.all(outputTargets.map((o) => bundleCustomElements(config, compilerCtx, buildCtx, o)));

  timespan.finish(`${bundlingEventMessage} finished`);
};

const bundleCustomElements = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCustomElementsBundle
) => {
  try {
    const bundleOpts: BundleOptions = {
      id: 'customElementsBundle',
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

    const build = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    if (build) {
      const rollupOutput = await build.generate({
        banner: generatePreamble(config),
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
          let sourceMap = rollupToStencilSourceMap(bundle.map);
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
            code = code + getSourceMappingUrlForEndOfFile(bundle.fileName);
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
  } catch (e: any) {
    catchError(buildCtx.diagnostics, e);
  }
};

const generateEntryPoint = (outputTarget: d.OutputTargetDistCustomElementsBundle, buildCtx: d.BuildCtx) => {
  const imp: string[] = [];
  const exp: string[] = [];
  const exportNames: string[] = [];

  imp.push(
    `import { proxyCustomElement } from '${STENCIL_INTERNAL_CLIENT_ID}';`,
    `export { setAssetPath, setPlatformOptions } from '${STENCIL_INTERNAL_CLIENT_ID}';`,
    `export * from '${USER_INDEX_ENTRY_ID}';`
  );

  if (outputTarget.includeGlobalScripts !== false) {
    imp.push(`import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';`, `globalScripts();`);
  }

  buildCtx.components.forEach((cmp) => {
    const exportName = dashToPascalCase(cmp.tagName);
    const importName = cmp.componentClassName;
    const importAs = `$Cmp${exportName}`;

    if (cmp.isPlain) {
      exp.push(`export { ${importName} as ${exportName} } from '${cmp.sourceFilePath}';`);
    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));

      imp.push(`import { ${importName} as ${importAs} } from '${cmp.sourceFilePath}';`);
      exp.push(`export const ${exportName} = /*@__PURE__*/proxyCustomElement(${importAs}, ${meta});`);
    }
    exportNames.push(exportName);
  });

  exp.push(`export const defineCustomElements = (opts) => {`);
  exp.push(`    if (typeof customElements !== 'undefined') {`);
  exp.push(`        [`);
  exp.push(`            ${exportNames.join(',\n    ')}`);
  exp.push(`        ].forEach(cmp => {`);
  exp.push(`            if (!customElements.get(cmp.is)) {`);
  exp.push(`                customElements.define(cmp.is, cmp, opts);`);
  exp.push(`            }`);
  exp.push(`        });`);
  exp.push(`    }`);
  exp.push(`};`);

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
