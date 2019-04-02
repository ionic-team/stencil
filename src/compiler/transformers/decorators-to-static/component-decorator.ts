import * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, removeDecorators } from '../transform-utils';
import ts from 'typescript';
import { DEFAULT_STYLE_MODE } from '@utils';


export function componentDecoratorToStatic(config: d.Config, cmpNode: ts.ClassDeclaration, newMembers: ts.ClassElement[], componentDecorator: ts.Decorator) {
  removeDecorators(cmpNode, ['Component']);

  const [ componentOptions ] = getDeclarationParameters<d.ComponentOptions>(componentDecorator);
  if (!componentOptions) {
    return;
  }

  if (typeof componentOptions.tag !== 'string' || componentOptions.tag.trim().length === 0) {
    return;
  }

  newMembers.push(createStaticGetter('is', convertValueToLiteral(componentOptions.tag.trim())));

  if (componentOptions.shadow) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('shadow')));

  } else if (componentOptions.scoped) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('scoped')));
  }

  const defaultModeStyles = [];
  if (componentOptions.styleUrls) {
    if (Array.isArray(componentOptions.styleUrls)) {
      defaultModeStyles.push(...normalizeStyle(componentOptions.styleUrls));
    } else {
      defaultModeStyles.push(...normalizeStyle(componentOptions.styleUrls[DEFAULT_STYLE_MODE]));
    }
  }
  if (componentOptions.styleUrl) {
    defaultModeStyles.push(...normalizeStyle(componentOptions.styleUrl));
  }

  let styleUrls: d.CompilerModeStyles = {};
  if (componentOptions.styleUrls && !Array.isArray(componentOptions.styleUrls)) {
    styleUrls = normalizeStyleUrls(componentOptions.styleUrls);
  }
  if (defaultModeStyles.length > 0) {
    styleUrls[DEFAULT_STYLE_MODE] = defaultModeStyles;
  }

  if (Object.keys(styleUrls).length > 0) {
    newMembers.push(createStaticGetter('originalStyleUrls', convertValueToLiteral(styleUrls)));
    newMembers.push(createStaticGetter('styleUrls', convertValueToLiteral(normalizeExtension(config, styleUrls))));
  }

  let assetsDirs = componentOptions.assetsDirs || [];
  if (componentOptions.assetsDir) {
    assetsDirs = [
      ...assetsDirs,
      componentOptions.assetsDir,
    ];
  }
  if (assetsDirs.length > 0) {
    newMembers.push(createStaticGetter('assetsDirs', convertValueToLiteral(assetsDirs)));
  }
  if (typeof componentOptions.styles === 'string') {
    const styles = componentOptions.styles.trim();
    if (styles.length > 0) {
      newMembers.push(createStaticGetter('styles', convertValueToLiteral(styles)));
    }
  }
}


function normalizeExtension(config: d.Config, styleUrls: d.CompilerModeStyles): d.CompilerModeStyles {
  const compilerStyleUrls: d.CompilerModeStyles = {};
  Object.keys(styleUrls).forEach(key => {
    compilerStyleUrls[key] = styleUrls[key].map(s => useCss(config, s));
  });
  return compilerStyleUrls;
}

function useCss(config: d.Config, path: string) {
  const p = config.sys.path.parse(path);
  return config.sys.path.join(p.dir, p.name + '.css');
}

function normalizeStyleUrls(styleUrls: d.ModeStyles): d.CompilerModeStyles {
  const compilerStyleUrls: d.CompilerModeStyles = {};
  Object.keys(styleUrls).forEach(key => {
    compilerStyleUrls[key] = normalizeStyle(styleUrls[key]);
  });
  return compilerStyleUrls;
}

function normalizeStyle(style: string | string[] | undefined): string[] {
  if (Array.isArray(style)) {
    return style;
  }
  if (style) {
    return [style];
  }
  return [];
}
