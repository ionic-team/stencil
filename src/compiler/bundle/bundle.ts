import * as d from '../../declarations';
import { catchError } from '../util';
import { generateBundleModules } from './bundle-modules';


export async function generateModuleMap(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (buildCtx.shouldAbort()) {
    return null;
  }

  if (buildCtx.isRebuild && compilerCtx.lastJsModules) {
    const hasScriptFileChanges = buildCtx.filesChanged.some(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js'));
    if (!hasScriptFileChanges) {
      return compilerCtx.lastJsModules;
    }
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
