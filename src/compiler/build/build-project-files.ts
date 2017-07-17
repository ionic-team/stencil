import { CORE_NAME, LOADER_NAME, PROJECT_NAMESPACE_REGEX } from '../../util/constants';
import { BuildConfig, BuildContext } from '../interfaces';
import { generateBanner, normalizePath } from '../util';
import { LoadComponentRegistry, ProjectRegistry } from '../../util/interfaces';


export function generateProjectFiles(config: BuildConfig, ctx: BuildContext, componentRegistry: LoadComponentRegistry[]) {
  const sys = config.sys;

  config.logger.debug(`build, generateProjectFiles: ${config.namespace}`);

  const projectFileName = config.namespace.toLowerCase();

  const projectRegistry: ProjectRegistry = {
    namespace: config.namespace,
    components: componentRegistry,
    loader: `${projectFileName}.js`,
  };

  let projectCoreFileName: string;
  let projectCoreEs5FileName: string;

  return Promise.all([
    generateCore(config),
    generateCoreEs5(config)

  ]).then(results => {
    const coreContent = results[0];
    const coreEs5Content = results[1];

    if (config.devMode) {
      // dev mode core filename just keeps the same name, no content hashing
      projectRegistry.core = `${projectFileName}/${projectFileName}.${CORE_NAME}.js`;
      projectCoreFileName = `${projectFileName}.${CORE_NAME}.js`;

      projectRegistry.coreEs5 = `${projectFileName}/${projectFileName}.${CORE_NAME}.ce.js`;
      projectCoreEs5FileName = `${projectFileName}.${CORE_NAME}.ce.js`;

    } else {
      // prod mode renames the core file with its hashed content
      const contentHash = sys.generateContentHash(coreContent, config.hashedFileNameLength);
      projectRegistry.core = `${projectFileName}/${projectFileName}.${contentHash}.js`;
      projectCoreFileName = `${projectFileName}.${contentHash}.js`;

      const contentEs5Hash = sys.generateContentHash(coreEs5Content, config.hashedFileNameLength);
      projectRegistry.coreEs5 = `${projectFileName}/${projectFileName}.${contentEs5Hash}.ce.js`;
      projectCoreEs5FileName = `${projectFileName}.${contentEs5Hash}.ce.js`;
    }

    // write the project core file
    const projectCoreFilePath = sys.path.join(config.buildDir, projectFileName, projectCoreFileName);
    if (ctx.projectFiles.core !== coreContent) {
      // core file is actually different from our last saved version
      config.logger.debug(`build, write project core: ${projectCoreFilePath}`);
      ctx.filesToWrite[projectCoreFilePath] = ctx.projectFiles.core = coreContent;
      ctx.projectFileBuildCount++;
    }

    // write the project core ES5 file
    const projectCoreEs5FilePath = sys.path.join(config.buildDir, projectFileName, projectCoreEs5FileName);
    if (ctx.projectFiles.coreEs5 !== coreEs5Content) {
      // core es5 file is actually different from our last saved version
      config.logger.debug(`build, project core es5: ${projectCoreEs5FilePath}`);
      ctx.filesToWrite[projectCoreEs5FilePath] = ctx.projectFiles.coreEs5 = coreEs5Content;
      ctx.projectFileBuildCount++;
    }

  }).then(() => {
    // create the loader after creating the loader file name
    return generateLoader(config, projectCoreFileName, projectCoreEs5FileName, componentRegistry).then(loaderContent => {
      // write the project loader file
      const projectLoaderFileName = `${projectRegistry.loader}`;
      const projectLoaderFilePath = sys.path.join(config.buildDir, projectLoaderFileName);
      if (ctx.projectFiles.loader !== loaderContent) {
        // project loader file is actually different from our last saved version
        config.logger.debug(`build, project loader: ${projectLoaderFilePath}`);
        ctx.filesToWrite[projectLoaderFilePath] = ctx.projectFiles.loader = loaderContent;
        ctx.projectFileBuildCount++;
      }
    });

  }).then(() => {
    // create a json file for the project registry
    const registryJson = JSON.stringify(projectRegistry, null, 2);
    if (ctx.projectFiles.registryJson !== registryJson) {
      // project registry json file is actually different from our last saved version
      const registryFilePath = getRegistryJsonFilePath(config);
      config.logger.debug(`build, project registry: ${registryFilePath}`);
      ctx.filesToWrite[registryFilePath] = ctx.projectFiles.registryJson = registryJson;
      ctx.projectFileBuildCount++;
    }

  }).catch(err => {
    config.logger.error('generateProjectFiles', err);
  });
}


