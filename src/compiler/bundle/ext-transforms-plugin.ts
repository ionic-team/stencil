import type * as d from '../../declarations';
import type { BundleOptions } from './bundle-interface';
import { hasError, normalizeFsPath } from '@utils';
import { isOutputTargetDistCollection } from '../output-targets/output-utils';
import { join, relative } from 'path';
import { parseImportPath } from '../transformers/stencil-import-path';
import type { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../plugin/plugin';

/**
 * A Rollup plugin which bundles up some transformation of CSS imports as well
 * as writing CSS files for components to disk for the `DIST_COLLECTION` output
 * target.
 *
 * @param config a user-supplied configuration
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param bundleOpts bundle options for Rollup
 * @returns a Rollup plugin which carries out the necessary work
 */
export const extTransformsPlugin = (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  bundleOpts: BundleOptions
): Plugin => {
  return {
    name: 'extTransformsPlugin',

    /**
     * A custom function targeting the `transform` build hook in Rollup. See here for details:
     * https://rollupjs.org/guide/en/#transform
     *
     * This Rollup build hook has a signature like:
     *
     * ```
     * (code: string, id: string) =>
     *   | string
     *   | null
     *   | {
     *       code?: string,
     *       map?: string | SourceMap,
     *       ast? : ESTree.Program,
     *       moduleSideEffects?: boolean | "no-treeshake" | null,
     *       syntheticNamedExports?: boolean | string | null,
     *       meta?: {[plugin: string]: any} | null
     *     }
     * ```
     *
     * Here we are ignoring the `code` argument and only looking at the `id` argument.
     * We use that `id` to get information about the module in question from disk
     * ourselves so that we can then do some transformations on it.
     *
     * @param _ an unused parameter (normally the code for a given module)
     * @param id the id of a module
     * @returns metadata for Rollup or null if no transformation should be done
     */
    async transform(_, id) {
      if (/\0/.test(id)) {
        return null;
      }

      // The `id` here was possibly previously updated using
      // `serializeImportPath` to annotate the filepath with various metadata
      // serialized to query-params. If that was done for this particular `id`
      // then the `data` prop will not be null.
      const { data } = parseImportPath(id);

      if (data != null) {
        let cmp: d.ComponentCompilerMeta | undefined = undefined;
        const filePath = normalizeFsPath(id);
        const code = await compilerCtx.fs.readFile(filePath);
        if (typeof code !== 'string') {
          return null;
        }

        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, buildCtx, code, filePath);
        const commentOriginalSelector = bundleOpts.platform === 'hydrate' && data.encapsulation === 'scoped';

        if (data.tag) {
          cmp = buildCtx.components.find((c) => c.tagName === data.tag);
          const moduleFile = cmp && compilerCtx.moduleMap.get(cmp.sourceFilePath);

          if (moduleFile) {
            const collectionDirs = config.outputTargets.filter(isOutputTargetDistCollection);
            const relPath = relative(config.srcDir, pluginTransforms.id);

            // If we found a `moduleFile` in the module map above then we
            // should write the transformed CSS file (found in the return value
            // of `runPluginTransformsEsmImports`, above) to disk.
            await Promise.all(
              collectionDirs.map(async (outputTarget) => {
                const collectionPath = join(outputTarget.collectionDir, relPath);
                await compilerCtx.fs.writeFile(collectionPath, pluginTransforms.code);
              })
            );
          }
        }

        const cssTransformResults = await compilerCtx.worker.transformCssToEsm({
          file: pluginTransforms.id,
          input: pluginTransforms.code,
          tag: data.tag,
          encapsulation: data.encapsulation,
          mode: data.mode,
          commentOriginalSelector,
          sourceMap: config.sourceMap,
          minify: config.minifyCss,
          autoprefixer: config.autoprefixCss,
          docs: config.buildDocs,
        });

        // Set style docs
        if (cmp) {
          cmp.styleDocs = cssTransformResults.styleDocs;
        }

        // Track dependencies
        for (const dep of pluginTransforms.dependencies) {
          this.addWatchFile(dep);
          compilerCtx.addWatchFile(dep);
        }

        buildCtx.diagnostics.push(...pluginTransforms.diagnostics);
        buildCtx.diagnostics.push(...cssTransformResults.diagnostics);
        const didError = hasError(cssTransformResults.diagnostics) || hasError(pluginTransforms.diagnostics);
        if (didError) {
          this.error('Plugin CSS transform error');
        }

        const hasUpdatedStyle = buildCtx.stylesUpdated.some((s) => {
          return s.styleTag === data.tag && s.styleMode === data.mode && s.styleText === cssTransformResults.styleText;
        });

        if (!hasUpdatedStyle) {
          buildCtx.stylesUpdated.push({
            styleTag: data.tag,
            styleMode: data.mode,
            styleText: cssTransformResults.styleText,
          });
        }

        return {
          code: cssTransformResults.output,
          map: cssTransformResults.map,
          moduleSideEffects: false,
        };
      }

      return null;
    },
  };
};
