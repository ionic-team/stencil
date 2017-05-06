import { ComponentListenersData, ComponentModeData, ComponentRegistry, ComponentWatchersData, Props } from '../util/interfaces';
import { isString } from './helpers';


export function parseComponentModeData(registry: ComponentRegistry, moduleImports: any, cmpModeData: ComponentModeData) {
  var i = 0;
  var cmpListenerData: ComponentListenersData;
  var cmpWatchData: ComponentWatchersData;

  // tag name (ion-badge)
  // get component meta data by tag name
  var cmpMeta = registry[cmpModeData[0]];

  // component methods
  cmpMeta.methods = cmpModeData[2];

  // component listeners
  cmpMeta.listeners = {};
  for (i = 0; i < cmpModeData[3].length; i++) {
    cmpListenerData = cmpModeData[3][i];
    cmpMeta.listeners[cmpListenerData[0]] = {
      eventName: cmpListenerData[1],
      capture: !!cmpListenerData[2],
      passive: !!cmpListenerData[3],
      enabled: !!cmpListenerData[4],
    };
  }

  // component instance property watchers
  cmpMeta.watchers = {};
  for (i = 0; i < cmpModeData[4].length; i++) {
    cmpWatchData = cmpModeData[4][i];
    cmpMeta.watchers[cmpWatchData[0]] = {
      fn: cmpWatchData[1],
    };
  }

  // shadow
  cmpMeta.shadow = !!cmpModeData[5];

  // mode name (ios, md, wp)
  // get component mode
  if (isString(cmpModeData[7])) {
    var cmpMode = cmpMeta.modes[parseModeName(cmpModeData[6].toString())];
    if (cmpMode) {
      // component mode styles
      cmpMode.styles = cmpModeData[7];
    }
  }

  // get the component class which was added to moduleImports
  // component class name (Badge)
  cmpMeta.componentModule = moduleImports[cmpModeData[1]];
}


export function parseModeName(modeCode: string) {
  switch (modeCode) {
    case '0':
      return 'default';
    case '1':
      return 'ios';
    case '2':
      return 'md';
    case '3':
      return 'wp';
  }

  return modeCode;
}


export function parseProp(propData: any[][]) {
  const prop: Props = {
    color: {},
    mode: {}
  };

  if (propData) {
    for (var i = 0; i < propData.length; i++) {
      prop[propData[i][0]] = {
        type: propData[i][1]
      };
    }
  }

  return prop;
}


export const BOOLEAN_TYPE_CODE = 0;
export const NUMBER_TYPE_CODE = 1;
