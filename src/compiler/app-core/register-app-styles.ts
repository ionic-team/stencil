import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '../../util/constants';


export function getComponentsWithStyles(build: d.Build) {
  return build.appModuleFiles
    .filter(m => m.cmpCompilerMeta != null && m.cmpCompilerMeta.styles != null && m.cmpCompilerMeta.styles.length > 0)
    .map(m => m.cmpCompilerMeta);
}


export function setStylePlaceholders(build: d.Build, cmpsWithStyles: d.ComponentCompilerMeta[]) {
  const c: string[] = [];

  c.push(`import { registerStyle } from '${build.coreImportPath}';`);

  cmpsWithStyles.forEach(cmpWithStyles => {
    const styleIdPlaceholder = getStyleIdPlaceholder(cmpWithStyles);
    const styleTextPlaceholder = getStyleTextPlaceholder(cmpWithStyles);
    c.push(`registerStyle('${styleIdPlaceholder}', '${styleTextPlaceholder}');`);
  });

  return c.join('\n');
}


export function replaceStylePlaceholders(appModuleFiles: d.Module[], modeName: string, bundleInput: string) {
  const cmpsWithStyles = appModuleFiles
    .filter(m => m.cmpCompilerMeta && m.cmpCompilerMeta.styles && m.cmpCompilerMeta.styles.length > 0)
    .map(m => m.cmpCompilerMeta);

  cmpsWithStyles.forEach(cmpWithStyles => {
    let style = cmpWithStyles.styles.find(s => s.modeName === modeName);
    if (!style || typeof style.compiledStyleText !== 'string') {
      modeName = DEFAULT_STYLE_MODE;
      style = cmpWithStyles.styles.find(s => s.modeName === modeName);
      if (!style || typeof style.compiledStyleText !== 'string') {
        return;
      }
    }

    const styleIdPlaceholder = getStyleIdPlaceholder(cmpWithStyles);
    const styleTextPlaceholder = getStyleTextPlaceholder(cmpWithStyles);

    const styleId = getStyleId(cmpWithStyles, modeName);

    bundleInput = bundleInput.replace(styleIdPlaceholder, styleId);
    bundleInput = bundleInput.replace(styleTextPlaceholder, style.compiledStyleText);
  });

  return bundleInput;
}


function getStyleId(cmpMeta: d.ComponentCompilerMeta, modeName: string) {
  return `${cmpMeta.tagName.toUpperCase()}${modeName === DEFAULT_STYLE_MODE ? '' : modeName}`;
}

function getStyleIdPlaceholder(cmpMeta: d.ComponentCompilerMeta) {
  return `${cmpMeta.tagName.toUpperCase()}$STYLE-ID-PLACEHOLDER`;
}

function getStyleTextPlaceholder(cmpMeta: d.ComponentCompilerMeta) {
  return `${cmpMeta.tagName.toUpperCase()}$STYLE-TEXT-PLACEHOLDER`;
}


export function getAllModes(moduleFiles: d.Module[]) {
  const allModes: string[] = [DEFAULT_STYLE_MODE];

  moduleFiles.forEach(m => {
    if (m.cmpCompilerMeta && m.cmpCompilerMeta.styles) {
      m.cmpCompilerMeta.styles.forEach(style => {
        if (!allModes.includes(style.modeName)) {
          allModes.push(style.modeName);
        }
      });
    }
  });

  return allModes;
}
