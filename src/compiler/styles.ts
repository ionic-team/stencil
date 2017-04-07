import { BundlerConfig, ComponentMode } from './interfaces';
import * as path from 'path';


export function buildComponentModeStyles(config: BundlerConfig, mode: ComponentMode) {
  return Promise.all(mode.styleUrls.map(styleUrl => {
    return buildComponentModeStyle(config, styleUrl);

  })).then(results => {
    return mode.styles = results.join('');
  });
}


export function buildComponentModeStyle(config: BundlerConfig, scssFileName: string) {
  return new Promise((resolve, reject) => {
    const scssFilePath = path.join(config.coreDir, scssFileName);

    const sassConfig = {
      file: scssFilePath,
      outputStyle: 'compressed'
    };

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
