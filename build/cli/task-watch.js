import { printCheckVersionResults, startCheckVersion } from './check-version';
import { startupCompilerLog } from './logs';
export const taskWatch = async (coreCompiler, config) => {
    let devServer = null;
    let exitCode = 0;
    try {
        startupCompilerLog(coreCompiler, config);
        const versionChecker = startCheckVersion(config, coreCompiler.version);
        const compiler = await coreCompiler.createCompiler(config);
        const watcher = await compiler.createWatcher();
        if (config.flags.serve) {
            const devServerPath = config.sys.getDevServerExecutingPath();
            const { start } = await config.sys.dynamicImport(devServerPath);
            devServer = await start(config.devServer, config.logger, watcher);
        }
        config.sys.onProcessInterrupt(() => {
            config.logger.debug(`close watch`);
            compiler && compiler.destroy();
        });
        const rmVersionCheckerLog = watcher.on('buildFinish', async () => {
            // log the version check one time
            rmVersionCheckerLog();
            printCheckVersionResults(versionChecker);
        });
        if (devServer) {
            const rmDevServerLog = watcher.on('buildFinish', () => {
                var _a;
                // log the dev server url one time
                rmDevServerLog();
                const url = (_a = devServer === null || devServer === void 0 ? void 0 : devServer.browserUrl) !== null && _a !== void 0 ? _a : 'UNKNOWN URL';
                config.logger.info(`${config.logger.cyan(url)}\n`);
            });
        }
        const closeResults = await watcher.start();
        if (closeResults.exitCode > 0) {
            exitCode = closeResults.exitCode;
        }
    }
    catch (e) {
        exitCode = 1;
        config.logger.error(e);
    }
    if (devServer) {
        await devServer.close();
    }
    if (exitCode > 0) {
        return config.sys.exit(exitCode);
    }
};
//# sourceMappingURL=task-watch.js.map