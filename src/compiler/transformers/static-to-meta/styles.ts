import * as d from '../../../declarations';
import { DEFAULT_STYLE_MODE, sortBy } from '@utils';
import { ConvertIdentifier, getStaticValue } from '../transform-utils';
import { normalizeStyles } from '../../style/normalize-styles';
import ts from 'typescript';


export const parseStaticStyles = (config: d.Config, compilerCtx: d.CompilerCtx, tagName: string, componentFilePath: string, isCollectionDependency: boolean, staticMembers: ts.ClassElement[]) => {
  const styles: d.StyleCompiler[] = [];
  const styleUrlsProp = isCollectionDependency ? 'styleUrls' : 'originalStyleUrls';
  const parsedStyleUrls = getStaticValue(staticMembers, styleUrlsProp) as d.CompilerModeStyles;

  let parsedStyle = getStaticValue(staticMembers, 'styles');

  if (parsedStyle) {
    if (typeof parsedStyle === 'string') {
      // styles: 'div { padding: 10px }'
      parsedStyle = parsedStyle.trim();
      if (parsedStyle.length > 0) {
        styles.push({
          modeName: DEFAULT_STYLE_MODE,
          styleId: null,
          styleStr: parsedStyle,
          styleIdentifier: null,
          compiledStyleText: null,
          compiledStyleTextScoped: null,
          compiledStyleTextScopedCommented: null,
          externalStyles: []
        });
        compilerCtx.styleModeNames.add(DEFAULT_STYLE_MODE);
      }

    } else if ((parsedStyle as ConvertIdentifier).__identifier) {
      styles.push(parseStyleIdentifier(parsedStyle));
      compilerCtx.styleModeNames.add(DEFAULT_STYLE_MODE);
    }
  }

  if (parsedStyleUrls && typeof parsedStyleUrls === 'object') {
    Object.keys(parsedStyleUrls).forEach(modeName => {
      const externalStyles: d.ExternalStyleCompiler[] = [];
      const styleObj = parsedStyleUrls[modeName];
      styleObj.forEach(styleUrl => {
        if (typeof styleUrl === 'string' && styleUrl.trim().length > 0) {
          externalStyles.push({
            absolutePath: null,
            relativePath: null,
            originalComponentPath: styleUrl.trim()
          });
        }
      });

      if (externalStyles.length > 0) {
        const style: d.StyleCompiler = {
          modeName: modeName,
          styleId: null,
          styleStr: null,
          styleIdentifier: null,
          compiledStyleText: null,
          compiledStyleTextScoped: null,
          compiledStyleTextScopedCommented: null,
          externalStyles: externalStyles
        };

        styles.push(style);
        compilerCtx.styleModeNames.add(modeName);
      }
    });
  }

  normalizeStyles(config, tagName, componentFilePath, styles);

  return sortBy(styles, s => s.modeName);
};

const parseStyleIdentifier = (parsedStyle: ConvertIdentifier) => {
  const style: d.StyleCompiler = {
    modeName: DEFAULT_STYLE_MODE,
    styleId: null,
    styleStr: null,
    styleIdentifier: parsedStyle.__escapedText,
    compiledStyleText: null,
    compiledStyleTextScoped: null,
    compiledStyleTextScopedCommented: null,
    externalStyles: []
  };
  return style;
};
