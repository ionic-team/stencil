import  * as d from '../../declarations';
import { appError, clearDevServerModal } from './app-error';
import { hmrWindow } from '../hmr-client';
import { logBuild, logReload, logWarn } from './logger';
import { onBuildResults } from './build-events';


export function initAppUpdate(win: d.DevClientWindow, doc: Document, config: d.DevClientConfig) {
  onBuildResults(win, buildResults => {
    appUpdate(win, doc, config, buildResults);
  });
}


function appUpdate(win: d.DevClientWindow, doc: Document, config: d.DevClientConfig, buildResults: d.BuildResults) {
  try {
    // remove any app errors that may already be showing
    clearDevServerModal(doc);

    if (buildResults.hasError) {
      // looks like we've got an error
      // let's show the error all pretty like
      appError(win, doc, config, buildResults);
      return;
    }

    if (win['s-initial-load']) {
      // this page is the initial dev server loading page
      // and the build has finished without errors
      // let's make sure the url is at the root
      // and we've unregistered any existing service workers
      // then let's refresh the page from the root of the server
      appReset(win, config, () => {
        logReload(`Initial load`);
        win.location.reload(true);
      });
      return;
    }

    if (buildResults.hmr) {
      appHmr(win, buildResults.hmr);
    }

  } catch (e) {
    console.error(e);
  }
}


function appHmr(win: Window, hmr: d.HotModuleReplacement) {
  let shouldWindowReload = false;

  if (hmr.reloadStrategy === 'pageReload') {
    shouldWindowReload = true;
  }

  if (hmr.indexHtmlUpdated) {
    logReload(`Updated index.html`);
    shouldWindowReload = true;
  }

  if (hmr.serviceWorkerUpdated) {
    logReload(`Updated Service Worker: sw.js`);
    shouldWindowReload = true;
  }

  if (hmr.scriptsAdded && hmr.scriptsAdded.length > 0) {
    logReload(`Added scripts: ${hmr.scriptsAdded.join(', ')}`);
    shouldWindowReload = true;
  }

  if (hmr.scriptsDeleted && hmr.scriptsDeleted.length > 0) {
    logReload(`Deleted scripts: ${hmr.scriptsDeleted.join(', ')}`);
    shouldWindowReload = true;
  }

  if (hmr.excludeHmr && hmr.excludeHmr.length > 0) {
    logReload(`Excluded From Hmr: ${hmr.excludeHmr.join(', ')}`);
    shouldWindowReload = true;
  }

  if (shouldWindowReload) {
    win.location.reload(true);
    return;
  }

  const results = hmrWindow(win, hmr);

  if (results.updatedComponents.length > 0) {
    logBuild(`Updated component${results.updatedComponents.length > 1 ? 's' : ''}: ${results.updatedComponents.join(', ')}`);
  }

  if (results.updatedInlineStyles.length > 0) {
    logBuild(`Updated styles: ${results.updatedInlineStyles.join(', ')}`);
  }

  if (results.updatedExternalStyles.length > 0) {
    logBuild(`Updated stylesheets: ${results.updatedExternalStyles.join(', ')}`);
  }

  if (results.updatedImages.length > 0) {
    logBuild(`Updated images: ${results.updatedImages.join(', ')}`);
  }
}


export function appReset(win: d.DevClientWindow, config: d.DevClientConfig, cb: () => void) {
  // we're probably at some ugly url
  // let's update the url to be the expect root url: /
  // avoiding Promise to keep things simple for our ie11 buddy
  win.history.replaceState({}, 'App', config.basePath);

  if (!win.navigator.serviceWorker || !win.navigator.serviceWorker.getRegistration) {
    cb();

  } else {
    // it's possible a service worker is already registered
    // for this localhost url from some other app's development
    // let's ensure we entirely remove the service worker for this domain
    win.navigator.serviceWorker.getRegistration().then(swRegistration => {
      if (swRegistration) {
        swRegistration.unregister().then(hasUnregistered => {
          if (hasUnregistered) {
            logBuild(`unregistered service worker`);
          }
          cb();
        });
      } else {
        cb();
      }
    }).catch(err => {
      logWarn('Service Worker', err);
      cb();
    });
  }
}
