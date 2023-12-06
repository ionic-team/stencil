import { Logger, LoggerLineUpdater, LogLevel } from '../../../declarations';
/**
 * Create a logger for outputting information to a terminal environment
 * @param loggerSys an underlying logger system entity used to create the terminal logger
 * @returns the created logger
 */
export declare const createTerminalLogger: (loggerSys: TerminalLoggerSys) => Logger;
export interface TerminalLoggerSys {
    emoji: (msg: string) => string;
    cwd: () => string;
    getColumns: () => number;
    memoryUsage: () => number;
    relativePath: (from: string, to: string) => string;
    writeLogs: (logFilePath: string, log: string, append: boolean) => void;
    createLineUpdater: () => Promise<LoggerLineUpdater>;
}
/**
 * Helper function to determine, based on the current log level setting, whether
 * a message at a given log level should be logged or not.
 *
 * @param currentSetting the current log level setting
 * @param messageLevel the log level to check
 * @returns whether we should log or not!
 */
export declare const shouldLog: (currentSetting: LogLevel, messageLevel: LogLevel) => boolean;
/**
 * Helper function for word wrapping
 * @param msg the message to wrap
 * @param columns the maximum number of columns to occupy per line
 * @returns the wrapped message
 */
export declare const wordWrap: (msg: any[], columns: number) => string[];
