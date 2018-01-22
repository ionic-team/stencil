import { Config, ExternalStyleMeta, StylesMeta } from '../../declarations';
import { normalizePath } from '../util';


export function normalizeStyles(config: Config, componentFilePath: string, stylesMeta: StylesMeta) {
  const newStylesMeta: StylesMeta = {};

  Object.keys(stylesMeta).forEach((modeName) => {
    newStylesMeta[modeName] = {
      externalStyles: []
    };

    const externalStyles = stylesMeta[modeName].externalStyles || [];

    newStylesMeta[modeName].externalStyles = externalStyles.map(externalStyle => {
      const { cmpRelativePath, absolutePath } = normalizeModeStylePaths(config, componentFilePath, externalStyle.originalComponentPath);

      const normalizedExternalStyles: ExternalStyleMeta = {
        absolutePath: absolutePath,
        cmpRelativePath: cmpRelativePath,
        originalComponentPath: externalStyle.originalComponentPath,
        originalCollectionPath: externalStyle.originalCollectionPath
      };

      return normalizedExternalStyles;
    });

    if (typeof stylesMeta[modeName].styleStr === 'string') {
      newStylesMeta[modeName].styleStr = stylesMeta[modeName].styleStr;
    }
  });

  return newStylesMeta;
}


function normalizeModeStylePaths(config: Config, componentFilePath: string, stylePath: string) {
  let cmpRelativePath: string;
  let absolutePath: string;

  // get the absolute path of the directory which the component is sitting in
  const componentDir = normalizePath(config.sys.path.dirname(componentFilePath));

  // get the relative path from the component file to the style
  let componentRelativeStylePath = normalizePath(stylePath.trim());

  if (config.sys.path.isAbsolute(componentRelativeStylePath)) {
    // this path is absolute already!
    // add to our list of style absolute paths
    absolutePath = componentRelativeStylePath;

    // if this is an absolute path already, let's convert it to be relative
    componentRelativeStylePath = config.sys.path.relative(componentDir, componentRelativeStylePath);

    // add to our list of style relative paths
    cmpRelativePath = componentRelativeStylePath;

  } else {
    // this path is relative to the component
    // add to our list of style relative paths
    cmpRelativePath = componentRelativeStylePath;

    // create the absolute path to the style file
    const absoluteStylePath = normalizePath(config.sys.path.join(componentDir, componentRelativeStylePath));

    // add to our list of style absolute paths
    absolutePath = absoluteStylePath;
  }

  return {
    cmpRelativePath,
    absolutePath
  };
}
