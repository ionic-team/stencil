import * as d from '../../declarations';
import { appUpdate } from './app-update';
import { logReload, logWarn } from './logger';
import { updateBuildStatus } from './build-status';


export function initClientWebSocket(win: d.DevClientWindow, doc: Document) {
  const wsUrl = getSocketUrl(win.location);
  let clientWs: WebSocket;
  let reconnectTmrId: any;
  let reconnectAttempts = 0;

  function onOpen(this: WebSocket) {
    if (reconnectAttempts > 0) {
      // we just reconnected
      // we'll request the build results and wait on its response
      updateBuildStatus(doc, 'pending');
    }

    // now that we've got a good web socket connection opened
    // let's request the latest build results if they exist
    // but if a build is still happening that's fine
    const msg: d.DevServerMessage = {
      requestBuildResults: true
    };
    this.send(JSON.stringify(msg));

    // we just connected, let's just
    // double check we don't have a reconnect queued
    clearTimeout(reconnectTmrId);
  }

  function onError() {
    // looks like we can't connect to the server
    // let's give it another shot in a few seconds
    queueReconnect();
  }

  function onClose(event: { code: number; reason: string }) {
    updateBuildStatus(doc, 'pending');

    if (event.code > NORMAL_CLOSURE_CODE) {
      // the browser's web socket has closed w/ an unexpected code
      logWarn(`Dev Server`, `web socket closed: ${event.code} ${event.reason}`);
    }

    // web socket closed, let's try to reconnect
    queueReconnect();
  }

  function onMessage(event: any) {
    // the browser's web socket received a message from the server
    const msg: d.DevServerMessage = JSON.parse(event.data);

    if (reconnectAttempts > 0 && (msg.buildResults || msg.buildResults === null)) {
      // this is from a reconnect, and we were just notified w/ build results
      // or we at least know there are was build result at all cuz it's specifically null
      // so it's probably safe to do a full page refresh
      logReload(`Reconnected to dev server`);
      win.location.reload(true);
      return;
    }

    if (msg.buildLog) {
      const statusMsg = new CustomEvent('buildLog', { detail: msg.buildLog });
      win.dispatchEvent(statusMsg);
      updateBuildStatus(doc, 'pending');
      return;
    }

    if (msg.buildResults) {
      // we just got build results from the server
      // let's update our app with the data received
      updateBuildStatus(doc, 'default');
      appUpdate(win, doc, msg.buildResults);
      return;
    }
  }

  function connect() {
    // ensure we don't have a reconnect timeout running
    clearTimeout(reconnectTmrId);

    // have the browser open a web socket with the server
    clientWs = new win.WebSocket(wsUrl, ['xmpp']);

    // add all our event listeners to our new web socket
    clientWs.addEventListener('open', onOpen);
    clientWs.addEventListener('error', onError);
    clientWs.addEventListener('close', onClose);
    clientWs.addEventListener('message', onMessage);
  }

  function queueReconnect() {
    // either it closed or was a connection error

    // let's clear out the existing web socket
    if (clientWs) {
      if (clientWs.readyState === WebSocket.OPEN || clientWs.readyState === WebSocket.CONNECTING) {
        // probably fine as is, but let's double check we're closed out
        clientWs.close();
      }

      // let's remove all the existing event listeners
      clientWs.removeEventListener('open', onOpen);
      clientWs.removeEventListener('error', onError);
      clientWs.removeEventListener('close', onClose);
      clientWs.removeEventListener('message', onMessage);
      clientWs = null;
    }

    // ensure clear out any other pending reconnect timeouts
    clearTimeout(reconnectTmrId);

    if (reconnectAttempts > RECONNECT_ATTEMPTS) {
      console.warn(`Canceling dev server reconnect attempts`);

    } else {
      // keep track how many times we tried to reconnect
      reconnectAttempts++;

      // queue up a reconnect in a few seconds
      reconnectTmrId = setTimeout(connect, RECONNECT_RETRY_MS);
    }
  }

  // let's do this!
  // try to connect up with our web socket server
  connect();
}


function getSocketUrl(location: Location) {
  return `${location.protocol === 'https:' ? `wss:` : `ws:`}//${location.hostname}:${location.port}/`;
}


const RECONNECT_ATTEMPTS = 500;
const RECONNECT_RETRY_MS = 2500;
const NORMAL_CLOSURE_CODE = 1000;
