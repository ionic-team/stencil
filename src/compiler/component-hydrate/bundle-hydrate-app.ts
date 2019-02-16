import * as d from '@declarations';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { logger, sys } from '@sys';
import { RollupOptions } from 'rollup'; // types only
import { stencilAppCorePlugin } from '../rollup-plugins/stencil-app-core';
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilServerEntryPointPlugin } from '../rollup-plugins/stencil-server-entrypoint';


export async function bundleHydrateCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModules: d.EntryModule[], entryFilePath: string) {
  let code: string = null;

  try {
    const rollupOptions: RollupOptions = {
      input: '@core-entrypoint',
      plugins: [
        stencilAppCorePlugin(entryFilePath),
        stencilServerEntryPointPlugin(),
        stencilBuildConditionalsPlugin(build),
        globalScriptsPlugin(config, compilerCtx),
        componentEntryPlugin(compilerCtx, buildCtx, build, entryModules),
        sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        sys.rollup.plugins.emptyJsResolver(),
        sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        inMemoryFsRead(compilerCtx, buildCtx),
        ...config.plugins
      ],
      onwarn: createOnWarnFn(logger, buildCtx.diagnostics),
    };

    const rollupBuild = await sys.rollup.rollup(rollupOptions);

    const { output } = await rollupBuild.generate({
      format: 'cjs'
    });

    code = output[0].code;

  } catch (e) {
    loadRollupDiagnostics(compilerCtx, buildCtx, e);
  }

  return code;
}
