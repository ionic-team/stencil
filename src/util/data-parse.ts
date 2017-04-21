import { ComponentListenersData, ComponentModeData, ComponentRegistry, ComponentWatchesData } from '../util/interfaces';
import { isString } from './helpers';


export function parseComponentModeData(registry: ComponentRegistry, moduleImports: any, h: any, injectedIonic: any, cmpModeData: ComponentModeData) {
  var i = 0;
  var cmpListenerData: ComponentListenersData;
  var cmpWatchData: ComponentWatchesData;

  // tag name (ion-badge)
  // get component meta data by tag name
  var cmpMeta = registry[cmpModeData[0]];

  // component listeners
  cmpMeta.listeners = {};
  for (i = 0; i < cmpModeData[2].length; i++) {
    cmpListenerData = cmpModeData[2][i];
    cmpMeta.listeners[cmpListenerData[0]] = {
      eventName: cmpListenerData[1],
      capture: !!cmpListenerData[2],
      passive: !!cmpListenerData[3],
      enabled: !!cmpListenerData[4],
    };
  }

  // component instance property watches
  cmpMeta.watches = {};
  for (i = 0; i < cmpModeData[3].length; i++) {
    cmpWatchData = cmpModeData[3][i];
    cmpMeta.watches[cmpWatchData[0]] = {
      fn: cmpWatchData[1],
    };
  }

  // shadow
  cmpMeta.shadow = !!cmpModeData[4];

  // mode name (ios, md, wp)
  // get component mode
  if (isString(cmpModeData[6])) {
    var cmpMode = cmpMeta.modes[parseModeName(cmpModeData[5])];
    if (cmpMode) {
      // component mode styles
      cmpMode.styles = cmpModeData[6];
    }
  }

  // import component function
  // inject ionic globals
  cmpModeData[7](moduleImports, h, injectedIonic);

  // get the component class which was added to moduleImports
  // component class name (Badge)
  cmpMeta.componentModule = moduleImports[cmpModeData[1]];
}


function parseModeName(mode: any) {
  switch (mode) {
    case 0:
      return 'default';
    case 1:
      return 'ios';
    case 2:
      return 'md';
    case 3:
      return 'wp';
  }

  return mode;
}
