import * as d from '../../declarations';
import { BundleOptions } from './bundle-interface';
import { hasError, normalizeFsPath } from '@utils';
import { parseStencilImportPathData } from '../../compiler/transformers/stencil-import-path';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../../compiler/plugin/plugin';


export const extTransformsPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions): Plugin => {
  return {
    name: 'extTransformsPlugin',

    async transform(_, id) {
      if (/\0/.test(id)) {
        return null;
      }
      const pathData = parseStencilImportPathData(id);
      if (pathData !== null) {
        // TODO, offline caching
        const filePath = normalizeFsPath(id);
        const code = await compilerCtx.fs.readFile(filePath);
        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, code, filePath);

        const modules = Array.from(compilerCtx.moduleMap.values());
        const moduleFile = modules.find(m => m.cmps.some(c => c.tagName === pathData.tag));

        if (moduleFile) {
          const collectionDirs = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.collectionDir);

          const relPath = config.sys.path.relative(config.srcDir, pluginTransforms.id);

          await Promise.all(collectionDirs.map(async outputTarget => {
            const collectionPath = config.sys.path.join(outputTarget.collectionDir, relPath);
            await compilerCtx.fs.writeFile(collectionPath, pluginTransforms.code);
          }));
        }

        const commentOriginalSelector = (bundleOpts.platform === 'hydrate');

        const cssTransformResults = await compilerCtx.worker.transformCssToEsm({
          filePath: pluginTransforms.id,
          code: pluginTransforms.code,
          tagName: pathData.tag,
          encapsulation: pathData.encapsulation,
          modeName: pathData.mode,
          commentOriginalSelector,
          sourceMap: config.sourceMap,
          minify: config.minifyCss,
          autoprefixer: config.autoprefixCss,
        });

        // Track dependencies
        pluginTransforms.dependencies.forEach(dep => {
          this.addWatchFile(dep);
        });

        buildCtx.diagnostics.push(...pluginTransforms.diagnostics);
        buildCtx.diagnostics.push(...cssTransformResults.diagnostics);
        const didError = hasError(cssTransformResults.diagnostics) || hasError(pluginTransforms.diagnostics);
        if (didError) {
          this.error('Plugin CSS transform error');
        }

        const hasUpdatedStyle = buildCtx.stylesUpdated.some(s => {
          return s.styleTag === pathData.tag && s.styleMode === pathData.mode && s.styleText === cssTransformResults.styleText
        });

        if (!hasUpdatedStyle) {
          buildCtx.stylesUpdated.push({
            styleTag: pathData.tag,
            styleMode: pathData.mode,
            styleText: cssTransformResults.styleText,
          });
        }

        return {
          code: cssTransformResults.code,
          map: cssTransformResults.map,
          moduleSideEffects: false
        };
      }
      return null;
    }
  };
};
