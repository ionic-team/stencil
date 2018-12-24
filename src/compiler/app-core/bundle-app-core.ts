import * as d from '../../declarations';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import inMemoryFsRead from '../bundle/rollup-plugins/in-memory-fs-read';
import { normalizePath } from '../util';


export async function bundleAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, files: Map<string, string>, bundleInput: string) {
  let output = '';

  try {
    const rollup = await config.sys.rollup.rollup({
      input: INPUT_ENTRY,
      plugins: [
        filePlugin(files, bundleInput),
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.emptyJsResolver(),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        inMemoryFsRead(config, compilerCtx, buildCtx),
        ...config.plugins
      ],
      onwarn: createOnWarnFn(config, buildCtx.diagnostics),
    });

    const results = await rollup.generate({ format: 'es' });

    if (results && typeof results.code === 'string') {
      output = results.code.replace(/__import\(/g, 'import(');
    }

  } catch (e) {
    loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    config.logger.debug(`bundleAppCore, bundleInput: ${bundleInput}`);
  }

  return output;
}


function filePlugin(files: Map<string, string>, bundleInput: string) {
  return {
    resolveId(id: string) {
      id = normalizePath(id);

      if (id === INPUT_ENTRY || id === STENCIL_CORE) {
        return INPUT_ENTRY;
      }
      if (files.has(id)) {
        return id;
      }
      return null;
    },
    load(id: string) {
      if (id === INPUT_ENTRY || id === STENCIL_CORE) {
        return bundleInput;
      }
      return files.get(id);
    }
  };
}

const INPUT_ENTRY = ':INPUTENTRY:';
export const STENCIL_CORE = '@stencil/core';
