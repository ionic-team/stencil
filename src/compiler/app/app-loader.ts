import { AppRegistry, Config, CompilerCtx, ComponentRegistry } from '../../util/interfaces';
import { APP_NAMESPACE_REGEX } from '../../util/constants';
import { generatePreamble, minifyJs } from '../util';
import { getAppPublicPath, getLoaderFileName, getLoaderDist, getLoaderWWW } from './app-file-naming';
import { formatComponentLoaderRegistry } from '../../util/data-serialize';


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

    if (config.generateWWW) {
      const appLoaderWWW = getLoaderWWW(config);
      await compilerCtx.fs.writeFile(appLoaderWWW, loaderContent);
    }

    if (config.generateDistribution) {
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

  const loaderArgs = [
    `"${config.namespace}"`,
    `"${publicPath}"`,
    `"${appCoreFileName}"`,
    `"${appCorePolyfilledFileName}"`,
    `"${hydratedCssClass}"`,
    cmpLoaderRegistryStr
  ].join(',');

  return loaderContent.replace(APP_NAMESPACE_REGEX, loaderArgs);
}
