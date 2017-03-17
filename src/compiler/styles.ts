import { FileMeta, CompilerOptions, CompilerContext } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'node-sass';


export function preprocessStyles(file: FileMeta, opts: CompilerOptions, ctx: CompilerContext) {
  const preprocessStyles: string[] = [];

  file.components.forEach(c => {
    c.preprocessStyles.forEach(scssFileName => {
      preprocessStyles.push(scssFileName);
    });
  });

  const promises = preprocessStyles.map(scssFileName => {
    return new Promise(resolve => {
      const scssFilePath = path.join(path.dirname(file.filePath), scssFileName);
      const cssFileName = scssFileName.replace('.scss', '.css');
      const cssFilePath = path.join(opts.destDir, cssFileName);

      const sassConfig = {
        file: scssFilePath,
        outputStyle: (opts.sassOutputStyle || 'expanded')
      };

      sass.render(sassConfig, (err, result) => {
        if (err) {
          console.log(err);
          resolve();

        } else {
          const cssOutput = result.css.toString().trim();

          fs.writeFile(cssFilePath, cssOutput, err => {
            if (err) {
              console.log(err);
            }
            resolve();
          });
        }
      });
    });
  });

  return Promise.all(promises);
}
