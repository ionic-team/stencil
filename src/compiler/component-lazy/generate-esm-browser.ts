import * as d from '../../declarations';
import { generateRollupOutput } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { OutputOptions, RollupBuild } from 'rollup';
import { getDynamicImportFunction } from '@utils';

export async function generateEsmBrowser(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, rollupBuild: RollupBuild, outputTargets: d.OutputTargetDistLazy[]) {
  const esmOutputs = outputTargets.filter(o => !!o.esmDir && !!o.isBrowserBuild);
  const isProd = !build.isDev;
  if (esmOutputs.length) {
    const esmOpts: OutputOptions = {
      format: 'esm',
      entryFileNames: '[name].esm.js',
      chunkFileNames: isProd ? 'p-[hash].js' : '[name]-[hash].js',
      preferConst: true,
      // This is needed until Firefox 67, which ships native dynamic imports
      dynamicImportFunction: getDynamicImportFunction(config.fsNamespace)
    };
    const output = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);

    if (output != null) {
      const es2017destinations = esmOutputs.map(o => o.esmDir);
      const componentBundle = await generateLazyModules(config, compilerCtx, buildCtx, es2017destinations, output, 'es2017', true, '');
      return componentBundle;
    }
  }
  return undefined;
}
