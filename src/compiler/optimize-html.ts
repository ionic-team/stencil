import { BuildConfig, BuildContext, OptimizeHtmlResults } from './interfaces';
import { readFile } from './util';


export function optimizeHtml(buildConfig: BuildConfig, ctx: BuildContext) {
  const sys = buildConfig.sys;

  const optimizeHtmlResults: OptimizeHtmlResults = {
    diagnostics: []
  };

  return readFile(sys, buildConfig.indexSrc).then(indexSrcHtml => {
    // TODO!
    ctx.filesToWrite[buildConfig.indexDest] = indexSrcHtml;

  }).catch(() => {
    // it's ok if there's no index file

  }).then(() => {
    return optimizeHtmlResults;
  });
}
