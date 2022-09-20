import { hasError, normalizeFsPath } from '@utils';
import { join, relative } from 'path';
import type { Plugin } from 'rollup';

import type * as d from '../../declarations';
import { isOutputTargetDistCollection } from '../output-targets/output-utils';
import { runPluginTransformsEsmImports } from '../plugin/plugin';
import { parseImportPath } from '../transformers/stencil-import-path';
import type { BundleOptions } from './bundle-interface';

/**
 * A Rollup plugin which bundles up some transformation of CSS imports as well
 * as writing some files to disk for the `DIST_COLLECTION` output target.
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
     * Here we are ignoring the first argument (which contains the module's source code) and
     * only looking at the `id` argument. We use that `id` to get information about the module
     * in question from disk ourselves so that we can then do some transformations on it.
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

        // We need to check whether the current build is a dev-mode watch build w/ HMR enabled in
        // order to know how we'll want to set `commentOriginalSelector` (below). If we are doing
        // a hydrate build we need to set this to `true` because commenting-out selectors is what
        // gives us support for scoped CSS w/ hydrated components (we don't support shadow DOM and
        // styling via that route for them). However, we don't want to comment selectors in dev
        // mode when using HMR in the browser, since there we _do_ support putting stylesheets into
        // the shadow DOM and commenting out e.g. the `:host` selector in those stylesheets will
        // break components' CSS when an HMR update is sent to the browser.
        //
        // See https://github.com/ionic-team/stencil/issues/3461 for details
        const isDevWatchHMRBuild =
          config.flags.watch &&
          config.flags.dev &&
          config.flags.serve &&
          (config.devServer?.reloadStrategy ?? null) === 'hmr';
        const commentOriginalSelector =
          bundleOpts.platform === 'hydrate' && data.encapsulation === 'shadow' && !isDevWatchHMRBuild;

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
