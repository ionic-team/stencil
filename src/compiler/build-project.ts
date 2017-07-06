import { BuildConfig, LoadComponentRegistry } from '../util/interfaces';
import { BuildContext } from './interfaces';


export function generateProjectFiles(buildConfig: BuildConfig, ctx: BuildContext, componentRegistry: LoadComponentRegistry[]) {
  buildConfig.logger.debug(`build, generateProjectFiles: ${buildConfig.namespace}`);

  const promises: Promise<any>[] = [
    generateCore(buildConfig, ctx, false),
    generateLoader(buildConfig, ctx, componentRegistry)
  ];

  if (!buildConfig.devMode) {
    // don't bother with es5 mode in dev mode
    // also no need to wait on it to finish
    generateCore(buildConfig, ctx, true);
  }

  return Promise.all(promises);
}


function generateLoader(buildConfig: BuildConfig, ctx: BuildContext, componentRegistry: LoadComponentRegistry[]) {
  const sys = buildConfig.sys;

  const projectLoaderFileName = `${buildConfig.namespace.toLowerCase()}.js`;
  const projectLoaderFilePath = sys.path.join(buildConfig.dest, projectLoaderFileName);

  return sys.getClientCoreFile({ staticName: STENCIL_LOADER_NAME, devMode: buildConfig.devMode }).then(stencilLoaderContent => {
    // replace the default loader with the project's namespace and components

    let registryStr = JSON.stringify(componentRegistry);
    if (!buildConfig.devMode) {
      const minifyResult = buildConfig.sys.minifyJs(registryStr);
      minifyResult.diagnostics.forEach(d => {
        buildConfig.logger[d.type](d.msg);
      });
      if (minifyResult.output) {
        registryStr = minifyResult.output;
      }
    }

    stencilLoaderContent = stencilLoaderContent.replace(
      STENCIL_PROJECT_REGEX,
      `"${buildConfig.namespace}",${registryStr}`
    );

    // concat the projects loader code
    const projectCode: string[] = [
      generateBanner(buildConfig),
      stencilLoaderContent
    ];

    buildConfig.logger.debug(`build, writing: ${projectLoaderFilePath}`);

    ctx.filesToWrite[projectLoaderFilePath] = projectCode.join('');
  });
}


function generateCore(buildConfig: BuildConfig, ctx: BuildContext, es5: boolean) {
  const sys = buildConfig.sys;

  let projectLoaderFileName = `${buildConfig.namespace.toLowerCase()}.core`;
  if (es5) {
    projectLoaderFileName += '.es5';
  }
  projectLoaderFileName += '.js';

  const projectLoaderFilePath = sys.path.join(buildConfig.dest, projectLoaderFileName);

  return sys.getClientCoreFile({ staticName: STENCIL_CORE_NAME, devMode: buildConfig.devMode, es5: es5 }).then(stencilCoreContent => {
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

    ctx.filesToWrite[projectLoaderFilePath] = projectCode.join('');
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
