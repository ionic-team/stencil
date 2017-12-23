import graphIt from './rollup-plugins/graph-it';
import { hasError } from '../util';
import transpiledInMemoryPlugin from './rollup-plugins/transpile-in-memory';
import stencilManifestsToInputs from './rollup-plugins/stencil-manifest-to-imports';
import { BuildConfig, BuildContext, ManifestBundle } from '../../util/interfaces';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import scss from './rollup-plugins/scss';

export async function createDependencyGraph(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  // start the bundler on our temporary file
  let rollupBundle;
  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: manifestBundle.cacheKey,
      plugins: [
        graphIt(ctx.graphData, manifestBundle.cacheKey),
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        scss({
          output: false
        }),
        stencilManifestsToInputs(manifestBundle),
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
