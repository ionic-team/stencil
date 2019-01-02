import * as d from '../../declarations';
import { buildError, buildWarn, catchError } from '../util';
import { calcComponentDependencies } from './component-dependencies';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { generateComponentEntries } from './entry-components';
import { validateComponentTag } from '../config/validate-component';


export function generateEntryModules(config: d.Config, buildCtx: d.BuildCtx) {
  // figure out how modules and components connect
  calcComponentDependencies(buildCtx.moduleFiles);

  try {
    const allModules = validateComponentEntries(config, buildCtx);

    const userConfigEntryModulesTags = getUserConfigEntryTags(buildCtx, config.bundles, allModules);

    const appEntryTags = getAppEntryTags(allModules);

    buildCtx.entryPoints = generateComponentEntries(
      config,
      buildCtx,
      allModules,
      userConfigEntryModulesTags,
      appEntryTags
    );

    const cleanedEntryModules = regroupEntryModules(allModules, buildCtx.entryPoints);

    buildCtx.entryModules = cleanedEntryModules
      .map(createEntryModule(config))
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
    const encapsulation = m.cmpCompilerMeta.encapsulation || 'none';
    if (!encapsulations.includes(encapsulation)) {
      encapsulations.push(encapsulation);
    }
  });

  if (encapsulations.length === 0) {
    encapsulations.push('none');

  } else if (encapsulations.includes('shadow') && !encapsulations.includes('scoped')) {
    encapsulations.push('scoped');
  }

  return encapsulations.sort();
}


export function getEntryModes(moduleFiles: d.Module[]) {
  const styleModeNames: string[] = [];

  moduleFiles.forEach(m => {
    const cmpStyleModes = getComponentStyleModes(m.cmpCompilerMeta);
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


export function regroupEntryModules(allModules: d.Module[], entryPoints: d.EntryPoint[]) {

  const cleanedEntryModules = entryPoints.map(entryPoint => {
    return allModules.filter(m => {
      return entryPoint.some(ep => m.cmpCompilerMeta && ep.tag === m.cmpCompilerMeta.tagName);
    });
  });

  return cleanedEntryModules
    .filter(m => m.length > 0)
    .sort((a, b) => {
      if (a[0].cmpCompilerMeta.tagName < b[0].cmpCompilerMeta.tagName) return -1;
      if (a[0].cmpCompilerMeta.tagName > b[0].cmpCompilerMeta.tagName) return 1;
      if (a.length < b.length) return -1;
      if (a.length > b.length) return 1;
      return 0;
    });
}


export function createEntryModule(config: d.Config) {
  return (moduleFiles: d.Module[]): d.EntryModule => {
    // generate a unique entry key based on the components within this entry module
    const entryKey = ENTRY_KEY_PREFIX + moduleFiles
      .sort(sortModuleFiles)
      .map(m => m.cmpCompilerMeta.tagName)
      .join('.');

    return {
      moduleFiles,
      entryKey,

      // generate a unique entry key based on the components within this entry module
      filePath: config.sys.path.join(config.srcDir, `${entryKey}.js`),

      // get the modes used in this bundle
      modeNames: getEntryModes(moduleFiles),

      // figure out if we'll need a scoped css build
      requiresScopedStyles: true
    };
  };
}


export const ENTRY_KEY_PREFIX = 'entry.';


export function getAppEntryTags(allModules: d.Module[]) {
  return allModules
    .filter(m => m.cmpCompilerMeta && !m.isCollectionDependency)
    .map(m => m.cmpCompilerMeta.tagName)
    .sort((a, b) => {
      if (a.length < b.length) return 1;
      if (a.length > b.length) return -1;
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
}


export function getUserConfigEntryTags(buildCtx: d.BuildCtx, configBundles: d.ConfigBundle[], allModules: d.Module[]) {
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

        const moduleFile = allModules.find(m => m.cmpCompilerMeta && m.cmpCompilerMeta.tagName === tag);
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

  return buildCtx.moduleFiles.map(moduleFile => {
    if (moduleFile.cmpCompilerMeta) {
      const tag = moduleFile.cmpCompilerMeta.tagName;
      if (definedTags.has(tag)) {
        const error = buildError(buildCtx.diagnostics);
        error.messageText = `Component tag "${tag}" has been defined in multiple files: ${config.sys.path.relative(config.rootDir, moduleFile.sourceFilePath)}`;
      } else {
        definedTags.add(tag);
      }
    }

    return moduleFile;
  });
}

function sortModuleFiles(a: d.Module, b: d.Module) {
  if (a.isCollectionDependency && !b.isCollectionDependency) {
    return 1;
  }
  if (!a.isCollectionDependency && b.isCollectionDependency) {
    return -1;
  }

  if (a.cmpCompilerMeta.tagName < b.cmpCompilerMeta.tagName) return -1;
  if (a.cmpCompilerMeta.tagName > b.cmpCompilerMeta.tagName) return 1;
  return 0;
}
