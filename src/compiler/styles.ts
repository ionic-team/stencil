import { FileMeta, CompilerOptions, CompilerContext, ComponentMode } from './interfaces';
import { readFile } from './util';
import * as path from 'path';
import * as sass from 'node-sass';


export function processStyles(file: FileMeta, opts: CompilerOptions, ctx: CompilerContext) {
  const promises: Promise<any>[] = [];

  if (file.cmpMeta && file.cmpMeta.modes) {

    Object.keys(file.cmpMeta.modes).forEach(mode => {

      promises.push(
        processModeStyle(file, file.cmpMeta.modes[mode], opts, ctx)
      );

    });

  }

  return Promise.all(promises);
}


export function processModeStyle(file: FileMeta, cmpMode: ComponentMode, opts: CompilerOptions, ctx: CompilerContext) {
  const promises: Promise<any>[] = [];

  if (cmpMode.styleUrls) {

    cmpMode.styleUrls.forEach(styleFileName => {

      if (path.extname(styleFileName) === '.scss') {
        promises.push(
          processScssStyles(file, cmpMode, styleFileName, opts, ctx)
        );

      } else {
        promises.push(
          processCssStyles(file, cmpMode, styleFileName, opts, ctx)
        );
      }

    });

  }

  return Promise.all(promises);
}


export function processScssStyles(file: FileMeta, cmpMode: ComponentMode, scssFileName: string, opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const scssFilePath = path.join(path.dirname(file.filePath), scssFileName);

    const sassConfig = {
      file: scssFilePath,
      outputStyle: (opts.sassOutputStyle || 'compressed')
    };

    sass.render(sassConfig, (err, result) => {
      if (err) {
        console.log(err);

      } else {
        cmpMode.styles = cmpMode.styles || '';
        cmpMode.styles += result.css.toString();
      }

      resolve();
    });
  });
}


export function processCssStyles(file: FileMeta, cmpMode: ComponentMode, scssFileName: string, opts: CompilerOptions, ctx: CompilerContext) {
  const cssFilePath = path.join(path.dirname(file.filePath), scssFileName);

  return readFile(cssFilePath).then(content => {
    cmpMode.styles = cmpMode.styles || '';
    cmpMode.styles += content;

    return content;
  });
}
