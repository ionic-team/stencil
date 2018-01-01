import { BuildContext, BuildConfig, ComponentMeta, ModuleFile, StyleMeta } from '../../util/interfaces';
import { buildError, isCssFile, isSassFile, readFile, normalizePath } from '../util';
import { ENCAPSULATION } from '../../util/constants';
import { scopeComponentCss } from '../css/scope-css';


export function generateComponentStyles(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile) {
  moduleFile.cmpMeta.stylesMeta = moduleFile.cmpMeta.stylesMeta || {};

  return Promise.all(Object.keys(moduleFile.cmpMeta.stylesMeta).map(async modeName => {
    // compile each style mode's sass/css
    const styles = await compileStyles(config, ctx, moduleFile, moduleFile.cmpMeta.stylesMeta[modeName]);

    // format and set the styles for use later
    return setStyleText(config, ctx,  moduleFile.cmpMeta, moduleFile.cmpMeta.stylesMeta[modeName], styles);
  }));
}


async function compileStyles(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile, styleMeta: StyleMeta) {
  const styles = await compileExternalStyles(config, ctx, moduleFile, styleMeta.absolutePaths);

  if (typeof styleMeta.styleStr === 'string') {
    // plain styles just in a string
    styles.push(styleMeta.styleStr);
  }

  return styles;
}


async function compileExternalStyles(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile, absStylePaths: string[]) {
  if (!Array.isArray(absStylePaths)) {
    return [];
  }

  return Promise.all(absStylePaths.map(filePath => {

    filePath = normalizePath(filePath);

    if (isSassFile(filePath)) {
      // sass file needs to be compiled
      return compileSassFile(config, ctx, moduleFile.jsFilePath, filePath);
    }

    if (isCssFile(filePath)) {
      // plain ol' css file
      return readCssFile(config, ctx, filePath);
    }

    // idk
    const d = buildError(ctx.diagnostics);
    d.messageText = `style url "${filePath}", in component "${moduleFile.cmpMeta.tagNameMeta}", is not a supported file type`;
    return '';
  }));
}


export function setStyleText(config: BuildConfig, ctx: BuildContext, cmpMeta: ComponentMeta, styleMeta: StyleMeta, styles: string[]) {
  // join all the component's styles for this mode together into one line
  styleMeta.compiledStyleText = styles.join('\n\n').trim();

  if (config.minifyCss) {
    // minify css
    const minifyCssResults = config.sys.minifyCss(styleMeta.compiledStyleText);
    minifyCssResults.diagnostics.forEach(d => {
      ctx.diagnostics.push(d);
    });

    if (minifyCssResults.output) {
      styleMeta.compiledStyleText = minifyCssResults.output;
    }
  }

  if (requiresScopedStyles(cmpMeta.encapsulation)) {
    // only create scoped styles if we need to
    styleMeta.compiledStyleTextScoped = scopeComponentCss(ctx, cmpMeta, styleMeta.compiledStyleText);
  }

  // append the hydrated css to the output
  setHydratedCss(config, cmpMeta, styleMeta);

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


function setHydratedCss(config: BuildConfig, cmpMeta: ComponentMeta, styleMeta: StyleMeta) {
  const tagSelector = `${cmpMeta.tagNameMeta}.${config.hydratedCssClass}`;

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    const hostSelector = `:host(.${config.hydratedCssClass})`;

    styleMeta.compiledStyleText = appendHydratedCss(
      styleMeta.compiledStyleText,
      hostSelector,
      true
    );

  } else {
    styleMeta.compiledStyleText = appendHydratedCss(
      styleMeta.compiledStyleText,
      tagSelector
    );
  }

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom || cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
    styleMeta.compiledStyleTextScoped = appendHydratedCss(
      styleMeta.compiledStyleTextScoped,
      tagSelector
    );
  }
}


function appendHydratedCss(styles: string, selector: string, important?: boolean) {
  return `${styles || ''}\n${selector}{visibility:inherit${important ? ' !important' : ''}}`;
}


function compileSassFile(config: BuildConfig, ctx: BuildContext, jsFilePath: string, absStylePath: string): Promise<string> {

  if (ctx.isChangeBuild && !ctx.changeHasSass && ctx.compiledFileCache[absStylePath]) {
    // if this is a change build, but there wasn't specifically a sass file change
    // however we may still need to build sass if its typescript module changed

    // loop through all the changed typescript filename and see if there are corresponding js filenames
    // if there are no filenames that match then let's not run sass
    // yes...there could be two files that have the same filename in different directories
    // but worst case scenario is that both of them run sass, which isn't a performance problem
    const distFileName = config.sys.path.basename(jsFilePath, '.js');
    const hasChangedFileName = ctx.changedFiles.some(f => {
      const changedFileName = config.sys.path.basename(f);
      return (changedFileName === distFileName + '.ts' || changedFileName === distFileName + '.tsx');
    });

    if (!hasChangedFileName) {
      // don't bother running sass on this, none of the changed files have the same filename
      // use the cached version
      return Promise.resolve(ctx.compiledFileCache[absStylePath]);
    }
  }

  return new Promise(resolve => {
    const sassConfig = {
      ...config.sassConfig,
      file: absStylePath,
      outputStyle: config.minifyCss ? 'compressed' : 'expanded',
    };

    config.sys.sass.render(sassConfig, (err, result) => {
      if (err) {
        const d = buildError(ctx.diagnostics);
        d.absFilePath = absStylePath;
        d.messageText = err;
        resolve(`/** ${err} **/`);

      } else {
        // keep track of how many times sass builds
        ctx.sassBuildCount++;

        // cache for later
        ctx.compiledFileCache[absStylePath] = result.css.toString();

        // resolve w/ our compiled sass
        resolve(ctx.compiledFileCache[absStylePath]);
      }
    });
  });
}


async function readCssFile(config: BuildConfig, ctx: BuildContext, absStylePath: string) {
  if (ctx.isChangeBuild && !ctx.changeHasCss && ctx.compiledFileCache[absStylePath]) {
    // if this is a change build, but there were no css changes so don't bother
    // and we have cached content for this file
    return ctx.compiledFileCache[absStylePath];
  }

  let styleText: string = '';

  try {
    // this is just a plain css file
    // only open it up for its content
    styleText = await readFile(config.sys, absStylePath);

    // cache for later
    ctx.compiledFileCache[absStylePath] = styleText;

  } catch (e) {
    const d = buildError(ctx.diagnostics);
    d.messageText = `Error opening CSS file. ${e}`;
    d.absFilePath = absStylePath;
  }

  return styleText;
}
