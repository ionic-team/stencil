import { BuildContext, BuildConfig, ModuleFile, ComponentMeta, CompiledModeStyles } from '../../util/interfaces';
import { buildError, isCssFile, isSassFile, readFile, normalizePath } from '../util';
import { ENCAPSULATION } from '../../util/constants';
import { scopeComponentCss } from '../css/scope-css';



export function generateComponentStyles(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile) {
  const modes = Object.keys(moduleFile.cmpMeta.stylesMeta);

  const promises = modes.map(modeName => {
    return generateComponentModeStyles(config, ctx, moduleFile, modeName);
  });

  return Promise.all(promises).then(componentModeStyles => {
    if (componentModeStyles.some(c => c.writeFile)) {
      ctx.styleBundleCount++;
    }
    return componentModeStyles;
  });
}


export function generateComponentModeStyles(
  config: BuildConfig,
  ctx: BuildContext,
  moduleFile: ModuleFile,
  modeName: string
) {
  return generateAllComponentModeStyles(config, ctx, moduleFile, modeName).then(allCmpStyleDetails => {
    const compiledModeStyles = groupComponentModeStyles(moduleFile.cmpMeta.tagNameMeta, modeName, allCmpStyleDetails);

    setHydratedCss(config, moduleFile.cmpMeta, compiledModeStyles);

    return compiledModeStyles;
  });
}


function generateAllComponentModeStyles(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile, modeName: string) {
  const modeStyleMeta = moduleFile.cmpMeta.stylesMeta[modeName];
  const promises: Promise<CompiledModeStyles>[] = [];

  if (modeStyleMeta) {
    // used to remember the exact order the user wants
    // sass render and file reads are async so it could mess with the order
    let styleOrder = 0;

    if (modeStyleMeta.absolutePaths) {
      modeStyleMeta.absolutePaths.forEach(absStylePath => {
        styleOrder++;

        absStylePath = normalizePath(absStylePath);

        if (isSassFile(absStylePath)) {
          // sass file needs to be compiled
          promises.push(compileSassFile(config, ctx, moduleFile, absStylePath, styleOrder));

        } else if (isCssFile(absStylePath)) {
          // plain ol' css file
          promises.push(readCssFile(config, ctx, moduleFile.cmpMeta, absStylePath, styleOrder));

        } else {
          // idk
          const d = buildError(ctx.diagnostics);
          d.messageText = `style url "${absStylePath}", in component "${moduleFile.cmpMeta.tagNameMeta}", is not a supported file type`;
        }
      });
    }

    if (typeof modeStyleMeta.styleStr === 'string') {
      // plain styles as a string
      promises.push(readInlineStyles(config, ctx, moduleFile.cmpMeta, modeStyleMeta.styleStr, styleOrder));
    }
  }

  return Promise.all(promises);
}


export function groupComponentModeStyles(tag: string, modeName: string, allCmpStyleDetails: CompiledModeStyles[]) {
  const compiledModeStyles: CompiledModeStyles = {
    tag: tag,
    modeName: modeName,
    writeFile: allCmpStyleDetails.some(c => c.writeFile)
  };

  if (allCmpStyleDetails.length === 0) {
    return compiledModeStyles;
  }

  allCmpStyleDetails = allCmpStyleDetails.sort((a, b) => {
    if (a.styleOrder < b.styleOrder) return -1;
    if (a.styleOrder > b.styleOrder) return 1;
    return 0;
  });

  // create the unscoped css by combining
  // all of the styles this component should use
  compiledModeStyles.unscopedStyles = allCmpStyleDetails.map(s => s.unscopedStyles || '').join('\n\n').trim();

  // group all scoped css
  compiledModeStyles.scopedStyles = allCmpStyleDetails.map(s => s.scopedStyles || '').join('\n\n').trim();

  return compiledModeStyles;
}


function setHydratedCss(config: BuildConfig, cmpMeta: ComponentMeta, compiledModeStyles: CompiledModeStyles) {
  const tagSelector = `${cmpMeta.tagNameMeta}.${config.hydratedCssClass}`;

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    const hostSelector = `:host(.${config.hydratedCssClass})`;

    compiledModeStyles.unscopedStyles = appendHydratedCss(
      compiledModeStyles.unscopedStyles,
      hostSelector,
      true
    );

  } else {
    compiledModeStyles.unscopedStyles = appendHydratedCss(
      compiledModeStyles.unscopedStyles,
      tagSelector
    );
  }

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom || cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
    compiledModeStyles.scopedStyles = appendHydratedCss(
      compiledModeStyles.scopedStyles,
      tagSelector
    );
  }
}


function appendHydratedCss(styles: string, selector: string, important?: boolean) {
  return `${styles}\n${selector}{visibility:inherit${important ? ' !important' : ''}}`;
}


