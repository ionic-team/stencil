import * as d from '../../declarations';
import { ENCAPSULATION } from '../../util/constants';
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


export function getAppRegistry(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) {
  const registryJsonFilePath = getRegistryJson(config, outputTarget);
  let appRegistry: d.AppRegistry;

  try {
    // open up the app registry json file
    const appRegistryJson = compilerCtx.fs.readFileSync(registryJsonFilePath);

    // parse the json into app registry data
    appRegistry = JSON.parse(appRegistryJson);

  } catch (e) {
    throw new Error(`Error parsing app registry, ${registryJsonFilePath}: ${e}`);
  }

  return appRegistry;
}


export function serializeComponentRegistry(cmpRegistry: d.ComponentRegistry) {
  const appRegistryComponents: d.AppRegistryComponents = {};

  Object.keys(cmpRegistry).sort().forEach(tagName => {
    const cmpMeta = cmpRegistry[tagName];

    appRegistryComponents[tagName] = {
      bundleIds: cmpMeta.bundleIds as any
    };

    if (cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom) {
      appRegistryComponents[tagName].encapsulation = 'shadow';
    } else if (cmpMeta.encapsulationMeta === ENCAPSULATION.ScopedCss) {
      appRegistryComponents[tagName].encapsulation = 'scoped';
    }
  });

  return appRegistryComponents;
}


export async function writeAppRegistry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, appRegistry: d.AppRegistry, cmpRegistry: d.ComponentRegistry) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return;
  }

  if (outputTarget.type === 'www') {
    appRegistry.components = serializeComponentRegistry(cmpRegistry);

    const registryJson = JSON.stringify(appRegistry, null, 2);

    // cache so we can check if it changed on rebuilds
    // compilerCtx.appFiles.registryJson = registryJson;

    const appRegistryWWW = getRegistryJson(config, outputTarget);

    await compilerCtx.fs.writeFile(appRegistryWWW, registryJson);

    const relPath = config.sys.path.relative(config.rootDir, appRegistryWWW);
    buildCtx.debug(`writeAppRegistry: ${relPath}`);
  }
}
