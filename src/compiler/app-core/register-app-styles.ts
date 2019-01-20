import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';


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


export function replaceStylePlaceholders(cmps: d.ComponentCompilerMeta[], modeName: string, bundleInput: string) {
  cmps.forEach(cmp => {
    let style = cmp.styles.find(s => s.modeName === modeName);

    if (style == null || typeof style.compiledStyleText !== 'string') {
      modeName = DEFAULT_STYLE_MODE;
      style = cmp.styles.find(s => s.modeName === modeName);
      if (style == null || typeof style.compiledStyleText !== 'string') {
        return;
      }
    }

    const styleIdPlaceholder = getStyleIdPlaceholder(cmp);
    const styleTextPlaceholder = getStyleTextPlaceholder(cmp);
    const styleId = getStyleId(cmp, modeName);

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


export function getAllModes(cmps: d.ComponentCompilerMeta[]) {
  const allModes: string[] = [DEFAULT_STYLE_MODE];

  cmps.forEach(cmp => {
    if (cmp.styles != null) {
      cmp.styles.forEach(style => {
        if (!allModes.includes(style.modeName)) {
          allModes.push(style.modeName);
        }
      });
    }
  });

  return allModes;
}
