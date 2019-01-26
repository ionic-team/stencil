import * as d from '@declarations';
import { createOnWarnFn, loadRollupDiagnostics, normalizePath } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { logger, sys } from '@sys';
import { RollupBuild, RollupOptions } from 'rollup'; // types only


export async function bundleAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, appCoreInputEntryFile: string, appInputFiles: Map<string, string>) {
  let outputText: string = null;

  try {
    const rollupOptions: RollupOptions = {
      input: appCoreInputEntryFile,
      plugins: [
        appCoreStencilDependenciesPlugin(),
        appCoreBuildDataPlugin(build),
        appCoreInputFilesPlugin(appInputFiles),
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

    if (Array.isArray(output) && output.length > 0 && typeof output[0].code === 'string') {
      outputText = output[0].code.replace(/__import\(/g, 'import(');
    }

  } catch (e) {
    loadRollupDiagnostics(compilerCtx, buildCtx, e);

    if (logger.level === 'debug') {
      logger.error(`bundleAppCore, inputEntryText: ${appInputFiles.get(appCoreInputEntryFile)}`);
    }
  }

  return outputText;
}


function appCoreInputFilesPlugin(appInputFiles: Map<string, string>) {
  return {

    resolveId(id: string) {
      id = normalizePath(id);
      if (appInputFiles.has(id)) {
        return id;
      }
      return null;
    },

    load(id: string) {
      const inputFileText = appInputFiles.get(normalizePath(id));
      if (typeof inputFileText === 'string') {
        return inputFileText;
      }
      return null;
    },

    name: 'appCoreInputFilesPlugin'
  };
}


function appCoreBuildDataPlugin(build: d.Build) {
  const buildData = `export const BUILD = ${JSON.stringify(build)}`;

  return {
    resolveId(id: string) {
      if (id === '@stencil/core/build-conditionals') {
        return '@stencil/core/build-conditionals';
      }
      return null;
    },

    load(id: string) {
      if (id === '@stencil/core/build-conditionals') {
        return buildData;
      }
      return null;
    },

    name: 'appCoreBuildDataPlugin'
  };
}


function appCoreStencilDependenciesPlugin() {

  return {
    resolveId(id: string) {
      if (id === '@stencil/core/platform') {
        return sys.path.join(sys.compiler.distDir, 'client', 'index.mjs');
      }
      if (id === '@stencil/core/runtime') {
        return sys.path.join(sys.compiler.distDir, 'runtime', 'index.mjs');
      }
      if (id === '@stencil/core/utils') {
        return sys.path.join(sys.compiler.distDir, 'utils', 'index.mjs');
      }
      return null;
    },

    name: 'appCoreStencilDependenciesPlugin'
  };
}
