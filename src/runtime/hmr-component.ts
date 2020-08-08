import type * as d from '../declarations';
import { getHostRef } from '@platform';
import { HOST_FLAGS } from '@utils';
import { initializeComponent } from './initialize-component';

export const hmrStart = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, hmrVersionId: string) => {
  // ¯\_(ツ)_/¯
  const hostRef = getHostRef(elm);

  // reset state flags to only have been connected
  hostRef.$flags$ = HOST_FLAGS.hasConnected;

  // TODO
  // detatch any event listeners that may have been added
  // because we're not passing an exact event name it'll
  // remove all of this element's event, which is good

  // create a callback for when this component finishes hmr
  elm['s-hmr-load'] = () => {
    // finished hmr for this element
    delete elm['s-hmr-load'];
    hmrFinish(elm, cmpMeta);
  };

  // re-initialize the component
  initializeComponent(elm, hostRef, cmpMeta, hmrVersionId);
};

export const hmrFinish = (_elm: d.HostElement, _cmpMeta: d.ComponentRuntimeMeta) => {
  // TODO
};
