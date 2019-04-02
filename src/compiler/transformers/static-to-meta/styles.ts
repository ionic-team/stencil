import * as d from '../../../declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getStaticValue } from '../transform-utils';
import { normalizeStyles } from '../../style/normalize-styles';
import ts from 'typescript';


export function parseStaticStyles(config: d.Config, tagName: string, componentFilePath: string, isCollectionDependency: boolean, staticMembers: ts.ClassElement[]) {
  const styles: d.StyleCompiler[] = [];

  let parsedStyleStr: string = getStaticValue(staticMembers, 'styles');
  if (typeof parsedStyleStr === 'string') {
    // styles: 'div { padding: 10px }'
    parsedStyleStr = parsedStyleStr.trim();
    if (parsedStyleStr.length > 0) {
      styles.push({
        modeName: DEFAULT_STYLE_MODE,
        styleStr: parsedStyleStr,
        styleId: null,
        compiledStyleText: null,
        compiledStyleTextScoped: null,
        compiledStyleTextScopedCommented: null,
        externalStyles: []
      });
    }
  }

  const styleUrlsProp = isCollectionDependency ? 'styleUrls' : 'originalStyleUrls';
  const parsedStyleUrls = getStaticValue(staticMembers, styleUrlsProp) as d.CompilerModeStyles;
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
        styles.push({
          modeName: modeName,
          styleStr: null,
          styleId: null,
          compiledStyleText: null,
          compiledStyleTextScoped: null,
          compiledStyleTextScopedCommented: null,
          externalStyles: externalStyles
        });
      }
    });
  }

  normalizeStyles(config, tagName, componentFilePath, styles);

  return styles;
}
