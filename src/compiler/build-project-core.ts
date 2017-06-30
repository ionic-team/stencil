import { BuildConfig } from '../util/interfaces';
import { writeFile } from './util';


export function generateProjectCore(buildConfig: BuildConfig, projectComponentRegistry: string) {
  buildConfig.logger.debug(`build, generateProjectCore: ${buildConfig.namespace}`);

  const promises: Promise<any>[] = [
    generateCore(buildConfig, false),
    generateLoader(buildConfig, projectComponentRegistry)
  ];

  if (!buildConfig.isDevMode) {
    // only do the es5 version in prod mode
    generateCore(buildConfig, true);
  }

  return Promise.all(promises);
}


function generateLoader(buildConfig: BuildConfig, projectComponentRegistry: string) {
  const sys = buildConfig.sys;

  const projectLoaderFileName = `${buildConfig.namespace.toLowerCase()}.js`;
  const projectLoaderFilePath = sys.path.join(buildConfig.destDir, projectLoaderFileName);

  return sys.getClientCoreFile({ staticName: STENCIL_LOADER_NAME, devMode: buildConfig.isDevMode }).then(stencilLoaderContent => {
    // replace the default loader with the project's namespace and components
    stencilLoaderContent = stencilLoaderContent.replace(
      STENCIL_PROJECT_REGEX,
      `"${buildConfig.namespace}",${projectComponentRegistry}`
    );

    // concat the projects loader code
    const projectCode: string[] = [
      generateBanner(buildConfig),
      stencilLoaderContent
    ];

    buildConfig.logger.debug(`build, writing: ${projectLoaderFilePath}`);

    return writeFile(sys, projectLoaderFilePath, projectCode.join(''));
  });
}


function generateCore(buildConfig: BuildConfig, es5: boolean) {
  const sys = buildConfig.sys;

  let projectLoaderFileName = `${buildConfig.namespace.toLowerCase()}.core`;
  if (es5) {
    projectLoaderFileName += '.es5';
  }
  projectLoaderFileName += '.js';

  const projectLoaderFilePath = sys.path.join(buildConfig.destDir, projectLoaderFileName);

  return sys.getClientCoreFile({ staticName: STENCIL_CORE_NAME, devMode: buildConfig.isDevMode, es5: es5 }).then(stencilCoreContent => {
    // replace the default core with the project's namespace
    stencilCoreContent = stencilCoreContent.replace(
      STENCIL_PROJECT_REGEX,
      `"${buildConfig.namespace}"`
    );

    // concat the projects core code
    const projectCode: string[] = [
      generateBanner(buildConfig),
      stencilCoreContent
    ];

    buildConfig.logger.debug(`build, writing: ${projectLoaderFilePath}`);

    return writeFile(sys, projectLoaderFilePath, projectCode.join(''));
  });
}


function generateBanner(buildConfig: BuildConfig) {
  let preamble: string[] = [];

  if (buildConfig.preamble) {
    preamble = buildConfig.preamble.split('\n');
  }

  preamble.push(STENCIL_BANNER);

  preamble = preamble.map(l => ` * ${l}`);

  preamble.unshift(`/*!`);
  preamble.push(` */\n`);

  return preamble.join('\n');
}


const STENCIL_CORE_NAME = 'core';
const STENCIL_LOADER_NAME = 'loader';
const STENCIL_BANNER = `Built with https://stenciljs.com`;
const STENCIL_PROJECT_REGEX = /["']__STENCIL__APP__['"]/g;
