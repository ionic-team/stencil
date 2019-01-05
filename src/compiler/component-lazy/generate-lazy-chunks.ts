import * as d from '../../declarations';
import { writeLazyChunkModule } from './write-lazy-module';


export async function generateLazyChunks(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], derivedModules: d.DerivedModule[]) {
  if (buildCtx.shouldAbort) {
    return;
  }

  const promises = derivedModules.map(async derivedModule => {
    await generateLazyChunkModules(config, compilerCtx, buildCtx, outputTargets, derivedModule);
  });

  await Promise.all(promises);
}


async function generateLazyChunkModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, _outputTargets: d.OutputTargetBuild[], derivedModule: d.DerivedModule) {
  const entryModulesMap = new Map<string, d.EntryModule>();
  buildCtx.entryModules.forEach(e => entryModulesMap.set(e.entryKey, e));

  const chunks = derivedModule.list.filter(chunk => !entryModulesMap.has(chunk.entryKey));
  if (chunks.length === 0) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generateChunkFiles started`, true);

  const promises = chunks.map(async chunk => {
    // chunk asset, not a entry point, just write to the final destination
    await writeLazyChunkModule(config, compilerCtx, chunk);
  });

  await Promise.all(promises);

  timeSpan.finish(`generateBrowserEsm finished`);
}
