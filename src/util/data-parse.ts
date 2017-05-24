import { ATTR_DASH_CASE } from './constants';
import { ComponentListenersData, ComponentModeData, ComponentRegistry, ComponentWatchersData, PropMeta } from '../util/interfaces';
import { isString, toDashCase } from './helpers';


export function parseComponentModeData(registry: ComponentRegistry, moduleImports: any, cmpModeData: ComponentModeData) {
  let i = 0;
  let cmpListenerData: ComponentListenersData;
  let cmpWatchData: ComponentWatchersData;

  // tag name (ion-badge)
  // get component meta data by tag name
  let cmpMeta = registry[cmpModeData[0]];

  // component props would have already been parsed
  // and added to the cmpMeta when it was registered
  // no need to redo prop parsing on the client side again

  // component methods
  cmpMeta.methods = cmpModeData[2];

  // component states
  cmpMeta.states = cmpModeData[3];

  // component listeners
  if (cmpModeData[4]) {
    cmpMeta.listeners = [];
    for (i = 0; i < cmpModeData[4].length; i++) {
      cmpListenerData = cmpModeData[4][i];
      cmpMeta.listeners.push({
        methodName: cmpListenerData[0],
        eventName: cmpListenerData[1],
        capture: !!cmpListenerData[2],
        passive: !!cmpListenerData[3],
        enabled: !!cmpListenerData[4],
      });
    }
  }

  // component instance property watchers
  if (cmpModeData[5]) {
    cmpMeta.watchers = [];
    for (i = 0; i < cmpModeData[5].length; i++) {
      cmpWatchData = cmpModeData[5][i];
      cmpMeta.watchers.push({
        propName: cmpWatchData[0],
        fn: cmpWatchData[1]
      });
    }
  }

  // shadow
  cmpMeta.shadow = !!cmpModeData[6];

  // mode name (ios, md, wp)
  // get component mode
  if (isString(cmpModeData[8])) {
    let cmpMode = cmpMeta.modes[parseModeName(cmpModeData[7])];
    if (cmpMode) {
      // component mode styles
      cmpMode.styles = cmpModeData[8];
    }
  }

  // get the component class which was added to moduleImports
  // using the tag as the key on the export object
  cmpMeta.componentModule = moduleImports[cmpModeData[0]];
}


export function parseProp(data: any[]) {
  // data[0] = propName
  // data[1] = attrOption
  // data[2] = propType

  return <PropMeta>{
    propName: data[0],
    attrName: (data[1] === ATTR_DASH_CASE ? toDashCase(data[0]) : data[0]).toLowerCase(),
    propType: data[2]
  };
}


export function parseModeName(modeCode: any) {
  switch (modeCode.toString()) {
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
