import { CORE_NAME, LOADER_NAME, PROJECT_NAMESPACE_REGEX } from '../util/constants';
import { BuildConfig, BuildContext } from './interfaces';
import { generateBanner } from './util';
import { LoadComponentRegistry, ProjectRegistry } from '../util/interfaces';


export function generateProjectFiles(config: BuildConfig, ctx: BuildContext, componentRegistry: LoadComponentRegistry[]) {
  const sys = config.sys;

  config.logger.debug(`build, generateProjectFiles: ${config.namespace}`);

  const projectFileName = config.namespace.toLowerCase();
  const registryFileName = `${projectFileName}.registry.json`;
  const registryFilePath = config.sys.path.join(config.buildDest, registryFileName);

  const projectRegistry: ProjectRegistry = {
    namespace: config.namespace,
    components: componentRegistry,
    loader: projectFileName
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
    const projectCoreFilePath = sys.path.join(config.buildDest, projectFileName, projectCoreFileName);
    config.logger.debug(`build, project core: ${projectCoreFilePath}`);
    ctx.filesToWrite[projectCoreFilePath] = coreContent;

    // write the project core ES5 file
    const projectCoreEs5FilePath = sys.path.join(config.buildDest, projectFileName, projectCoreEs5FileName);
    config.logger.debug(`build, project core es5: ${projectCoreEs5FilePath}`);
    ctx.filesToWrite[projectCoreEs5FilePath] = coreEs5Content;

  }).then(() => {
    // create the loader after creating the loader file name
    return generateLoader(config, projectFileName, projectCoreFileName, projectCoreEs5FileName, componentRegistry).then(loaderContent => {

      // write the project loader file
      const projectLoaderFileName = `${projectRegistry.loader}.js`;
      const projectLoaderFilePath = sys.path.join(config.buildDest, projectLoaderFileName);
      config.logger.debug(`build, project loader: ${projectLoaderFilePath}`);
      ctx.filesToWrite[projectLoaderFilePath] = loaderContent;
    });

  }).then(() => {
    // create a json file for the project registry
    config.logger.debug(`build, project registry: ${registryFilePath}`);
    ctx.filesToWrite[registryFilePath] = JSON.stringify(projectRegistry, null, 2);

  });
}


function generateLoader(config: BuildConfig, projectFileName: string, projectCoreFileName: string, projectCoreEs5FileName: string, componentRegistry: LoadComponentRegistry[]) {
  const sys = config.sys;

  let staticName = LOADER_NAME;
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  return sys.getClientCoreFile({ staticName: staticName }).then(stencilLoaderContent => {
    // replace the default loader with the project's namespace and components

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

    stencilLoaderContent = stencilLoaderContent.replace(
      PROJECT_NAMESPACE_REGEX,
      `"${config.namespace}","${projectFileName}","${projectCoreFileName}","${projectCoreEs5FileName}",${componentRegistryStr}`
    );

    // concat the projects loader code
    const projectCode: string[] = [
      generateBanner(config),
      stencilLoaderContent
    ];

    return projectCode.join('');
  });
}


function generateCore(config: BuildConfig) {
  const sys = config.sys;

  let staticName = CORE_NAME;
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  return sys.getClientCoreFile({ staticName: staticName }).then(coreContent => {
    // replace the default core with the project's namespace
    coreContent = coreContent.replace(
      PROJECT_NAMESPACE_REGEX,
      `"${config.namespace}"`
    );

    // concat the projects core code
    const projectCode: string[] = [
      generateBanner(config),
      coreContent
    ];

    return projectCode.join('');
  });
}


function generateCoreEs5(config: BuildConfig) {
  const sys = config.sys;

  let staticName = CORE_NAME + '.es5';
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  let documentRegistryPolyfill = config.sys.path.join('polyfills', 'document-register-element.js');

  return Promise.all([
    sys.getClientCoreFile({ staticName: staticName }),
    sys.getClientCoreFile({ staticName: documentRegistryPolyfill })

  ]).then(results => {
    let coreContent = results[0];
    let docRegistryPolyfillContent = results[1];

    // replace the default core with the project's namespace
    coreContent = coreContent.replace(
      PROJECT_NAMESPACE_REGEX,
      `"${config.namespace}"`
    );

    // concat the projects core code
    const projectCode: string[] = [
      docRegistryPolyfillContent + '\n\n',
      generateBanner(config),
      coreContent
    ];

    return projectCode.join('');
  });
}
