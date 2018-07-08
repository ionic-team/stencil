import { BuildConditionals, BuildCtx, CompilerCtx, Config, OutputTarget } from '../../declarations';
import { buildCoreContent } from './build-core-content';
import { generatePreamble, pathJoin } from '../util';
import { getAppBrowserCorePolyfills } from './app-polyfills';
import { getAppBuildDir, getCoreFilename } from './app-file-naming';


export async function generateCoreBrowser(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget, globalJsContent: string, buildConditionals: BuildConditionals) {
  const relPath = config.sys.path.relative(config.rootDir, getAppBuildDir(config, outputTarget));
  const timespan = buildCtx.createTimeSpan(`generateCoreBrowser ${buildConditionals.coreId} started, ${relPath}`, true);

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


export function wrapCoreJs(config: Config, jsContent: string) {
  if (typeof jsContent !== 'string') {
    jsContent = '';
  }

  const output = [
    generatePreamble(config) + '\n',
    `(function(Context,namespace,hydratedCssClass,resourcesUrl,s){`,
    `"use strict";\n`,
    `s=document.querySelector("script[data-namespace='${config.fsNamespace}']");`,
    `if(s){resourcesUrl=s.getAttribute('data-resources-url');}\n`,
    jsContent.trim(),
    `\n})({},"${config.namespace}","${config.hydratedCssClass}");`
  ].join('');

  return output;
}


export const APP_NAMESPACE_PLACEHOLDER = '__APPNAMESPACE__';