function generateLoader(config: BuildConfig, projectCoreFileName: string, projectCoreEs5FileName: string, componentRegistry: LoadComponentRegistry[]) {
  const sys = config.sys;

  let staticName = LOADER_NAME;
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  return sys.getClientCoreFile({ staticName: staticName }).then(stencilLoaderContent => {
    // replace the default loader with the project's namespace and components

    stencilLoaderContent = injectProjectIntoLoader(
      config,
      projectCoreFileName,
      projectCoreEs5FileName,
      componentRegistry,
      stencilLoaderContent
    );

    // concat the projects loader code
    const projectCode: string[] = [
      generateBanner(config),
      stencilLoaderContent
    ];

    return projectCode.join('');
  });
}


export function injectProjectIntoLoader(config: BuildConfig, projectCoreFileName: string, projectCoreEs5FileName: string, componentRegistry: LoadComponentRegistry[], stencilLoaderContent: string) {
  let componentRegistryStr = JSON.stringify(componentRegistry);

  if (config.minifyJs) {
    const minifyResult = config.sys.minifyJs(componentRegistryStr);
    minifyResult.diagnostics.forEach(d => {
      config.logger[d.level](d.messageText);
    });
    if (minifyResult.output) {
      componentRegistryStr = minifyResult.output;
    }
  }

  const projectCoreUrl = getProjectPublicPath(config) + '/' + projectCoreFileName;
  const projectCoreEs5Url = getProjectPublicPath(config) + '/' + projectCoreEs5FileName;

  return stencilLoaderContent.replace(
    PROJECT_NAMESPACE_REGEX,
    `"${config.namespace}","${projectCoreUrl}","${projectCoreEs5Url}",${componentRegistryStr}`
  );
}


function generateCore(config: BuildConfig) {
  const sys = config.sys;

  let staticName = CORE_NAME;
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  return sys.getClientCoreFile({ staticName: staticName }).then(coreContent => {
    // concat the projects core code
    const projectCode: string[] = [
      generateBanner(config),
      injectProjectIntoCore(config, coreContent)
    ];

    return projectCode.join('');
  });
}


export function injectProjectIntoCore(config: BuildConfig, coreContent: string) {
  // replace the default core with the project's namespace
  return coreContent.replace(
    PROJECT_NAMESPACE_REGEX,
    `"${config.namespace}","${getProjectPublicPath(config)}/"`
  );
}


function generateCoreEs5(config: BuildConfig) {
  const sys = config.sys;

  let staticName = CORE_NAME + '.es5';
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  const documentRegistryPolyfill = config.sys.path.join('polyfills', 'document-register-element.js');

  return Promise.all([
    sys.getClientCoreFile({ staticName: staticName }),
    sys.getClientCoreFile({ staticName: documentRegistryPolyfill })

  ]).then(results => {
    const coreContent = results[0];
    const docRegistryPolyfillContent = results[1];

    // replace the default core with the project's namespace
    // concat the custom element polyfill and projects core code
    const projectCode: string[] = [
      docRegistryPolyfillContent + '\n\n',
      generateBanner(config),
      injectProjectIntoCore(config, coreContent)
    ];

    return projectCode.join('');
  });
}


export function getRegistryJsonFilePath(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.buildDir, `${config.namespace.toLowerCase()}.registry.json`));
}


export function getProjectBuildDir(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.buildDir, config.namespace.toLowerCase()));
}


export function getProjectPublicPath(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.publicPath, config.namespace.toLowerCase()));
}
