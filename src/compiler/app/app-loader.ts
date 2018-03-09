import { AppRegistry, CompilerCtx, ComponentRegistry, Config, OutputTarget } from '../../declarations';
import { APP_NAMESPACE_REGEX } from '../../util/constants';
import { formatComponentLoaderRegistry } from '../../util/data-serialize';
import { generatePreamble, minifyJs } from '../util';
import { getAppPublicPath, getLoaderFileName, getLoaderPath } from './app-file-naming';


export async function generateLoader(
  config: Config,
  compilerCtx: CompilerCtx,
  outputTarget: OutputTarget,
  appRegistry: AppRegistry,
  cmpRegistry: ComponentRegistry
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
  config: Config,
  outputTarget: OutputTarget,
  appCoreFileName: string,
  appCorePolyfilledFileName: string,
  hydratedCssClass: string,
  cmpRegistry: ComponentRegistry,
  loaderContent: string
) {
  const cmpLoaderRegistry = formatComponentLoaderRegistry(cmpRegistry);

  const cmpLoaderRegistryStr = JSON.stringify(cmpLoaderRegistry);

  const publicPath = getAppPublicPath(config, outputTarget);

  const discoverPublicPath = (outputTarget.discoverPublicPath !== false);

  const loaderArgs = [
    `"${config.namespace}"`,
    `"${config.fsNamespace}"`,
    `"${publicPath}"`,
    `${discoverPublicPath}`,
    `"${appCoreFileName}"`,
    `"${appCorePolyfilledFileName}"`,
    `"${hydratedCssClass}"`,
    cmpLoaderRegistryStr
  ].join(',');

  return loaderContent.replace(APP_NAMESPACE_REGEX, loaderArgs);
}
