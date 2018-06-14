import * as d from '../../declarations';
import { getLoaderFileName, getRegistryJson } from './app-file-naming';


export function createAppRegistry(config: d.Config) {
  // create the shared app registry object
  const appRegistry: d.AppRegistry = {
    namespace: config.namespace,
    fsNamespace: config.fsNamespace,
    loader: `../${getLoaderFileName(config)}`
  };

  return appRegistry;
}


export function getAppRegistry(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTarget) {
  const registryJsonFilePath = getRegistryJson(config, outputTarget);
  let appRegistry: d.AppRegistry;

  try {
    // open up the app registry json file
    const appRegistryJson = compilerCtx.fs.readFileSync(registryJsonFilePath);

    // parse the json into app registry data
    appRegistry = JSON.parse(appRegistryJson);

    config.logger.debug(`parsed app registry: ${registryJsonFilePath}`);

  } catch (e) {
    throw new Error(`Error parsing app registry, ${registryJsonFilePath}: ${e}`);
  }

  return appRegistry;
}


export function serializeComponentRegistry(cmpRegistry: d.ComponentRegistry) {
  const appRegistryComponents: d.AppRegistryComponents = {};

  Object.keys(cmpRegistry).sort().forEach(tagName => {
    appRegistryComponents[tagName] = cmpRegistry[tagName].bundleIds as any;
  });

  return appRegistryComponents;
}


export async function writeAppRegistry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, appRegistry: d.AppRegistry, cmpRegistry: d.ComponentRegistry) {
  if (buildCtx.shouldAbort()) {
    return;
  }

  if (outputTarget.type !== 'www') {
    // only create a registry for www builds
    return;
  }

  appRegistry.components = serializeComponentRegistry(cmpRegistry);

  const registryJson = JSON.stringify(appRegistry, null, 2);

  // cache so we can check if it changed on rebuilds
  compilerCtx.appFiles.registryJson = registryJson;

  const appRegistryWWW = getRegistryJson(config, outputTarget);
  config.logger.debug(`build, app www registry: ${appRegistryWWW}`);

  await compilerCtx.fs.writeFile(appRegistryWWW, registryJson);
}
