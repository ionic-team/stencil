import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError, dashToPascalCase, formatComponentRuntimeMeta, hasError, stringifyRuntimeData } from '@utils';
import { getCustomElementsBuildConditionals } from './custom-elements-build-conditionals';
import { isOutputTargetDistCustomElementsBundle } from '../output-utils';
import { join } from 'path';
import { nativeComponentTransform } from '../../transformers/component-native/tranform-to-native-component';
import { optimizeModule } from '../../optimize/optimize-module';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID, STENCIL_APP_GLOBALS_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';

export const outputCustomElementsBundle = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (config.devMode) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElementsBundle);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom elements bundle started`);

  await Promise.all(outputTargets.map(o => bundleCustomElements(config, compilerCtx, buildCtx, o)));

  timespan.finish(`generate custom elements bundle finished`);
};

const bundleCustomElements = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCustomElementsBundle) => {
  try {
    const bundleOpts: BundleOptions = {
      id: 'customElementsBundle',
      platform: 'client',
      conditionals: getCustomElementsBuildConditionals(config, buildCtx.components),
      customTransformers: getCustomElementBundleCustomTransformer(config, compilerCtx),
      inlineWorkers: true,
      inputs: {
        index: '\0core',
      },
      loader: {
        '\0core': generateEntryPoint(buildCtx),
      },
      inlineDynamicImports: outputTarget.inlineDynamicImports,
    };

    const build = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    if (build) {
      const rollupOutput = await build.generate({
        format: 'esm',
        sourcemap: config.sourceMap,
        chunkFileNames: config.devMode ? '[name]-[hash].mjs' : 'p-[hash].mjs',
        entryFileNames: '[name].mjs',
      });
      const files = rollupOutput.output.map(async bundle => {
        if (bundle.type === 'chunk') {
          let code = bundle.code;
          const optimizeResults = await optimizeModule(config, compilerCtx, {
            input: code,
            isCore: bundle.isEntry,
            minify: config.minifyJs,
          });
          buildCtx.diagnostics.push(...optimizeResults.diagnostics);
          if (!hasError(optimizeResults.diagnostics) && typeof optimizeResults.output === 'string') {
            code = optimizeResults.output;
          }
          await compilerCtx.fs.writeFile(join(outputTarget.dir, bundle.fileName), code, { outputTargetType: outputTarget.type });
        }
      });
      await Promise.all(files);
    }
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
};

const generateEntryPoint = (buildCtx: d.BuildCtx) => {
  const importStatements: string[] = [];
  const exportStatements: string[] = [];
  const exportNames: string[] = [];
  importStatements.push(
    `import { proxyCustomElement } from '${STENCIL_INTERNAL_CLIENT_ID}';`,
    `export * from '${USER_INDEX_ENTRY_ID}';`,
    `import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';`,
    'globalScripts();',
  );

  buildCtx.components.forEach(cmp => {
    const exportName = dashToPascalCase(cmp.tagName);
    const importName = cmp.componentClassName;
    const importAs = `$Cmp${exportName}`;

    if (cmp.isPlain) {
      exportStatements.push(`export { ${importName} as ${exportName} } from '${cmp.sourceFilePath}';`);
    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));

      importStatements.push(`import { ${importName} as ${importAs} } from '${cmp.sourceFilePath}';`);
      exportStatements.push(`export const ${exportName} = /*@__PURE__*/proxyCustomElement(${importAs}, ${meta});`);
      exportNames.push(exportName);
    }
  });
  exportStatements.push(`
export const defineCustomElements = () => {
  [
    ${exportNames.join(',\n    ')}
  ].forEach(cmp => customElements.define(cmp.is, cmp));
};`);
  return [...importStatements, ...exportStatements, ''].join('\n');
};

const getCustomElementBundleCustomTransformer = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_CLIENT_ID,
    componentExport: null,
    componentMetadata: null,
    currentDirectory: config.cwd,
    proxy: null,
    style: 'static',
  };
  return [updateStencilCoreImports(transformOpts.coreImportPath), nativeComponentTransform(compilerCtx, transformOpts), removeCollectionImports(compilerCtx)];
};
