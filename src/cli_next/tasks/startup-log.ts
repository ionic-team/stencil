import * as d from '../../declarations';
import { compilerBuild } from '../../version';
import os from 'os';


export function startupLog(prcs: NodeJS.Process, config: d.Config) {
  if (config.suppressLogs === true) {
    return;
  }

  const logger = config.logger;
  const isDebug = logger.level === 'debug';
  const version = compilerBuild.stencilVersion;
  const isPrerelease = version.includes('-');
  const isDevBuild = version.includes('-dev.');

  let startupMsg = logger.cyan(`@stencil/core`);

  if (isDevBuild) {
    startupMsg += ' ' + logger.yellow('[DEV]');
  } else {
    startupMsg += ' ' + logger.cyan(`v${version}`);
  }

  startupMsg += ' ' + logger.magenta('[NEXT]');

  if (prcs.platform !== 'win32') {
    startupMsg += ' ' + compilerBuild.vermoji;
  }

  logger.info(startupMsg);

  if (isPrerelease && !isDevBuild) {
    logger.warn(logger.yellow(`This is a prerelease build, undocumented changes might happen at any time. Technical support is not available for prereleases, but any assistance testing is appreciated.`));
  }

  if (config.devMode && !isDebug) {
    if (config.buildEs5) {
      logger.warn(`Generating ES5 during development is a very task expensive, initial and incremental builds will be much slower. Drop the '--es5' flag and use a modern browser for development.
      If you need ESM output, use the '--esm' flag instead.`);
    }

    if (!config.enableCache) {
      logger.warn(`Disabling cache during development will slow down incremental builds.`);
    }
  }

  try {
    const cpus = os.cpus();
    const platformInfo = `${prcs.platform}, ${cpus[0].model}`;
    const statsInfo = `cpus: ${cpus.length}, freemem: ${Math.round(os.freemem() / 1000000)}MB, totalmem: ${Math.round(os.totalmem() / 1000000)}MB`;

    if (isDebug) {
      logger.debug(platformInfo);
      logger.debug(statsInfo);

    } else if (config.flags && config.flags.ci) {
      logger.info(platformInfo);
      logger.info(statsInfo);
    }

    logger.debug(`node ${prcs.version}`);
    logger.debug(`compiler: ${config.sys_next.getCompilerExecutingPath()}`);
    logger.debug(`build: ${compilerBuild.buildId}`);

  } catch (e) {
    logger.warn(e);
  }
}
