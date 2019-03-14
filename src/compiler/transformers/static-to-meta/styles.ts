import * as d from '../../../declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getStaticValue } from '../transform-utils';
import { normalizeStyles } from '../../style/normalize-styles';
import ts from 'typescript';


export function parseStaticStyles(config: d.Config, tagName: string, componentFilePath: string, staticMembers: ts.ClassElement[]) {
  const styles: d.StyleCompiler[] = [];

  let parsedStyleStr: string = getStaticValue(staticMembers, 'styles');

  let parsedStyleUrl: string = getStaticValue(staticMembers, 'styleUrl');

  const parsedStyleUrls = getStaticValue(staticMembers, 'styleUrls');

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

  if (typeof parsedStyleUrl === 'string') {
    parsedStyleUrl = parsedStyleUrl.trim();
    if (parsedStyleUrl.length > 0) {
      // styleUrl: 'my-styles.css'
      styles.push({
        modeName: DEFAULT_STYLE_MODE,
        styleStr: null,
        styleId: null,
        compiledStyleText: null,
        compiledStyleTextScoped: null,
        compiledStyleTextScopedCommented: null,
        externalStyles: [{
          absolutePath: null,
          relativePath: null,
          originalCollectionPath: null,
          originalComponentPath: parsedStyleUrl
        }]
      });
    }
  }

  if (Array.isArray(parsedStyleUrls)) {
    // styleUrls: ['my-styles.css', 'my-other-styles.css']
    styles.push({
      modeName: DEFAULT_STYLE_MODE,
      styleStr: null,
      styleId: null,
      compiledStyleText: null,
      compiledStyleTextScoped: null,
      compiledStyleTextScopedCommented: null,
      externalStyles: parsedStyleUrls.map(parsedStyleUrl => {
        const externalStyle: d.ExternalStyleCompiler = {
          absolutePath: null,
          relativePath: null,
          originalCollectionPath: null,
          originalComponentPath: parsedStyleUrl.trim()
        };
        return externalStyle;
      })
    });

  } else if (parsedStyleUrls && typeof parsedStyleUrls === 'object') {
    // styleUrls: {
    //   ios: 'badge.ios.css',
    //   md: 'badge.md.css',
    //   wp: 'badge.wp.css'
    // }
    Object.keys(parsedStyleUrls).forEach(modeName => {
      const externalStyles: d.ExternalStyleCompiler[] = [];

      const styleObj = parsedStyleUrls[modeName];
      if (typeof styleObj === 'string' && styleObj.trim().length > 0) {
        externalStyles.push({
          absolutePath: null,
          relativePath: null,
          originalCollectionPath: null,
          originalComponentPath: styleObj.trim()
        });

      } else if (Array.isArray(styleObj)) {
        styleObj.forEach(styleUrl => {
          if (typeof styleUrl === 'string' && styleUrl.trim().length > 0) {
            externalStyles.push({
              absolutePath: null,
              relativePath: null,
              originalCollectionPath: null,
              originalComponentPath: styleUrl.trim()
            });
          }
        });
      }

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
