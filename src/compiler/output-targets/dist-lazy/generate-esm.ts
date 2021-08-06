import type * as d from '../../../declarations';
import { generateLazyModules } from './generate-lazy-module';
import { generateRollupOutput } from '../../app-core/bundle-app-core';
import { join } from 'path';
import type { OutputOptions, RollupBuild } from 'rollup';
import { relativeImport } from '../output-utils';
import type { RollupResult } from '../../../declarations';

export const generateEsm = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupBuild: RollupBuild,
  outputTargets: d.OutputTargetDistLazy[]
) => {
  const esmEs5Outputs = config.buildEs5 ? outputTargets.filter((o) => !!o.esmEs5Dir && !o.isBrowserBuild) : [];
  const esmOutputs = outputTargets.filter((o) => !!o.esmDir && !o.isBrowserBuild);
  if (esmOutputs.length + esmEs5Outputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'es',
      entryFileNames: '[name].js',
      assetFileNames: '[name]-[hash][extname]',
      preferConst: true,
    };
    const outputTargetType = esmOutputs[0].type;
    const output = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (output != null) {
      const es2017destinations = esmOutputs.map((o) => o.esmDir);
      await generateLazyModules(
        config,
        compilerCtx,
        buildCtx,
        outputTargetType,
        es2017destinations,
        output,
        'es2017',
        false,
        ''
      );

      const es5destinations = esmEs5Outputs.map((o) => o.esmEs5Dir);
      await generateLazyModules(
        config,
        compilerCtx,
        buildCtx,
        outputTargetType,
        es5destinations,
        output,
        'es5',
        false,
        ''
      );

      await copyPolyfills(config, compilerCtx, esmOutputs);
      await generateShortcuts(config, compilerCtx, outputTargets, output);
    }
  }
};

const copyPolyfills = async (config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[]) => {
  const destinations = outputTargets.filter((o) => o.polyfills).map((o) => o.esmDir);
  if (destinations.length === 0) {
    return;
  }

  const src = join(config.sys.getCompilerExecutingPath(), '..', '..', 'internal', 'client', 'polyfills');
  const files = await compilerCtx.fs.readdir(src);

  await Promise.all(
    destinations.map((dest) => {
      return Promise.all(
        files.map((f) => {
          return compilerCtx.fs.copyFile(f.absPath, join(dest, 'polyfills', f.relPath));
        })
      );
    })
  );
};

const generateShortcuts = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  outputTargets: d.OutputTargetDistLazy[],
  rollupResult: RollupResult[]
) => {
  const indexFilename = rollupResult.find((r) => r.type === 'chunk' && r.isIndex).fileName;

  return Promise.all(
    outputTargets.map(async (o) => {
      if (o.esmDir && o.esmIndexFile) {
        const entryPointPath =
          config.buildEs5 && o.esmEs5Dir ? join(o.esmEs5Dir, indexFilename) : join(o.esmDir, indexFilename);

        const relativePath = relativeImport(o.esmIndexFile, entryPointPath);
        const shortcutContent = `export * from '${relativePath}';`;
        await compilerCtx.fs.writeFile(o.esmIndexFile, shortcutContent, { outputTargetType: o.type });
      }
    })
  );
};
