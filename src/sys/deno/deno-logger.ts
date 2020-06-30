import { createTerminalLogger, ColorType, TerminalLoggerSys } from '../../compiler/sys/logger/terminal-logger';
import { bgRed, blue, bold, cyan, dim, gray, green, magenta, red, yellow } from './deps';
import type { Deno as DenoTypes } from '../../../types/lib.deno';

export const createDenoLogger = (c: { Deno: any }) => {
  let useColors = true;
  const deno: typeof DenoTypes = c.Deno;
  const minColumns = 60;
  const maxColumns = 120;

  const color = (msg: string, colorType: ColorType) => {
    if (useColors && !deno.noColor) {
      switch (colorType) {
        case 'bgRed':
          return bgRed(msg);
        case 'blue':
          return blue(msg);
        case 'bold':
          return bold(msg);
        case 'cyan':
          return cyan(msg);
        case 'dim':
          return dim(msg);
        case 'gray':
          return gray(msg);
        case 'green':
          return green(msg);
        case 'magenta':
          return magenta(msg);
        case 'red':
          return red(msg);
        case 'yellow':
          return yellow(msg);
      }
    }
    return msg;
  };

  const cwd = () => deno.cwd();

  const emoji = (e: string) => (deno.build.os !== 'windows' ? e : '');

  const enableColors = (enableClrs: boolean) => (useColors = enableClrs);

  const getColumns = () => {
    const terminalWidth = (deno.stdout && (deno.stdout as any).columns) || 80;
    return Math.max(Math.min(maxColumns, terminalWidth), minColumns);
  };

  const memoryUsage = () => -1;

  const relativePath = (_from: string, to: string) => to;

  const writeLogs = (logFilePath: string, log: string, append: boolean) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(log);
    deno.writeFileSync(logFilePath, data, { append });
  };

  const loggerSys: TerminalLoggerSys = {
    color,
    cwd,
    emoji,
    enableColors,
    getColumns,
    memoryUsage,
    relativePath,
    writeLogs,
  };

  return createTerminalLogger(loggerSys);
};
