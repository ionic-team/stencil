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
    const minifyJsResults = await minifyJs(config, compilerCtx, loaderContent, 'es5', true, buildCtx.timestamp);

    if (minifyJsResults.diagnostics.length > 0) {
      buildCtx.diagnostics.push(...minifyJsResults.diagnostics);
    } else {
      loaderContent = minifyJsResults.output;
    }

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
