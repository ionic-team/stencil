import * as d from '../declarations';
import * as http from 'http';


const WebSocket: d.DevServerSocketConstructor = require('../sys/node/faye-websocket').fayeWebSocket;


export function initWebSocketUpgrads(devServerContext: d.DevServerContext, httpServer: http.Server) {
  httpServer.on('upgrade', (request: any, socket: any, body: any) => {
    if (WebSocket.isWebSocket(request)) {
      onWebSocketConnection(devServerContext, request, socket, body);
    }
  });
}


function onWebSocketConnection(devServerContext: d.DevServerContext, request: any, socket: any, body: any) {
  const webSocket = new WebSocket(request, socket, body, ['xmpp']);

  webSocket.on('message', (ev: any) => {
    // the server process has received a message from the browser
    // pass the message received from the browser to the main cli process
    process.send(JSON.parse(ev.data));
  });

  devServerContext.wsConnections.push(webSocket);
}
