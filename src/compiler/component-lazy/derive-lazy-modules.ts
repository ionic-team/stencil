import * as d from '@declarations';
import { transpileToEs5Main } from '../transpile/transpile-to-es5-main';


export async function deriveLazyModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, lazyModuleFormats: d.JSModuleFormats) {
  if (lazyModuleFormats == null) {
    return null;
  }

  const modules = await Promise.all([
    deriveModule(config, compilerCtx, buildCtx, lazyModuleFormats.esm, 'es2017', 'esm'),
    // deriveModule(config, compilerCtx, buildCtx, lazyModuleFormats.esm, 'es5', 'esm'),
    // deriveModule(config, compilerCtx, buildCtx, lazyModuleFormats.esm, 'es5', 'amd')
  ]);

  const derivedModules = modules.filter(m => m != null);
  if (derivedModules.length === 0) {
    return null;
  }

  return derivedModules;
}


async function deriveModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleList: d.JSModuleList, sourceTarget: d.SourceTarget, moduleFormat: d.ModuleFormat) {
  // skip if moduleList is not defined
  if (moduleList == null) {
    return null;
  }

  // skip if es5 build is disabled
  if (sourceTarget === 'es5' && !config.buildEs5) {
    return null;
  }

  const list = Object.keys(moduleList).map(chunkKey => ({
    entryKey: chunkKey.replace('.js', '').replace('.mjs', ''),
    filename: chunkKey,
    code: moduleList[chunkKey].code
  }));

  const derivedModule: d.DerivedModule = {
    list,
    sourceTarget,
    moduleFormat
  };

  if (sourceTarget === 'es5') {
    const promises = derivedModule.list.map(chunk =>
      transpileToEs5Target(config, compilerCtx, buildCtx, chunk)
    );
    await Promise.all(promises);
  }

  return derivedModule;
}


async function transpileToEs5Target(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, chunk: d.DerivedChunk) {
  // use typescript to convert this js text into es5
  const transpileResults = await transpileToEs5Main(config, compilerCtx, chunk.code);
  if (transpileResults.diagnostics && transpileResults.diagnostics.length > 0) {
    buildCtx.diagnostics.push(...transpileResults.diagnostics);

  } else {
    chunk.code = transpileResults.code;
  }

  return chunk;
}


// async function deriveChunk(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, sourceTarget: d.SourceTarget, isBrowser: boolean, chunk: d.DerivedChunk) {
//   // replace intro placeholder with an actual intro statement
//   chunk.code = chunk.code.replace(MODULE_INTRO_PLACEHOLDER, generateIntro(config, isBrowser));

//   if (sourceTarget === 'es5') {
//     chunk.code = await transpileEs5Bundle(config, compilerCtx, buildCtx, isBrowser, chunk.code);
//     if (!isBrowser) {
//       chunk.code = chunk.code.replace(`from "tslib";`, `from '../polyfills/tslib.js';`);
//     }
//   }
// }
