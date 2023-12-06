import fs from 'graceful-fs';
import path from 'path';
import { createTerminalLogger } from './terminal-logger';
/**
 * Create a logger to run in a Node environment
 *
 * @returns the created logger
 */
export const createNodeLogger = () => {
    const loggerSys = createNodeLoggerSys();
    const logger = createTerminalLogger(loggerSys);
    return logger;
};
/**
 * Create a logger sys object for use in a Node.js environment
 *
 * The `TerminalLoggerSys` interface basically abstracts away some
 * environment-specific details so that the terminal logger can deal with
 * things in a (potentially) platform-agnostic way.
 *
 * @returns a configured logger sys object
 */
export function createNodeLoggerSys() {
    const cwd = () => process.cwd();
    const emoji = (emoji) => (process.platform !== 'win32' ? emoji : '');
    /**
     * Get the number of columns for the terminal to use when printing
     * @returns the number of columns to use
     */
    const getColumns = () => {
        var _a, _b;
        const min_columns = 60;
        const max_columns = 120;
        const defaultWidth = 80;
        const terminalWidth = (_b = (_a = process === null || process === void 0 ? void 0 : process.stdout) === null || _a === void 0 ? void 0 : _a.columns) !== null && _b !== void 0 ? _b : defaultWidth;
        return Math.max(Math.min(terminalWidth, max_columns), min_columns);
    };
    const memoryUsage = () => process.memoryUsage().rss;
    const relativePath = (from, to) => path.relative(from, to);
    const writeLogs = (logFilePath, log, append) => {
        if (append) {
            try {
                fs.accessSync(logFilePath);
            }
            catch (e) {
                append = false;
            }
        }
        if (append) {
            fs.appendFileSync(logFilePath, log);
        }
        else {
            fs.writeFileSync(logFilePath, log);
        }
    };
    const createLineUpdater = async () => {
        const readline = await import('readline');
        let promise = Promise.resolve();
        const update = (text) => {
            text = text.substring(0, process.stdout.columns - 5) + '\x1b[0m';
            return (promise = promise.then(() => {
                return new Promise((resolve) => {
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0, null);
                    process.stdout.write(text, resolve);
                });
            }));
        };
        const stop = () => {
            return update('\x1B[?25h');
        };
        // hide cursor
        process.stdout.write('\x1B[?25l');
        return {
            update,
            stop,
        };
    };
    return {
        cwd,
        emoji,
        getColumns,
        memoryUsage,
        relativePath,
        writeLogs,
        createLineUpdater,
    };
}
//# sourceMappingURL=index.js.map