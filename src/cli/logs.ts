import type { Config, Logger, ConfigFlags, CompilerSystem } from '../declarations';
import type { CoreCompiler } from './load-compiler';
import { version, vermoji } from '../version';

export const startupLog = (logger: Logger, flags: ConfigFlags) => {
  if (flags.task === 'info' || flags.task === 'serve') {
    return;
  }

  const isDevBuild = version.includes('-dev.');

  let startupMsg = logger.cyan(`@stencil/core`);

  if (isDevBuild) {
    startupMsg += ' ' + logger.yellow('[LOCAL DEV]');
  } else {
    startupMsg += ' ' + logger.cyan(`v${version}`);
  }
  startupMsg += logger.emoji(' ' + vermoji);

  logger.info(startupMsg);
};

export const loadedCompilerLog = (sys: CompilerSystem, logger: Logger, flags: ConfigFlags, coreCompiler: CoreCompiler) => {
  const sysDetails = sys.details;
  const runtimeInfo = `${sys.name} ${sys.version}`;
  const platformInfo = `${sysDetails.platform}, ${sysDetails.cpuModel}`;
  const statsInfo = `cpus: ${sys.hardwareConcurrency}, freemem: ${Math.round(sysDetails.freemem() / 1000000)}MB, totalmem: ${Math.round(sysDetails.totalmem / 1000000)}MB`;

  if (logger.getLevel() === 'debug') {
    logger.debug(runtimeInfo);
    logger.debug(platformInfo);
    logger.debug(statsInfo);
    logger.debug(`compiler: ${sys.getCompilerExecutingPath()}`);
    logger.debug(`build: ${coreCompiler.buildId}`);
  } else if (flags.ci) {
    logger.info(runtimeInfo);
    logger.info(platformInfo);
    logger.info(statsInfo);
  }
};

export const startupCompilerLog = (coreCompiler: CoreCompiler, config: Config) => {
  if (config.suppressLogs === true) {
    return;
  }

  const { logger } = config;
  const isDebug = logger.getLevel() === 'debug';
  const isPrerelease = coreCompiler.version.includes('-');
  const isDevBuild = coreCompiler.version.includes('-dev.');

  if (isPrerelease && !isDevBuild) {
    logger.warn(
      logger.yellow(
        `This is a prerelease build, undocumented changes might happen at any time. Technical support is not available for prereleases, but any assistance testing is appreciated.`,
      ),
    );
  }

  if (config.devMode && !isDebug) {
    if (config.buildEs5) {
      logger.warn(
        `Generating ES5 during development is a very task expensive, initial and incremental builds will be much slower. Drop the '--es5' flag and use a modern browser for development.`,
      );
    }

    if (!config.enableCache) {
      logger.warn(`Disabling cache during development will slow down incremental builds.`);
    }
  }
};
