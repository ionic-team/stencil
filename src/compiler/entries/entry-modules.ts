import * as d from '../../declarations';
import { buildError, buildWarn, catchError } from '@utils';
import { calcComponentDependencies } from './component-dependencies';
import { DEFAULT_STYLE_MODE } from '@utils';
import { generateComponentEntries } from './entry-components';
import { validateComponentTag } from '../config/validate-component';


export function generateEntryModules(config: d.Config, buildCtx: d.BuildCtx) {
  // figure out how modules and components connect
  calcComponentDependencies(buildCtx.moduleFiles);

  try {
    const cmps = validateComponentEntries(config, buildCtx);

    const userConfigEntryModulesTags = getUserConfigEntryTags(buildCtx, config.bundles, cmps);

    const appEntryTags = getAppEntryTags(cmps);

    buildCtx.entryPoints = generateComponentEntries(
      buildCtx,
      cmps,
      userConfigEntryModulesTags,
      appEntryTags
    );

    const cleanedEntryModules = regroupEntryModules(cmps, buildCtx.entryPoints);

    buildCtx.entryModules = cleanedEntryModules
      .map(createEntryModule())
      .filter((entryModule, index, array) => {
        const firstIndex = array.findIndex(e => e.entryKey === entryModule.entryKey);
        return firstIndex === index;
      });

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


export function regroupEntryModules(cmps: d.ComponentCompilerMeta[], entryPoints: d.EntryPoint[]) {

  const cleanedEntryModules = entryPoints.map(entryPoint => {
    return cmps.filter(cmp => {
      return entryPoint.some(ep => cmp.tagName === ep.tag);
    });
  });

  return cleanedEntryModules
    .filter(m => m.length > 0)
    .sort((a, b) => {
      if (a[0].tagName < b[0].tagName) return -1;
      if (a[0].tagName > b[0].tagName) return 1;
      if (a.length < b.length) return -1;
      if (a.length > b.length) return 1;
      return 0;
    });
}


export function createEntryModule() {
  return (cmps: d.ComponentCompilerMeta[]): d.EntryModule => {
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
  };
}


export function getAppEntryTags(cmps: d.ComponentCompilerMeta[]) {
  return cmps
    .filter(cmp => !cmp.isCollectionDependency)
    .map(cmp => cmp.tagName)
    .sort((a, b) => {
      if (a.length < b.length) return 1;
      if (a.length > b.length) return -1;
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
}


export function getUserConfigEntryTags(buildCtx: d.BuildCtx, configBundles: d.ConfigBundle[], cmps: d.ComponentCompilerMeta[]) {
  configBundles = (configBundles || [])
    .filter(b => b.components && b.components.length > 0)
    .sort((a, b) => {
      if (a.components.length < b.components.length) return 1;
      if (a.components.length > b.components.length) return -1;
      return 0;
    });

  const definedTags = new Set<string>();
  const entryTags = configBundles
    .map(b => {
    return b.components
      .map(tag => {
        tag = validateComponentTag(tag);

        const moduleFile = cmps.find(cmp => cmp.tagName === tag);
        if (!moduleFile) {
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
        return tag;
      })
      .sort();
  });

  return entryTags;
}


export function validateComponentEntries(config: d.Config, buildCtx: d.BuildCtx) {
  const definedTags = new Set<string>();

  return buildCtx.moduleFiles.reduce((cmps, m) => {
    m.cmps.forEach(cmp => {
      if (definedTags.has(cmp.tagName)) {
        const error = buildError(buildCtx.diagnostics);
        error.messageText = `Component tag "${cmp.tagName}" has been defined in multiple times: ${config.sys.path.relative(config.rootDir, m.sourceFilePath)}`;
      } else {
        definedTags.add(cmp.tagName);
      }
      cmps.push(cmp);
    });
    return cmps;
  }, [] as d.ComponentCompilerMeta[]);
}

// function sortModuleFiles(a: d.Module, b: d.Module) {
//   a.cmps.sort(sortComponents);
//   b.cmps.sort(sortComponents);

//   if (a.isCollectionDependency && !b.isCollectionDependency) {
//     return 1;
//   }
//   if (!a.isCollectionDependency && b.isCollectionDependency) {
//     return -1;
//   }

//   if (a.cmpCompilerMeta.tagName < b.cmpCompilerMeta.tagName) return -1;
//   if (a.cmpCompilerMeta.tagName > b.cmpCompilerMeta.tagName) return 1;
//   return 0;
// }

function sortComponents(a: d.ComponentCompilerMeta, b: d.ComponentCompilerMeta) {
  if (a.tagName < b.tagName) return -1;
  if (a.tagName > b.tagName) return 1;
  return 0;
}
