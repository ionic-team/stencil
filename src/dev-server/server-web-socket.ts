import * as d from '../declarations';
import * as http from 'http';


const WebSocket: d.DevServerSocketConstructor = require('faye-websocket');


export function createWebSocketServer(server: http.Server) {
  server.on('upgrade', (request: any, socket: any, body: any) => {
    if (WebSocket.isWebSocket(request)) {
      onWebSocketUpgrade(request, socket, body);
    }
  });
}


function onWebSocketUpgrade(request: any, socket: any, body: any) {
  let serverWs = new WebSocket(request, socket, body, ['xmpp']);

  function onMessageFromCli(msg: d.DevServerMessage) {
    // the server process has received a message from the cli's main thread
    // pass it to the server's web socket to send to the browser
    if (serverWs) {
      serverWs.send(JSON.stringify(msg));
    }
  }

  serverWs.on('message', (event: any) => {
    // the server process has received a message from the browser
    // pass the message received from the browser to the main cli process
    process.send(JSON.parse(event.data));
  });

  serverWs.on('close', () => {
    // the server web socket has closed
    process.removeListener('message', onMessageFromCli);
    serverWs = null;
  });

  process.addListener('message', onMessageFromCli);

  process.once('SIGINT', () => {
    serverWs && serverWs.close(1000);
  });
}
