import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE, normalizePath } from '@utils';


export const normalizeStyles = (config: d.Config, tagName: string, componentFilePath: string, styles: d.StyleCompiler[]) => {
  styles.forEach(style => {

    if (style.modeName === DEFAULT_STYLE_MODE) {
      style.styleId = tagName.toUpperCase();
    } else {
      style.styleId = `${tagName.toUpperCase()}#${style.modeName}`;
    }

    if (Array.isArray(style.externalStyles)) {
      style.externalStyles.forEach(externalStyle => {
        normalizeExternalStyle(config, componentFilePath, externalStyle);
      });
    }
  });
};


const normalizeExternalStyle = (config: d.Config, componentFilePath: string, externalStyle: d.ExternalStyleCompiler) => {
  if (typeof externalStyle.originalComponentPath !== 'string' || externalStyle.originalComponentPath.trim().length === 0) {
    return;
  }

  // get the absolute path of the directory which the component is sitting in
  const componentDir = config.sys.path.dirname(componentFilePath);

  if (config.sys.path.isAbsolute(externalStyle.originalComponentPath)) {
    // this path is absolute already!
    // add to our list of style absolute paths
    externalStyle.absolutePath = normalizePath(externalStyle.originalComponentPath);

    // if this is an absolute path already, let's convert it to be relative
    externalStyle.relativePath = normalizePath(config.sys.path.relative(componentDir, externalStyle.originalComponentPath));

  } else {
    // this path is relative to the component
    // add to our list of style relative paths
    externalStyle.relativePath = normalizePath(externalStyle.originalComponentPath);

    // create the absolute path to the style file
    externalStyle.absolutePath = normalizePath(config.sys.path.join(componentDir, externalStyle.originalComponentPath));
  }
};
