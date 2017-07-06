import { BUNDLES_DIR, HYDRATED_CSS } from '../util/constants';
import { BuildContext, BuildConfig, ComponentMeta, Manifest, Bundle, StylesResults } from './interfaces';
import { formatCssBundleFileName, generateBundleId } from '../util/data-serialize';
import { readFile } from './util';


export function bundleStyles(buildConfig: BuildConfig, ctx: BuildContext, userManifest: Manifest) {
  // within MAIN thread
  const timeSpan = buildConfig.logger.createTimeSpan(`bundle styles started`);

  // create main style results object
  const stylesResults: StylesResults = {
    bundles: {},
    diagnostics: []
  };

  // go through each bundle the user wants created
  // and create css files for each mode for each bundle
  return Promise.all(userManifest.bundles.map(userBundle => {
    return generateBundleCss(buildConfig, ctx, userManifest, userBundle, stylesResults);
  }))
  .catch(err => {
    stylesResults.diagnostics.push({
      msg: err.toString(),
      type: 'error',
      stack: err.stack
    });

  })
  .then(() => {
    timeSpan.finish('bundle styles finished');
    return stylesResults;
  });
}


function generateBundleCss(buildConfig: BuildConfig, ctx: BuildContext, userManifest: Manifest, userBundle: Bundle, stylesResults: StylesResults) {
  // within MAIN thread
  // multiple modes can be on each component
  // and multiple components can be in each bundle
  // create css files with the common modes for the bundle's components

  // collect only the component meta data this bundle needs
  const bundleComponentMeta = userBundle.components.sort().map(userBundleComponentTag => {
    const foundComponentMeta = userManifest.components.find(manifestComponent => (
      manifestComponent.tagNameMeta === userBundleComponentTag
    ));

    if (!foundComponentMeta) {
      stylesResults.diagnostics = stylesResults.diagnostics || [];
      stylesResults.diagnostics.push({
        msg: `Component tag "${userBundleComponentTag.toLowerCase()}" is defined in a bundle but no matching component was found with this tag within this project or its collections.`,
        type: 'error'
      });
    }
    return foundComponentMeta;
  }).filter(c => c);

  // figure out all of the possible modes this bundle has
  let bundleModes: string[] = [];
  bundleComponentMeta
    .filter(cmpMeta => cmpMeta.styleMeta)
    .forEach(cmpMeta => {
      Object.keys(cmpMeta.styleMeta).forEach(modeName => {
        if (bundleModes.indexOf(modeName) === -1) {
          bundleModes.push(modeName);
        }
      });
  });
  bundleModes = bundleModes.sort();

  // go through each mode this bundle has
  // and create a css file for this each mode in this bundle
  return Promise.all(bundleModes.map(modeName => {
    return generateModeCss(buildConfig, ctx, bundleComponentMeta, userBundle, modeName, stylesResults);

  })).catch(err => {
    stylesResults.diagnostics.push({
      msg: err.toString(),
      type: 'error',
      stack: err.stack
    });

  }).then(() => {
    return stylesResults;
  });
}


function generateModeCss(
  buildConfig: BuildConfig,
  ctx: BuildContext,
  bundleComponentMeta: ComponentMeta[],
  userBundle: Bundle,
  modeName: string,
  stylesResults: StylesResults
) {
  // within WORKER thread
  // loop through each component in this bundle
  // and create a css file for all the same modes
  const sys = buildConfig.sys;

  return Promise.all(bundleComponentMeta.map(cmpMeta => {
    return generateComponentModeStyles(buildConfig, cmpMeta, modeName, stylesResults);

  })).then(modeStyles => {
    // tack on the visibility css to each component tag selector
    modeStyles.push(appendVisibilityCss(bundleComponentMeta));

    // let's join all bundled component mode css together
    let styleContent = modeStyles.join('\n\n').trim();

    // generate a unique internal id for this bundle (this isn't the hashed bundle id)
    const bundleId = generateBundleId(userBundle.components);

    // we've built up some css content for this mode
    // ensure we've got some good objects before we start assigning stuff
    const stylesResult = stylesResults.bundles[bundleId] = stylesResults.bundles[bundleId] || {};

    if (buildConfig.devMode) {
      // dev mode has filename from the bundled tag names
      stylesResult[modeName] = (userBundle.components.sort().join('.') + '.' + modeName).toLowerCase();

      if (modeName !== '$') {
        // prefix with the mode name if it's not the default mode
        stylesResult[modeName] = modeName + '.' + stylesResult[modeName];
      }

      if (stylesResult[modeName].length > 50) {
        // can get a lil too long, so let's simmer down
        stylesResult[modeName] = stylesResult[modeName].substr(0, 50);
      }

    } else {
      // prod mode, minify css
      const minifyCssResults = sys.minifyCss(styleContent);
      minifyCssResults.diagnostics.forEach(d => {
        stylesResults.diagnostics.push(d);
      });

      if (minifyCssResults.output) {
        styleContent = minifyCssResults.output;
      }

      // create bundle id from hashing the content
      stylesResult[modeName] = sys.generateContentHash(styleContent);
    }

    // create the file name and path of where the bundle will be saved
    const styleFileName = formatCssBundleFileName(stylesResult[modeName]);
    const styleFilePath = sys.path.join(
      buildConfig.dest,
      BUNDLES_DIR,
      buildConfig.namespace.toLowerCase(),
      styleFileName
    );

    ctx.filesToWrite[styleFilePath] = styleContent;
  });
}


