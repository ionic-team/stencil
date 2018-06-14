import * as d from '../../declarations';
import { buildWarn } from '../util';
import { processAppGraph } from './app-graph';


export function generateComponentEntries(
  buildCtx: d.BuildCtx,
  allModules: d.ModuleFile[],
  userConfigEntryTags: string[][],
  appEntryTags: string[]
) {
  // user config entry modules you leave as is
  // whatever the user put in the bundle is how it goes
  const entryPoints: d.EntryPoint[] = [];

  // get all the config.bundle entry tags the user may have manually configured
  const userConfigEntryPoints = processUserConfigBundles(userConfigEntryTags);
  const hasUserConfigEntries = (userConfigEntryPoints.length > 0);

  // start out by adding all the user config entry points first
  entryPoints.push(...userConfigEntryPoints);

  // process all of the app's components not already found
  // in the config or the root html
  const appEntries = processAppComponentEntryTags(buildCtx, hasUserConfigEntries, allModules, entryPoints, appEntryTags);
  entryPoints.push(...appEntries);

  return entryPoints;
}


export function processAppComponentEntryTags(buildCtx: d.BuildCtx, hasUserConfigEntries: boolean, allModules: d.ModuleFile[], entryPoints: d.EntryPoint[], appEntryTags: string[]) {
  // remove any tags already found in user config
  appEntryTags = appEntryTags.filter(tag => !entryPoints.some(ep => ep.some(em => em.tag === tag)));

  if (hasUserConfigEntries && appEntryTags.length > 0) {
    appEntryTags.forEach(appEntryTag => {
      const warn = buildWarn(buildCtx.diagnostics);
      warn.header = `Stencil Config`;
      warn.messageText = `config.bundles does not include component tag "${appEntryTag}". When manually configurating config.bundles, all component tags used by this app must be listed in a component bundle.`;
    });
  }

  return processAppGraph(allModules, appEntryTags);
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
