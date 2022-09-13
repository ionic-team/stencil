import {
  catchError,
  dashToPascalCase,
  generatePreamble,
  getSourceMappingUrlForEndOfFile,
  hasError,
  isString,
  rollupToStencilSourceMap,
} from '@utils';
import { join } from 'path';
import ts from 'typescript';

import type * as d from '../../../declarations';
import type { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { STENCIL_APP_GLOBALS_ID, STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID } from '../../bundle/entry-alias-ids';
import { optimizeModule } from '../../optimize/optimize-module';
import { addDefineCustomElementFunctions } from '../../transformers/component-native/add-define-custom-element-function';
import { proxyCustomElement } from '../../transformers/component-native/proxy-custom-element-function';
import { nativeComponentTransform } from '../../transformers/component-native/tranform-to-native-component';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';
import { getCustomElementsBuildConditionals } from '../dist-custom-elements-bundle/custom-elements-build-conditionals';
import { isOutputTargetDistCustomElements } from '../output-utils';

/**
 * Main output target function for `dist-custom-elements`. This function just
 * does some organizational work to call the other functions in this module,
 * which do actual work of generating the rollup configuration, creating an
 * entry chunk, running, the build, etc.
 *
 * @param config the validated compiler configuration we're using
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @returns an empty Promise which won't resolve until the work is done!
 */
export const outputCustomElements = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx
): Promise<void> => {
  if (!config.buildDist) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElements);
  if (outputTargets.length === 0) {
    return;
  }

  const bundlingEventMessage = 'generate custom elements';
  const timespan = buildCtx.createTimeSpan(`${bundlingEventMessage} started`);

  await Promise.all(outputTargets.map((target) => bundleCustomElements(config, compilerCtx, buildCtx, target)));

  timespan.finish(`${bundlingEventMessage} finished`);
};

/**
 * Get bundle options for our current build and compiler context which we'll use
 * to generate a Rollup build and so on.
 *
 * @param config a validated Stencil configuration object
 * @param buildCtx the current build context
 * @param compilerCtx the current compiler context
 * @param outputTarget the outputTarget we're currently dealing with
 * @returns bundle options suitable for generating a rollup configuration
 */
export const getBundleOptions = (
  config: d.ValidatedConfig,
  buildCtx: d.BuildCtx,
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTargetDistCustomElements
): BundleOptions => ({
  id: 'customElements',
  platform: 'client',
  conditionals: getCustomElementsBuildConditionals(config, buildCtx.components),
  customTransformers: getCustomElementCustomTransformer(config, compilerCtx, buildCtx.components, outputTarget),
  externalRuntime: !!outputTarget.externalRuntime,
  inlineWorkers: true,
  inputs: {
    // Here we prefix our index chunk with '\0' to tell Rollup that we're
    // going to be using virtual modules with this module. A leading '\0'
    // prevents other plugins from messing with the module. We generate a
    // string for the index chunk below in the `loader` property.
    //
    // @see {@link https://rollupjs.org/guide/en/#conventions} for more info.
    index: '\0core',
  },
  loader: {
    '\0core': generateEntryPoint(outputTarget),
  },
  inlineDynamicImports: outputTarget.inlineDynamicImports,
  preserveEntrySignatures: 'allow-extension',
});

/**
 * Get bundle options for rollup, run the rollup build, optionally minify the
 * output, and write files to disk.
 *
 * @param config the validated Stencil configuration we're using
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget the outputTarget we're currently dealing with
 * @returns an empty promise
 */
