import { BuildContext, BundlerConfig, ComponentMeta } from './interfaces';
import { createFileMeta } from './util';
import { STYLES } from '../util/constants';


export function bundleComponentModeStyles(config: BundlerConfig, ctx: BuildContext, cmpMeta: ComponentMeta, modeName: string) {
  if (!cmpMeta.modesStyleMeta || !cmpMeta.modesStyleMeta[modeName]) {
    return Promise.resolve();
  }

  const modeStyleMeta = cmpMeta.modesStyleMeta[modeName];

  const promises: Promise<string>[] = [];

  if (modeStyleMeta) {
    if (modeStyleMeta.styleUrls) {
      modeStyleMeta.styleUrls.forEach(styleUrl => {
        promises.push(bundleComponentModeStyle(config, ctx, styleUrl));
      });
    }

    if (modeStyleMeta.styles) {
      modeStyleMeta.styles.forEach(style => {
        promises.push(Promise.resolve(style));
      });
    }
  }

  return Promise.all(promises).then(styles => {
    cmpMeta.modesMeta = cmpMeta.modesMeta || {};
    cmpMeta.modesMeta[modeName] = cmpMeta.modesMeta[modeName] || new Array(2);
    cmpMeta.modesMeta[modeName][STYLES] = styles.join('').trim();
  });
}


export function bundleComponentModeStyle(config: BundlerConfig, ctx: BuildContext, styleUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scssFilePath = config.packages.path.join(config.srcDir, styleUrl);
    const scssFileName = config.packages.path.basename(styleUrl);
    const fileMeta = createFileMeta(config.packages, ctx, scssFilePath, '');
    fileMeta.rebundleOnChange = true;

    const sassConfig = {
      file: scssFilePath,
      outputStyle: config.devMode ? 'expanded' : 'compressed'
    };

    if (config.debug) {
      console.log(`bundle, render sass: ${scssFilePath}`);
    }

    config.packages.nodeSass.render(sassConfig, (err: any, result: any) => {
      if (err) {
        reject(`bundleComponentModeStyle, nodeSass.render: ${err}`);

      } else {
        let css = result.css.toString().trim().replace(/\\/g, '\\\\');

        if (config.devMode) {
          css = `/********** ${scssFileName} **********/\n\n${css}\n\n`;
        } else {
          css = css.replace(/\n/g, '');
        }

        resolve(css);
      }
    });
  });
}
