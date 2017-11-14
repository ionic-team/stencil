import { AppRegistry, BuildConfig, BuildContext } from '../../util/interfaces';
import { getRegistryJsonDist, getRegistryJsonWWW } from './app-file-naming';


export async function generateAppRegistry(config: BuildConfig, ctx: BuildContext, appRegistry: AppRegistry) {
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
