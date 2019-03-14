import * as d from '../declarations';
import { createHttpServer } from './server-http';
import { createWebSocket } from './server-web-socket';
import { DEV_SERVER_INIT_URL, getBrowserUrl, sendError, sendMsg } from './util';
import { getEditors } from './open-in-editor';
import exit from 'exit';


export async function startDevServerWorker(process: NodeJS.Process, devServerConfig: d.DevServerConfig, fs: d.FileSystem) {
  try {
    const destroys: d.DevServerDestroy[] = [];

    devServerConfig.editors = await getEditors();

    // create the http server listening for and responding to requests from the browser
    let httpServer = await createHttpServer(devServerConfig, fs, destroys);

    // upgrade web socket requests the server receives
    createWebSocket(process, httpServer, destroys);

    // start listening!
    httpServer.listen(devServerConfig.port, devServerConfig.address);

    // have the server worker send a message to the main cli
    // process that the server has successfully started up
    sendMsg(process, {
      serverStated: {
        browserUrl: getBrowserUrl(devServerConfig.protocol, devServerConfig.address, devServerConfig.port, devServerConfig.baseUrl, '/'),
        initialLoadUrl: getBrowserUrl(devServerConfig.protocol, devServerConfig.address, devServerConfig.port, devServerConfig.baseUrl, devServerConfig.initialLoadUrl || DEV_SERVER_INIT_URL)
      }
    });

    function closeServer() {
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

      process.removeAllListeners('message');
    }

    process.once('SIGINT', closeServer);

  } catch (e) {
    sendError(process, e);
  }
}
