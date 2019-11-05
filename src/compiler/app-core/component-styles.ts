import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '@utils';


export const replaceStylePlaceholders = (cmps: d.ComponentCompilerMeta[], modeName: string, code: string) => {
  cmps.forEach(cmp => {
    let styleModeName = modeName;
    let style = cmp.styles.find(s => s.modeName === styleModeName);

    if (style == null || typeof style.compiledStyleText !== 'string') {
      styleModeName = DEFAULT_STYLE_MODE;
      style = cmp.styles.find(s => s.modeName === styleModeName);
      if (style == null || typeof style.compiledStyleText !== 'string') {
        return;
      }
    }

    const styleTextPlaceholder = getStyleTextPlaceholder(cmp);
    code = code.replace(styleTextPlaceholder, style.compiledStyleText);
  });

  return code;
};

export const getStyleTextPlaceholder = (cmp: d.ComponentCompilerMeta) => {
  return `STYLE_TEXT_PLACEHOLDER:${cmp.tagName}`;
};

export const getAllModes = (cmps: d.ComponentCompilerMeta[]) => {
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

  return allModes.sort();
};
