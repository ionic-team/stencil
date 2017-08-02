import { AppRegistry, BuildConfig, BuildContext } from '../../util/interfaces';
import { CORE_NAME, GLOBAL_NAME } from '../../util/constants';
import { formatComponentRegistry } from '../../util/data-serialize';
import { generateCore, generateCoreEs5, getAppFileName} from './app-core';
import { generateLoader } from './app-loader';
import { generateAppGlobal, generateGlobalJs } from './app-global';
import { hasError, normalizePath } from '../util';


export function generateAppFiles(config: BuildConfig, ctx: BuildContext) {
  const sys = config.sys;

  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
  }

  config.logger.debug(`build, generateAppFiles: ${config.namespace}`);

  const appFileName = getAppFileName(config);

  const appRegistry: AppRegistry = {
    namespace: config.namespace,
    components: formatComponentRegistry(ctx.registry, config.attrCase),
    loader: `${appFileName}.js`,
  };

  let appCoreFileName: string;
  let appCoreEs5FileName: string;

  // bundle the app's entry file (if one was provided)
  return generateAppGlobal(config, ctx).then(globalJsContents => {
    if (globalJsContents.length) {
      appRegistry.global = `${appFileName}.${GLOBAL_NAME}.js`;

      const globalJsContent = generateGlobalJs(config, globalJsContents);
      const appGlobalFilePath = getGlobalFilePath(config);

      config.logger.debug(`build, app global: ${appGlobalFilePath}`);
      ctx.filesToWrite[appGlobalFilePath] = ctx.appFiles.global = globalJsContent;
    }

    return Promise.all([
      generateCore(config, globalJsContents),
      generateCoreEs5(config, globalJsContents)
    ]);

  }).then(results => {
    const coreContent = results[0];
    const coreEs5Content = results[1];

    if (config.devMode) {
      // dev mode core filename just keeps the same name, no content hashing
      appRegistry.core = `${appFileName}/${appFileName}.${CORE_NAME}.js`;
      appCoreFileName = `${appFileName}.${CORE_NAME}.js`;

      appRegistry.coreEs5 = `${appFileName}/${appFileName}.${CORE_NAME}.ce.js`;
      appCoreEs5FileName = `${appFileName}.${CORE_NAME}.ce.js`;

    } else {
      // prod mode renames the core file with its hashed content
      const contentHash = sys.generateContentHash(coreContent, config.hashedFileNameLength);
      appRegistry.core = `${appFileName}/${appFileName}.${contentHash}.js`;
      appCoreFileName = `${appFileName}.${contentHash}.js`;

      const contentEs5Hash = sys.generateContentHash(coreEs5Content, config.hashedFileNameLength);
      appRegistry.coreEs5 = `${appFileName}/${appFileName}.${contentEs5Hash}.ce.js`;
      appCoreEs5FileName = `${appFileName}.${contentEs5Hash}.ce.js`;
    }

    // write the app core file
    const appCoreFilePath = normalizePath(sys.path.join(config.buildDir, appFileName, appCoreFileName));
    if (ctx.appFiles.core !== coreContent) {
      // core file is actually different from our last saved version
      config.logger.debug(`build, write app core: ${appCoreFilePath}`);
      ctx.filesToWrite[appCoreFilePath] = ctx.appFiles.core = coreContent;
      ctx.appFileBuildCount++;
    }

    // write the app core ES5 file
    const appCoreEs5FilePath = normalizePath(sys.path.join(config.buildDir, appFileName, appCoreEs5FileName));
    if (ctx.appFiles.coreEs5 !== coreEs5Content) {
      // core es5 file is actually different from our last saved version
      config.logger.debug(`build, app core es5: ${appCoreEs5FilePath}`);
      ctx.filesToWrite[appCoreEs5FilePath] = ctx.appFiles.coreEs5 = coreEs5Content;
      ctx.appFileBuildCount++;
    }

  }).then(() => {
    // create the loader after creating the loader file name
    return generateLoader(config, appCoreFileName, appCoreEs5FileName, appRegistry.components).then(loaderContent => {
      // write the app loader file
      const appLoaderFileName = `${appRegistry.loader}`;
      const appLoaderFilePath = normalizePath(sys.path.join(config.buildDir, appLoaderFileName));
      if (ctx.appFiles.loader !== loaderContent) {
        // app loader file is actually different from our last saved version
        config.logger.debug(`build, app loader: ${appLoaderFilePath}`);
        ctx.filesToWrite[appLoaderFilePath] = ctx.appFiles.loader = loaderContent;
        ctx.appFileBuildCount++;
      }
    });

  }).then(() => {
    // create a json file for the app registry
    const registryJson = JSON.stringify(appRegistry, null, 2);
    if (ctx.appFiles.registryJson !== registryJson) {
      // app registry json file is actually different from our last saved version
      const appRegistryFilePath = getRegistryJsonFilePath(config);
      config.logger.debug(`build, app registry: ${appRegistryFilePath}`);
      ctx.filesToWrite[appRegistryFilePath] = ctx.appFiles.registryJson = registryJson;
      ctx.appFileBuildCount++;
    }

  }).catch(err => {
    config.logger.error('generateAppFiles', err);
  });
}


export function getRegistryJsonFilePath(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.buildDir, `${appFileName}.registry.json`));
}


export function getGlobalFilePath(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.buildDir, `${appFileName}.${GLOBAL_NAME}.js`));
}


export function getAppBuildDir(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.buildDir, appFileName));
}
