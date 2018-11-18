import * as d from '../../declarations';
import { generateDocs } from '../docs/docs';
import { generateServiceWorkers } from '../service-worker/generate-sw';
import { generateProxies } from '../distribution/distribution';
import { prerenderOutputTargets } from '../prerender/prerender-app';


export async function buildAuxiliaries(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return;
  }

  // let's prerender this first
  // and run service workers on top of this when it's done
  await prerenderOutputTargets(config, compilerCtx, buildCtx, entryModules);

  // generate component docs
  // and service workers can run in parallel
  await Promise.all([
    generateDocs(config, compilerCtx, buildCtx),
    generateServiceWorkers(config, compilerCtx, buildCtx),
    generateProxies(config, compilerCtx, cmpRegistry)
  ]);

  if (!buildCtx.hasError && buildCtx.isActiveBuild) {
    await compilerCtx.fs.commit();
  }
}
