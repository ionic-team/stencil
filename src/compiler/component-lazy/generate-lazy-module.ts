import * as d from '@declarations';
import { writeLazyModule } from './write-lazy-entry-module';
import { sortBy } from '@utils';
import { optimizeModule } from '../app-core/optimize-module';
import { sys } from '@sys';


export async function generateLazyModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], rollupResults: d.RollupResult[], sufix: string) {
  const entryComponetsResults = rollupResults.filter(rollupResult => rollupResult.isComponent);
  const chunkResults = rollupResults.filter(rollupResult => !rollupResult.isComponent && !rollupResult.isAppCore);

  const [bundleModules] = await Promise.all([
    Promise.all(entryComponetsResults.map(rollupResult => {
      return generateLazyEntryModule(config, compilerCtx, buildCtx, destinations, buildCtx.entryModules, rollupResult, sufix);
    })),
    Promise.all(chunkResults.map(rollupResult => {
      return writeLazyChunk(config, compilerCtx, buildCtx, destinations, rollupResult);
    }))
  ]);

  return bundleModules;
}


async function generateLazyEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], entryModules: d.EntryModule[], rollupResult: d.RollupResult, sufix: string): Promise<d.BundleModule> {
  const entryModule = entryModules.find(entryModule => entryModule.entryKey === rollupResult.entryKey);
  const outputs = await Promise.all(
    entryModule.modeNames.map(modeName =>
      writeLazyModule(config, compilerCtx, buildCtx, destinations, entryModule, rollupResult.code, modeName, sufix)
    )
  );

  return {
    entryKey: rollupResult.entryKey,
    modeNames: entryModule.modeNames.slice(),
    cmps: entryModule.cmps,
    outputs: sortBy(outputs, o => o.modeName)
  };
}

export async function writeLazyChunk(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], rollupResult: d.RollupResult) {
  let code = rollupResult.code;

  if (config.minifyJs) {
    const optimizeResults = await optimizeModule(config, compilerCtx, 'es2017', code);
    buildCtx.diagnostics.push(...optimizeResults.diagnostics);

    if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
      code = optimizeResults.output;
    }
  }

  return Promise.all(destinations.map(dst => {
    const filePath = sys.path.join(dst, rollupResult.fileName);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}
