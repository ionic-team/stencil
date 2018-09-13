
import * as d from '../../declarations';

import { getIntroPlaceholder } from '../../util/data-serialize';
import { getCoreEsmFileName } from '../app/app-file-naming';
import { hasError } from '../util';
import { transpileToEs5Main } from '../transpile/transpile-to-es5-main';
import { minifyJs } from '../minifier';

export async function deriveModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFormats: d.JSModuleFormats) {
  if (!moduleFormats) {
    return undefined;
  }
  const modules = await Promise.all([
    deriveModule(config, compilerCtx, buildCtx, 'es2017', true, moduleFormats.esm),
    // deriveModule(config, compilerCtx, buildCtx, 'es2017', false, moduleFormats.esm),
    deriveModule(config, compilerCtx, buildCtx, 'es5', false, moduleFormats.esm),
    deriveModule(config, compilerCtx, buildCtx, 'es5', true, moduleFormats.amd),
  ]);

  const rawModules = modules.filter(m => !!m);
  if (rawModules.length === 0) {
    return undefined;
  }
  return rawModules;
}

function createModule(moduleList: d.JSModuleList, sourceTarget: d.SourceTarget, isBrowser: boolean): d.DerivedModule {

  const list = Object.keys(moduleList).map(chunkKey => ({
    entryKey: chunkKey.replace('.js', ''),
    filename: chunkKey,
    code: moduleList[chunkKey].code
  }));

  return {
    list,
    sourceTarget,
    isBrowser
  };
}

async function deriveModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, sourceTarget: d.SourceTarget, isBrowser: boolean, moduleList: d.JSModuleList) {
  // skip if moduleList is not defined
  if (!moduleList) {
    return undefined;
  }

  // skip if es5 build is disabled
  if (sourceTarget === 'es5' && !config.buildEs5) {
    return undefined;
  }

  // skip non-browser builds if ESM is disabled
  if (!isBrowser && !config.buildEsm) {
    return undefined;
  }

  const module = createModule(moduleList, sourceTarget, isBrowser);

  await Promise.all(
    module.list.map(async chunk =>
      deriveChunk(config, compilerCtx, buildCtx, sourceTarget, isBrowser, chunk))
  );
  return module;
}

async function deriveChunk(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, sourceTarget: d.SourceTarget, isBrowser: boolean, chunk: d.DerivedChunk) {
  // replace intro placeholder with an actual intro statement
  chunk.code = chunk.code.replace(getIntroPlaceholder(), generateIntro(config, isBrowser));

  // transpile
  if (sourceTarget === 'es5') {
    chunk.code = await transpileEs5Bundle(config, compilerCtx, buildCtx, isBrowser, chunk.code);
    if (!isBrowser) {
      chunk.code = chunk.code.replace(`from "tslib";`, `from '../polyfills/tslib.js';`);
    }
  }

  // // minify
  if (config.minifyJs) {
    chunk.code = await minifyJs(config, compilerCtx, buildCtx.diagnostics, chunk.code, sourceTarget, true);
  }
}


async function transpileEs5Bundle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, isBrowser: boolean, jsText: string, ) {
  // use typescript to convert this js text into es5
  const transpileResults = await transpileToEs5Main(config, compilerCtx, jsText, isBrowser);
  if (transpileResults.diagnostics && transpileResults.diagnostics.length > 0) {
    buildCtx.diagnostics.push(...transpileResults.diagnostics);

    if (hasError(transpileResults.diagnostics)) {
      return jsText;
    }
  }
  return transpileResults.code;
}

function generateIntro(config: d.Config, isBrowser: boolean) {
  return isBrowser
    ? `const { h } = window.${config.namespace};`
    : `import { h } from '../${getCoreEsmFileName(config)}';`;
}
