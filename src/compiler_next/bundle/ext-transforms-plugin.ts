import * as d from '../../declarations';
import { BundleOptions } from './bundle-interface';
import { hasError, normalizeFsPath } from '@utils';
import { parseImportPath } from '../../compiler/transformers/stencil-import-path';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../../compiler/plugin/plugin';


export const extTransformsPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions): Plugin => {
  return {
    name: 'extTransformsPlugin',

    async transform(_, id) {
      if (/\0/.test(id)) {
        return null;
      }

      const { data } = parseImportPath(id);
      if (data != null) {
        const filePath = normalizeFsPath(id);
        const code = await compilerCtx.fs.readFile(filePath);
        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, code, filePath);

        const modules = Array.from(compilerCtx.moduleMap.values());
        const moduleFile = modules.find(m => m.cmps.some(c => c.tagName === data.tag));
        const commentOriginalSelector = (bundleOpts.platform === 'hydrate') && (data.encapsulation === 'shadow');

        if (moduleFile) {
          const collectionDirs = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.collectionDir);

          const relPath = config.sys.path.relative(config.srcDir, pluginTransforms.id);

          await Promise.all(collectionDirs.map(async outputTarget => {
            const collectionPath = config.sys.path.join(outputTarget.collectionDir, relPath);
            await compilerCtx.fs.writeFile(collectionPath, pluginTransforms.code);
          }));
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
          return (
            s.styleTag === data.tag &&
            s.styleMode === data.mode &&
            s.styleText === cssTransformResults.styleText
          );
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
          moduleSideEffects: false
        };
      }

      return null;
    }
  };
};
