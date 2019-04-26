import * as d from '../../declarations';
import { generateRollupOutput } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { OutputOptions, RollupBuild } from 'rollup';
import { getDynamicImportFunction, relativeImport } from '@utils';
import { RollupResult } from '../../declarations';

export async function generateEsm(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, rollupBuild: RollupBuild, isBrowserBuild: boolean, outputTargets: d.OutputTargetDistLazy[]) {
  if (!isBrowserBuild && !config.buildDist) {
    return undefined;
  }

  const esmEs5Outputs = config.buildEs5 ? outputTargets.filter(o => !!o.esmEs5Dir) : [];
  const esmOutputs = outputTargets.filter(o => !!o.esmDir);
  const isProd = !build.isDev && isBrowserBuild;
  if (esmOutputs.length + esmEs5Outputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'esm',
      entryFileNames: '[name].esm.js',
      chunkFileNames: isProd ? 'p-[hash].js' : '[name]-[hash].js',
      preferConst: true
    };
    // This is needed until Firefox 67, which ships native dynamic imports
    if (isBrowserBuild) {
      esmOpts.dynamicImportFunction = getDynamicImportFunction(config.fsNamespace);
    }
    const output = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);

    if (output != null) {
      const es2017destinations = esmOutputs.map(o => o.esmDir);
      const componentBundle = await generateLazyModules(config, compilerCtx, buildCtx, es2017destinations, output, 'es2017', isBrowserBuild, '');

      const es5destinations = esmEs5Outputs.map(o => o.esmEs5Dir);
      await generateLazyModules(config, compilerCtx, buildCtx, es5destinations, output, 'es5', isBrowserBuild, '');

      await generateShortcuts(config, compilerCtx, outputTargets, output);
      return componentBundle;
    }
  }
  return undefined;
}

export function generateShortcuts(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[], rollupResult: RollupResult[]) {
  const indexFilename = rollupResult.find(r => r.isIndex).fileName;

  return Promise.all(
    outputTargets.map(async o => {
      if (o.esmDir) {
        if (o.esmIndexFile) {
          const entryPointPath = config.buildEs5 && o.esmEs5Dir
            ? config.sys.path.join(o.esmEs5Dir, indexFilename)
            : config.sys.path.join(o.esmDir, indexFilename);

          const relativePath = relativeImport(config, o.esmIndexFile, entryPointPath);
          const shortcutContent = `export * from '${relativePath}';`;
          await compilerCtx.fs.writeFile(o.esmIndexFile, shortcutContent);
        }
      }
    })
  );
}
