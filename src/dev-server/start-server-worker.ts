import * as d from '../declarations';
import { createHttpServer } from './server-http';
import { createWebSocketServer } from './server-web-socket';
import { findClosestOpenPort } from './find-closest-port';
import { UNREGISTER_SW_URL, getBrowserUrl, sendError, sendMsg } from './util';


export async function startDevServerWorker(devServerConfig: d.DevServerConfig, fs: d.FileSystem) {
  try {
    devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);

    const serverCtx: d.DevServerContext = {};

    const httpServer = await createHttpServer(devServerConfig, serverCtx, fs);

    createWebSocketServer(serverCtx, httpServer);

    httpServer.listen(devServerConfig.port, devServerConfig.address);

    sendMsg(process, {
      serverStated: {
        browserUrl: getBrowserUrl(devServerConfig),
        initialLoadUrl: getBrowserUrl(devServerConfig, UNREGISTER_SW_URL)
      }
    });

    process.once('SIGINT', () => {
      if (serverCtx.webSocketServer) {
        serverCtx.webSocketServer.close(1000);
        serverCtx.webSocketServer = null;
      }
      if (serverCtx.httpServer) {
        serverCtx.httpServer.close();
        serverCtx.httpServer = null;
      }
    });

  } catch (e) {
    sendError(process, e);
  }
}
