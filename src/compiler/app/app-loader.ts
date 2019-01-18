import * as d from '@declarations';
import { APP_NAMESPACE_REGEX, generatePreamble } from '@utils';
import { formatBrowserLoaderComponentTagNames } from '../../util/data-serialize';
import { getLoaderPath } from './app-file-naming';
import { minifyJs } from '../minifier';


export async function generateLoader(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetBuild,
  appRegistry: d.AppRegistry,
  cmpRegistry: d.ComponentRegistry
) {

  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return null;
  }

  const appLoaderPath = getLoaderPath(config, outputTarget);
  const relPath = config.sys.path.relative(config.rootDir, appLoaderPath);
  const timeSpan = buildCtx.createTimeSpan(`generateLoader started, ${relPath}`, true);

  let loaderContent = await config.sys.getClientCoreFile({ staticName: CLIENT_LOADER_SOURCE });

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
    // minify the loader which should always be es5
    loaderContent = await minifyJs(config, compilerCtx, buildCtx.diagnostics, loaderContent, 'es5', true, buildCtx.timestamp);

  } else {
    // dev
    loaderContent = generatePreamble(config, { suffix: buildCtx.timestamp }) + '\n' + loaderContent;
  }

  await compilerCtx.fs.writeFile(appLoaderPath, loaderContent);

  timeSpan.finish(`generateLoader finished, ${relPath}`);

  return loaderContent;
}

const CLIENT_LOADER_SOURCE = `loader.js`;


export function injectAppIntoLoader(
  config: d.Config,
  outputTarget: d.OutputTargetBuild,
  appCoreFileName: string,
  appCorePolyfilledFileName: string,
  hydratedCssClass: string,
  cmpRegistry: d.ComponentRegistry,
  loaderContent: string
) {
  const cmpTags = formatBrowserLoaderComponentTagNames(cmpRegistry);

  const resourcesUrl = outputTarget.resourcesUrl ? `"${outputTarget.resourcesUrl}"` : 0;

  const loaderArgs = [
    `"${config.namespace}"`,
    `"${config.fsNamespace}"`,
    `${resourcesUrl}`,
    `"${appCoreFileName}"`,
    `"${appCorePolyfilledFileName}"`,
    `"${hydratedCssClass}"`,
    `"${cmpTags.join(',')}"`,
    'HTMLElement.prototype'
  ].join(',');

  return loaderContent.replace(APP_NAMESPACE_REGEX, loaderArgs);
}
