import { ComponentListenersData, ComponentModeData, ComponentRegistry, ComponentWatchersData, PropMeta } from '../util/interfaces';
import { isString } from './helpers';


export function parseComponentModeData(registry: ComponentRegistry, moduleImports: any, cmpModeData: ComponentModeData) {
  var i = 0;
  var cmpListenerData: ComponentListenersData;
  var cmpWatchData: ComponentWatchersData;

  // tag name (ion-badge)
  // get component meta data by tag name
  var cmpMeta = registry[cmpModeData[0]];

  // component methods
  cmpMeta.methods = cmpModeData[1];

  // component listeners
  if (cmpModeData[2]) {
    cmpMeta.listeners = [];
    for (i = 0; i < cmpModeData[2].length; i++) {
      cmpListenerData = cmpModeData[2][i];
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
  if (cmpModeData[3]) {
    cmpMeta.watchers = [];
    for (i = 0; i < cmpModeData[3].length; i++) {
      cmpWatchData = cmpModeData[3][i];
      cmpMeta.watchers.push({
        propName: cmpWatchData[0],
        fn: cmpWatchData[1]
      });
    }
  }

  // shadow
  cmpMeta.shadow = !!cmpModeData[4];

  // mode name (ios, md, wp)
  // get component mode
  if (isString(cmpModeData[6])) {
    var cmpMode = cmpMeta.modes.find(m => m.modeName === parseModeName(cmpModeData[5].toString()));
    if (cmpMode) {
      // component mode styles
      cmpMode.styles = cmpModeData[6];
    }
  }

  // get the component class which was added to moduleImports
  // component class name (Badge)
  cmpMeta.componentModule = moduleImports[cmpModeData[0]];
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
  const props: PropMeta[] = [
    { propName: 'color' },
    { propName: 'mode' },
    { propName: 'id' }
  ];

  if (propData) {
    for (var i = 0; i < propData.length; i++) {
      props.push({
        propName: propData[i][0],
        propType: propData[i][1]
      });
    }
  }

  return props;
}


export const BOOLEAN_TYPE_CODE = 0;
export const NUMBER_TYPE_CODE = 1;
