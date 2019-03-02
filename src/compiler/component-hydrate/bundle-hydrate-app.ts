import * as d from '@declarations';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { RollupOptions } from 'rollup'; // types only
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilLoaderPlugin } from '../rollup-plugins/stencil-loader';
import { stencilServerPlugin } from '../rollup-plugins/stencil-server';
import { sys } from '@sys';


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
        stencilServerPlugin(),
        stencilBuildConditionalsPlugin(build),
        globalScriptsPlugin(config, compilerCtx, buildCtx, build),
        componentEntryPlugin(compilerCtx, buildCtx, build, entryModules),
        sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true,
          preferBuiltins: true
        }),
        sys.rollup.plugins.emptyJsResolver(),
        sys.rollup.plugins.commonjs({
          sourceMap: false
        }),
        inMemoryFsRead(compilerCtx, buildCtx),
        ...config.plugins
      ],
      external: [
        'url'
      ],
      onwarn: createOnWarnFn(buildCtx.diagnostics),
    };

    const rollupBuild = await sys.rollup.rollup(rollupOptions);

    const { output } = await rollupBuild.generate({
      format: 'cjs'
    });

    code = output[0].code;

    // hack to remove some unnecessary async ticks
    if (!code.includes(`initializeComponent = async`)) {
      throw new Error(`"initializeComponent = async" not found`);
    }
    code = code.replace(`initializeComponent = async`, `initializeComponent =`);

    // remove the async ticks for now
    // this is temporary until Angular Universal can get async
    code = code.replace(`scheduleUpdate = async`, `scheduleUpdate =`);
    code = code.replace(`await instance.componentWillLoad()`, `instance.componentWillLoad()`);
    code = code.replace(`await instance.componentWillUpdate()`, `instance.componentWillUpdate()`);
    code = code.replace(`await instance.componentWillRender()`, `instance.componentWillRender()`);

  } catch (e) {
    loadRollupDiagnostics(compilerCtx, buildCtx, e);
  }

  return code;
}

const SERVER_ENTRY = `
export { hydrateDocumentSync, renderToStringSync } from '@stencil/core/app';
`;
