import * as d from '../../declarations';
import { APP_NAMESPACE_REGEX } from '../../util/constants';
import { formatComponentLoaderRegistry } from '../../util/data-serialize';
import { generatePreamble, minifyJs } from '../util';
import { getLoaderFileName, getLoaderPath } from './app-file-naming';


export async function generateLoader(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTarget,
  appRegistry: d.AppRegistry,
  cmpRegistry: d.ComponentRegistry
) {
  const appLoaderFileName = getLoaderFileName(config);

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

  // write the app loader file
  // app loader file is actually different from our last saved version
  config.logger.debug(`build, app loader: ${appLoaderFileName}`);

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
  const cmpLoaderRegistry = formatComponentLoaderRegistry(cmpRegistry);

  const cmpLoaderRegistryStr = JSON.stringify(cmpLoaderRegistry);

  const resourcePath = outputTarget.resourcePath ? `"${outputTarget.resourcePath}"` : 0;

  const loaderArgs = [
    `"${config.namespace}"`,
    `"${config.fsNamespace}"`,
    `${resourcePath}`,
    `"${appCoreFileName}"`,
    `"${appCorePolyfilledFileName}"`,
    `"${hydratedCssClass}"`,
    cmpLoaderRegistryStr
  ].join(',');

  return loaderContent.replace(APP_NAMESPACE_REGEX, loaderArgs);
}
