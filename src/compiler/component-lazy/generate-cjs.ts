import * as d from '../../declarations';
import { generateRollupOutput } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { OutputOptions, RollupBuild } from 'rollup';
import { relativeImport } from '@utils';

export async function generateCjs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, rollupBuild: RollupBuild, outputTargets: d.OutputTargetDistLazy[]) {
  const cjsOutputs = outputTargets.filter(o => !!o.cjsDir);

  if (cjsOutputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
    };
    const results = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (results != null) {
      const destinations = cjsOutputs.map(o => o.cjsDir);
      await generateLazyModules(config, compilerCtx, buildCtx, destinations, results, 'es2017', '.cjs', false);
      await generateShortcuts(config, compilerCtx, cjsOutputs);
    }
  }
}

function generateShortcuts(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[]) {
  return Promise.all(outputTargets.map(async o => {
    if (o.cjsIndexFile) {
      const entryPointPath = config.sys.path.join(o.cjsDir, 'index.cjs.js');
      const relativePath = relativeImport(config, o.cjsIndexFile, entryPointPath);
      const shortcutContent = `module.exports = require('${relativePath}');`;
      await compilerCtx.fs.writeFile(o.cjsIndexFile, shortcutContent);
    }
  }));
}
