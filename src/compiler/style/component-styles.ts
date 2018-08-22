import * as d from '../../declarations';
import { autoprefixCssMain } from './auto-prefix-css-main';
import { buildError, catchError, hasFileExtension, normalizePath } from '../util';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../util/constants';
import { getComponentStylesCache, setComponentStylesCache } from './cached-styles';
import { minifyStyle } from './minify-style';
import { runPluginTransforms } from '../plugin/plugin';
import { scopeComponentCss } from './scope-css';


export async function generateComponentStylesMode(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile, styleMeta: d.StyleMeta, modeName: string) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return;
  }

  if (buildCtx.isRebuild) {
    const cachedCompiledStyles = await getComponentStylesCache(config, compilerCtx, buildCtx, moduleFile, styleMeta, modeName);
    if (cachedCompiledStyles) {
      styleMeta.compiledStyleText = cachedCompiledStyles.compiledStyleText;
      styleMeta.compiledStyleTextScoped = cachedCompiledStyles.compiledStyleTextScoped;
      return;
    }
  }

  // compile each mode style
  const compiledStyles = await compileStyles(config, compilerCtx, buildCtx, moduleFile, styleMeta);

  // format and set the styles for use later
  const compiledStyleMeta = await setStyleText(config, compilerCtx, buildCtx, moduleFile.cmpMeta, modeName, styleMeta.externalStyles, compiledStyles);

  styleMeta.compiledStyleText = compiledStyleMeta.compiledStyleText;
  styleMeta.compiledStyleTextScoped = compiledStyleMeta.compiledStyleTextScoped;

  if (config.watch) {
    // since this is a watch and we'll be checking this again
    // let's cache what we've learned today
    setComponentStylesCache(compilerCtx, moduleFile, modeName, styleMeta);
  }
}


async function compileStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile, styleMeta: d.StyleMeta) {
  // get all the absolute paths for each style
  const extStylePaths = styleMeta.externalStyles.map(extStyle => extStyle.absolutePath);

  if (typeof styleMeta.styleStr === 'string') {
    // plain styles just in a string
    // let's put these file in an in-memory file
    const inlineAbsPath = moduleFile.jsFilePath + '.css';
    extStylePaths.push(inlineAbsPath);

    await compilerCtx.fs.writeFile(inlineAbsPath, styleMeta.styleStr, { inMemoryOnly: true });
  }

  // build an array of style strings
  const compiledStyles = await Promise.all(extStylePaths.map(extStylePath => {
    return compileExternalStyle(config, compilerCtx, buildCtx, moduleFile, extStylePath);
  }));

  return compiledStyles;
}


async function compileExternalStyle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile, extStylePath: string) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return '/* build aborted */';
  }

  extStylePath = normalizePath(extStylePath);

  // see if we can used a cached style first
  let styleText: string;

  if (moduleFile.isCollectionDependency) {
    // if it's a collection dependency and it's a preprocessor file like sass
    // AND we have the correct plugin then let's compile it
    const hasPlugin = hasPluginInstalled(config, extStylePath);
    if (!hasPlugin) {
      // the collection has this style as a preprocessor file, like sass
      // however the user doesn't have this plugin installed, which is file
      // instead of using the preprocessor file (sass) use the vanilla css file
      const parts = extStylePath.split('.');
      parts[parts.length - 1] = 'css';
      extStylePath = parts.join('.');
    }

  } else {
    // not a collection dependency
    // check known extensions just for a helpful message
    checkPluginHelpers(config, buildCtx, extStylePath);
  }

  try {
    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, extStylePath, moduleFile);

    if (!moduleFile.isCollectionDependency) {
      const collectionDirs = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.collectionDir);

      const relPath = config.sys.path.relative(config.srcDir, transformResults.id);

      await Promise.all(collectionDirs.map(async outputTarget => {
        const collectionPath = config.sys.path.join(outputTarget.collectionDir, relPath);
        await compilerCtx.fs.writeFile(collectionPath, transformResults.code);
      }));
    }

    styleText = transformResults.code;

    buildCtx.styleBuildCount++;

  } catch (e) {
    if (e.code === 'ENOENT') {
      const d = buildError(buildCtx.diagnostics);
      const relExtStyle = config.sys.path.relative(config.cwd, extStylePath);
      const relSrc = config.sys.path.relative(config.cwd, moduleFile.sourceFilePath);
      d.messageText = `Unable to load style ${relExtStyle} from ${relSrc}`;
    } else {
      catchError(buildCtx.diagnostics, e);
    }
    styleText = '';
  }

  return styleText;
}


function checkPluginHelpers(config: d.Config, buildCtx: d.BuildCtx, externalStylePath: string) {
  PLUGIN_HELPERS.forEach(p => {
    checkPluginHelper(config, buildCtx, externalStylePath, p.pluginExts, p.pluginId, p.pluginName);
  });
}


function checkPluginHelper(config: d.Config, buildCtx: d.BuildCtx, externalStylePath: string, pluginExts: string[], pluginId: string, pluginName: string) {
  if (!hasFileExtension(externalStylePath, pluginExts)) {
    return;
  }

  if (config.plugins.some(p => p.name === pluginId)) {
    return;
  }

  const errorKey = 'styleError' + pluginId;
  if (buildCtx.data[errorKey]) {
    // already added this key
    return;
  }
  buildCtx.data[errorKey] = true;

  const relPath = config.sys.path.relative(config.rootDir, externalStylePath);

  const msg = [
    `Style "${relPath}" is a ${pluginName} file, however the "${pluginId}" `,
    `plugin has not been installed. Please install the "@stencil/${pluginId}" `,
    `plugin and add it to "config.plugins" within the project's stencil.config.js `,
    `file. For more info please see: https://www.npmjs.com/package/@stencil/${pluginId}`
  ].join('');

  const d = buildError(buildCtx.diagnostics);
  d.header = 'style error';
  d.messageText = msg;
}


