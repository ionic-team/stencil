import * as d from '@declarations';
import inMemoryFsRead from '../rollup-plugins/in-memory-fs-read';
import { createOnWarnFn, loadRollupDiagnostics, normalizePath } from '@utils';
import { RollupBuild, RollupOptions } from 'rollup'; // types only
import { logger, sys } from '@sys';


export async function bundleAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, files: Map<string, string>, bundleInput: string) {
  let outputText = '';

  try {
    const rollupOptions: RollupOptions = {
      input: INPUT_ENTRY,
      plugins: [
        filePlugin(build, files, bundleInput),
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
      onwarn: createOnWarnFn(buildCtx.diagnostics),
    };

    const rollupBuild: RollupBuild = await sys.rollup.rollup(rollupOptions);

    const { output } = await rollupBuild.generate({ format: 'es' });

    if (typeof output[0].code === 'string') {
      outputText = output[0].code.replace(/__import\(/g, 'import(');
    }

  } catch (e) {
    loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    logger.debug(`bundleAppCore, bundleInput: ${bundleInput}`);
  }

  return outputText;
}


function filePlugin(build: d.Build, files: Map<string, string>, bundleInput: string) {
  return {
    resolveId(id: string) {
      id = normalizePath(id);

      if (id === INPUT_ENTRY) {
        return INPUT_ENTRY;
      }
      if (id === STENCIL_CORE) {
        return build.coreImportPath;
      }
      if (files.has(id)) {
        return id;
      }
      return null;
    },
    load(id: string) {
      if (id === INPUT_ENTRY) {
        return bundleInput;
      }
      return files.get(id);
    }
  };
}

const INPUT_ENTRY = ':INPUTENTRY:';
export const STENCIL_CORE = '@stencil/core';
