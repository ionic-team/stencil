import * as d from '../declarations';
import { createHttpServer } from './server-http';
import { initWebSocketUpgrads } from './server-web-socket';
import { findClosestOpenPort } from './find-closest-port';
import { UNREGISTER_SW_URL, getBrowserUrl, sendError, sendMsg } from './util';


export async function startDevServerWorker(devServerConfig: d.DevServerConfig, fs: d.FileSystem) {
  try {
    // create the context object that'll be reused throughout the server
    const devServerContext: d.DevServerContext = {
      httpServer: null,
      wsConnections: []
    };

    // figure out the port to be listening on
    // by figuring out the first one available
    devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);

    // create the http server listening for and responding to requests from the browser
    const httpServer = await createHttpServer(devServerConfig, devServerContext, fs);

    // upgrade any web socket requests the server receives
    initWebSocketUpgrads(devServerContext, httpServer);

    // start listening!
    httpServer.listen(devServerConfig.port, devServerConfig.address);

    // have the server worker send a message to the main cli
    // process that the server has successfully started up
    sendMsg(process, {
      serverStated: {
        browserUrl: getBrowserUrl(devServerConfig),
        initialLoadUrl: getBrowserUrl(devServerConfig, UNREGISTER_SW_URL)
      }
    });

    function onMessageFromCli(msg: d.DevServerMessage) {
      // the server process has received a message from the cli's main thread
      // pass the data to each web socket for each browser connect
      if (devServerContext.wsConnections) {
        devServerContext.wsConnections.forEach(webSocket => {
          webSocket.send(JSON.stringify(msg));
        });
      }
    }

    function onSigInt() {
      // probably recived a SIGINT message from the parent cli process
      // let's do our best to gracefully close everything down first
      if (devServerContext.wsConnections) {
        // close every web socket connection we have open
        devServerContext.wsConnections.forEach(webSocket => {
          webSocket.close(1000);
        });
        devServerContext.wsConnections.length = 0;
      }

      if (devServerContext.httpServer) {
        // close the http server
        devServerContext.httpServer.close();
        devServerContext.httpServer = null;
      }
    }

    // add our listeners to this worker process
    process.addListener('message', onMessageFromCli);
    process.once('SIGINT', onSigInt);

  } catch (e) {
    sendError(process, e);
  }
}
