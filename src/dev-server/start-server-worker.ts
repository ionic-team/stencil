import * as d from '../declarations';
import { createHttpServer } from './server-http';
import { createWebSocketServer } from './server-web-socket';
import { findClosestOpenPort } from './find-closest-port';
import { UNREGISTER_SW_URL, getBrowserUrl, sendError, sendMsg } from './util';


export async function startDevServerWorker(devServerConfig: d.DevServerConfig, fs: d.FileSystem) {
  try {
    devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);

    const server = await createHttpServer(devServerConfig, fs);

    createWebSocketServer(server);

    server.listen(devServerConfig.port, devServerConfig.address);

    sendMsg(process, {
      serverStated: {
        browserUrl: getBrowserUrl(devServerConfig),
        initialLoadUrl: getBrowserUrl(devServerConfig, UNREGISTER_SW_URL)
      }
    });

    process.once('SIGINT', () => {
      server.close();
    });

  } catch (e) {
    sendError(process, e);
  }
}
