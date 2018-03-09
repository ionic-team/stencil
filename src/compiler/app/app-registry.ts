import { AppRegistry, AppRegistryComponents, CompilerCtx, ComponentRegistry, Config, OutputTarget } from '../../declarations';
import { getLoaderFileName, getRegistryJson } from './app-file-naming';


export function createAppRegistry(config: Config) {
  // create the shared app registry object
  const appRegistry: AppRegistry = {
    namespace: config.namespace,
    fsNamespace: config.fsNamespace,
    loader: `../${getLoaderFileName(config)}`
  };

  return appRegistry;
}


export function getAppRegistry(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTarget) {
  const registryJsonFilePath = getRegistryJson(config, outputTarget);
  let appRegistry: AppRegistry;

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


export function serializeComponentRegistry(cmpRegistry: ComponentRegistry) {
  const appRegistryComponents: AppRegistryComponents = {};

  Object.keys(cmpRegistry).sort().forEach(tagName => {
    appRegistryComponents[tagName] = cmpRegistry[tagName].bundleIds;
  });

  return appRegistryComponents;
}


export async function writeAppRegistry(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTarget, appRegistry: AppRegistry, cmpRegistry: ComponentRegistry) {
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
