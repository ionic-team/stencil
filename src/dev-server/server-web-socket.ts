import * as d from '../declarations';
import * as http from 'http';


const WebSocket: d.DevServerSocketConstructor = require('faye-websocket');


export function createWebSocketServer(devServerContext: d.DevServerContext, httpServer: http.Server) {
  httpServer.on('upgrade', (request: any, socket: any, body: any) => {
    if (WebSocket.isWebSocket(request)) {
      onWebSocketUpgrade(devServerContext, request, socket, body);
    }
  });

  function onMessageFromCli(msg: d.DevServerMessage) {
    // the server process has received a message from the cli's main thread
    // pass it to the server's web socket to send to the browser
    if (devServerContext.webSocketServer) {
      devServerContext.webSocketServer.send(JSON.stringify(msg));
    }
  }

  process.addListener('message', onMessageFromCli);
}


function onWebSocketUpgrade(devServerContext: d.DevServerContext, request: any, socket: any, body: any) {
  const webSocketServer = new WebSocket(request, socket, body, ['xmpp']);

  devServerContext.webSocketServer = webSocketServer;

  webSocketServer.on('message', (event: any) => {
    // the server process has received a message from the browser
    // pass the message received from the browser to the main cli process
    process.send(JSON.parse(event.data));
  });
}
