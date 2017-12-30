import { AppRegistry, AppRegistryComponents, BuildConfig, BuildContext, ComponentRegistry } from '../../util/interfaces';
import { getRegistryJsonDist, getRegistryJsonWWW } from './app-file-naming';


export function createAppRegistry(config: BuildConfig, cmpRegistry: ComponentRegistry) {
  // create the shared app registry object
  const appRegistry: AppRegistry = {
    namespace: config.namespace,
    fsNamespace: config.fsNamespace,
    components: getAppRegistryComponents(cmpRegistry)
  };
  return appRegistry;
}


export function getAppRegistryComponents(cmpRegistry: ComponentRegistry) {
  const appRegistryComponents: AppRegistryComponents = {};

  const tagNames = Object.keys(cmpRegistry).sort();
  tagNames.forEach(tagName => {
    appRegistryComponents[tagName] = cmpRegistry[tagName].bundleIds;
  });

  return appRegistryComponents;
}


export function parseComponentRegistryJsonFile(config: BuildConfig, registryJsonFilePath: string) {
  let cmpRegistry: ComponentRegistry = {};

  try {
    // open up the app registry json file
    const appRegistryJson = config.sys.fs.readFileSync(registryJsonFilePath, 'utf-8');

    // parse the json into app registry data
    const appRegistry: AppRegistry = JSON.parse(appRegistryJson);

    if (!appRegistry.components) {
      throw new Error(`App registry missing components`);
    }

    Object.keys(appRegistry.components).forEach(tagName => {
      cmpRegistry[tagName] = {
        tagNameMeta: tagName,
        bundleIds: appRegistry.components[tagName]
      };
    });

  } catch (e) {
    throw new Error(`Error parsing app registry, ${registryJsonFilePath}: ${e}`);
  }

  return cmpRegistry;
}


export function writeAppRegistry(config: BuildConfig, ctx: BuildContext, appRegistry: AppRegistry) {
  const registryJson = JSON.stringify(appRegistry, null, 2);

  if (ctx.appFiles.registryJson !== registryJson) {
    // app registry json file is actually different from our last saved version
    ctx.appFiles.registryJson = registryJson;

    if (config.generateWWW) {
      const appRegistryWWW = getRegistryJsonWWW(config);
      config.logger.debug(`build, app www registry: ${appRegistryWWW}`);
      ctx.filesToWrite[appRegistryWWW] = registryJson;
    }

    if (config.generateDistribution) {
      const appRegistryDist = getRegistryJsonDist(config);
      config.logger.debug(`build, app dist registry: ${appRegistryDist}`);
      ctx.filesToWrite[appRegistryDist] = registryJson;
    }

    ctx.appFileBuildCount++;
  }
}
