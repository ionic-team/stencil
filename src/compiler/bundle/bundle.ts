import * as d from '../../declarations';
import { catchError } from '../util';
import { generateBundleModules } from './bundle-modules';


export async function generateModuleMap(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return null;
  }

  if (buildCtx.isRebuild && !buildCtx.requiresFullBuild && !buildCtx.hasScriptChanges && compilerCtx.lastJsModules) {
    // this is a rebuild, it doesn't require a full build
    // there were no script changes, and we've got a good cache of the last js modules
    // let's skip this
    buildCtx.debug(`generateModuleMap, using lastJsModules cache`);
    return compilerCtx.lastJsModules;
  }

  const timeSpan = buildCtx.createTimeSpan(`module map started`);
  let jsModules: d.JSModuleMap;

  try {
    jsModules = await generateBundleModules(config, compilerCtx, buildCtx, entryModules);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  // remember for next time incase we change just a css file or something
  compilerCtx.lastJsModules = jsModules;

  timeSpan.finish(`module map finished`);

  return jsModules;
}
