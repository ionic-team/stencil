import * as d from '../../declarations';
import { generateDocs } from '../docs/docs';
import { generateServiceWorkers } from '../service-worker/generate-sw';
import { prerenderOutputTargets } from '../prerender/prerender-app';


export async function buildAuxiliaries(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (buildCtx.shouldAbort()) {
    return;
  }

  // generate component docs
  // and prerender can run in parallel
  await Promise.all([
    generateDocs(config, compilerCtx),
    generateServiceWorkers(config, compilerCtx, buildCtx),
    prerenderOutputTargets(config, compilerCtx, buildCtx, entryModules)
  ]);

  if (!buildCtx.shouldAbort()) {
    await compilerCtx.fs.commit();
  }
}
