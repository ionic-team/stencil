import { BUNDLES_DIR, HYDRATED_CSS } from '../util/constants';
import { BundlerConfig, StylesResults, BuildContext, ComponentMeta, Manifest, Bundle } from './interfaces';
import { createFileMeta, writeFiles } from './util';
import { formatCssBundleFileName, generateBundleId } from '../util/data-serialize';


export function bundleStyles(config: BundlerConfig, ctx: BuildContext, userManifest: Manifest) {
  config.logger.debug(`bundleStyles`);

  const stylesResults: StylesResults = {};
  const filesToWrite = new Map<string, string>();

  // go through each bundle the user wants created
  // and create css files for each mode for each bundle
  return Promise.all(userManifest.bundles.map(userBundle => {
    return generateBundleCss(config, ctx, userManifest, userBundle, stylesResults, filesToWrite);

  })).then(() => {
    return writeFiles(config.sys, filesToWrite);

  }).then(() => {
    return stylesResults;
  });
}


function generateBundleCss(config: BundlerConfig, ctx: BuildContext, userManifest: Manifest, userBundle: Bundle, stylesResults: StylesResults, filesToWrite: Map<string, string>) {
  // multiple modes can be on each component
  // and multiple components can be in each bundle
  // create css files with the common modes for the bundle's components

  // collect only the component meta data this bundle needs
  const bundleComponentMeta = userBundle.components.map(userBundleComponentTag => {
    const foundComponentMeta = userManifest.components.find(manifestComponent => (
      manifestComponent.tagNameMeta === userBundleComponentTag
    ));

    if (!foundComponentMeta) {
      throw new Error(`The component tag '${userBundleComponentTag}' is defined in a bundle but no component was found with this tag.`);
    }
    return foundComponentMeta;
  });

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
    return generateModeCss(config, ctx, bundleComponentMeta, userBundle, modeName, stylesResults, filesToWrite);
  }));
}


function generateModeCss(config: BundlerConfig, ctx: BuildContext, bundleComponentMeta: ComponentMeta[], userBundle: Bundle, modeName: string, stylesResults: StylesResults, filesToWrite: Map<string, string>) {
  // loop through each component in this bundle
  // and create a css file for all the same modes
  return Promise.all(bundleComponentMeta.map(cmpMeta => {
    return generateComponentModeStyles(config, ctx, cmpMeta, modeName);

  })).then(modeStyles => {
    // we've gone through each component in this bundle
    // that has styles for this mode,let's join them together
    let styleContent = modeStyles.join('\n\n').trim();

    // check if we even built anything
    if (!styleContent.length) return;

    // tack on the visibility inherit css each component tag should get
    styleContent += appendVisibilityCss(bundleComponentMeta);

    const bundleId = generateBundleId(userBundle.components);

    // we've built up some css content for this mode
    // ensure we've got some good objects before we start assigning stuff
    const stylesResult = stylesResults[bundleId] = stylesResults[bundleId] || {};

    if (config.isDevMode) {
      // dev mode has filename from the bundled tag names
      stylesResult[modeName] = modeName + '.' + (userBundle.components.sort().join('.') + '.' + modeName).toLowerCase();

      if (stylesResult[modeName].length > 40) {
        // can get a lil too long, so let's simmer down
        stylesResult[modeName] = stylesResult[modeName].substr(0, 40);
      }

    } else {
      // in prod mode, create bundle id from hashing the content
      stylesResult[modeName] = config.sys.generateContentHash(styleContent);
    }

    // create the file name and path of where the bundle will be saved
    const styleFileName = formatCssBundleFileName(stylesResult[modeName]);
    const styleFilePath = config.sys.path.join(config.destDir, BUNDLES_DIR, config.namespace.toLowerCase(), styleFileName);

    filesToWrite.set(styleFilePath, styleContent);
  });
}


