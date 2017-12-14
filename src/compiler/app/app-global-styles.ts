import { BuildConfig, BuildContext } from '../../util/interfaces';
import { buildError, readFile, pathJoin } from '../util';
import { getGlobalStyleFilename } from './app-file-naming';


export async function generateGlobalStyles(config: BuildConfig, ctx: BuildContext) {
  const filePaths = config.globalStyle;
  if (!filePaths || !filePaths.length) {
    return Promise.resolve();
  }

  let content = await readStyleContent(config, filePaths);
  if (ctx.appGlobalStyles.content === content) {
    return Promise.resolve();
  }

  content = await compileGlobalSass(config, ctx, content);

  const fileName = getGlobalStyleFilename(config);

  if (config.generateWWW) {
    const wwwFilePath = pathJoin(config, config.buildDir, fileName);
    ctx.filesToWrite[wwwFilePath] = content;
  }

  if (config.generateDistribution) {
    const distFilePath = pathJoin(config, config.distDir, fileName);
    ctx.filesToWrite[distFilePath] = content;
  }
}


function compileGlobalSass(config: BuildConfig, ctx: BuildContext, content: string): Promise<string> {
  return new Promise(resolve => {
    const sassConfig = {
      ...config.sassConfig,
      data: content,
      outputStyle: config.minifyCss ? 'compressed' : 'expanded',
    };

    config.sys.sass.render(sassConfig, (err, result) => {
      let content = '';

      if (err) {
        const d = buildError(ctx.diagnostics);
        d.messageText = err;

      } else {
        content = result.css.toString();
      }

      resolve(content);
    });
  });
}


function readStyleContent(config: BuildConfig, filePaths: string[]) {
  const promises = filePaths.map(filePath => readFile(config.sys, filePath));
  return Promise.all(promises).then(results => results.join('\n'));
}