function hasPluginInstalled(config: d.Config, filePath: string) {
  // TODO: don't hard these

  const plugin = PLUGIN_HELPERS.find(p => hasFileExtension(filePath, p.pluginExts));
  if (plugin) {
    return config.plugins.some(p => p.name === plugin.pluginId);
  }

  return false;
}


async function setStyleText(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmpMeta: d.ComponentMeta, modeName: string, externalStyles: d.ExternalStyleMeta[], compiledStyles: string[]) {
  const styleMeta: d.StyleMeta = {};

  // join all the component's styles for this mode together into one line
  styleMeta.compiledStyleText = compiledStyles.join('\n\n').trim();

  let filePath: string = null;
  const externalStyle = externalStyles && externalStyles.length && externalStyles[0];
  if (externalStyle && externalStyle.absolutePath) {
    filePath = externalStyle.absolutePath;
  }

  // auto add css prefixes
  const autoprefixConfig = config.autoprefixCss;
  if (autoprefixConfig !== false) {
    styleMeta.compiledStyleText = await autoprefixCssMain(config, compilerCtx, styleMeta.compiledStyleText, autoprefixConfig);
  }

  if (config.minifyCss) {
    // minify css
    styleMeta.compiledStyleText = await minifyStyle(config, compilerCtx, buildCtx.diagnostics, styleMeta.compiledStyleText, filePath);
  }

  if (requiresScopedStyles(cmpMeta.encapsulationMeta)) {
    // only create scoped styles if we need to
    styleMeta.compiledStyleTextScoped = await scopeComponentCss(config, buildCtx, cmpMeta, modeName, styleMeta.compiledStyleText);
    if (config.devMode) {
      styleMeta.compiledStyleTextScoped = '\n' + styleMeta.compiledStyleTextScoped + '\n';
    }
  }

  let addStylesUpdate = false;
  let addScopedStylesUpdate = false;

  // test to see if the last styles are different
  const styleId = getStyleId(cmpMeta, modeName, false);
  if (compilerCtx.lastBuildStyles.get(styleId) !== styleMeta.compiledStyleText) {
    compilerCtx.lastBuildStyles.set(styleId, styleMeta.compiledStyleText);

    if (buildCtx.isRebuild) {
      addStylesUpdate = true;
    }
  }

  const scopedStyleId = getStyleId(cmpMeta, modeName, true);
  if (compilerCtx.lastBuildStyles.get(scopedStyleId) !== styleMeta.compiledStyleTextScoped) {
    compilerCtx.lastBuildStyles.set(scopedStyleId, styleMeta.compiledStyleTextScoped);

    if (buildCtx.isRebuild) {
      addScopedStylesUpdate = true;
    }
  }

  styleMeta.compiledStyleText = escapeCssForJs(styleMeta.compiledStyleText);

  if (styleMeta.compiledStyleTextScoped) {
    styleMeta.compiledStyleTextScoped = escapeCssForJs(styleMeta.compiledStyleTextScoped);
  }

  const styleMode = (modeName === DEFAULT_STYLE_MODE ? null : modeName);

  if (addStylesUpdate) {
    buildCtx.stylesUpdated = buildCtx.stylesUpdated || [];

    buildCtx.stylesUpdated.push({
      styleTag: cmpMeta.tagNameMeta,
      styleMode: styleMode,
      styleText: styleMeta.compiledStyleText,
      isScoped: false
    });
  }

  if (addScopedStylesUpdate) {
    buildCtx.stylesUpdated.push({
      styleTag: cmpMeta.tagNameMeta,
      styleMode: styleMode,
      styleText: styleMeta.compiledStyleTextScoped,
      isScoped: true
    });
  }

  return styleMeta;
}


function getStyleId(cmpMeta: d.ComponentMeta, modeName: string, isScopedStyles: boolean) {
  return `${cmpMeta.tagNameMeta}${modeName}${isScopedStyles ? '.sc' : ''}`;
}


export function escapeCssForJs(style: string) {
  if (typeof style === 'string') {
    return style
      .replace(/\\[\D0-7]/g, (v) => '\\' + v)
      .replace(/\r\n|\r|\n/g, `\\n`)
      .replace(/\"/g, `\\"`)
      .replace(/\@/g, `\\@`);
  }
  return style;
}


export function requiresScopedStyles(encapsulation: ENCAPSULATION) {
  return (encapsulation === ENCAPSULATION.ScopedCss || encapsulation === ENCAPSULATION.ShadowDom);
}


export const PLUGIN_HELPERS = [
  {
    pluginName: 'PostCSS',
    pluginId: 'postcss',
    pluginExts: ['pcss']
  },
  {
    pluginName: 'Sass',
    pluginId: 'sass',
    pluginExts: ['scss', 'sass']
  },
  {
    pluginName: 'Stylus',
    pluginId: 'stylus',
    pluginExts: ['styl', 'stylus']
  }, {
    pluginName: 'Less',
    pluginId: 'less',
    pluginExts: ['less']
  }
];