export const bundleCustomElements = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCustomElements
) => {
  try {
    const bundleOpts = getBundleOptions(config, buildCtx, compilerCtx, outputTarget);

    addCustomElementInputs(buildCtx, bundleOpts);

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

      // the output target should have been validated at this point - as a result, we expect this field
      // to have been backfilled if it wasn't provided
      const outputTargetDir: string = outputTarget.dir!;

      // besides, if it isn't here we do a diagnostic and an early return
      if (!isString(outputTargetDir)) {
        buildCtx.diagnostics.push({
          level: 'error',
          type: 'build',
          messageText: 'dist-custom-elements output target provided with no output target directory!',
        });
        return;
      }

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
          }
          if (optimizeResults.sourceMap) {
            sourceMap = optimizeResults.sourceMap;
            code = code + getSourceMappingUrlForEndOfFile(bundle.fileName);
            await compilerCtx.fs.writeFile(join(outputTargetDir, bundle.fileName + '.map'), JSON.stringify(sourceMap), {
              outputTargetType: outputTarget.type,
            });
          }
          await compilerCtx.fs.writeFile(join(outputTargetDir, bundle.fileName), code, {
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

/**
 * Create the virtual modules/input modules for the `dist-custom-elements` output target.
 * @param buildCtx the context for the current build
 * @param bundleOpts the bundle options to store the virtual modules under. acts as an output parameter
 */
export const addCustomElementInputs = (buildCtx: d.BuildCtx, bundleOpts: BundleOptions): void => {
  const components = buildCtx.components;
  // an array to store the imports of these modules that we're going to add to our entry chunk
  const indexImports: string[] = [];

  components.forEach((cmp) => {
    const exp: string[] = [];
    const exportName = dashToPascalCase(cmp.tagName);
    const importName = cmp.componentClassName;
    const importAs = `$Cmp${exportName}`;
    const coreKey = `\0${exportName}`;

    if (cmp.isPlain) {
      exp.push(`export { ${importName} as ${exportName} } from '${cmp.sourceFilePath}';`);
      indexImports.push(`export { {${exportName} } from '${coreKey}';`);
    } else {
      // the `importName` may collide with the `exportName`, alias it just in case it does with `importAs`
      exp.push(
        `import { ${importName} as ${importAs}, defineCustomElement as cmpDefCustomEle } from '${cmp.sourceFilePath}';`
      );
      exp.push(`export const ${exportName} = ${importAs};`);
      exp.push(`export const defineCustomElement = cmpDefCustomEle;`);

      // Here we push an export (with a rename for `defineCustomElement`) for
      // this component onto our array which references the `coreKey` (prefixed
      // with `\0`). We have to do this so that our import is referencing the
      // correct virtual module, if we instead referenced, for instance,
      // `cmp.sourceFilePath`, we would end up with duplicated modules in our
      // output.
      indexImports.push(
        `export { ${exportName}, defineCustomElement as defineCustomElement${exportName} } from '${coreKey}';`
      );
    }

    bundleOpts.inputs[cmp.tagName] = coreKey;
    bundleOpts.loader![coreKey] = exp.join('\n');
  });

  bundleOpts.loader!['\0core'] += indexImports.join('\n');
};

/**
 * Generate the entrypoint (`index.ts` file) contents for the `dist-custom-elements` output target
 * @param outputTarget the output target's configuration
 * @returns the stringified contents to be placed in the entrypoint
 */
export const generateEntryPoint = (outputTarget: d.OutputTargetDistCustomElements): string => {
  const imp: string[] = [];

  imp.push(
    `export { setAssetPath, setPlatformOptions } from '${STENCIL_INTERNAL_CLIENT_ID}';`,
    `export * from '${USER_INDEX_ENTRY_ID}';`
  );

  if (outputTarget.includeGlobalScripts !== false) {
    imp.push(`import { globalScripts } from '${STENCIL_APP_GLOBALS_ID}';`, `globalScripts();`);
  }

  return imp.join('\n') + '\n';
};

/**
 * Get the series of custom transformers that will be applied to a Stencil project's source code during the TypeScript
 * transpilation process
 *
 * @param config the configuration for the Stencil project
 * @param compilerCtx the current compiler context
 * @param components the components that will be compiled as a part of the current build
 * @param outputTarget the output target configuration
 * @returns a list of transformers to use in the transpilation process
 */
const getCustomElementCustomTransformer = (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  components: d.ComponentCompilerMeta[],
  outputTarget: d.OutputTargetDistCustomElements
): ts.TransformerFactory<ts.SourceFile>[] => {
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
    addDefineCustomElementFunctions(compilerCtx, components, outputTarget),
    updateStencilCoreImports(transformOpts.coreImportPath),
    nativeComponentTransform(compilerCtx, transformOpts),
    proxyCustomElement(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};
