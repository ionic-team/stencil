import * as d from '../declarations';
import { sendMsg } from './dev-server-utils';


/**
 * NODE ONLY!
 * NOTE! this method is still apart of the main bundle
 * it is not apart of the dev-server/index.js bundle
 */

export async function startDevServerMain(config: d.Config, compilerCtx: d.CompilerCtx) {
  const fork = require('child_process').fork;

  // using the path stuff below because after the the bundles are created
  // then these files are no longer relative to how they are in the src directory
  config.devServer.devServerDir = config.sys.path.join(__dirname, '..', 'dev-server');

  // get the path of the dev server module
  const program = require.resolve(config.sys.path.join(config.devServer.devServerDir, 'index.js'));

  const args: string[] = [];

  const filteredExecArgs = process.execArgv.filter(
    v => !/^--(debug|inspect)/.test(v)
  );

  const options = {
    execArgv: filteredExecArgs,
    env: process.env,
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  };

  // start a new child process of the CLI process
  // for the http and web socket server
  const serverProcess = fork(program, args, options);

  const devServerConfig = await startServer(config, compilerCtx, serverProcess);

  const devServer: d.DevServer = {
    browserUrl: devServerConfig.browserUrl,
    close: () => {
      try {
        serverProcess.kill('SIGINT');
        config.logger.debug(`dev server closed`);
      } catch (e) {}
      return Promise.resolve();
    }
  };

  return devServer;
}


function startServer(config: d.Config, compilerCtx: d.CompilerCtx, serverProcess: NodeJS.Process) {
  return new Promise<d.DevServerConfig>((resolve, reject) => {
    serverProcess.stdout.on('data', (data: any) => {
      // the child server process has console logged data
      config.logger.debug(`dev server: ${data}`);
    });

    serverProcess.stderr.on('data', (data: any) => {
      // the child server process has console logged an error
      reject(`dev server error: ${data}`);
    });

    serverProcess.on('message', (msg: d.DevServerMessage) => {
      // main process has received a message from the child server process
      mainReceivedMessageFromWorker(config, compilerCtx, serverProcess, msg, resolve);
    });

    compilerCtx.events.subscribe('buildFinish', buildResults => {
      // a compiler build has finished
      // send the build results to the child server process
      const msg: d.DevServerMessage = {
        buildResults: Object.assign({}, buildResults)
      };
      delete msg.buildResults.entries;
      delete msg.buildResults.components;

      sendMsg(serverProcess, msg);
    });

    compilerCtx.events.subscribe('buildLog', buildLog => {
      const msg: d.DevServerMessage = {
        buildLog: Object.assign({}, buildLog)
      };

      sendMsg(serverProcess, msg);
    });

    // have the main process send a message to the child server process
    // to start the http and web socket server
    sendMsg(serverProcess, {
      startServer: config.devServer
    });

    return config.devServer;
  });
}


function mainReceivedMessageFromWorker(config: d.Config, compilerCtx: d.CompilerCtx, serverProcess: any, msg: d.DevServerMessage, resolve: (devServerConfig: any) => void) {
  if (msg.serverStated) {
    // received a message from the child process that the server has successfully started
    if (config.devServer.openBrowser && msg.serverStated.initialLoadUrl) {
      config.sys.open(msg.serverStated.initialLoadUrl);
    }

    // resolve that everything is good to go
    resolve(msg.serverStated);
    return;
  }

  if (msg.requestBuildResults) {
    // we received a request to send up the latest build results
    if (compilerCtx.lastBuildResults != null) {
      // we do have build results, so let's send them to the child process
      // but don't send any previous live reload data
      const msg: d.DevServerMessage = {
        buildResults: Object.assign({}, compilerCtx.lastBuildResults),
        isActivelyBuilding: compilerCtx.isActivelyBuilding
      };
      delete msg.buildResults.hmr;
      delete msg.buildResults.entries;
      delete msg.buildResults.components;

      serverProcess.send(msg);

    } else {
      const msg: d.DevServerMessage = {
        isActivelyBuilding: compilerCtx.isActivelyBuilding
      };
      serverProcess.send(msg);
    }
    return;
  }

  if (msg.error) {
    // received a message from the child process that is an error
    config.logger.error(msg.error.message);
    config.logger.debug(msg.error);
    return;
  }

  if (msg.requestLog) {
    const req = msg.requestLog;
    const logger = config.logger;

    let status: any;
    if (req.status >= 400) {
      status = logger.red(req.method);
    } else if (req.status >= 300) {
      status = logger.magenta(req.method);
    } else {
      status = logger.cyan(req.method);
    }

    logger.info(logger.dim(`${status} ${req.url}`));
    return;
  }
}

