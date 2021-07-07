import type * as d from '../../../declarations';
import { generateRollupOutput } from '../../app-core/bundle-app-core';
import { generateLazyModules } from './generate-lazy-module';
import type { OutputOptions, RollupBuild } from 'rollup';
import { getDynamicImportFunction } from '@utils';

export const generateEsmBrowser = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupBuild: RollupBuild,
  outputTargets: d.OutputTargetDistLazy[],
) => {
  const esmOutputs = outputTargets.filter(o => !!o.esmDir && !!o.isBrowserBuild);
  if (esmOutputs.length) {
    const outputTargetType = esmOutputs[0].type;
    const esmOpts: OutputOptions = {
      format: 'es',
      entryFileNames: '[name].esm.js',
      chunkFileNames: config.hashFileNames ? 'p-[hash].js' : '[name]-[hash].js',
      assetFileNames: config.hashFileNames ? 'p-[hash][extname]' : '[name]-[hash][extname]',
      preferConst: true,
    };
    if (config.extras.dynamicImportShim) {
      // for Edge 16-18
      esmOpts.dynamicImportFunction = getDynamicImportFunction(config.fsNamespace);
    }
    const output = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);

    if (output != null) {
      const es2017destinations = esmOutputs.map(o => o.esmDir);
      const componentBundle = await generateLazyModules(
        config,
        compilerCtx,
        buildCtx,
        outputTargetType,
        es2017destinations,
        output,
        'es2017',
        true,
        '',
      );
      return componentBundle;
    }
  }
  return undefined;
};
