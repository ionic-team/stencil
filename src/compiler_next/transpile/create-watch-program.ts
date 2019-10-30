import * as d from '../../declarations';
import { getTsOptionsToExtend } from './ts-config';
import ts from 'typescript';


export const createTsWatchProgram = async (config: d.Config, buildCallback: (tsBuilder: ts.BuilderProgram) => Promise<void>) => {
  let isRunning = false;
  let timeoutId: any;

  const optionsToExtend = getTsOptionsToExtend(config);

  const tsWatchSys: ts.System = {
    ...ts.sys,

    setTimeout(callback, time) {
      timeoutId = setInterval(() => {
        if (!isRunning) {
          callback();
          clearInterval(timeoutId);
        }
      }, config.sys_next.fileWatchTimeout || time);
      return timeoutId;
    },

    clearTimeout(id) {
      return clearInterval(id);
    }
  };

  config.sys_next.addDestory(() => tsWatchSys.clearTimeout(timeoutId));

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
