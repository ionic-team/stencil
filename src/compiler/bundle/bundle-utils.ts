import { Bundle, ComponentMeta, ModuleFile } from '../../util/interfaces';
import { ENCAPSULATION, DEFAULT_STYLE_MODE } from '../../util/constants';
import { requiresScopedStyles } from '../style/style';


export function getBundleModes(moduleFiles: ModuleFile[]) {
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
    let index = (styleModeNames.indexOf(DEFAULT_STYLE_MODE));
    if (index > -1) {
      styleModeNames.splice(index, 1);
    }
  }

  return styleModeNames.sort();
}


export function getComponentStyleModes(cmpMeta: ComponentMeta) {
  return (cmpMeta && cmpMeta.stylesMeta) ? Object.keys(cmpMeta.stylesMeta) : [];
}


export function getBundleEncapsulations(bundle: Bundle) {
  const encapsulations: ENCAPSULATION[] = [];

  bundle.moduleFiles.forEach(m => {
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


export function bundleRequiresScopedStyles(encapsulations?: ENCAPSULATION[]) {
  return encapsulations.some(e => requiresScopedStyles(e));
}


export function sortBundles(bundles: Bundle[]) {
  // sort components by tagname within each bundle
  bundles.forEach(m => {
    m.moduleFiles = m.moduleFiles.sort((a, b) => {
      if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
      if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
      return 0;
    });
  });

  // sort each bundle by the first component's tagname
  return bundles.sort((a, b) => {
    if (a.moduleFiles[0].cmpMeta.tagNameMeta < b.moduleFiles[0].cmpMeta.tagNameMeta) return -1;
    if (a.moduleFiles[0].cmpMeta.tagNameMeta > b.moduleFiles[0].cmpMeta.tagNameMeta) return 1;
    return 0;
  });
}
