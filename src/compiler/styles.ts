import { BundlerConfig, BuildContext, ComponentMode } from './interfaces';
import { createFileMeta } from './util';


export function bundleComponentModeStyles(config: BundlerConfig, ctx: BuildContext, mode: ComponentMode) {
  if (!mode || !mode.styleUrls) {
    return Promise.resolve();
  }

  return Promise.all(mode.styleUrls.map(styleUrl => {
    return bundleComponentModeStyle(config, ctx, styleUrl);

  })).then(results => {
    mode.styles = results.join('');
  });
}


export function bundleComponentModeStyle(config: BundlerConfig, ctx: BuildContext, styleUrl: string) {
  return new Promise((resolve, reject) => {
    const scssFilePath = config.packages.path.join(config.srcDir, styleUrl);
    const fileMeta = createFileMeta(config.packages, ctx, scssFilePath, '');
    fileMeta.rebundleOnChange = true;

    const sassConfig = {
      file: scssFilePath,
      outputStyle: 'compressed'
    };

    if (config.debug) {
      console.log(`bundle, render sass: ${scssFilePath}`);
    }

    config.packages.nodeSass.render(sassConfig, (err: any, result: any) => {
      if (err) {
        reject(`bundleComponentModeStyle, nodeSass.render: ${err}`);

      } else {
        let css = result.css.toString().replace(/\n/g, '').trim();

        if (!config.devMode && config.packages.cleanCss) {
          const output = new config.packages.cleanCss().minify(css);

          css = output.styles;
        }

        resolve(css);
      }
    });
  });
}
