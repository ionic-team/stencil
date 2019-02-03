import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';


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


function getStyleId(cmp: d.ComponentCompilerMeta, modeName: string) {
  return `${cmp.tagName.toUpperCase()}${modeName === DEFAULT_STYLE_MODE ? '' : modeName}`;
}

export function getStyleIdPlaceholder(cmp: d.ComponentCompilerMeta) {
  return `STYLE_ID_PLACEHOLDER:${cmp.tagName}`;
}

export function getStyleTextPlaceholder(cmp: d.ComponentCompilerMeta) {
  return `STYLE_TEXT_PLACEHOLDER:${cmp.tagName}`;
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
