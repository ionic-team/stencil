import * as d from '../../declarations';
import { buildCoreContent } from './build-core-content';
import { formatBrowserLoaderComponentRegistry } from '../../util/data-serialize';
import { generatePreamble, pathJoin } from '../util';
import { getAppBrowserCorePolyfills } from './app-polyfills';
import { getAppBuildDir, getCoreFilename } from './app-file-naming';


export async function generateCoreBrowser(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBuild, cmpRegistry: d.ComponentRegistry, staticName: string, globalJsContent: string, buildConditionals: d.BuildConditionals) {
  const relPath = config.sys.path.relative(config.rootDir, getAppBuildDir(config, outputTarget));
  const timespan = buildCtx.createTimeSpan(`generateCoreBrowser ${buildConditionals.coreId} started, ${relPath}`, true);

  // mega-minify the core w/ property renaming, but not the user's globals
  // hardcode which features should and should not go in the core builds
  // process the transpiled code by removing unused code and minify when configured to do so
  let jsContent = await config.sys.getClientCoreFile({ staticName: staticName });

  jsContent = await buildCoreContent(config, compilerCtx, buildCtx, buildConditionals, jsContent);

  if (globalJsContent) {
    // we've got global js to put in the core build too
    // concat the global js and transpiled code together
    jsContent = `${globalJsContent}\n${jsContent}`;
  }

  // wrap the core js code together
  jsContent = wrapCoreJs(config, jsContent, cmpRegistry, buildConditionals);

  if (buildConditionals.polyfills) {
    // this build wants polyfills so let's
    // add the polyfills to the top of the core content
    // the polyfilled code is already es5/minified ready to go
    const polyfillsContent = await getAppBrowserCorePolyfills(config);
    jsContent = polyfillsContent + '\n' + jsContent;
  }

  const coreFilename = getCoreFilename(config, buildConditionals.coreId, jsContent);

  // update the app core filename within the content
  jsContent = jsContent.replace(APP_NAMESPACE_PLACEHOLDER, config.fsNamespace);

  const appCorePath = pathJoin(config, getAppBuildDir(config, outputTarget), coreFilename);

  compilerCtx.appCoreWWWPath = appCorePath;

  await compilerCtx.fs.writeFile(appCorePath, jsContent);

  timespan.finish(`generateCoreBrowser ${buildConditionals.coreId} finished, ${relPath}`);

  return coreFilename;
}


export function wrapCoreJs(config: d.Config, jsContent: string, cmpRegistry: d.ComponentRegistry, buildConditionals: d.BuildConditionals) {
  if (typeof jsContent !== 'string') {
    jsContent = '';
  }

  const cmpLoaderRegistry = formatBrowserLoaderComponentRegistry(cmpRegistry);

  const cmpLoaderRegistryStr = JSON.stringify(cmpLoaderRegistry);

  if (buildConditionals.es5) {
    return [
      generatePreamble(config, {defaultBanner: true}) + '\n',
      '(function(w,d,x,n,h,c,r){',
      `"use strict";\n`,
      `(function(s){s&&(r=s.getAttribute('data-resources-url'))})(d.querySelector("script[data-namespace='${config.fsNamespace}']"));\n`,
      jsContent.trim(),
      `\n})(window,document,{},"${config.namespace}","${config.hydratedCssClass}",${cmpLoaderRegistryStr});`
    ].join('');
  } else {

  return [
    generatePreamble(config, {defaultBanner: true}) + '\n',
    `
let w = window;
let d = document;
let x = {};
let n = "${config.namespace}";
let h = "${config.hydratedCssClass}";
let c = ${cmpLoaderRegistryStr};
let r;
(function(s){s&&(r=s.getAttribute('data-resources-url'))})(d.querySelector("script[data-namespace='${config.fsNamespace}']"));\n
`,
    jsContent.trim()
  ].join('');
  }
}


export const APP_NAMESPACE_PLACEHOLDER = '__APPNAMESPACE__';
