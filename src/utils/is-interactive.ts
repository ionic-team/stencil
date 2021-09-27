import type * as d from '../declarations';

export declare const TERMINAL_INFO: d.TerminalInfo;

export const isInteractive = (sys: d.CompilerSystem, config: d.Config, object?: d.TerminalInfo): boolean => {
  const terminalInfo =
    object ||
    Object.freeze({
      tty: sys.isTTY() ? true : false,
      ci:
        ['CI', 'BUILD_ID', 'BUILD_NUMBER', 'BITBUCKET_COMMIT', 'CODEBUILD_BUILD_ARN'].filter(
          (v) => !!sys.getEnvironmentVar(v)
        ).length > 0 || !!config.flags?.ci,
    });

  return terminalInfo.tty && !terminalInfo.ci;
};
