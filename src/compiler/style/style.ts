import { BuildCtx, CompilerCtx, ComponentMeta, Config, EntryModule, ModuleFile, StyleMeta } from '../../declarations';
import { ENCAPSULATION } from '../../util/constants';
import { hasFileExtension, normalizePath } from '../util';
import { runPluginTransforms } from '../plugin/plugin';
import { scopeComponentCss } from '../css/scope-css';


export async function generateStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]) {

  await Promise.all(entryModules.map(async bundle => {

    await Promise.all(bundle.moduleFiles.map(async moduleFile => {
      await generateComponentStyles(config, compilerCtx, buildCtx, moduleFile);
    }));

  }));
}


export async function generateComponentStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, moduleFile: ModuleFile) {
  const stylesMeta = moduleFile.cmpMeta.stylesMeta = moduleFile.cmpMeta.stylesMeta || {};

  await Promise.all(Object.keys(stylesMeta).map(async modeName => {
    // compile each style mode's sass/css
    const styles = await compileStyles(config, compilerCtx, buildCtx, moduleFile.jsFilePath, stylesMeta[modeName]);

    // format and set the styles for use later
    await setStyleText(buildCtx, moduleFile.cmpMeta, stylesMeta[modeName], styles);
  }));
}


async function compileStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, jsFilePath: string, styleMeta: StyleMeta) {
  const absStylePath: string[] = styleMeta.externalStyles.map(externalStyle => {
    return externalStyle.absolutePath;
  });


  if (typeof styleMeta.styleStr === 'string') {
    // plain styles just in a string
    // let's put these file in an in-memory file
    const inlineAbsPath = jsFilePath + '.css';
    absStylePath.push(inlineAbsPath);
    await compilerCtx.fs.writeFile(inlineAbsPath, styleMeta.styleStr, { inMemoryOnly: true });
  }

  const styles = await Promise.all(absStylePath.map(async filePath => {
    filePath = normalizePath(filePath);

    // test for well-known extensions and if the plugin has been installed
    if (hasFileExtension(filePath, ['scss', 'sass'])) {
      if (!config.plugins.some(p => p.name === 'sass')) {
        // using a sass file, however the sass plugin isn't installed
        if (!buildCtx.data.hasShownSassError) {
          const relPath = config.sys.path.relative(config.rootDir, filePath);
          config.logger.error(`Style "${relPath}" is a Sass file, however the "sass" plugin has not been installed. Please install the "@stencil/sass" plugin and add it to "config.plugins" within the project's stencil.config.js file. For more info please see: https://www.npmjs.com/package/@stencil/sass`);
          buildCtx.data.hasShownSassError = true;
        }
      }

    } else if (hasFileExtension(filePath, ['pcss'])) {
      if (!config.plugins.some(p => p.name === 'postcss')) {
        // using a pcss file, however the postcss plugin isn't installed
        if (!buildCtx.data.hasShownPostCssError) {
          const relPath = config.sys.path.relative(config.rootDir, filePath);
          config.logger.error(`Style "${relPath}" is a PostCSS file, however the "postcss" plugin has not been installed. Please install the "@stencil/postcss" plugin and add it to "config.plugins" within the project's stencil.config.js file. For more info please see: https://www.npmjs.com/package/@stencil/postcss`);
          buildCtx.data.hasShownPostCssError = true;
        }
      }
    }

    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, filePath);

    return transformResults.code;
  }));

  return styles;
}


export function setStyleText(buildCtx: BuildCtx, cmpMeta: ComponentMeta, styleMeta: StyleMeta, styles: string[]) {
  // join all the component's styles for this mode together into one line
  styleMeta.compiledStyleText = styles.join('\n\n').trim();

  if (requiresScopedStyles(cmpMeta.encapsulation)) {
    // only create scoped styles if we need to
    styleMeta.compiledStyleTextScoped = scopeComponentCss(buildCtx, cmpMeta, styleMeta.compiledStyleText);
  }

  styleMeta.compiledStyleText = escapeCssForJs(styleMeta.compiledStyleText);

  if (styleMeta.compiledStyleTextScoped) {
    styleMeta.compiledStyleTextScoped = escapeCssForJs(styleMeta.compiledStyleTextScoped);
  }
}


export function escapeCssForJs(style: string) {
  return style
    .replace(/\\[0-7]/g, (v) => '\\' + v)
    .replace(/\r\n|\r|\n/g, `\\n`)
    .replace(/\"/g, `\\"`)
    .replace(/\@/g, `\\@`);
}


export function requiresScopedStyles(encapsulation: ENCAPSULATION) {
  return (encapsulation === ENCAPSULATION.ScopedCss || encapsulation === ENCAPSULATION.ShadowDom);
}
