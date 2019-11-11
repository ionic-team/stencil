import * as d from '../../../declarations';
import { ConvertIdentifier, convertValueToLiteral, createStaticGetter } from '../transform-utils';
import { DEFAULT_STYLE_MODE } from '@utils';
import ts from 'typescript';


export const styleToStatic = (config: d.Config, newMembers: ts.ClassElement[], componentOptions: d.ComponentOptions) => {
  const defaultModeStyles = [];

  if (componentOptions.styleUrls) {
    if (Array.isArray(componentOptions.styleUrls)) {
      defaultModeStyles.push(...normalizeStyleUrl(componentOptions.styleUrls));
    } else {
      defaultModeStyles.push(...normalizeStyleUrl(componentOptions.styleUrls[DEFAULT_STYLE_MODE]));
    }
  }

  if (componentOptions.styleUrl) {
    defaultModeStyles.push(...normalizeStyleUrl(componentOptions.styleUrl));
  }

  let styleUrls: d.CompilerModeStyles = {};
  if (componentOptions.styleUrls && !Array.isArray(componentOptions.styleUrls)) {
    styleUrls = normalizeStyleUrls(componentOptions.styleUrls);
  }

  if (defaultModeStyles.length > 0) {
    styleUrls[DEFAULT_STYLE_MODE] = defaultModeStyles;
  }

  if (Object.keys(styleUrls).length > 0) {
    const originalStyleUrls = convertValueToLiteral(styleUrls);
    newMembers.push(createStaticGetter('originalStyleUrls', originalStyleUrls));

    const norlizedStyleExt = normalizeExtension(config, styleUrls);
    const normalizedStyleExp = convertValueToLiteral(norlizedStyleExt);
    newMembers.push(createStaticGetter('styleUrls', normalizedStyleExp));
  }

  if (typeof componentOptions.styles === 'string') {
    const styles = componentOptions.styles.trim();
    if (styles.length > 0) {
      newMembers.push(createStaticGetter('styles', ts.createLiteral(styles)));
    }

  } else if (componentOptions.styles) {
    const convertIdentifier = (componentOptions.styles as any) as ConvertIdentifier;
    if (convertIdentifier.__identifier) {
      newMembers.push(createStaticGetter('styles', ts.createIdentifier(convertIdentifier.__escapedText)));
    }
  }
};


const normalizeExtension = (config: d.Config, styleUrls: d.CompilerModeStyles) => {
  const compilerStyleUrls: d.CompilerModeStyles = {};
  Object.keys(styleUrls).forEach(key => {
    compilerStyleUrls[key] = styleUrls[key].map(s => useCss(config, s));
  });
  return compilerStyleUrls;
};

const useCss = (config: d.Config, stylePath: string) => {
  const sourceFileDir = config.sys.path.dirname(stylePath);
  const sourceFileExt = config.sys.path.extname(stylePath);
  const sourceFileName = config.sys.path.basename(stylePath, sourceFileExt);
  return config.sys.path.join(sourceFileDir, sourceFileName + '.css');
};

const normalizeStyleUrls = (styleUrls: d.ModeStyles): d.CompilerModeStyles => {
  const compilerStyleUrls: d.CompilerModeStyles = {};
  Object.keys(styleUrls).forEach(key => {
    compilerStyleUrls[key] = normalizeStyleUrl(styleUrls[key]);
  });
  return compilerStyleUrls;
};

const normalizeStyleUrl = (style: string | string[] | undefined) => {
  if (Array.isArray(style)) {
    return style;
  }
  if (style) {
    return [style];
  }
  return [];
};
