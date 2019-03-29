import * as d from '../../declarations';
import { buildWarn, flatOne, unduplicate } from '@utils';
import { validateComponentTag } from '../config/validate-component';
import { getUsedComponents } from '../html/used-components';

export function getDefaultBundles(config: d.Config, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {
  if (config.devMode) {
    return [];
  }
  const userConfigEntryPoints = getUserConfigBundles(config, buildCtx, cmps);
  if (userConfigEntryPoints.length > 0) {
    return userConfigEntryPoints;
  }
  if (!buildCtx.indexDoc) {
    return [];
  }

  const entryPointsHints = getUsedComponents(buildCtx.indexDoc, cmps);
  const mainBundle = unduplicate([
    ...entryPointsHints,
    ...flatOne(entryPointsHints
      .map(cmp => resolveTag(cmp).dependencies)
    )
  ]).map(resolveTag);

  function resolveTag(tag: string) {
    return cmps.find(cmp => cmp.tagName === tag);
  }

  return [mainBundle];
}

export function getUserConfigBundles(config: d.Config, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {
  const definedTags = new Set<string>();
  const entryTags = config.bundles.map(b => {
    return b.components.map(tag => {
      tag = validateComponentTag(tag);

      const component = cmps.find(cmp => cmp.tagName === tag);
      if (!component) {
        const warn = buildWarn(buildCtx.diagnostics);
        warn.header = `Stencil Config`;
        warn.messageText = `Component tag "${tag}" is defined in a bundle but no matching component was found within this app or its collections.`;
      }

      if (definedTags.has(tag)) {
        const warn = buildWarn(buildCtx.diagnostics);
        warn.header = `Stencil Config`;
        warn.messageText = `Component tag "${tag}" has been defined multiple times in the "bundles" config.`;
      }

      definedTags.add(tag);
      return component;
    }).sort();
  });
  return entryTags;
}
