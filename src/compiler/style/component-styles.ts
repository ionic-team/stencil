import * as d from '../../declarations';
import { buildError, catchError, hasFileExtension, normalizePath } from '@utils';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getComponentStylesCache, setComponentStylesCache } from './cached-styles';
import { optimizeCss } from './optimize-css';
import { runPluginTransforms } from '../plugin/plugin';
import { scopeComponentCss } from './scope-css';


export async function generateComponentStylesMode(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, styleMeta: d.StyleCompiler, modeName: string, commentOriginalSelector: boolean) {
  if (buildCtx.isRebuild) {
    const cachedCompiledStyles = await getComponentStylesCache(config, compilerCtx, buildCtx, cmp, styleMeta, commentOriginalSelector);
    if (cachedCompiledStyles) {
      styleMeta.compiledStyleText = cachedCompiledStyles.compiledStyleText;
      styleMeta.compiledStyleTextScoped = cachedCompiledStyles.compiledStyleTextScoped;
      styleMeta.compiledStyleTextScopedCommented = cachedCompiledStyles.compiledStyleTextScopedCommented;
      return;
    }
  }

  // compile each mode style
  const compiledStyles = await compileStyles(config, compilerCtx, buildCtx, cmp, styleMeta);

  // format and set the styles for use later
  const compiledStyleMeta = await setStyleText(config, compilerCtx, buildCtx, cmp, modeName, styleMeta.externalStyles, compiledStyles, commentOriginalSelector);

  styleMeta.compiledStyleText = compiledStyleMeta.styleText;
  styleMeta.compiledStyleTextScoped = compiledStyleMeta.styleTextScoped;
  styleMeta.compiledStyleTextScopedCommented = compiledStyleMeta.styleTextScopedCommented;

  if (config.watch) {
    // since this is a watch and we'll be checking this again
    // let's cache what we've learned today
    setComponentStylesCache(compilerCtx, cmp, styleMeta);
  }
}


async function compileStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, styleMeta: d.StyleCompiler) {
  // get all the absolute paths for each style
  const extStylePaths = styleMeta.externalStyles.map(extStyle => extStyle.absolutePath);

  if (typeof styleMeta.styleStr === 'string') {
    // plain styles just in a string
    // let's put these file in an in-memory file
    const inlineAbsPath = cmp.jsFilePath + '.css';
    extStylePaths.push(inlineAbsPath);

    await compilerCtx.fs.writeFile(inlineAbsPath, styleMeta.styleStr, { inMemoryOnly: true });
  }

  // build an array of style strings
  const compiledStyles = await Promise.all(extStylePaths.map(extStylePath => {
    return compileExternalStyle(config, compilerCtx, buildCtx, cmp, extStylePath);
  }));

  return compiledStyles;
}


async function compileExternalStyle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, extStylePath: string) {

  extStylePath = normalizePath(extStylePath);

  // see if we can used a cached style first
  let styleText: string;

  if (cmp.isCollectionDependency) {
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
    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, extStylePath, cmp);

    if (!cmp.isCollectionDependency) {
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
      const relSrc = config.sys.path.relative(config.cwd, cmp.sourceFilePath);
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
    `plugin and add it to "config.plugins" within the project's stencil config `,
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


async function setStyleText(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, modeName: string, externalStyles: d.ExternalStyleCompiler[], compiledStyles: string[], commentOriginalSelector: boolean) {
  // join all the component's styles for this mode together into one line
  const compiledStyle = {
    styleText: compiledStyles.join('\n\n').trim(),
    styleTextScoped: null as string,
    styleTextScopedCommented: null as string
  };

  let filePath: string = null;
  const externalStyle = externalStyles && externalStyles.length && externalStyles[0];
  if (externalStyle && externalStyle.absolutePath) {
    filePath = externalStyle.absolutePath;
  }

  // auto add css prefixes and minifies when configured
  compiledStyle.styleText = await optimizeCss(config, compilerCtx, buildCtx.diagnostics, compiledStyle.styleText, filePath, true);
  if (requiresScopedStyles(cmp.encapsulation, commentOriginalSelector)) {
    // only create scoped styles if we need to
    compiledStyle.styleTextScoped = await scopeComponentCss(config, buildCtx, cmp, modeName, compiledStyle.styleText, false);
    if (cmp.encapsulation === 'scoped') {
      compiledStyle.styleText = compiledStyle.styleTextScoped;
    }

    if (commentOriginalSelector && cmp.encapsulation === 'shadow') {
      compiledStyle.styleTextScopedCommented = await scopeComponentCss(config, buildCtx, cmp, modeName, compiledStyle.styleText, true);
    }
  }

  // by default the compiledTextScoped === compiledStyleText
  if (!compiledStyle.styleTextScoped) {
    compiledStyle.styleTextScoped = compiledStyle.styleText;
  }

  let addStylesUpdate = false;

  // test to see if the last styles are different
  const styleId = getStyleId(cmp, modeName, false);
  if (compilerCtx.lastBuildStyles.get(styleId) !== compiledStyle.styleText) {
    compilerCtx.lastBuildStyles.set(styleId, compiledStyle.styleText);

    if (buildCtx.isRebuild) {
      addStylesUpdate = true;
    }
  }

  const scopedStyleId = getStyleId(cmp, modeName, true);
  if (compilerCtx.lastBuildStyles.get(scopedStyleId) !== compiledStyle.styleTextScoped) {
    compilerCtx.lastBuildStyles.set(scopedStyleId, compiledStyle.styleTextScoped);
  }

  const styleMode = (modeName === DEFAULT_STYLE_MODE ? null : modeName);

  if (addStylesUpdate) {
    buildCtx.stylesUpdated = buildCtx.stylesUpdated || [];

    buildCtx.stylesUpdated.push({
      styleTag: cmp.tagName,
      styleMode: styleMode,
      styleText: compiledStyle.styleText,
    });
  }

  compiledStyle.styleText = escapeCssForJs(compiledStyle.styleText);
  compiledStyle.styleTextScoped = escapeCssForJs(compiledStyle.styleTextScoped);
  compiledStyle.styleTextScopedCommented = escapeCssForJs(compiledStyle.styleTextScopedCommented);

  return compiledStyle;
}


function getStyleId(cmp: d.ComponentCompilerMeta, modeName: string, isScopedStyles: boolean) {
  return `${cmp.tagName}${modeName}${isScopedStyles ? '.sc' : ''}`;
}


export function escapeCssForJs(style: string) {
  if (typeof style === 'string') {
    return style
      .replace(/\\[\D0-7]/g, (v) => '\\' + v)
      .replace(/\r\n|\r|\n/g, `\\n`)
      .replace(/\"/g, `\\"`)
      .replace(/\'/g, `\\'`)
      .replace(/\@/g, `\\@`);
  }
  return style;
}


function requiresScopedStyles(encapsulation: d.Encapsulation, commentOriginalSelector: boolean) {
  return (encapsulation === 'scoped' || (encapsulation === 'shadow' && commentOriginalSelector));
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
