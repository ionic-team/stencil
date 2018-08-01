import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleMap } from '../../declarations';
import { catchError } from '../util';
import { createBundle } from './rollup-bundle';
import { minifyJs } from '../minifier';
import { writeEntryModules, writeEsModules, writeEsmEs5Modules, writeLegacyModules } from './write-bundles';
import { ENTRY_KEY_PREFIX } from '../entries/entry-modules';


export async function generateBundleModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]): Promise<JSModuleMap> {
  const results: JSModuleMap = {
    esm: {},
    es5: {},
    esmEs5: {}
  };

  if (entryModules.length === 0) {
    // no entry modules, so don't bother
    return results;
  }

  await writeEntryModules(config, compilerCtx, entryModules);

  try {
    // run rollup, but don't generate yet
    // returned rollup bundle can be reused for es module and legacy
    const rollupBundle = await createBundle(config, compilerCtx, buildCtx, entryModules);
    if (buildCtx.hasError || !buildCtx.isActiveBuild) {
      // rollup errored, so let's not continue
      return results;
    }

    const asyncResults = await Promise.all([
      // [0] bundle using only es modules and dynamic imports
      await writeEsModules(config, rollupBundle),

      // [1] bundle using commonjs using jsonp callback
      await writeLegacyModules(config, rollupBundle, entryModules),

      // [2] write the esm/es5 version when doing dist builds
      await writeEsmEs5Modules(config, rollupBundle)
    ]);

    if (buildCtx.hasError || !buildCtx.isActiveBuild) {
      // someone could have errored
      return results;
    }

    if (asyncResults[0]) {
      results.esm = asyncResults[0];
    }

    if (asyncResults[1]) {
      results.es5 = asyncResults[1];
    }

    if (asyncResults[2]) {
      results.esmEs5 = asyncResults[2];
    }

    if (config.minifyJs) {
      await minifyChunks(config, compilerCtx, buildCtx, results);
    }

  } catch (err) {
    catchError(buildCtx.diagnostics, err);
  }

  return results;
}


async function minifyChunks(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, results: JSModuleMap) {
  const promises = Object.keys(results).map(async (moduleType: 'esm' | 'es5' | 'esmEs5') => {
    const jsModuleList = results[moduleType];
    if (jsModuleList == null) {
      return null;
    }

    const promises = Object.keys(jsModuleList)
      .filter(m => !m.startsWith(ENTRY_KEY_PREFIX))
      .map(chunkKey => jsModuleList[chunkKey])
      .map(async chunk => {
        if (!chunk || !chunk.code) {
          return;
        }

        const sourceTarget = (moduleType === 'es5' || moduleType === 'esmEs5') ? 'es5' : 'es2017';
        const minifyJsResults = await minifyJs(config, compilerCtx, chunk.code, sourceTarget, true);

        if (minifyJsResults.diagnostics.length) {
          minifyJsResults.diagnostics.forEach(d => {
            buildCtx.diagnostics.push(d);
          });

        } else {
          chunk.code = minifyJsResults.output;
        }
      });

    await Promise.all(promises);
  });

  await Promise.all(promises);
}
