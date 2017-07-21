import { BuildConfig, BuildContext, ProjectRegistry } from '../../util/interfaces';
import { CORE_NAME } from '../../util/constants';
import { formatComponentRegistry } from '../../util/data-serialize';
import { generateCore, generateCoreEs5 } from './project-core';
import { generateLoader } from './project-loader';
import { generateProjectGlobal } from './project-global';
import { normalizePath } from '../util';


export function generateProjectFiles(config: BuildConfig, ctx: BuildContext) {
  const sys = config.sys;

  config.logger.debug(`build, generateProjectFiles: ${config.namespace}`);

  const projectFileName = config.namespace.toLowerCase();
  const publicPath = getProjectPublicPath(config);

  const projectRegistry: ProjectRegistry = {
    namespace: config.namespace,
    components: formatComponentRegistry(ctx.registry, config.attrCase),
    loader: `${projectFileName}.js`,
  };

  let projectCoreFileName: string;
  let projectCoreEs5FileName: string;

  // bundle the project's entry file (if one was provided)
  return generateProjectGlobal(config, ctx, publicPath).then(globalJsContent => {
    return Promise.all([
      generateCore(config, globalJsContent, publicPath),
      generateCoreEs5(config, globalJsContent, publicPath)
    ]);

  }).then(results => {
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
    return generateLoader(config, projectCoreFileName, projectCoreEs5FileName, publicPath, projectRegistry.components).then(loaderContent => {
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



export function getRegistryJsonFilePath(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.buildDir, `${config.namespace.toLowerCase()}.registry.json`));
}


export function getProjectBuildDir(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.buildDir, config.namespace.toLowerCase()));
}


export function getProjectPublicPath(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.publicPath, config.namespace.toLowerCase()));
}
