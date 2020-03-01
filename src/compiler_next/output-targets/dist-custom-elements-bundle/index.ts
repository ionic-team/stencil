import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError, dashToPascalCase, hasError } from '@utils';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../../../compiler/app-core/format-component-runtime-meta';
import { getBuildFeatures, updateBuildConditionals } from '../../build/app-data';
import { isOutputTargetDistCustomElementsBundle } from '../../../compiler/output-targets/output-utils';
import { nativeComponentTransform } from '../../../compiler/transformers/component-native/tranform-to-native-component';
import { optimizeModule } from '../../optimize/optimize-module';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID, STENCIL_APP_GLOBALS_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import { OutputChunk } from 'rollup';
import { join } from 'path';


export const outputCustomElementsBundle = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (config.devMode) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElementsBundle);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom elements bundle started`);

  try {
    const bundleOpts: BundleOptions = {
      id: 'customElementsBundle',
      platform: 'client',
      conditionals: getBuildConditionals(config, buildCtx.components),
      customTransformers: getCustomElementBundleCustomTransformer(config, compilerCtx),
      inputs: {
        'index': '@core-entrypoint'
      },
      loader: {
        '@core-entrypoint': generateEntryPoint(buildCtx)
      },
      inlineDynamicImports: true,
    };

    const build = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    if (build) {
      const rollupOutput = await build.generate({
        format: 'esm',
        sourcemap: config.sourceMap,
      });
      const chunk = rollupOutput.output.find(o => o.type === 'chunk') as OutputChunk;
      let code = chunk.code;
      const optimizeResults = await optimizeModule(config, compilerCtx, {
        input: code,
        isCore: true,
        minify: config.minifyJs
      });
      buildCtx.diagnostics.push(...optimizeResults.diagnostics);
      if (!hasError(optimizeResults.diagnostics) && typeof optimizeResults.output === 'string') {
        code = optimizeResults.output;
      }

      await Promise.all(
        outputTargets.map(o => {
          return compilerCtx.fs.writeFile(
            join(o.dir, 'index.mjs'),
            code,
            { outputTargetType: o.type }
          );
        })
      );
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate custom elements bundle finished`);
};

const generateEntryPoint = (buildCtx: d.BuildCtx) => {
  const imports: string[] = [];
  const exports: string[] = [];
  imports.push(
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
      exports.push(
        `export { ${importName} as ${exportName} } from '${cmp.sourceFilePath}';`,
      );

    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));

      imports.push(
        `import { ${importName} as ${importAs} } from '${cmp.sourceFilePath}';`
      );

      exports.push(
        `export const ${exportName} = /*@__PURE__*/proxyCustomElement(${importAs}, ${meta});`
      );
    }
  });

  return [
    ...imports,
    ...exports,
    ''
  ].join('\n');
};

const getBuildConditionals = (config: d.Config, cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  build.taskQueue = false;
  updateBuildConditionals(config, build);
  build.devTools = false;

  return build;
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
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    nativeComponentTransform(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};
