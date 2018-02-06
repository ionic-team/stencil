import { BuildConditionals, BuildCtx, CompilerCtx, Config } from '../../util/interfaces';
import { buildCoreContent } from './build-core-content';
import { generatePreamble, pathJoin } from '../util';
import { getAppDistDir, getAppPublicPath, getAppWWWBuildDir, getCoreFilename } from './app-file-naming';


export async function generateCore(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, globalJsContent: string, buildConditionals: BuildConditionals) {
  // mega-minify the core w/ property renaming, but not the user's globals
  // hardcode which features should and should not go in the core builds
  // process the transpiled code by removing unused code and minify when configured to do so
  let jsContent = await config.sys.getClientCoreFile({ staticName: 'core.build.js' });

  jsContent = await buildCoreContent(config, compilerCtx, buildCtx, buildConditionals, jsContent);

  if (globalJsContent) {
    // we've got global js to put in the core build too
    // concat the global js and transpiled code together
    jsContent = `${globalJsContent}\n${jsContent}`;
  }

  // wrap the core js code together
  jsContent = wrapCoreJs(config, jsContent);

  if (buildConditionals.polyfills) {
    // this build wants polyfills so let's
    // add the polyfills to the top of the core content
    // the polyfilled code is already es5/minified ready to go
    const polyfillsContent = await getCorePolyfills(config);
    jsContent = polyfillsContent + '\n' + jsContent;
  }

  const coreFilename = getCoreFilename(config, buildConditionals.coreId, jsContent);

  // update the app core filename within the content
  jsContent = jsContent.replace(APP_NAMESPACE_PLACEHOLDER, config.fsNamespace);

  if (config.generateWWW) {
    // write the www/build/ app core file
    const appCoreWWW = pathJoin(config, getAppWWWBuildDir(config), coreFilename);
    await compilerCtx.fs.writeFile(appCoreWWW, jsContent);
  }

  if (config.generateDistribution) {
    // write the dist/ app core file
    const appCoreDist = pathJoin(config, getAppDistDir(config), coreFilename);
    await compilerCtx.fs.writeFile(appCoreDist, jsContent);
  }

  return coreFilename;
}


export function wrapCoreJs(config: Config, jsContent: string) {
  const publicPath = getAppPublicPath(config);

  const output = [
    generatePreamble(config) + '\n',
    `(function(Context,appNamespace,hydratedCssClass,publicPath){`,
    `"use strict";\n`,
    `var s=document.querySelector("script[data-namespace='${APP_NAMESPACE_PLACEHOLDER}']");`,
    `if(s){publicPath=s.getAttribute('data-path');}\n`,
    jsContent.trim(),
    `\n})({},"${config.namespace}","${config.hydratedCssClass}","${publicPath}");`
  ].join('');

  return output;
}


export function getCorePolyfills(config: Config) {
  // first load up all of the polyfill content
  const readFilePromises = [
    'template.js',
    'document-register-element.js',
    'array-find.js',
    'object-assign.js',
    'string-startswith.js',
    'promise.js',
    'fetch.js',
    'request-animation-frame.js',
    'closest.js',
    'performance-now.js'
  ].map(polyfillFile => {
    const staticName = config.sys.path.join('polyfills', polyfillFile);
    return config.sys.getClientCoreFile({ staticName: staticName });
  });

  return Promise.all(readFilePromises).then(results => {
    // concat the polyfills
    return results.join('\n').trim();
  });
}


export const APP_NAMESPACE_PLACEHOLDER = '__APPNAMESPACE__';
