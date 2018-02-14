import { BuildCtx, CompilerCtx, ComponentMeta, Config, ConfigBundle, EntryModule, EntryPoint, ModuleFile } from '../../declarations';
import { calcComponentDependencies, calcModuleGraphImportPaths } from './component-dependencies';
import { catchError } from '../util';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../util/constants';
import { generateComponentEntries } from './entry-components';
import { requiresScopedStyles } from '../style/style';
import { validateComponentTag } from '../config/validate-component';


export function generateEntryModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  buildCtx.entryModules = [];

  // figure out all the actual import paths (basically which extension each import uses)
  calcModuleGraphImportPaths(compilerCtx, buildCtx.moduleGraphs);

  // figure out how modules and components connect
  calcComponentDependencies(compilerCtx.moduleFiles, buildCtx.moduleGraphs, buildCtx.componentRefs);

  try {
    const allModules = Object.keys(compilerCtx.moduleFiles).map(filePath => compilerCtx.moduleFiles[filePath]);

    const userConfigEntryModulesTags = getUserConfigEntryTags(config.bundles, allModules);

    const appEntryTags = getAppEntryTags(allModules);

    buildCtx.entryPoints = generateComponentEntries(
      allModules,
      userConfigEntryModulesTags,
      appEntryTags
    );

    const cleanedEntryModules = regroupEntryModules(allModules, buildCtx.entryPoints);

    buildCtx.entryModules = cleanedEntryModules.map(createEntryModule);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return buildCtx.entryModules;
}


export function getEntryEncapsulations(entryModule: EntryModule) {
  const encapsulations: ENCAPSULATION[] = [];

  entryModule.moduleFiles.forEach(m => {
    const encapsulation = m.cmpMeta.encapsulation || ENCAPSULATION.NoEncapsulation;
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


export function getEntryModes(moduleFiles: ModuleFile[]) {
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


export function getComponentStyleModes(cmpMeta: ComponentMeta) {
  return (cmpMeta && cmpMeta.stylesMeta) ? Object.keys(cmpMeta.stylesMeta) : [];
}


export function entryRequiresScopedStyles(encapsulations?: ENCAPSULATION[]) {
  return encapsulations.some(e => requiresScopedStyles(e));
}


export function regroupEntryModules(allModules: ModuleFile[], entryPoints: EntryPoint[]) {
  const outtedNoEncapsulation: ModuleFile[] = [];
  const outtedScopedCss: ModuleFile[] = [];
  const outtedShadowDom: ModuleFile[] = [];

  const cleanedEntryModules: ModuleFile[][] = [
    outtedNoEncapsulation,
    outtedScopedCss,
    outtedShadowDom
  ];

  entryPoints.forEach(entryPoint => {
    const entryModules = allModules.filter(m => {
      return entryPoint.some(ep => m.cmpMeta && ep.tag === m.cmpMeta.tagNameMeta);
    });

    const noEncapsulation = entryModules.filter(m => {
      return m.cmpMeta.encapsulation !== ENCAPSULATION.ScopedCss && m.cmpMeta.encapsulation !== ENCAPSULATION.ShadowDom;
    });
    const scopedCss = entryModules.filter(m => {
      return m.cmpMeta.encapsulation === ENCAPSULATION.ScopedCss;
    });
    const shadowDom = entryModules.filter(m => {
      return m.cmpMeta.encapsulation === ENCAPSULATION.ShadowDom;
    });

    if ((noEncapsulation.length > 0 && scopedCss.length === 0 && shadowDom.length === 0) ||
       (noEncapsulation.length === 0 && scopedCss.length > 0 && shadowDom.length === 0) ||
       (noEncapsulation.length === 0 && scopedCss.length === 0 && shadowDom.length > 0)) {
      cleanedEntryModules.push(entryModules);

    } else if (noEncapsulation.length >= scopedCss.length && noEncapsulation.length >= shadowDom.length) {
      cleanedEntryModules.push(noEncapsulation);
      outtedScopedCss.push(...scopedCss);
      outtedShadowDom.push(...shadowDom);

    } else if (scopedCss.length >= noEncapsulation.length && scopedCss.length >= shadowDom.length) {
      cleanedEntryModules.push(scopedCss);
      outtedNoEncapsulation.push(...noEncapsulation);
      outtedShadowDom.push(...shadowDom);

    } else if (shadowDom.length >= noEncapsulation.length && shadowDom.length >= scopedCss.length) {
      cleanedEntryModules.push(shadowDom);
      outtedNoEncapsulation.push(...noEncapsulation);
      outtedScopedCss.push(...scopedCss);
    }
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


export function createEntryModule(moduleFiles: ModuleFile[]) {
  const entryModule: EntryModule = {
    moduleFiles: moduleFiles
  };

  // generate a unique entry key based on the components within this entry module


  entryModule.entryKey = 'entry:' + entryModule.moduleFiles
    .sort((a, b) => {
      if (a.isCollectionDependency && !b.isCollectionDependency) {
        return 1;
      }
      if (!a.isCollectionDependency && b.isCollectionDependency) {
        return -1;
      }

      if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
      if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
      return 0;
    })
    .map(m => {
      return m.cmpMeta.tagNameMeta;
    }).join('.');

  // get the modes used in this bundle
  entryModule.modeNames = getEntryModes(entryModule.moduleFiles);

  // get the encapsulations used in this bundle
  const encapsulations = getEntryEncapsulations(entryModule);

  // figure out if we'll need a scoped css build
  entryModule.requiresScopedStyles = entryRequiresScopedStyles(encapsulations);

  return entryModule;
}


export function getAppEntryTags(allModules: ModuleFile[]) {
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


export function getUserConfigEntryTags(configBundles: ConfigBundle[], allModules: ModuleFile[]) {
  configBundles = (configBundles || [])
    .filter(b => b.components && b.components.length > 0)
    .sort((a, b) => {
      if (a.components.length < b.components.length) return 1;
      if (a.components.length > b.components.length) return -1;
      return 0;
    });

  const definedTags: string[] = [];
  const entryTags = configBundles
    .map(b => {
    return b.components
      .map(tag => {
        tag = validateComponentTag(tag);

        const moduleFile = allModules.find(m => m.cmpMeta && m.cmpMeta.tagNameMeta === tag);
        if (!moduleFile) {
          throw new Error(`Component tag "${tag}" is defined in a bundle but no matching component was found within this app or its collections.`);
        }

        if (definedTags.includes(tag)) {
          throw new Error(`Component tag "${tag}" has been defined multiple times in the "bundles" config.`);
        }

        definedTags.push(tag);
        return tag;
      })
      .sort();
  });

  return entryTags;
}