function generateComponentModeStyles(config: BundlerConfig, ctx: BuildContext, cmpMeta: ComponentMeta, modeName: string) {
  // generate all of the css this mode uses for this component
  if (!cmpMeta.styleMeta || !cmpMeta.styleMeta[modeName]) {
    return Promise.resolve('');
  }

  const modeStyleMeta = cmpMeta.styleMeta[modeName];

  const promises: Promise<any>[] = [];

  // used to remember the exact order the user wants
  // file reads are async and could mess with the order
  const styleCollection: StyleCollection = {};

  if (modeStyleMeta) {
    if (modeStyleMeta.styleUrls) {
      modeStyleMeta.styleUrls.forEach(styleUrl => {

        styleCollection[styleUrl] = '';

        const ext = config.sys.path.extname(styleUrl).toLowerCase();

        if (ext === '.scss' || ext === '.sass') {
          // sass file needs to be compiled
          promises.push(compileScssFile(config, ctx, styleUrl, styleCollection));

        } else if (ext === '.css') {
          // plain ol' css file
          promises.push(readCssFile(config, ctx, styleUrl, styleCollection));

        } else {
          // idk
          config.logger.error(`${styleUrl} is not a supported style url`);
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
    return Object.keys(styleCollection).map(key => {
      return styleCollection[key];
    }).join('\n\n').trim();
  });
}


interface StyleCollection {
  [styleKey: string]: string;
}


function compileScssFile(config: BundlerConfig, ctx: BuildContext, styleUrl: string, styleCollection: StyleCollection) {
  // this is a Sass file that needs to be compiled
  return new Promise((resolve, reject) => {
    const scssFilePath = config.sys.path.join(config.srcDir, styleUrl);
    const scssFileName = config.sys.path.basename(styleUrl);
    const fileMeta = createFileMeta(config.sys, ctx, scssFilePath, '');
    fileMeta.rebundleOnChange = true;

    const sassConfig = {
      file: scssFilePath,
      outputStyle: config.isDevMode ? 'expanded' : 'compressed',
    };

    config.sys.sass.render(sassConfig, (err, result) => {
      if (err) {
        reject(`bundleStyles, nodeSass.render: ${err}`);

      } else {
        let cssContent = result.css.toString().trim().replace(/\\/g, '\\\\');

        if (config.isDevMode) {
          styleCollection[styleUrl] = `/********** ${scssFileName} **********/\n\n${cssContent}\n\n`;

        } else {
          styleCollection[styleUrl] = cssContent;
        }

        resolve();
      }
    });
  });
}


function readCssFile(config: BundlerConfig, ctx: BuildContext, styleUrl: string, styleCollection: StyleCollection) {
  // this is just a plain css file
  // only open it up for its content
  return new Promise((resolve) => {
    const cssFilePath = config.sys.path.join(config.srcDir, styleUrl);
    const cssFileName = config.sys.path.basename(styleUrl);
    const fileMeta = createFileMeta(config.sys, ctx, cssFilePath, '');
    fileMeta.rebundleOnChange = true;

    config.sys.fs.readFile(cssFilePath, 'utf-8', (err, cssContent) => {
      if (err) {
        config.logger.error(`bundleStyles, unable to open: ${cssFilePath}`);
        config.logger.debug(err);

      } else {
        cssContent = cssContent.toString().trim();

        if (config.isDevMode) {
          styleCollection[styleUrl] = `/********** ${cssFileName} **********/\n\n${cssContent}\n\n`;
        } else {
          styleCollection[styleUrl] = cssContent;
        }
      }

      resolve();
    });
  });
}


function appendVisibilityCss(bundleComponentMeta: ComponentMeta[]) {
  // always tack this css to each component tag css
  const selector = bundleComponentMeta.map(c => {
    return `${c.tagNameMeta}.${HYDRATED_CSS}`;
  }).join(',');

  return `\n\n${selector}{visibility:inherit}`;
}

