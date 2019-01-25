import * as d from '@declarations';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { logger, sys } from '@sys';
import { RollupBuild, RollupOptions } from 'rollup'; // types only


export async function bundleAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, _build: d.Build, _files: Map<string, string>, _cmpRuntimeData: d.LazyBundlesRuntimeMeta) {
  let outputText = '';

  try {
    const rollupOptions: RollupOptions = {
      input: INPUT_ENTRY,
      plugins: [
        // filePlugin(files, bundleInput),
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

    const rollupBuild: RollupBuild = await sys.rollup.rollup(rollupOptions);

    const { output } = await rollupBuild.generate({ format: 'es' });

    if (typeof output[0].code === 'string') {
      outputText = output[0].code.replace(/__import\(/g, 'import(');
    }

  } catch (e) {
    loadRollupDiagnostics(sys, config, compilerCtx, buildCtx, e);
  }

  return outputText;
}


// function filePlugin(files: Map<string, string>, bundleInput: string) {
//   return {
//     resolveId(id: string) {
//       id = normalizePath(id);

//       if (id === INPUT_ENTRY) {
//         return INPUT_ENTRY;
//       }
//       if (files.has(id)) {
//         return id;
//       }
//       return null;
//     },
//     load(id: string) {
//       if (id === INPUT_ENTRY) {
//         return bundleInput;
//       }
//       return files.get(id);
//     }
//   };
// }

const INPUT_ENTRY = ':INPUTENTRY:';
