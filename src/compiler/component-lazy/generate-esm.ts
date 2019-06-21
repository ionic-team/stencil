import * as d from '../../declarations';
import { generateRollupOutput } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { OutputOptions, RollupBuild } from 'rollup';
import { relativeImport } from '@utils';
import { RollupResult } from '../../declarations';

export async function generateEsm(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, rollupBuild: RollupBuild, outputTargets: d.OutputTargetDistLazy[]) {
  const esmEs5Outputs = config.buildEs5 ? outputTargets.filter(o => !!o.esmEs5Dir && !o.isBrowserBuild) : [];
  const esmOutputs = outputTargets.filter(o => !!o.esmDir && !o.isBrowserBuild);
  if (esmOutputs.length + esmEs5Outputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'esm',
      entryFileNames: '[name].mjs',
      preferConst: true
    };

    const output = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (output != null) {
      const es2017destinations = esmOutputs.map(o => o.esmDir);
      await generateLazyModules(config, compilerCtx, buildCtx, es2017destinations, output, 'es2017', false, '');

      const es5destinations = esmEs5Outputs.map(o => o.esmEs5Dir);
      await generateLazyModules(config, compilerCtx, buildCtx, es5destinations, output, 'es5', false, '');

      await copyPolyfills(config, compilerCtx, esmOutputs);
      await generateShortcuts(config, compilerCtx, outputTargets, output);
    }
  }
}

async function copyPolyfills(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[]) {
  const destinations = outputTargets.filter(o => o.polyfills).map(o => o.esmDir);
  if (destinations.length === 0) {
    return;
  }

  const src = config.sys.getClientPath('polyfills');
  const files = await compilerCtx.fs.readdir(src);

  await Promise.all(destinations.map(dest => {
    return Promise.all(files.map(f => {
      return compilerCtx.fs.copyFile(
        f.absPath,
        config.sys.path.join(dest, 'polyfills', f.relPath));
    }));
  }));
}

function generateShortcuts(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[], rollupResult: RollupResult[]) {
  const indexFilename = rollupResult.find(r => r.isIndex).fileName;

  return Promise.all(
    outputTargets.map(async o => {
      if (o.esmDir && o.esmIndexFile) {
        const entryPointPath = config.buildEs5 && o.esmEs5Dir
          ? config.sys.path.join(o.esmEs5Dir, indexFilename)
          : config.sys.path.join(o.esmDir, indexFilename);

        const relativePath = relativeImport(config, o.esmIndexFile, entryPointPath);
        const shortcutContent = `export * from '${relativePath}';`;
        await compilerCtx.fs.writeFile(o.esmIndexFile, shortcutContent);
      }
    })
  );
}
