import * as d from '../../declarations';
import { APP_NAMESPACE_REGEX } from '../../util/constants';
import { formatComponentLoaderRegistry } from '../../util/data-serialize';
import { generatePreamble, minifyJs } from '../util';
import { getLoaders, getLoaderFileName, getLoaderPath } from './app-file-naming';


export async function generateLoader(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTarget,
  appRegistry: d.AppRegistry,
  cmpRegistry: d.ComponentRegistry
) {

  const clientLoaderSource = `loader.js`;

  const clientLoaderContent = await config.sys.getClientCoreFile({ staticName: clientLoaderSource });

  let loadersContent = injectAppIntoLoaders(
    config,
    outputTarget,
    appRegistry.core,
    appRegistry.corePolyfilled,
    config.hydratedCssClass,
    cmpRegistry,
    clientLoaderContent
  );

  await Promise.all(Object.keys(loadersContent).map(async (loader: string) => {
    
    const appLoaderFileName = getLoaderFileName(loader);
    let loaderContent = loadersContent[loader];
    
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

    const appLoadPath = getLoaderPath(config, outputTarget, loader);
    await compilerCtx.fs.writeFile(appLoadPath, loaderContent);

  }));

  return loadersContent;
}


export function injectAppIntoLoaders(
  config: d.Config,
  outputTarget: d.OutputTargetWww,
  appCoreFileName: string,
  appCorePolyfilledFileName: string,
  hydratedCssClass: string,
  cmpRegistry: d.ComponentRegistry,
  loaderContent: string
) {
  const loadersContent: any = {};
  
  getLoaders(config).forEach(loader => {
    let cmpLoaderRegistry: any = {};
    config.loaders[loader].forEach((cmp:string) => cmpLoaderRegistry[cmp] = cmpRegistry[cmp]);
    cmpLoaderRegistry = formatComponentLoaderRegistry(cmpLoaderRegistry);
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

    loadersContent[loader] = loaderContent.replace(APP_NAMESPACE_REGEX, loaderArgs);
  });
  return loadersContent;
}