function compileSassFile(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile, absStylePath: string, styleOrder: number): Promise<CompiledModeStyles> {
  const compileSassDetails: CompiledModeStyles = {
    styleOrder: styleOrder,
    writeFile: false
  };

  if (ctx.isChangeBuild && !ctx.changeHasSass) {
    // if this is a change build, but there wasn't specifically a sass file change
    // however we may still need to build sass if its typescript module changed

    // loop through all the changed typescript filename and see if there are corresponding js filenames
    // if there are no filenames that match then let's not run sass
    // yes...there could be two files that have the same filename in different directories
    // but worst case scenario is that both of them run sass, which isn't a performance problem
    const distFileName = config.sys.path.basename(moduleFile.jsFilePath, '.js');
    const hasChangedFileName = ctx.changedFiles.some(f => {
      const changedFileName = config.sys.path.basename(f);
      return (changedFileName === distFileName + '.ts' || changedFileName === distFileName + '.tsx');
    });

    if (!hasChangedFileName && ctx.styleSassUnscopedOutputs[absStylePath]) {
      // don't bother running sass on this, none of the changed files have the same filename
      // use the cached version
      compileSassDetails.unscopedStyles = ctx.styleSassUnscopedOutputs[absStylePath];
      compileSassDetails.scopedStyles = ctx.styleSassScopedOutputs[absStylePath];
      return Promise.resolve(compileSassDetails);
    }
  }

  return new Promise(resolve => {
    const sassConfig = {
      file: absStylePath,
      outputStyle: config.minifyCss ? 'compressed' : 'expanded',
    };

    config.sys.sass.render(sassConfig, (err, result) => {
      if (err) {
        const d = buildError(ctx.diagnostics);
        d.absFilePath = absStylePath;
        d.messageText = err;

      } else {
        fillStyleText(config, ctx, moduleFile.cmpMeta, compileSassDetails, result.css.toString());

        compileSassDetails.writeFile = true;
        ctx.sassBuildCount++;

        // cache for later
        ctx.styleSassUnscopedOutputs[absStylePath] = compileSassDetails.unscopedStyles;
        ctx.styleSassScopedOutputs[absStylePath] = compileSassDetails.scopedStyles;
      }
      resolve(compileSassDetails);
    });
  });
}


function readCssFile(config: BuildConfig, ctx: BuildContext, cmpMeta: ComponentMeta, absStylePath: string, styleOrder: number) {
  const readCssDetails: CompiledModeStyles = {
    styleOrder: styleOrder,
    writeFile: false
  };

  if (ctx.isChangeBuild && !ctx.changeHasCss) {
    // if this is a change build, but there were no sass changes then don't bother
    readCssDetails.unscopedStyles = ctx.styleCssUnscopedOutputs[absStylePath];
    readCssDetails.scopedStyles = ctx.styleCssScopedOutputs[absStylePath];
    return Promise.resolve(readCssDetails);
  }

  // this is just a plain css file
  // only open it up for its content
  const sys = config.sys;

  return readFile(sys, absStylePath).then(cssText => {
    fillStyleText(config, ctx, cmpMeta, readCssDetails, cssText.toString());

    readCssDetails.writeFile = true;

    // cache for later
    ctx.styleCssUnscopedOutputs[absStylePath] = readCssDetails.unscopedStyles;
    ctx.styleCssScopedOutputs[absStylePath] = readCssDetails.scopedStyles;

  }).catch(err => {
    const d = buildError(ctx.diagnostics);
    d.messageText = `Error opening CSS file. ${err}`;
    d.absFilePath = absStylePath;

  }).then(() => {
    return readCssDetails;
  });
}


function readInlineStyles(config: BuildConfig, ctx: BuildContext, cmpMeta: ComponentMeta, styleStr: string, styleOrder: number) {
  const inlineStylesDetail: CompiledModeStyles = {
    styleOrder: styleOrder
  };

  fillStyleText(config, ctx, cmpMeta, inlineStylesDetail, styleStr);

  return Promise.resolve(inlineStylesDetail);
}


export function fillStyleText(config: BuildConfig, ctx: BuildContext, cmpMeta: ComponentMeta, compiledModeStyles: CompiledModeStyles, unscopedStyles: string) {
  compiledModeStyles.unscopedStyles = null;
  compiledModeStyles.scopedStyles = null;

  if (typeof unscopedStyles === 'string') {
    compiledModeStyles.unscopedStyles = unscopedStyles.trim();

    if (config.minifyCss) {
      // minify css
      const minifyCssResults = config.sys.minifyCss(compiledModeStyles.unscopedStyles);
      minifyCssResults.diagnostics.forEach(d => {
        ctx.diagnostics.push(d);
      });

      if (minifyCssResults.output) {
        compiledModeStyles.unscopedStyles = minifyCssResults.output;
      }
    }

    if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss || cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      // only create scoped styles if we need to
      compiledModeStyles.scopedStyles = scopeComponentCss(ctx, cmpMeta, unscopedStyles);
    }
  }
}
