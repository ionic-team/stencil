import * as d from '../../declarations';
import { APP_NAMESPACE_REGEX } from '../../util/constants';
import { formatBrowserLoaderComponentRegistry } from '../../util/data-serialize';
import { generatePreamble } from '../util';
import { getLoaderPath } from './app-file-naming';
import { minifyJs } from '../minifier';


export async function generateLoader(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTarget,
  appRegistry: d.AppRegistry,
  cmpRegistry: d.ComponentRegistry
) {
  if (buildCtx.shouldAbort()) {
    return null;
  }

  const timeSpan = buildCtx.createTimeSpan(`generateLoader started`, true);

  const clientLoaderSource = `loader.js`;

  let loaderContent = await config.sys.getClientCoreFile({ staticName: clientLoaderSource });

  loaderContent = injectAppIntoLoader(
    config,
    outputTarget,
    appRegistry.core,
    appRegistry.corePolyfilled,
    config.hydratedCssClass,
    cmpRegistry,
    loaderContent
  );

  if (config.minifyJs) {
    // minify the loader
    const minifyJsResults = await minifyJs(config, compilerCtx, loaderContent, 'es5', true);
    minifyJsResults.diagnostics.forEach(d => {
      (config.logger as any)[d.level](d.messageText);
    });

    if (!minifyJsResults.diagnostics.length) {
      loaderContent = minifyJsResults.output;
    }

  } else {
    // dev
    loaderContent = generatePreamble(config) + '\n' + loaderContent;
  }

  const appLoadPath = getLoaderPath(config, outputTarget);
  await compilerCtx.fs.writeFile(appLoadPath, loaderContent);

  timeSpan.finish(`generateLoader finished`);

  return loaderContent;
}


export function injectAppIntoLoader(
  config: d.Config,
  outputTarget: d.OutputTargetWww,
  appCoreFileName: string,
  appCorePolyfilledFileName: string,
  hydratedCssClass: string,
  cmpRegistry: d.ComponentRegistry,
  loaderContent: string
) {
  const cmpLoaderRegistry = formatBrowserLoaderComponentRegistry(cmpRegistry);

  const cmpLoaderRegistryStr = JSON.stringify(cmpLoaderRegistry);

  const resourcesUrl = outputTarget.resourcesUrl ? `"${outputTarget.resourcesUrl}"` : 0;

  const loaderArgs = [
    `"${config.namespace}"`,
    `"${config.fsNamespace}"`,
    `${resourcesUrl}`,
    `"${appCoreFileName}"`,
    `"${appCorePolyfilledFileName}"`,
    `"${hydratedCssClass}"`,
    cmpLoaderRegistryStr,
    'HTMLElement.prototype'
  ].join(',');

  return loaderContent.replace(APP_NAMESPACE_REGEX, loaderArgs);
}
