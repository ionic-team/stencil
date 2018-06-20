import * as d from '../../declarations';
import { generateDocs } from '../docs/docs';
import { generateServiceWorkers } from '../service-worker/generate-sw';
import { prerenderOutputTargets } from '../prerender/prerender-app';


export async function buildAuxiliaries(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (buildCtx.shouldAbort()) {
    return;
  }

  // let's prerender this first
  // and run service workers on top of this when it's done
  await prerenderOutputTargets(config, compilerCtx, buildCtx, entryModules);

  // generate component docs
  // and service workers can run in parallel
  await Promise.all([
    generateDocs(config, compilerCtx),
    generateServiceWorkers(config, compilerCtx, buildCtx)
  ]);

  if (!buildCtx.shouldAbort()) {
    await compilerCtx.fs.commit();
  }
}
