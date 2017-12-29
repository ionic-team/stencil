import { BuildConfig, BuildContext, ManifestBundle } from '../../util/interfaces';
import bundleInputEntry from './rollup-plugins/bundle-input-entry';
import bundleResolution from './rollup-plugins/bundle-resolution';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import graphIt from './rollup-plugins/graph-it';
import { hasError } from '../util';
import transpiledInMemoryPlugin from './rollup-plugins/transpile-in-memory';


export async function createDependencyGraph(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  // start the bundler on our temporary file
  let rollupBundle;
  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: manifestBundle.cacheKey,
      plugins: [
        graphIt(config, ctx.graphData, manifestBundle.cacheKey),
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        bundleInputEntry(ctx,  manifestBundle),
        bundleResolution(manifestBundle),
        transpiledInMemoryPlugin(config, ctx),
      ],
      onwarn: createOnWarnFn(ctx.diagnostics, manifestBundle.moduleFiles)

    });
  } catch (err) {
    console.error(err);
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  }

  if (hasError(ctx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }
}
