import { BuildConfig, BuildContext, OptimizeHtmlResults } from '../interfaces';
import { readFile } from '../util';


export function optimizeHtml(config: BuildConfig, ctx: BuildContext) {
  const sys = config.sys;

  const optimizeHtmlResults: OptimizeHtmlResults = {
    diagnostics: []
  };

  return readFile(sys, config.indexSrc).then(indexSrcHtml => {
    // TODO!
    ctx.filesToWrite[config.indexDest] = indexSrcHtml;

  }).catch(() => {
    // it's ok if there's no index file

  }).then(() => {
    return optimizeHtmlResults;
  });
}
