import { BuildConfig, BuildContext, CoreBuildConditionals } from '../../util/interfaces';
import { buildCoreContent } from './build-core-content';
import { generatePreamble, normalizePath } from '../util';
import { getAppFileName } from './generate-app-files';
import { setCoreBuildConditionals } from './core-conditionals';


export function generateCore(config: BuildConfig, ctx: BuildContext, globalJsContent: string[]) {
  const staticName = 'core.build.js';

  // figure out which sections should be included
  setCoreBuildConditionals(ctx.coreBuildConditionals, ctx.manifestBundles);

  // create a list of builds we need to do
  const coreBuilds = getCoreBuilds(ctx.coreBuildConditionals);

  return Promise.all([
    config.sys.getClientCoreFile({ staticName: staticName }),
    getCorePolyfills(config)

  ]).then(results => {
    const coreContent = results[0];
    const polyfillsContent = results[1];

    coreBuilds.forEach(coreBuild => {
      generateCoreBuild(config, ctx, coreBuild, globalJsContent, coreContent, polyfillsContent);
    });

  }).catch(err => {
    config.logger.error('generateCore', err);

  }).then(() => {
    return coreBuilds;
  });
}


function generateCoreBuild(config: BuildConfig, ctx: BuildContext, coreBuild: CoreBuildConditionals, globalJsContent: string[], coreContent: string, polyfillsContent: string) {

  // concat the global js and transpiled code together
  let jsContent = [
    globalJsContent.join('\n'),
    coreContent
  ].join('\n').trim();

  // hardcode which features should and should not go in the core builds
  // process the transpiled code by removing unused code and minify when configured to do so
  jsContent = buildCoreContent(config, ctx, coreBuild, jsContent);

  // wrap the core js code together
  jsContent = wrapCoreJs(config, jsContent);

  if (coreBuild.polyfills) {
    // this build wants polyfills so let's
    // add the polyfills to the top of the core content
    // the polyfilled code is already es5/minified ready to go
    jsContent = polyfillsContent + '\n' + jsContent;
  }

  if (ctx.appFiles[coreBuild.coreId] === jsContent) {
    // build is identical from last, no need to resave
    return;
  }
  ctx.appFiles[coreBuild.coreId] = jsContent;

  const appFileName = getAppFileName(config);
  coreBuild.fileName = getBuildFilename(config, appFileName, coreBuild.coreId, jsContent);

  // update the app core filename within the content
  jsContent = jsContent.replace(APP_CORE_FILENAME_PLACEHOLDER, coreBuild.fileName);

  if (config.generateWWW) {
    // write the www/build/ app core file
    const appCoreWWW = normalizePath(config.sys.path.join(config.buildDir, appFileName, coreBuild.fileName));
    ctx.filesToWrite[appCoreWWW] = jsContent;
  }

  if (config.generateDistribution) {
    // write the dist/ app core file
    const appCoreDist = normalizePath(config.sys.path.join(config.distDir, appFileName, coreBuild.fileName));
    ctx.filesToWrite[appCoreDist] = jsContent;
  }
}


function getBuildFilename(config: BuildConfig, appFileName: string, coreId: string, jsContent: string) {
  if (config.hashFileNames) {
    // prod mode renames the core file with its hashed content
    const contentHash = config.sys.generateContentHash(jsContent, config.hashedFileNameLength);
    return `${appFileName}.${contentHash}.js`;
  }

  // dev file name
  return `${appFileName}.${coreId}.js`;
}


export function wrapCoreJs(config: BuildConfig, jsContent: string) {
  const publicPath = getAppPublicPath(config);

  const output = [
    generatePreamble(config),
    `(function(Context,appNamespace,hydratedCssClass,publicPath){`,
    `"use strict";\n`,
    `var s=document.querySelector("script[data-core='${APP_CORE_FILENAME_PLACEHOLDER}'][data-path]");`,
    `if(s){publicPath=s.getAttribute('data-path');}\n`,
    jsContent.trim(),
    `\n})({},"${config.namespace}","${config.hydratedCssClass}","${publicPath}",document);`
  ].join('');

  return output;
}


function getCoreBuilds(coreBuild: CoreBuildConditionals) {
  const coreBuilds: CoreBuildConditionals[] = [];

  // no custom slot
  // without ssr parser
  // es2015
  coreBuilds.push({
    ...coreBuild,
    coreId: 'core',
    _build_es2015: true
  });

  // no custom slot
  // with ssr parser
  // es2015
  coreBuilds.push({
    ...coreBuild,
    coreId: 'core.ssr',
    _build_es2015: true,
    _build_ssr_parser: true
  });

  // es5 gets everything
  coreBuilds.push({
    ...coreBuild,
    coreId: 'core.pf',
    _build_es5: true,
    _build_custom_slot: true,
    _build_ssr_parser: true,
    polyfills: true
  });

  return coreBuilds;
}


export function getCorePolyfills(config: BuildConfig) {
  // first load up all of the polyfill content
  const readFilePromises = [
    'document-register-element.js',
    'object-assign.js',
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


export function getAppPublicPath(config: BuildConfig) {
  return normalizePath(
    config.sys.path.join(
      config.publicPath,
      getAppFileName(config)
    )
  ) + '/';
}


export const APP_CORE_FILENAME_PLACEHOLDER = '__APP_CORE_FILENAME__';
