import * as d from '../../declarations';
import { emitBuildLog, emitBuildResults, emitBuildStatus, logDisabled, logReload, logWarn } from '../client';

export const initClientWebSocket = (win: d.DevClientWindow, config: d.DevClientConfig) => {
  let clientWs: WebSocket;
  let reconnectTmrId: any;
  let reconnectAttempts = 0;
  let requestBuildResultsTmrId: any;
  let hasGottenBuildResults = false;
  let buildResultsRequests = 0;

  function onOpen(this: WebSocket) {
    if (reconnectAttempts > 0) {
      // we just reconnected
      // we'll request the build results and wait on its response
      emitBuildStatus(win, 'pending');
    }

    if (!hasGottenBuildResults) {
      requestBuildResultsTmrId = setInterval(() => {
        buildResultsRequests++;
        if (!hasGottenBuildResults && this.readyState === WebSocket.OPEN && buildResultsRequests < 500) {
          const msg: d.DevServerMessage = {
            requestBuildResults: true,
          };
          this.send(JSON.stringify(msg));
        } else {
          clearInterval(requestBuildResultsTmrId);
        }
      }, REQUEST_BUILD_RESULTS_INTERVAL_MS);
    }

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
    emitBuildStatus(win, 'disabled');

    if (event.code > NORMAL_CLOSURE_CODE) {
      // the browser's web socket has closed w/ an unexpected code
      logWarn(`Dev Server`, `web socket closed: ${event.code} ${event.reason}`);
    } else {
      logDisabled(`Dev Server`, `Disconnected, attempting to reconnect...`);
    }

    // web socket closed, let's try to reconnect
    queueReconnect();
  }

  function onMessage(event: any) {
    // the browser's web socket received a message from the server
    const msg: d.DevServerMessage = JSON.parse(event.data);

    if (reconnectAttempts > 0) {
      // we got a message and we know we've been trying to reconnect

      if (msg.isActivelyBuilding) {
        // looks like there's still an active build
        return;
      }

      if (msg.buildResults) {
        // this is from a reconnect, and we were just notified w/ build results
        // so it's probably best if we do a full page refresh
        logReload(`Reconnected to dev server`);
        hasGottenBuildResults = true;
        buildResultsRequests = 0;
        clearInterval(requestBuildResultsTmrId);
        win.location.reload(true);
        return;
      }
    }

    if (msg.buildLog) {
      if (msg.buildLog.progress < 1) {
        emitBuildStatus(win, 'pending');
      }

      emitBuildLog(win, msg.buildLog);
      return;
    }

    if (msg.buildResults) {
      // we just got build results from the server
      // let's update our app with the data received
      hasGottenBuildResults = true;
      buildResultsRequests = 0;
      clearInterval(requestBuildResultsTmrId);

      emitBuildStatus(win, 'default');
      emitBuildResults(win, msg.buildResults);
      return;
    }
  }

  function connect() {
    // ensure we don't have a reconnect timeout running
    clearTimeout(reconnectTmrId);

    // have the browser open a web socket with the server
    clientWs = new win.WebSocket(config.socketUrl, ['xmpp']);

    // add all our event listeners to our new web socket
    clientWs.addEventListener('open', onOpen);
    clientWs.addEventListener('error', onError);
    clientWs.addEventListener('close', onClose);
    clientWs.addEventListener('message', onMessage);
  }

  function queueReconnect() {
    // either it closed or was a connection error
    hasGottenBuildResults = false;

    // let's clear out the existing web socket
    if (clientWs) {
      if (clientWs.readyState === WebSocket.OPEN || clientWs.readyState === WebSocket.CONNECTING) {
        // probably fine as is, but let's double check we're closed out
        clientWs.close(NORMAL_CLOSURE_CODE);
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

    if (reconnectAttempts >= RECONNECT_ATTEMPTS) {
      logWarn(`Dev Server`, `Canceling reconnect attempts`);
    } else {
      // keep track how many times we tried to reconnect
      reconnectAttempts++;

      // queue up a reconnect in a few seconds
      reconnectTmrId = setTimeout(connect, RECONNECT_RETRY_MS);

      emitBuildStatus(win, 'disabled');
    }
  }

  // let's do this!
  // try to connect up with our web socket server
  connect();
};

const RECONNECT_ATTEMPTS = 1000;
const RECONNECT_RETRY_MS = 2500;
const NORMAL_CLOSURE_CODE = 1000;
const REQUEST_BUILD_RESULTS_INTERVAL_MS = 500;
