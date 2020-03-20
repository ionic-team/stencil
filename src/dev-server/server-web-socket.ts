import * as d from '../declarations';
import * as ws from 'ws';
import * as http from 'http';
import { noop } from '@utils';

export function createWebSocket(prcs: NodeJS.Process, httpServer: http.Server, destroys: d.DevServerDestroy[]) {
  const wsConfig: ws.ServerOptions = {
    server: httpServer,
  };

  const wsServer: ws.Server = new ws.Server(wsConfig);

  function heartbeat(this: DevWS) {
    this.isAlive = true;
  }

  wsServer.on('connection', (ws: DevWS) => {
    ws.on('message', data => {
      // the server process has received a message from the browser
      // pass the message received from the browser to the main cli process
      prcs.send(JSON.parse(data.toString()));
    });

    ws.isAlive = true;

    ws.on('pong', heartbeat);
  });

  const pingInternval = setInterval(() => {
    wsServer.clients.forEach((ws: DevWS) => {
      if (!ws.isAlive) {
        return ws.close(1000);
      }

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 10000);

  function onMessageFromCli(msg: d.DevServerMessage) {
    // the server process has received a message from the cli's main thread
    // pass the data to each web socket for each browser/tab connected
    if (msg) {
      const data = JSON.stringify(msg);
      wsServer.clients.forEach(ws => {
        if (ws.readyState === ws.OPEN) {
          ws.send(data);
        }
      });
    }
  }

  prcs.addListener('message', onMessageFromCli);

  destroys.push(() => {
    clearInterval(pingInternval);

    wsServer.clients.forEach(ws => {
      ws.close(1000);
    });
  });
}

interface DevWS extends ws {
  isAlive: boolean;
}
