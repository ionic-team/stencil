import { AppRegistry, BuildConfig, BuildContext } from '../../util/interfaces';
import { CORE_NAME, GLOBAL_NAME } from '../../util/constants';
import { formatComponentRegistry } from '../../util/data-serialize';
import { generateCore, generateCoreES5WithPolyfills, getAppFileName, APP_CORE_FILENAME_PLACEHOLDER } from './app-core';
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
    components: formatComponentRegistry(ctx.registry),
    loader: `${appFileName}.js`,
  };

  let appCoreFileName: string;
  let appCorePolyfilledFileName: string;

  // bundle the app's entry file (if one was provided)
  return generateAppGlobal(config, ctx).then(globalJsContents => {
    if (globalJsContents.length) {
      appRegistry.global = `${appFileName}.${GLOBAL_NAME}.js`;

      const globalJsContent = generateGlobalJs(config, globalJsContents);

      ctx.appFiles.global = globalJsContent;

      if (config.generateWWW) {
        const appGlobalWWWFilePath = getGlobalWWW(config);

        config.logger.debug(`build, app global www: ${appGlobalWWWFilePath}`);
        ctx.filesToWrite[appGlobalWWWFilePath] = globalJsContent;
      }

      if (config.generateDistribution) {
        const appGlobalDistFilePath = getGlobalDist(config);

        config.logger.debug(`build, app global dist: ${appGlobalDistFilePath}`);
        ctx.filesToWrite[appGlobalDistFilePath] = globalJsContent;
      }
    }

    return Promise.all([
      generateCore(config, globalJsContents),
      generateCoreES5WithPolyfills(config, globalJsContents)
    ]);

  }).then(results => {
    let coreContent = results[0];
    let coreEs5WithPolyfilledContent = results[1];

    if (config.minifyJs) {
      // prod mode renames the core file with its hashed content
      const contentHash = sys.generateContentHash(coreContent, config.hashedFileNameLength);
      appRegistry.core = `${appFileName}/${appFileName}.${contentHash}.js`;
      appCoreFileName = `${appFileName}.${contentHash}.js`;

      const contentPolyfilledHash = sys.generateContentHash(coreEs5WithPolyfilledContent, config.hashedFileNameLength);
      appRegistry.corePolyfilled = `${appFileName}/${appFileName}.${contentPolyfilledHash}.pf.js`;
      appCorePolyfilledFileName = `${appFileName}.${contentPolyfilledHash}.pf.js`;

    } else {
      // dev mode core filename just keeps the same name, no content hashing
      appRegistry.core = `${appFileName}/${appFileName}.${CORE_NAME}.js`;
      appCoreFileName = `${appFileName}.${CORE_NAME}.js`;

      appRegistry.corePolyfilled = `${appFileName}/${appFileName}.${CORE_NAME}.pf.js`;
      appCorePolyfilledFileName = `${appFileName}.${CORE_NAME}.pf.js`;
    }


    // update the app core filename within the content
    coreContent = coreContent.replace(APP_CORE_FILENAME_PLACEHOLDER, appCoreFileName);

    if (ctx.appFiles.core !== coreContent) {
      // core file is actually different from our last saved version
      config.logger.debug(`build, write app core: ${appCoreFileName}`);
      ctx.appFiles.core = coreContent;

      if (config.generateWWW) {
        // write the www/build app core file
        const appCoreWWW = normalizePath(sys.path.join(config.buildDir, appFileName, appCoreFileName));
        ctx.filesToWrite[appCoreWWW] = coreContent;
      }

      if (config.generateDistribution) {
        // write the dist/ app core file
        const appCoreDist = normalizePath(sys.path.join(config.distDir, appFileName, appCoreFileName));
        ctx.filesToWrite[appCoreDist] = coreContent;
      }

      ctx.appFileBuildCount++;
    }

    // update the app core filename within the content
    coreEs5WithPolyfilledContent = coreEs5WithPolyfilledContent.replace(APP_CORE_FILENAME_PLACEHOLDER, appCoreFileName);

    if (ctx.appFiles.corePolyfilled !== coreEs5WithPolyfilledContent) {
      // core polyfilled file is actually different from our last saved version
      config.logger.debug(`build, app core polyfilled: ${appCoreFileName}`);
      ctx.appFiles.corePolyfilled = coreEs5WithPolyfilledContent;

      if (config.generateWWW) {
        // write the www/build app core polyfilled file
        const appCorePolyfilledWWW = normalizePath(sys.path.join(config.buildDir, appFileName, appCorePolyfilledFileName));
        ctx.filesToWrite[appCorePolyfilledWWW] = coreEs5WithPolyfilledContent;
      }

      if (config.generateDistribution) {
        // write the dist app core polyfilled file
        const appCorePolyfilledDist = normalizePath(sys.path.join(config.distDir, appFileName, appCorePolyfilledFileName));
        ctx.filesToWrite[appCorePolyfilledDist] = coreEs5WithPolyfilledContent;
      }

      ctx.appFileBuildCount++;
    }

  }).then(() => {
    // create the loader after creating the loader file name
    return generateLoader(config, appCoreFileName, appCorePolyfilledFileName, appRegistry.components).then(loaderContent => {
      // write the app loader file
      if (ctx.appFiles.loader !== loaderContent) {
        // app loader file is actually different from our last saved version
        config.logger.debug(`build, app loader: ${appRegistry.loader}`);
        ctx.appFiles.loader = loaderContent;

        if (config.generateWWW) {
          const appLoaderWWW = normalizePath(sys.path.join(config.buildDir, appRegistry.loader));
          ctx.filesToWrite[appLoaderWWW] = loaderContent;
        }

        if (config.generateDistribution) {
          const appLoaderDist = normalizePath(sys.path.join(config.distDir, appRegistry.loader));
          ctx.filesToWrite[appLoaderDist] = loaderContent;
        }

        ctx.appFileBuildCount++;
      }
    });

  }).then(() => {
    // create a json file for the app registry
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

  }).catch(err => {
    config.logger.error('generateAppFiles', err);
  });
}


export function getRegistryJsonWWW(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.buildDir, `${appFileName}.registry.json`));
}


export function getRegistryJsonDist(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.distDir, `${appFileName}.registry.json`));
}


export function getGlobalWWW(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.buildDir, `${appFileName}.${GLOBAL_NAME}.js`));
}


export function getGlobalDist(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.distDir, `${appFileName}.${GLOBAL_NAME}.js`));
}


export function getAppWWWBuildDir(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.buildDir, appFileName));
}

export function getAppDistDir(config: BuildConfig) {
  const appFileName = getAppFileName(config);
  return normalizePath(config.sys.path.join(config.distDir, appFileName));
}
