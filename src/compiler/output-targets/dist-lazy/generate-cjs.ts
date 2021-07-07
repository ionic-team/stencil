import type * as d from '../../../declarations';
import { generateRollupOutput } from '../../app-core/bundle-app-core';
import { generateLazyModules } from './generate-lazy-module';
import { join } from 'path';
import type { OutputOptions, RollupBuild } from 'rollup';
import { relativeImport } from '../output-utils';

export const generateCjs = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupBuild: RollupBuild,
  outputTargets: d.OutputTargetDistLazy[],
) => {
  const cjsOutputs = outputTargets.filter(o => !!o.cjsDir);

  if (cjsOutputs.length > 0) {
    const outputTargetType = cjsOutputs[0].type;
    const esmOpts: OutputOptions = {
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      assetFileNames: '[name]-[hash][extname]',
      preferConst: true,
    };
    const results = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (results != null) {
      const destinations = cjsOutputs.map(o => o.cjsDir);
      await generateLazyModules(
        config,
        compilerCtx,
        buildCtx,
        outputTargetType,
        destinations,
        results,
        'es2017',
        false,
        '.cjs',
      );
      await generateShortcuts(compilerCtx, results, cjsOutputs);
    }
  }
};

const generateShortcuts = (
  compilerCtx: d.CompilerCtx,
  rollupResult: d.RollupResult[],
  outputTargets: d.OutputTargetDistLazy[],
) => {
  const indexFilename = rollupResult.find(r => r.type === 'chunk' && r.isIndex).fileName;
  return Promise.all(
    outputTargets.map(async o => {
      if (o.cjsIndexFile) {
        const entryPointPath = join(o.cjsDir, indexFilename);
        const relativePath = relativeImport(o.cjsIndexFile, entryPointPath);
        const shortcutContent = `module.exports = require('${relativePath}');\n`;
        await compilerCtx.fs.writeFile(o.cjsIndexFile, shortcutContent, { outputTargetType: o.type });
      }
    }),
  );
};
