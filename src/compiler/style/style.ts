import { BuildCtx, Bundle, CompilerCtx, ComponentMeta, Config, ModuleFile, StyleMeta } from '../../util/interfaces';
import { ENCAPSULATION } from '../../util/constants';
import { normalizePath } from '../util';
import { runPluginTransforms } from '../plugin/plugin';
import { scopeComponentCss } from '../css/scope-css';


export async function generateStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[]) {

  await Promise.all(bundles.map(async bundle => {

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
  const absStylePath = styleMeta.absolutePaths ? styleMeta.absolutePaths.slice() : [];

  if (typeof styleMeta.styleStr === 'string') {
    // plain styles just in a string
    // let's put these file in an in-memory file
    const inlineAbsPath = jsFilePath + '.css';
    absStylePath.push(inlineAbsPath);
    await compilerCtx.fs.writeFile(inlineAbsPath, styleMeta.styleStr, { inMemoryOnly: true });
  }

  const styles = await Promise.all(absStylePath.map(async filePath => {
    filePath = normalizePath(filePath);

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

  styleMeta.compiledStyleText = cleanStyle(styleMeta.compiledStyleText);

  if (styleMeta.compiledStyleTextScoped) {
    styleMeta.compiledStyleTextScoped = cleanStyle(styleMeta.compiledStyleTextScoped);
  }
}


export function cleanStyle(style: string) {
  return style.replace(/\r\n|\r|\n/g, `\\n`)
              .replace(/\"/g, `\\"`)
              .replace(/\@/g, `\\@`);
}


export function requiresScopedStyles(encapsulation: ENCAPSULATION) {
  return (encapsulation === ENCAPSULATION.ScopedCss || encapsulation === ENCAPSULATION.ShadowDom);
}
