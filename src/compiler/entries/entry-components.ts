import * as d from '../../declarations';
import { buildWarn } from '../util';
import { processAppGraph } from './app-graph';


export function generateComponentEntries(
  config: d.Config,
  buildCtx: d.BuildCtx,
  allModules: d.ModuleFile[],
  userConfigEntryTags: string[][],
  appEntryTags: string[]
): d.EntryPoint[] {
  // In dev mode we create an entry poitn for each component
  if (config.devMode) {
    return appEntryTags.map(tag => [{tag}]);
  }

  // user config entry modules you leave as is
  // whatever the user put in the bundle is how it goes

  // get all the config.bundle entry tags the user may have manually configured
  const userConfigEntryPoints = processUserConfigBundles(userConfigEntryTags);

  // process all of the app's components not already found
  // in the config or the root html
  const appEntries = processAppComponentEntryTags(buildCtx, allModules, userConfigEntryPoints, appEntryTags);

  return [
    ...userConfigEntryPoints,
    ...appEntries
  ];
}


export function processAppComponentEntryTags(buildCtx: d.BuildCtx, allModules: d.ModuleFile[], entryPoints: d.EntryPoint[], appEntryTags: string[]) {
  // remove any tags already found in user config
  appEntryTags = appEntryTags.filter(tag => !entryPoints.some(ep => ep.some(em => em.tag === tag)));
  if (entryPoints.length > 0 && appEntryTags.length > 0) {
    appEntryTags.forEach(appEntryTag => {
      const warn = buildWarn(buildCtx.diagnostics);
      warn.header = `Stencil Config`;
      warn.messageText = `config.bundles does not include component tag "${appEntryTag}". When manually configurating config.bundles, all component tags used by this app must be listed in a component bundle.`;
    });
  }

  return processAppGraph(buildCtx, allModules, appEntryTags);
}


export function processUserConfigBundles(userConfigEntryTags: string[][]) {
  return userConfigEntryTags.map(entryTags => {
    return entryTags.map(entryTag => {
      const entryComponent: d.EntryComponent = {
        tag: entryTag,
        dependencyOf: ['#config']
      };
      return entryComponent;
    });
  });
}
