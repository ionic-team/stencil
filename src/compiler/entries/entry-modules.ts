import * as d from '../../declarations';
import { buildWarn, catchError, flatOne, unduplicate } from '@utils';
import { DEFAULT_STYLE_MODE } from '@utils';
import { generateComponentEntries } from './entry-components';
import { validateComponentTag } from '../config/validate-component';
import { getComponentsFromModules } from '../output-targets/output-utils';


export function generateEntryModules(config: d.Config, buildCtx: d.BuildCtx, ) {
  // figure out how modules and components connect
  const cmps = getComponentsFromModules(buildCtx.moduleFiles);

  try {
    const entryPoints = generateComponentEntries(
      config,
      buildCtx,
      cmps,
    );
    buildCtx.entryModules = entryPoints.map(createEntryModule);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  buildCtx.debug(`generateEntryModules, ${buildCtx.entryModules.length} entryModules`);
}


export function getEntryEncapsulations(moduleFiles: d.Module[]) {
  const encapsulations: d.Encapsulation[] = [];

  moduleFiles.forEach(m => {
    m.cmps.forEach(cmp => {
      const encapsulation = cmp.encapsulation || 'none';
      if (!encapsulations.includes(encapsulation)) {
        encapsulations.push(encapsulation);
      }
    });
  });

  if (encapsulations.length === 0) {
    encapsulations.push('none');

  } else if (encapsulations.includes('shadow') && !encapsulations.includes('scoped')) {
    encapsulations.push('scoped');
  }

  return encapsulations.sort();
}


export function getEntryModes(cmps: d.ComponentCompilerMeta[]) {
  const styleModeNames: string[] = [];

  cmps.forEach(cmp => {
    const cmpStyleModes = getComponentStyleModes(cmp);
    cmpStyleModes.forEach(modeName => {
      if (!styleModeNames.includes(modeName)) {
        styleModeNames.push(modeName);
      }
    });
  });

  if (styleModeNames.length === 0) {
    styleModeNames.push(DEFAULT_STYLE_MODE);

  } else if (styleModeNames.length > 1) {
    const index = (styleModeNames.indexOf(DEFAULT_STYLE_MODE));
    if (index > -1) {
      styleModeNames.splice(index, 1);
    }
  }

  return styleModeNames.sort();
}


export function getComponentStyleModes(cmpMeta: d.ComponentCompilerMeta) {
  if (cmpMeta && cmpMeta.styles) {
    return cmpMeta.styles.map(style => style.modeName);
  }
  return [];
}


export function createEntryModule(cmps: d.ComponentCompilerMeta[]): d.EntryModule {
  // generate a unique entry key based on the components within this entry module
  const entryKey = cmps
    .sort(sortComponents)
    .map(c => c.tagName)
    .join('.');

  return {
    cmps,
    entryKey,

    // get the modes used in this bundle
    modeNames: getEntryModes(cmps),

    // figure out if we'll need a scoped css build
    requiresScopedStyles: true
  };
}


export function getPredefinedEntryPoints(config: d.Config, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {
  if (config.devMode) {
    return [];
  }
  const userConfigEntryPoints = getUserConfigEntryPoints(config, buildCtx, cmps);
  if (userConfigEntryPoints.length > 0) {
    return userConfigEntryPoints;
  }
  const entryPointsHints = getEntryHints(buildCtx, cmps);
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

export function getUserConfigEntryPoints(config: d.Config, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {

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

function getEntryHints(buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {
  const tags = new Set(cmps.map(cmp => cmp.tagName.toUpperCase()));
  const found: string[] = [];
  if (buildCtx.indexDoc) {
    function searchComponents(el: Element) {
      if (tags.has(el.tagName)) {
        found.push(el.tagName.toLowerCase());
      }

      for (let i = 0; i < el.childElementCount; i++) {
        searchComponents(el.children[i]);
      }
    }
    searchComponents(buildCtx.indexDoc.documentElement);
  }
  return found;
}


function sortComponents(a: d.ComponentCompilerMeta, b: d.ComponentCompilerMeta) {
  if (a.tagName < b.tagName) return -1;
  if (a.tagName > b.tagName) return 1;
  return 0;
}
