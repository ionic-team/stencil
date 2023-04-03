import { createJsVarName, isString, loadTypeScriptDiagnostics, normalizePath, safeJSONStringify } from '@utils';
import MagicString from 'magic-string';
import { basename } from 'path';
import type { LoadResult, Plugin, ResolveIdResult, TransformResult } from 'rollup';
import ts from 'typescript';

import type * as d from '../../declarations';
import { removeCollectionImports } from '../transformers/remove-collection-imports';
import {
  APP_DATA_CONDITIONAL,
  STENCIL_APP_DATA_ID,
  STENCIL_APP_GLOBALS_ID,
  STENCIL_CORE_ID,
  STENCIL_INTERNAL_HYDRATE_ID,
} from './entry-alias-ids';

export const appDataPlugin = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  build: d.BuildConditionals,
  platform: 'client' | 'hydrate' | 'worker'
): Plugin => {
  if (!platform) {
    return {
      name: 'appDataPlugin',
    };
  }
  const globalScripts = getGlobalScriptData(config, compilerCtx);

  return {
    name: 'appDataPlugin',

    resolveId(id: string, importer: string | undefined): ResolveIdResult {
      if (id === STENCIL_APP_DATA_ID || id === STENCIL_APP_GLOBALS_ID) {
        if (platform === 'worker') {
          this.error('@stencil/core packages cannot be imported from a worker.');
        }

        if (platform === 'hydrate' || STENCIL_APP_GLOBALS_ID) {
          // hydrate will always bundle app-data and runtime
          // and the load() fn will build a custom globals import
          return id;
        } else if (platform === 'client' && importer && importer.endsWith(APP_DATA_CONDITIONAL)) {
          // since the importer ends with ?app-data=conditional we know that
          // we need to build custom app-data based off of component metadata
          // return the same "id" so that the "load()" method knows to
          // build custom app-data
          return id;
        }
        // for a client build that does not have ?app-data=conditional at the end then we
        // do not want to create custom app-data, but should use the default
      }
      return null;
    },

    load(id: string): LoadResult {
      if (id === STENCIL_APP_GLOBALS_ID) {
        const s = new MagicString(``);
        appendGlobalScripts(globalScripts, s);
        return s.toString();
      }
      if (id === STENCIL_APP_DATA_ID) {
        // build custom app-data based off of component metadata
        const s = new MagicString(``);
        appendNamespace(config, s);
        appendBuildConditionals(config, build, s);
        appendEnv(config, s);
        return s.toString();
      }
      if (id !== config.globalScript) {
        return null;
      }

      const module = compilerCtx.moduleMap.get(config.globalScript);
      if (!module) {
        return null;
      } else if (!module.sourceMapFileText) {
        return {
          code: module.staticSourceFileText,
          map: null,
        };
      }

      const sourceMap: d.SourceMap = JSON.parse(module.sourceMapFileText);
      sourceMap.sources = sourceMap.sources.map((src) => basename(src));
      return { code: module.staticSourceFileText, map: sourceMap };
    },

    transform(code: string, id: string): TransformResult {
      id = normalizePath(id);
      if (globalScripts.some((s) => s.path === id)) {
        const program = this.parse(code, {});
        const needsDefault = !(program as any).body.some((s: any) => s.type === 'ExportDefaultDeclaration');
        const defaultExport = needsDefault ? '\nexport const globalFn = () => {};\nexport default globalFn;' : '';
        code = getContextImport(platform) + code + defaultExport;

        const compilerOptions: ts.CompilerOptions = { ...config.tsCompilerOptions };
        compilerOptions.module = ts.ModuleKind.ESNext;

        const results = ts.transpileModule(code, {
          compilerOptions,
          fileName: id,
          transformers: {
            after: [removeCollectionImports(compilerCtx)],
          },
        });
        buildCtx.diagnostics.push(...loadTypeScriptDiagnostics(results.diagnostics));

        if (config.sourceMap) {
          // generate the sourcemap for global script
          const codeMs = new MagicString(code);
          const codeMap = codeMs.generateMap({
            source: id,
            // this is the name of the sourcemap, not to be confused with the `file` field in a generated sourcemap
            file: id + '.map',
            includeContent: true,
            hires: true,
          });

          return {
            code: results.outputText,
            map: {
              ...codeMap,
              // MagicString changed their types in this PR: https://github.com/Rich-Harris/magic-string/pull/235
              // so that their `sourcesContent` is of type `(string | null)[]`. But, it will only return `[null]` if
              // `includeContent` is set to `false`. Since we explicitly set `includeContent: true`, we can override
              // the type to satisfy Rollup's type expectation
              sourcesContent: codeMap.sourcesContent as string[],
            },
          };
        }

        return { code: results.outputText };
      }
      return null;
    },
  };
};

export const getGlobalScriptData = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const globalScripts: GlobalScript[] = [];

  if (isString(config.globalScript)) {
    const mod = compilerCtx.moduleMap.get(config.globalScript);
    const globalScript = compilerCtx.version === 2 ? config.globalScript : mod && mod.jsFilePath;

    if (globalScript) {
      globalScripts.push({
        defaultName: createJsVarName(config.namespace + 'GlobalScript'),
        path: normalizePath(globalScript),
      });
    }
  }

  compilerCtx.collections.forEach((collection) => {
    if (collection.global != null && isString(collection.global.sourceFilePath)) {
      let defaultName = createJsVarName(collection.collectionName + 'GlobalScript');
      if (globalScripts.some((s) => s.defaultName === defaultName)) {
        defaultName += globalScripts.length;
      }
      globalScripts.push({
        defaultName,
        path: normalizePath(collection.global.sourceFilePath),
      });
    }
  });

  return globalScripts;
};

const appendGlobalScripts = (globalScripts: GlobalScript[], s: MagicString) => {
  if (globalScripts.length === 1) {
    s.prepend(`import appGlobalScript from '${globalScripts[0].path}';\n`);
    s.append(`export const globalScripts = appGlobalScript;\n`);
  } else if (globalScripts.length > 1) {
    globalScripts.forEach((globalScript) => {
      s.prepend(`import ${globalScript.defaultName} from '${globalScript.path}';\n`);
    });

    s.append(`export const globalScripts = () => {\n`);
    globalScripts.forEach((globalScript) => {
      s.append(`  ${globalScript.defaultName}();\n`);
    });
    s.append(`};\n`);
  } else {
    s.append(`export const globalScripts = () => {};\n`);
  }
};

const appendBuildConditionals = (config: d.Config, build: d.BuildConditionals, s: MagicString) => {
  const buildData = Object.keys(build)
    .sort()
    .map((key) => key + ': ' + ((build as any)[key] ? 'true' : 'false'))
    .join(', ');

  s.append(`export const BUILD = /* ${config.fsNamespace} */ { ${buildData} };\n`);
};

const appendEnv = (config: d.Config, s: MagicString) => {
  s.append(`export const Env = /* ${config.fsNamespace} */ ${safeJSONStringify(config.env ?? {})};\n`);
};

const appendNamespace = (config: d.Config, s: MagicString) => {
  s.append(`export const NAMESPACE = '${config.fsNamespace}';\n`);
};

const getContextImport = (platform: string) => {
  return `import { Context } from '${platform === 'hydrate' ? STENCIL_INTERNAL_HYDRATE_ID : STENCIL_CORE_ID}';\n`;
};

interface GlobalScript {
  defaultName: string;
  path: string;
}
