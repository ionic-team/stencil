import * as d from '../../declarations';
import { buildError, catchError, hasFileExtension, normalizePath } from '../util';
import { ENCAPSULATION } from '../../util/constants';
import { generateGlobalStyles } from './global-styles';
import { minifyStyle } from './minify-style';
import { runPluginTransforms } from '../plugin/plugin';
import { scopeComponentCss } from './scope-css';


export async function generateStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (canSkipGenerateStyles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate styles started`);

  const componentStyles = await Promise.all(entryModules.map(async bundle => {
    await Promise.all(bundle.moduleFiles.map(async moduleFile => {
      await generateComponentStyles(config, compilerCtx, buildCtx, moduleFile);
    }));
  }));

  // create the global styles
  const globalStyles = await Promise.all(config.outputTargets
    .filter(outputTarget => outputTarget.type !== 'stats')
    .map(async outputTarget => {
      await generateGlobalStyles(config, compilerCtx, buildCtx, outputTarget);
    }));

  await Promise.all([
    componentStyles,
    globalStyles
  ]);

  timeSpan.finish(`generate styles finished`);
}


export async function generateComponentStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile) {
  const stylesMeta = moduleFile.cmpMeta.stylesMeta = moduleFile.cmpMeta.stylesMeta || {};

  await Promise.all(Object.keys(stylesMeta).map(async modeName => {
    // compile each style mode's sass/css
    const styles = await compileStyles(config, compilerCtx, buildCtx, moduleFile, stylesMeta[modeName]);

    // format and set the styles for use later
    await setStyleText(config, compilerCtx, buildCtx, moduleFile.cmpMeta, modeName, stylesMeta[modeName], styles);
  }));
}


async function compileStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile, styleMeta: d.StyleMeta) {
  const extStylePaths = styleMeta.externalStyles.map(extStyle => {
    return extStyle.absolutePath;
  });

  if (typeof styleMeta.styleStr === 'string') {
    // plain styles just in a string
    // let's put these file in an in-memory file
    const inlineAbsPath = moduleFile.jsFilePath + '.css';
    extStylePaths.push(inlineAbsPath);
    await compilerCtx.fs.writeFile(inlineAbsPath, styleMeta.styleStr, { inMemoryOnly: true });
  }

  const styles = await Promise.all(extStylePaths.map(extStylePath => {
    return compileExternalStyle(config, compilerCtx, buildCtx, moduleFile, extStylePath);
  }));

  return styles;
}


async function compileExternalStyle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile, extStylePath: string) {
  let styleText: string;

  extStylePath = normalizePath(extStylePath);

  if (buildCtx.isRebuild && !buildCtx.hasStyleChanges) {
    // watched file must have only been a script change and not style change
    // let's see if we cached anything for this file path
    styleText = compilerCtx.lastStyleText[extStylePath];
    if (typeof styleText === 'string') {
      return styleText;
    }
  }

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
    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, extStylePath);

    if (!moduleFile.isCollectionDependency) {
      const collectionDirs = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.collectionDir);

      const relPath = config.sys.path.relative(config.srcDir, transformResults.id);

      await Promise.all(collectionDirs.map(async outputTarget => {
        const collectionPath = config.sys.path.join(outputTarget.collectionDir, relPath);
        await compilerCtx.fs.writeFile(collectionPath, transformResults.code);
      }));
    }

    styleText = transformResults.code;

    if (config.watch && !extStylePath.endsWith('.js.css')) {
      // only cache if it's a watch build
      // but don't cache any css that was inlined in a .tsx file
      compilerCtx.lastStyleText[extStylePath] = styleText;
    }

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


export async function setStyleText(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmpMeta: d.ComponentMeta, modeName: string, styleMeta: d.StyleMeta, styles: string[]) {
  // join all the component's styles for this mode together into one line
  styleMeta.compiledStyleText = styles.join('\n\n').trim();

  // auto add css prefixes
  const autoprefixConfig = config.autoprefixCss;
  if (autoprefixConfig !== false) {
    styleMeta.compiledStyleText = await config.sys.autoprefixCss(styleMeta.compiledStyleText, autoprefixConfig);
  }

  let filePath: string = null;
  const externalStyle = styleMeta.externalStyles && styleMeta.externalStyles.length && styleMeta.externalStyles[0];
  if (externalStyle && externalStyle.absolutePath) {
    filePath = externalStyle.absolutePath;
  }

  // minify css
  styleMeta.compiledStyleText = await minifyStyle(config, compilerCtx, buildCtx.diagnostics, styleMeta.compiledStyleText, filePath);

  if (requiresScopedStyles(cmpMeta.encapsulation)) {
    // only create scoped styles if we need to
    styleMeta.compiledStyleTextScoped = await scopeComponentCss(config, buildCtx, cmpMeta, styleMeta.compiledStyleText);
  }

  compilerCtx.lastBuildStyles = compilerCtx.lastBuildStyles || {};
  // test to see if the last styles are different
  let styleId = getStyleId(cmpMeta, modeName, false);
  if (compilerCtx.lastBuildStyles[styleId] !== styleMeta.compiledStyleText) {
    compilerCtx.lastBuildStyles[styleId] = styleMeta.compiledStyleText;

    if (buildCtx.isRebuild) {
      buildCtx.stylesUpdated = buildCtx.stylesUpdated || {};
      buildCtx.stylesUpdated[styleId] = styleMeta.compiledStyleText;
    }
  }

  styleId = getStyleId(cmpMeta, modeName, true);
  if (compilerCtx.lastBuildStyles[styleId] !== styleMeta.compiledStyleTextScoped) {
    compilerCtx.lastBuildStyles[styleId] = styleMeta.compiledStyleTextScoped;

    if (buildCtx.isRebuild) {
      buildCtx.stylesUpdated = buildCtx.stylesUpdated || {};
      buildCtx.stylesUpdated[styleId] = styleMeta.compiledStyleTextScoped;
    }
  }

  styleMeta.compiledStyleText = escapeCssForJs(styleMeta.compiledStyleText);

  if (styleMeta.compiledStyleTextScoped) {
    styleMeta.compiledStyleTextScoped = escapeCssForJs(styleMeta.compiledStyleTextScoped);
  }
}


function getStyleId(cmpMeta: d.ComponentMeta, modeName: string, isScopedStyles: boolean) {
  return `${cmpMeta.tagNameMeta}${modeName}${isScopedStyles ? '.sc' : ''}`;
}


export function escapeCssForJs(style: string) {
  return style
    .replace(/\\[\D0-7]/g, (v) => '\\' + v)
    .replace(/\r\n|\r|\n/g, `\\n`)
    .replace(/\"/g, `\\"`)
    .replace(/\@/g, `\\@`);
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


function canSkipGenerateStyles(buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort()) {
    return true;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild) {
    if (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges) {
      return false;
    }

    return true;
  }

  return false;
}
