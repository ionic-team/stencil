import * as d from '../../declarations';
import { appReset } from './app-update';
import { DEV_SERVER_INIT_URL } from '../dev-server-utils';
import { initClientWebSocket } from './client-web-socket';


export function initClient(win: d.DevClientWindow, doc: Document, config: d.DevClientConfig) {
  try {
    if (win['s-dev-server']) {
      // somehow we've already initialized the dev server client-side script
      // don't bother doing it again (this shouldn't happen)
      return;
    }
    win['s-dev-server'] = true;

    if (isInitialDevServerLoad(win, config)) {
      win['s-initial-load'] = true;
      // this page is the initial dev server load page
      // we currently have an ugly url like /~dev-server-init
      // or something, let's quickly change that using
      // history.replaceState() and update the url to
      // what's expected like /
      // we're doing this so we can force the server
      // worker to unregister, but do not fully reload the page yet
      appReset(win, config).then(() => {
        initClientWebSocket(win, doc, config);
      });

    } else {
      initClientWebSocket(win, doc, config);
    }

  } catch (e) {
    console.error(e);
  }
}


function isInitialDevServerLoad(win: d.DevClientWindow, config: d.DevClientConfig) {
  let pathname = win.location.pathname;
  pathname = '/' + pathname.substring(config.baseUrl.length);
  return pathname === DEV_SERVER_INIT_URL;
}
