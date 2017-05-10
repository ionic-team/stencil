import { BundlerConfig, BuildContext, ModeMeta } from './interfaces';
import { createFileMeta } from './util';


export function bundleComponentModeStyles(config: BundlerConfig, ctx: BuildContext, cmpMode: ModeMeta) {
  if (!cmpMode || !cmpMode.styleUrls) {
    return Promise.resolve();
  }

  return Promise.all(cmpMode.styleUrls.map(styleUrl => {
    return bundleComponentModeStyle(config, ctx, styleUrl);

  })).then(results => {
    cmpMode.styles = results.join('');
  });
}


export function bundleComponentModeStyle(config: BundlerConfig, ctx: BuildContext, styleUrl: string) {
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
        let css = result.css.toString().trim();

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
