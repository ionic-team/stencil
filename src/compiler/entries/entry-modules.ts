import * as d from '../../declarations';
import { buildError, buildWarn, catchError } from '../util';
import { calcComponentDependencies } from './component-dependencies';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../util/constants';
import { generateComponentEntries } from './entry-components';
import { validateComponentTag } from '../config/validate-component';


export function generateEntryModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  buildCtx.entryModules = [];

  const moduleFiles = Object.keys(compilerCtx.moduleFiles).map(filePath => {
    return compilerCtx.moduleFiles[filePath];
  });

  // figure out how modules and components connect
  calcComponentDependencies(moduleFiles);

  try {
    const allModules = validateComponentEntries(config, compilerCtx, buildCtx);

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

  return buildCtx.entryModules;
}


export function getEntryEncapsulations(moduleFiles: d.ModuleFile[]) {
  const encapsulations: ENCAPSULATION[] = [];

  moduleFiles.forEach(m => {
    const encapsulation = m.cmpMeta.encapsulationMeta || ENCAPSULATION.NoEncapsulation;
    if (!encapsulations.includes(encapsulation)) {
      encapsulations.push(encapsulation);
    }
  });

  if (encapsulations.length === 0) {
    encapsulations.push(ENCAPSULATION.NoEncapsulation);

  } else if (encapsulations.includes(ENCAPSULATION.ShadowDom) && !encapsulations.includes(ENCAPSULATION.ScopedCss)) {
    encapsulations.push(ENCAPSULATION.ScopedCss);
  }

  return encapsulations.sort();
}


export function getEntryModes(moduleFiles: d.ModuleFile[]) {
  const styleModeNames: string[] = [];

  moduleFiles.forEach(m => {
    const cmpStyleModes = getComponentStyleModes(m.cmpMeta);
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


export function getComponentStyleModes(cmpMeta: d.ComponentMeta) {
  return (cmpMeta && cmpMeta.stylesMeta) ? Object.keys(cmpMeta.stylesMeta) : [];
}


export function regroupEntryModules(allModules: d.ModuleFile[], entryPoints: d.EntryPoint[]) {

  const cleanedEntryModules = entryPoints.map(entryPoint => {
    return allModules.filter(m => {
      return entryPoint.some(ep => m.cmpMeta && ep.tag === m.cmpMeta.tagNameMeta);
    });
  });

  return cleanedEntryModules
    .filter(m => m.length > 0)
    .sort((a, b) => {
      if (a[0].cmpMeta.tagNameMeta < b[0].cmpMeta.tagNameMeta) return -1;
      if (a[0].cmpMeta.tagNameMeta > b[0].cmpMeta.tagNameMeta) return 1;
      if (a.length < b.length) return -1;
      if (a.length > b.length) return 1;
      return 0;
    });
}


export function createEntryModule(config: d.Config) {
  return (moduleFiles: d.ModuleFile[]): d.EntryModule => {
    // generate a unique entry key based on the components within this entry module
    const entryKey = ENTRY_KEY_PREFIX + moduleFiles
      .sort(sortModuleFiles)
      .map(m => m.cmpMeta.tagNameMeta)
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


export function getAppEntryTags(allModules: d.ModuleFile[]) {
  return allModules
    .filter(m => m.cmpMeta && !m.isCollectionDependency)
    .map(m => m.cmpMeta.tagNameMeta)
    .sort((a, b) => {
      if (a.length < b.length) return 1;
      if (a.length > b.length) return -1;
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
}


export function getUserConfigEntryTags(buildCtx: d.BuildCtx, configBundles: d.ConfigBundle[], allModules: d.ModuleFile[]) {
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

        const moduleFile = allModules.find(m => m.cmpMeta && m.cmpMeta.tagNameMeta === tag);
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


export function validateComponentEntries(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const definedTags = new Set<string>();
  return Object.keys(compilerCtx.moduleFiles).map(filePath => {
    const moduleFile = compilerCtx.moduleFiles[filePath];

    if (moduleFile.cmpMeta) {
      const tag = moduleFile.cmpMeta.tagNameMeta;
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

function sortModuleFiles(a: d.ModuleFile, b: d.ModuleFile) {
  if (a.isCollectionDependency && !b.isCollectionDependency) {
    return 1;
  }
  if (!a.isCollectionDependency && b.isCollectionDependency) {
    return -1;
  }

  if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
  if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
  return 0;
}
