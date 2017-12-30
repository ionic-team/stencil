import { BuildConfig, BuildContext, ManifestBundle } from '../../util/interfaces';
import bundleResolution from './rollup-plugins/bundle-resolution';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { getBundleEntryInput } from './rollup-bundle';
import graphIt from './rollup-plugins/graph-it';
import { hasError } from '../util';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';


export async function createDependencyGraph(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  // start the bundler on our temporary file
  let rollupBundle;

  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: getBundleEntryInput(manifestBundle),
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
        bundleResolution(manifestBundle, ctx.moduleFiles),
        transpiledInMemoryPlugin(config, ctx),
        localResolution(config),
      ],
      onwarn: createOnWarnFn(ctx.diagnostics, manifestBundle.moduleFiles)

    });
  } catch (err) {
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  }

  if (hasError(ctx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }
}
