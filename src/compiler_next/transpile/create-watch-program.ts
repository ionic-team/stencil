import * as d from '../../declarations';
import { TSCONFIG_NAME_FALLBACK, getTsConfigFallback, getTsOptionsToExtend } from './ts-config';
import path from 'path';
import ts from 'typescript';


export const createTsWatchProgram = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCallback: (tsBuilder: ts.BuilderProgram) => Promise<void>) => {
  let isRunning = false;

  const optionsToExtend = getTsOptionsToExtend(config);

  const tsWatchSys: ts.System = {
    ...ts.sys,

    setTimeout(callback, time) {
      const id = setInterval(() => {
        if (!isRunning) {
          callback();
          clearInterval(id);
        }
      }, config.sys_next.fileWatchTimeout || time);
      return id;
    },

    clearTimeout(id) {
      return clearInterval(id);
    }
  };

  // TODO: it should error?
  if (config.tsconfig == null) {
    config.tsconfig = path.join(config.rootDir, TSCONFIG_NAME_FALLBACK);
    const tsConfig = JSON.stringify(getTsConfigFallback(config), null, 2);
    await compilerCtx.fs.writeFile(config.tsconfig, tsConfig, { immediateWrite: true });
  }

  const tsWatchHost = ts.createWatchCompilerHost(
    config.tsconfig,
    optionsToExtend,
    tsWatchSys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    (reportDiagnostic) => {
      config.logger.debug('watch reportDiagnostic:' + reportDiagnostic.messageText);
    },
    (reportWatchStatus) => {
      config.logger.debug(reportWatchStatus.messageText);
    }
  );

  tsWatchHost.afterProgramCreate = async (tsBuilder) => {
    isRunning = true;
    await buildCallback(tsBuilder);
    isRunning = false;
  };

  return ts.createWatchProgram(tsWatchHost);
};
