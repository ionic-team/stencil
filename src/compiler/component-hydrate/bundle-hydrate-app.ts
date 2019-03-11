import * as d from '../../declarations';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { RollupOptions } from 'rollup'; // types only
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilConsolePlugin } from '../rollup-plugins/stencil-console';
import { stencilLoaderPlugin } from '../rollup-plugins/stencil-loader';
import { stencilServerPlugin } from '../rollup-plugins/stencil-server';


export async function bundleHydrateCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModules: d.EntryModule[], coreSource: string) {
  let code: string = null;

  try {
    const rollupOptions: RollupOptions = {
      input: '@core-entrypoint',
      inlineDynamicImports: true,
      plugins: [
        stencilLoaderPlugin({
          '@core-entrypoint': SERVER_ENTRY,
          '@stencil/core/app': coreSource,
        }),
        stencilServerPlugin(config),
        stencilConsolePlugin(),
        stencilBuildConditionalsPlugin(build),
        globalScriptsPlugin(config, compilerCtx, buildCtx, build),
        componentEntryPlugin(config, compilerCtx, buildCtx, build, entryModules),
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true,
          preferBuiltins: true
        }),
        config.sys.rollup.plugins.emptyJsResolver(),
        config.sys.rollup.plugins.commonjs({
          sourceMap: false
        }),
        inMemoryFsRead(config, compilerCtx, buildCtx),
        ...config.plugins
      ],
      external: [
        'url'
      ],
      onwarn: createOnWarnFn(buildCtx.diagnostics),
    };

    const rollupBuild = await config.sys.rollup.rollup(rollupOptions);

    const { output } = await rollupBuild.generate({
      format: 'cjs'
    });

    code = output[0].code;

  } catch (e) {
    loadRollupDiagnostics(compilerCtx, buildCtx, e);
  }

  return code;
}

const SERVER_ENTRY = `
export { hydrateDocument, renderToString } from '@stencil/core/app';
`;
