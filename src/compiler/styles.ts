import { BundlerConfig, ComponentMode } from './interfaces';


export function bundleComponentModeStyles(config: BundlerConfig, mode: ComponentMode) {
  return Promise.all(mode.styleUrls.map(styleUrl => {
    return bundleComponentModeStyle(config, styleUrl);

  })).then(results => {
    return mode.styles = results.join('');
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
        reject(err);

      } else {
        const css = result.css.toString().replace(/\n/g, '').trim();
        resolve(css);
      }
    });
  });
}
