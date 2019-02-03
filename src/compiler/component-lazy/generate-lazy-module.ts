import * as d from '@declarations';
import { writeLazyModule } from './write-lazy-module';


export function generateLazyModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], rollupResults: d.RollupResult[]) {
  const componentRollupResults = rollupResults.filter(rollupResult => {
    return rollupResult.isEntry && !rollupResult.isAppCore;
  });

  return Promise.all(componentRollupResults.map(rollupResult => {
    return generateLazyModule(config, compilerCtx, buildCtx, outputTargets, buildCtx.entryModules, rollupResult);
  }));
}


async function generateLazyModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], entryModules: d.EntryModule[], rollupResult: d.RollupResult) {
  const entryModule = entryModules.find(entryModule => entryModule.entryKey === rollupResult.entryKey);

  const bundleModule: d.BundleModule = {
    entryKey: rollupResult.entryKey,
    cmps: entryModule.cmps,
    outputs: await Promise.all(entryModule.modeNames.map(modeName => {
      return writeLazyModule(config, compilerCtx, buildCtx, outputTargets, entryModule, rollupResult.code, modeName);
    }))
  };

  return bundleModule;
}
