import * as d from '../../declarations';
import { catchError, sortBy } from '@utils';
import { DEFAULT_STYLE_MODE } from '@utils';
import { generateComponentBundles } from './component-bundles';

export function generateEntryModules(config: d.Config, buildCtx: d.BuildCtx) {
  // figure out how modules and components connect
  try {
    const bundles = generateComponentBundles(config, buildCtx);
    buildCtx.entryModules = bundles.map(createEntryModule);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  buildCtx.debug(`generateEntryModules, ${buildCtx.entryModules.length} entryModules`);
}

export function createEntryModule(cmps: d.ComponentCompilerMeta[]): d.EntryModule {
  // generate a unique entry key based on the components within this entry module
  cmps = sortBy(cmps, c => c.tagName);
  const entryKey = cmps.map(c => c.tagName).join('.') + '.entry';

  return {
    cmps,
    entryKey,
  };
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
    const index = styleModeNames.indexOf(DEFAULT_STYLE_MODE);
    if (index > -1) {
      styleModeNames.splice(index, 1);
    }
  }

  return styleModeNames.sort();
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

export function getComponentStyleModes(cmpMeta: d.ComponentCompilerMeta) {
  if (cmpMeta && cmpMeta.styles) {
    return cmpMeta.styles.map(style => style.modeName);
  }
  return [];
}
