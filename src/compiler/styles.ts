import { BundlerConfig, ComponentMode } from './interfaces';


export function bundleComponentModeStyles(config: BundlerConfig, mode: ComponentMode) {
  if (!mode || !mode.styleUrls) {
    return Promise.resolve();
  }

  return Promise.all(mode.styleUrls.map(styleUrl => {
    return bundleComponentModeStyle(config, styleUrl);

  })).then(results => {
    mode.styles = results.join('');
  });
}


export function bundleComponentModeStyle(config: BundlerConfig, styleUrl: string) {
  return new Promise((resolve, reject) => {
    const scssFilePath = config.packages.path.join(config.srcDir, styleUrl);

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
