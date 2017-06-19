import { ATTR_DASH_CASE, TYPE_BOOLEAN, TYPE_NUMBER } from './constants';
import { ComponentMeta, ComponentRegistry,  LoadComponentMeta, PropMeta } from '../util/interfaces';
import { toDashCase } from './helpers';


export function parseComponentMeta(registry: ComponentRegistry, moduleImports: any, cmpData: LoadComponentMeta): ComponentMeta {
  let i = 0;
  let data: any;

  const tagname = cmpData[0].toUpperCase();
  const cmpMeta = registry[tagname] = registry[tagname] || {
    tagNameMeta: cmpData[0],
    modesMeta: {},
    propsMeta: [
      // every component defaults to always have
      // the mode and color properties
      // but only watch the color attribute
      { propName: 'color', attribName: 'color' },
      { propName: 'mode' },
    ]
  };

  // get the component class which was added to moduleImports
  // using the tag as the key on the export object
  cmpMeta.componentModuleMeta = moduleImports[cmpMeta.tagNameMeta];

  // map of the modes w/ bundle id and style data
  cmpMeta.modesMeta = cmpData[1];
  Object.keys(cmpData[1]).forEach(modeName => {
    cmpMeta.modesMeta[modeName] = cmpData[1][modeName];
  });

  if (cmpData[2]) {
    // parse prop meta
    for (i = 0; i < cmpData[2].length; i++) {
      data = cmpData[2][i];
      cmpMeta.propsMeta.push({
        propName: data[0],
        attribName: (data[1] === ATTR_DASH_CASE ? toDashCase(data[0]) : data[0]).toLowerCase(),
        propType: data[2],
        isTwoWay: !!data[3]
      });
    }
  }

  // slot
  cmpMeta.slotMeta = cmpData[3];

  // host
  cmpMeta.hostMeta = cmpData[4];

  // component listeners
  if (cmpData[5]) {
    cmpMeta.listenersMeta = [];
    for (i = 0; i < cmpData[5].length; i++) {
      data = cmpData[5][i];
      cmpMeta.listenersMeta.push({
        eventMethod: data[0],
        eventName: data[1],
        eventCapture: !!data[2],
        eventPassive: !!data[3],
        eventEnabled: !!data[4],
      });
    }
  }

  // component states
  cmpMeta.statesMeta = cmpData[6];

  // component instance property watchers
  if (cmpData[7]) {
    cmpMeta.watchersMeta = [];
    for (i = 0; i < cmpData[7].length; i++) {
      data = cmpData[7][i];
      cmpMeta.watchersMeta.push({
        propName: data[0],
        fn: data[1]
      });
    }
  }

  // component methods
  cmpMeta.methodsMeta = cmpData[8];

  // shadow
  cmpMeta.isShadowMeta = !!cmpData[9];

  return cmpMeta;
}


export function parseProp(data: any[]) {
  // data[0] = propName
  // data[1] = attrOption
  // data[2] = propType

  return <PropMeta>{
    propName: data[0],
    attribName: (data[1] === ATTR_DASH_CASE ? toDashCase(data[0]) : data[0]).toLowerCase(),
    propType: data[2],
    isTwoWay: !!data[3]
  };
}


export function parsePropertyValue(propType: number, propValue: any) {
  // ensure this value is of the correct prop type

  if (propType === TYPE_BOOLEAN) {
    // per the HTML spec, any string value means it is a boolean "true" value
    // but we'll cheat here and say that the string "false" is the boolean false
    return (propValue === null || propValue === false || propValue === 'false' ? false : true);
  }

  if (propType === TYPE_NUMBER) {
    // force it to be a number
    return parseFloat(propValue);
  }

  // not sure exactly what type we want
  // so no need to change to a different type
  return propValue;
}
