import type * as d from '../declarations';
import type { Server } from 'http';
import { createHttpServer, findClosestOpenPort } from './server-http';
import { createNodeSys } from '@sys-api-node';
import { createWebSocket, DevWebSocket } from './server-web-socket';
import { DEV_SERVER_INIT_URL } from './dev-server-constants';
import { getBrowserUrl } from './dev-server-utils';
import { normalizePath } from '@utils';
import { openInBrowser } from './open-in-browser';
import { serveCompilerResponse } from './serve-compiler-request';

export function initServerProcess(sendMsg: (msg: d.DevServerMessage) => void) {
  let devServerConfig: d.DevServerConfig = null;
  let server: Server = null;
  let webSocket: DevWebSocket = null;

  let sys = createNodeSys({ process });

  const startServer = async (msg: d.DevServerMessage) => {
    devServerConfig = msg.startServer;
    devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);
    devServerConfig.browserUrl = getBrowserUrl(
      devServerConfig.protocol,
      devServerConfig.address,
      devServerConfig.port,
      devServerConfig.basePath,
      '/',
    );
    devServerConfig.root = normalizePath(devServerConfig.root);

    server = createHttpServer(devServerConfig, sys, sendMsg);

    webSocket = devServerConfig.websocket ? createWebSocket(server, sendMsg) : null;

    server.listen(devServerConfig.port, devServerConfig.address);

    if (devServerConfig.openBrowser) {
      const initialLoadUrl = getBrowserUrl(
        devServerConfig.protocol,
        devServerConfig.address,
        devServerConfig.port,
        devServerConfig.basePath,
        devServerConfig.initialLoadUrl || DEV_SERVER_INIT_URL,
      );
      openInBrowser({ url: initialLoadUrl });
    }

    sendMsg({ serverStarted: devServerConfig });
  };

  const closeServer = () => {
    const promises: Promise<any>[] = [];
    devServerConfig = null;
    if (sys) {
      promises.push(sys.destroy());
      sys = null;
    }
    if (webSocket) {
      promises.push(webSocket.close());
      webSocket = null;
    }
    if (server) {
      promises.push(
        new Promise(resolve => {
          server.close(resolve);
        }),
      );
      server = null;
    }
    Promise.all(promises).finally(() => {
      sendMsg({
        serverClosed: true,
      });
    });
  };

  const receiveMessage = (msg: d.DevServerMessage) => {
    try {
      if (msg.startServer) {
        startServer(msg);
      } else if (msg.closeServer) {
        closeServer();
      } else if (msg.compilerRequestResults) {
        serveCompilerResponse(devServerConfig, msg.compilerRequestResults, sendMsg);
      } else {
        if (webSocket && devServerConfig) {
          webSocket.sendToBrowser(msg);
        }
      }
    } catch (e) {
      sendMsg({
        error: { message: e + '', stack: e?.stack ? e.stack : null },
      });
    }
  };

  return receiveMessage;
}
