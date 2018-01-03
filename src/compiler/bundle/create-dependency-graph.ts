import { BuildConfig, BuildContext, Bundle } from '../../util/interfaces';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import graphIt from './rollup-plugins/graph-it';
import { hasError } from '../util';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';


export async function createDependencyGraph(config: BuildConfig, ctx: BuildContext, bundle: Bundle) {
  // start the bundler on our temporary file
  let rollupBundle;

  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: bundle.entryKey,
      cache: ctx.rollupCache[bundle.entryKey],
      plugins: [
        graphIt(config, ctx.graphData, bundle.entryKey),
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        bundleEntryFile(bundle),
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
