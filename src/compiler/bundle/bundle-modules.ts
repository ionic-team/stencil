import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleMap } from '../../declarations';
import { catchError, minifyJs } from '../util';
import { createBundle, writeEsModules, writeLegacyModules  } from './rollup-bundle';


export async function generateBundleModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]): Promise<JSModuleMap> {
  const results: JSModuleMap = {};

  try {
    // run rollup, but don't generate yet
    // returned rollup bundle can be reused for es module and legacy
    const rollupBundle = await createBundle(config, compilerCtx, buildCtx, entryModules);

    // bundle using only es modules and dynamic imports
    results.esm = await writeEsModules(config, rollupBundle);

    buildCtx.bundleBuildCount = Object.keys(results.esm).length;

    if (config.buildEs5) {
      // only create legacy modules when generating es5 fallbacks
      // bundle using commonjs using jsonp callback
      results.es5 = await writeLegacyModules(config, rollupBundle, entryModules);
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
  const promises = Object.keys(results).map((moduleType: 'esm' | 'es5') => {
    const jsModuleList = results[moduleType];

    const promises = Object.keys(jsModuleList)
      .filter(m => m.startsWith('chunk'))
      .map(chunkKey => jsModuleList[chunkKey])
      .map(async chunk => {
        const sourceTarget = moduleType === 'es5' ? 'es5' : 'es2015';
        const minifyJsResults = await minifyJs(config, compilerCtx, chunk.code, sourceTarget, true);

        if (minifyJsResults.diagnostics.length) {
          minifyJsResults.diagnostics.forEach(d => {
            buildCtx.diagnostics.push(d);
          });

        } else {
          chunk.code = minifyJsResults.output;
        }
      });

    return Promise.all(promises);
  });

  return Promise.all(promises);
}
