import { AppRegistry, CompilerCtx, ComponentRegistry, Config } from '../../declarations';
import { APP_NAMESPACE_REGEX } from '../../util/constants';
import { formatComponentLoaderRegistry } from '../../util/data-serialize';
import { generatePreamble, minifyJs } from '../util';
import { getAppPublicPath, getLoaderDist, getLoaderFileName, getLoaderWWW } from './app-file-naming';


export async function generateLoader(
  config: Config,
  compilerCtx: CompilerCtx,
  appRegistry: AppRegistry,
  cmpRegistry: ComponentRegistry
) {
  const appLoaderFileName = getLoaderFileName(config);

  const clientLoaderSource = `loader.js`;

  let loaderContent = await config.sys.getClientCoreFile({ staticName: clientLoaderSource });

  loaderContent = injectAppIntoLoader(
    config,
    appRegistry.core,
    appRegistry.corePolyfilled,
    config.hydratedCssClass,
    cmpRegistry,
    loaderContent
  );

  // write the app loader file
  if (compilerCtx.appFiles.loaderContent !== loaderContent) {
    // app loader file is actually different from our last saved version
    config.logger.debug(`build, app loader: ${appLoaderFileName}`);
    compilerCtx.appFiles.loaderContent = loaderContent;

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

    compilerCtx.appFiles.loader = loaderContent;

    if (config.outputTargets['www']) {
      const appLoaderWWW = getLoaderWWW(config);
      await compilerCtx.fs.writeFile(appLoaderWWW, loaderContent);
    }

    if (config.outputTargets['distribution']) {
      const appLoaderDist = getLoaderDist(config);
      await compilerCtx.fs.writeFile(appLoaderDist, loaderContent);
    }
  }

  return loaderContent;
}


export function injectAppIntoLoader(
  config: Config,
  appCoreFileName: string,
  appCorePolyfilledFileName: string,
  hydratedCssClass: string,
  cmpRegistry: ComponentRegistry,
  loaderContent: string
) {
  const cmpLoaderRegistry = formatComponentLoaderRegistry(cmpRegistry);

  const cmpLoaderRegistryStr = JSON.stringify(cmpLoaderRegistry);

  const publicPath = getAppPublicPath(config);

  const discoverPublicPath = (config.discoverPublicPath !== false);

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
