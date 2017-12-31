import { BuildConfig, BuildContext, Bundle } from '../../util/interfaces';
import bundleResolution from './rollup-plugins/bundle-resolution';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { getBundleEntryInput } from './rollup-bundle';
import graphIt from './rollup-plugins/graph-it';
import { hasError } from '../util';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';


export async function createDependencyGraph(config: BuildConfig, ctx: BuildContext, bundle: Bundle) {
  // start the bundler on our temporary file
  let rollupBundle;

  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: getBundleEntryInput(bundle),
      plugins: [
        graphIt(config, ctx.graphData, bundle.cacheKey),
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        bundleResolution(bundle, ctx.moduleFiles),
        transpiledInMemoryPlugin(config, ctx),
        localResolution(config),
      ],
      onwarn: createOnWarnFn(ctx.diagnostics, bundle.moduleFiles)

    });
  } catch (err) {
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  }

  if (hasError(ctx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }
}
