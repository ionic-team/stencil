import { BuildConfig, LoadComponentRegistry } from '../../util/interfaces';
import { LOADER_NAME, APP_NAMESPACE_REGEX } from '../../util/constants';
import { generatePreamble } from '../util';
import { getAppPublicPath } from './app-core';


export function generateLoader(
  config: BuildConfig,
  appCoreFileName: string,
  appCorePolyfilledFileName: string,
  componentRegistry: LoadComponentRegistry[]
) {
  const sys = config.sys;

  let staticName = LOADER_NAME;
  if (!config.minifyJs) {
    staticName += '.dev';
  }
  staticName += '.js';

  return sys.getClientCoreFile({ staticName: staticName }).then(stencilLoaderContent => {
    // replace the default loader with the project's namespace and components

    stencilLoaderContent = injectAppIntoLoader(
      config,
      appCoreFileName,
      appCorePolyfilledFileName,
      componentRegistry,
      stencilLoaderContent
    );

    // concat the app's loader code
    const appCode: string[] = [
      generatePreamble(config),
      stencilLoaderContent
    ];

    return appCode.join('');
  });
}


export function injectAppIntoLoader(
  config: BuildConfig,
  appCoreFileName: string,
  appCorePolyfilledFileName: string,
  componentRegistry: LoadComponentRegistry[],
  stencilLoaderContent: string
) {
  const componentRegistryStr = JSON.stringify(componentRegistry);

  const publicPath = getAppPublicPath(config);

  stencilLoaderContent = stencilLoaderContent.replace(
    APP_NAMESPACE_REGEX,
    `"${config.namespace}","${publicPath}","${appCoreFileName}","${appCorePolyfilledFileName}",${componentRegistryStr}`
  );

  if (config.minifyJs) {
    const minifyJsResults = config.sys.minifyJs(stencilLoaderContent);
    minifyJsResults.diagnostics.forEach(d => {
      config.logger[d.level](d.messageText);
    });
    if (!minifyJsResults.diagnostics.length) {
      stencilLoaderContent = minifyJsResults.output;
    }
  }

  return stencilLoaderContent;
}