function generateComponentModeStyles(
  buildConfig: BuildConfig,
  cmpMeta: ComponentMeta,
  modeName: string,
  stylesResults: StylesResults
) {
  // within WORKER thread
  const modeStyleMeta = cmpMeta.styleMeta[modeName];
  const sys = buildConfig.sys;

  const promises: Promise<any>[] = [];

  // used to remember the exact order the user wants
  // sass render and file reads are async so it could mess with the order
  const styleCollection: StyleCollection = {};

  if (modeStyleMeta) {
    if (modeStyleMeta.styleUrls) {
      modeStyleMeta.styleUrls.forEach(styleUrl => {
        styleCollection[styleUrl] = '';

        const ext = sys.path.extname(styleUrl).toLowerCase();

        if (ext === '.scss' || ext === '.sass') {
          // sass file needs to be compiled
          promises.push(compileScssFile(buildConfig, styleUrl, styleCollection, stylesResults));

        } else if (ext === '.css') {
          // plain ol' css file
          promises.push(readCssFile(buildConfig, styleUrl, styleCollection, stylesResults));

        } else {
          // idk
          stylesResults.diagnostics.push({
            msg: `style url "${styleUrl}" on component "${cmpMeta.tagNameMeta.toLowerCase()}" is not a supported file type`,
            type: 'error'
          });
        }
      });
    }

    if (typeof modeStyleMeta.styleStr === 'string' && modeStyleMeta.styleStr.trim().length) {
      // plain styles as a string
      styleCollection['styleStr'] = modeStyleMeta.styleStr.trim();
    }
  }

  return Promise.all(promises).then(() => {
    // we've loaded everything, let's join them together
    // using the style collection object as a way to keep the same order
    return Object.keys(styleCollection)
            .map(key => styleCollection[key])
            .join('\n\n').trim();
  });
}


interface StyleCollection {
  [styleKey: string]: string;
}


function compileScssFile(buildConfig: BuildConfig, styleUrl: string, styleCollection: StyleCollection, stylesResults: StylesResults) {
  return new Promise(resolve => {
    const sys = buildConfig.sys;

    const scssFileName = sys.path.basename(styleUrl);
    const scssFilePath = sys.path.join(buildConfig.src, styleUrl);

    const sassConfig = {
      file: scssFilePath,
      outputStyle: buildConfig.devMode ? 'expanded' : 'compressed',
    };

    sys.sass.render(sassConfig, (err, result) => {
      if (err) {
        stylesResults.diagnostics.push({
          filePath: scssFilePath,
          msg: `${err}`,
          type: 'error',
          stack: err.stack
        });

      } else if (result.css) {
        result.css = result.css.toString().trim();

        if (buildConfig.devMode) {
          styleCollection[styleUrl] = `/********** ${scssFileName} **********/\n\n${result.css}\n\n`;

        } else {
          styleCollection[styleUrl] = result.css;
        }
      }

      resolve();
    });
  });
}


function readCssFile(buildConfig: BuildConfig, styleUrl: string, styleCollection: StyleCollection, stylesResults: StylesResults) {
  // this is just a plain css file
  // only open it up for its content
  const sys = buildConfig.sys;

  const cssFilePath = sys.path.join(buildConfig.src, styleUrl);
  const cssFileName = sys.path.basename(styleUrl);

  return readFile(sys, cssFilePath).then(cssText => {
    cssText = cssText.toString().trim();

    if (buildConfig.devMode) {
      styleCollection[styleUrl] = `/********** ${cssFileName} **********/\n\n${cssText}`;

    } else {
      styleCollection[styleUrl] = cssText;
    }

  }).catch(err => {
    stylesResults.diagnostics.push({
      filePath: cssFilePath,
      msg: `Error opening file. ${err}`,
      type: 'error',
      stack: err.stack
    });
  });
}


function appendVisibilityCss(bundleComponentMeta: ComponentMeta[]) {
  // always tack this css to each component tag css
  const selector = bundleComponentMeta.map(c => {
    return `${c.tagNameMeta}.${HYDRATED_CSS}`;
  }).join(',\n');

  return `${selector} {\n  visibility: inherit;\n}`;
}

