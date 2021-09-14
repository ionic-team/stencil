import type * as d from '../../declarations';

export const getStyleId = (cmp: d.ComponentCompilerMeta, modeName: string, isScopedStyles: boolean) => {
  return `${cmp.tagName}${modeName}${isScopedStyles ? '.sc' : ''}`;
};

export const escapeCssForJs = (style: string) => {
  if (typeof style === 'string') {
    return style
      .replace(/\\[\D0-7]/g, (v) => '\\' + v)
      .replace(/\r\n|\r|\n/g, `\\n`)
      .replace(/\"/g, `\\"`)
      .replace(/\'/g, `\\'`)
      .replace(/\@/g, `\\@`);
  }
  return style;
};

export const requiresScopedStyles = (encapsulation: d.Encapsulation, commentOriginalSelector: boolean) => {
  return encapsulation === 'scoped' || (encapsulation === 'shadow' && commentOriginalSelector);
};

export const PLUGIN_HELPERS = [
  {
    pluginName: 'PostCSS',
    pluginId: 'postcss',
    pluginExts: ['pcss'],
  },
  {
    pluginName: 'Sass',
    pluginId: 'sass',
    pluginExts: ['scss', 'sass'],
  },
  {
    pluginName: 'Stylus',
    pluginId: 'stylus',
    pluginExts: ['styl', 'stylus'],
  },
  {
    pluginName: 'Less',
    pluginId: 'less',
    pluginExts: ['less'],
  },
];

export const stripCssComments = (input: string) => {
  let isInsideString = null;
  let currentCharacter = '';
  let returnValue = '';

  for (let i = 0; i < input.length; i++) {
    currentCharacter = input[i];

    if (input[i - 1] !== '\\') {
      if (currentCharacter === '"' || currentCharacter === "'") {
        if (isInsideString === currentCharacter) {
          isInsideString = null;
        } else if (!isInsideString) {
          isInsideString = currentCharacter;
        }
      }
    }

    // Find beginning of /* type comment
    if (!isInsideString && currentCharacter === '/' && input[i + 1] === '*') {
      // Ignore important comment when configured to preserve comments using important syntax: /*!
      let j = i + 2;

      // Iterate over comment
      for (; j < input.length; j++) {
        // Find end of comment
        if (input[j] === '*' && input[j + 1] === '/') {
          break;
        }
      }
      // Resume iteration over CSS string from the end of the comment
      i = j + 1;
      continue;
    }

    returnValue += currentCharacter;
  }
  return returnValue;
};
