import { BuildConfig, ComponentMeta, ComponentOptions, ModuleFileMeta, StyleMeta } from '../../interfaces';
import { normalizePath } from '../../util';


export function normalizeStyles(buildConfig: BuildConfig, userOpts: ComponentOptions, moduleFile: ModuleFileMeta, cmpMeta: ComponentMeta) {
  normalizeStyleStr(userOpts, cmpMeta);
  normalizeStylePath(buildConfig, userOpts, moduleFile, cmpMeta);
  normalizeStylePaths(buildConfig, userOpts, moduleFile, cmpMeta);
}


function normalizeStyleStr(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  if (typeof userOpts.styles === 'string' && userOpts.styles.trim().length) {

    cmpMeta.stylesMeta = cmpMeta.stylesMeta || {};
    cmpMeta.stylesMeta.$ = cmpMeta.stylesMeta.$ || {};

    cmpMeta.stylesMeta.$.styleStr = userOpts.styles.trim();
  }
}


function normalizeStylePath(buildConfig: BuildConfig, userOpts: ComponentOptions, moduleFile: ModuleFileMeta, cmpMeta: ComponentMeta) {
  if (typeof userOpts.styleUrl === 'string' && userOpts.styleUrl.trim()) {
    // as a string
    // styleUrl: 'my-styles.scss'

    cmpMeta.stylesMeta = cmpMeta.stylesMeta || {};
    cmpMeta.stylesMeta.$ = cmpMeta.stylesMeta.$ || {};

    normalizeModeStylePaths(buildConfig, moduleFile, cmpMeta.stylesMeta.$, userOpts.styleUrl);
  }
}


function normalizeStylePaths(buildConfig: BuildConfig, userOpts: ComponentOptions, moduleFile: ModuleFileMeta, cmpMeta: ComponentMeta) {
  if (!userOpts.styleUrls) {
    return;
  }

  // normalize the possible styleUrl structures

  if (Array.isArray(userOpts.styleUrls)) {
    // as an array of strings
    // styleUrls: ['my-styles.scss', 'my-other-styles']

    userOpts.styleUrls.forEach(styleUrl => {
      if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim()) {

        cmpMeta.stylesMeta = cmpMeta.stylesMeta || {};
        cmpMeta.stylesMeta.$ = cmpMeta.stylesMeta.$ || {};
        normalizeModeStylePaths(buildConfig, moduleFile, cmpMeta.stylesMeta.$, userOpts.styleUrl);
      }
    });
    return;
  }

  // as an object
  // styleUrls: {
  //   ios: 'badge.ios.scss',
  //   md: 'badge.md.scss',
  //   wp: 'badge.wp.scss'
  // }
  const styleModes: {[modeName: string]: string} = (<any>userOpts).styleUrls;

  Object.keys(styleModes).forEach(styleModeName => {
    const modeName = styleModeName.trim().toLowerCase();

    if (typeof styleModes[styleModeName] === 'string' && styleModes[styleModeName].trim()) {
      cmpMeta.stylesMeta = cmpMeta.stylesMeta || {};
      cmpMeta.stylesMeta[modeName] = cmpMeta.stylesMeta[modeName] || {};
      normalizeModeStylePaths(buildConfig, moduleFile, cmpMeta.stylesMeta[styleModeName], styleModes[styleModeName]);

    } else if (Array.isArray(styleModes[styleModeName])) {
      const styleUrls: string[] = (<any>userOpts).styleUrls;

      styleUrls.forEach(styleUrl => {
        if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim().length) {
          cmpMeta.stylesMeta = cmpMeta.stylesMeta || {};
          cmpMeta.stylesMeta[modeName] = cmpMeta.stylesMeta[modeName] || {};

          normalizeModeStylePaths(buildConfig, moduleFile, cmpMeta.stylesMeta[styleModeName], styleUrl);
        }
      });
    }
  });
}


function normalizeModeStylePaths(buildConfig: BuildConfig, moduleFile: ModuleFileMeta, modeStyleMeta: StyleMeta, stylePath: string) {
  modeStyleMeta.cmpRelativeStylePaths = modeStyleMeta.cmpRelativeStylePaths || [];
  modeStyleMeta.absStylePaths = modeStyleMeta.absStylePaths || [];

  // get the absolute path of the directory which the component is sitting in
  const componentDir = normalizePath(buildConfig.sys.path.dirname(moduleFile.tsFilePath));

  // get the relative path from the component file to the style
  let componentRelativeStylePath = normalizePath(stylePath.trim());

  if (buildConfig.sys.path.isAbsolute(componentRelativeStylePath)) {
    // this path is absolute already!
    // add to our list of style absolute paths
    modeStyleMeta.absStylePaths.push(componentRelativeStylePath);

    // if this is an absolute path already, let's convert it to be relative
    componentRelativeStylePath = buildConfig.sys.path.relative(componentDir, componentRelativeStylePath);

    // add to our list of style relative paths
    modeStyleMeta.cmpRelativeStylePaths.push(componentRelativeStylePath);

  } else {
    // this path is relative to the component
    // add to our list of style relative paths
    modeStyleMeta.cmpRelativeStylePaths.push(componentRelativeStylePath);

    // create the absolute path to the style file
    const absoluteStylePath = normalizePath(buildConfig.sys.path.join(componentDir, componentRelativeStylePath));

    // add to our list of style absolute paths
    modeStyleMeta.absStylePaths.push(absoluteStylePath);
  }
}
