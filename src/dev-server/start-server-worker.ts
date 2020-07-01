import * as d from '../declarations';
import { createHttpServer } from './server-http';
import { createNodeSys } from '../sys/node/node-sys';
import { createWebSocket } from './server-web-socket';
import { DEV_SERVER_INIT_URL } from './dev-server-constants';
import { getBrowserUrl, sendError, sendMsg } from './dev-server-utils';
import { getEditors } from './open-in-editor';
import exit from 'exit';

export async function startDevServerWorker(prcs: NodeJS.Process, devServerConfig: d.DevServerConfig) {
  let hasStarted = false;

  try {
    const sys = createNodeSys({ process: prcs });
    const destroys: d.DevServerDestroy[] = [];
    devServerConfig.editors = await getEditors();

    // create the http server listening for and responding to requests from the browser
    let httpServer = await createHttpServer(devServerConfig, sys, destroys);

    if (devServerConfig.websocket) {
      // upgrade web socket requests the server receives
      createWebSocket(prcs, httpServer, destroys);
    }

    // start listening!
    httpServer.listen(devServerConfig.port, devServerConfig.address);

    // have the server worker send a message to the main cli
    // process that the server has successfully started up
    sendMsg(prcs, {
      serverStarted: {
        address: devServerConfig.address,
        basePath: devServerConfig.basePath,
        browserUrl: getBrowserUrl(devServerConfig.protocol, devServerConfig.address, devServerConfig.port, devServerConfig.basePath, '/'),
        port: devServerConfig.port,
        protocol: devServerConfig.protocol,
        root: devServerConfig.root,
        initialLoadUrl: getBrowserUrl(
          devServerConfig.protocol,
          devServerConfig.address,
          devServerConfig.port,
          devServerConfig.basePath,
          devServerConfig.initialLoadUrl || DEV_SERVER_INIT_URL,
        ),
        error: null,
      },
    });
    hasStarted = true;

    const closeServer = () => {
      // probably recived a SIGINT message from the parent cli process
      // let's do our best to gracefully close everything down first
      destroys.forEach(destroy => {
        destroy();
      });

      destroys.length = 0;
      httpServer = null;

      setTimeout(() => {
        exit(0);
      }, 5000).unref();

      prcs.removeAllListeners('message');
    };

    prcs.once('SIGINT', closeServer);
  } catch (e) {
    if (!hasStarted) {
      sendMsg(prcs, {
        serverStarted: {
          address: null,
          basePath: null,
          browserUrl: null,
          initialLoadUrl: null,
          port: null,
          protocol: null,
          root: null,
          error: String(e),
        },
      });
    } else {
      sendError(prcs, e);
    }
  }
}
