import type * as d from '../../declarations';
import type { BundleOptions } from './bundle-interface';
import { hasError, normalizeFsPath } from '@utils';
import { isOutputTargetDistCollection } from '../output-targets/output-utils';
import { join, relative } from 'path';
import { parseImportPath } from '../transformers/stencil-import-path';
import type { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../plugin/plugin';

export const extTransformsPlugin = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  bundleOpts: BundleOptions
): Plugin => {
  return {
    name: 'extTransformsPlugin',

    async transform(_, id) {
      if (/\0/.test(id)) {
        return null;
      }

      const { data } = parseImportPath(id);
      if (data != null) {
        let cmp: d.ComponentCompilerMeta;
        const filePath = normalizeFsPath(id);
        const code = await compilerCtx.fs.readFile(filePath);
        if (typeof code !== 'string') {
          return null;
        }

        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, buildCtx, code, filePath);
        const commentOriginalSelector = bundleOpts.platform === 'hydrate' && data.encapsulation === 'shadow';

        if (data.tag) {
          cmp = buildCtx.components.find((c) => c.tagName === data.tag);
          const moduleFile = cmp && compilerCtx.moduleMap.get(cmp.sourceFilePath);

          if (moduleFile) {
            const collectionDirs = config.outputTargets.filter(isOutputTargetDistCollection);

            const relPath = relative(config.srcDir, pluginTransforms.id);

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
