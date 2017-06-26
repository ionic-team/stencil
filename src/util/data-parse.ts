import { ATTR_DASH_CASE, TYPE_BOOLEAN, TYPE_NUMBER } from './constants';
import { ComponentMeta, ComponentRegistry, LoadComponentMeta } from '../util/interfaces';
import { isDef, toDashCase } from './helpers';


export function parseComponentMeta(registry: ComponentRegistry, moduleImports: any, cmpData: LoadComponentMeta): ComponentMeta {
  let i = 0;
  let data: any;

  const tagName = cmpData[0].toUpperCase();
  const cmpMeta = registry[tagName] = registry[tagName] || {
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
  cmpMeta.componentModuleMeta = moduleImports[tagName];

  // map of the modes w/ bundle id and style data
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
        isStateful: !!data[3]
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

  // component instance prop WILL change methods
  cmpMeta.propWillChangeMeta = cmpData[7];

  // component instance prop DID change methods
  cmpMeta.propDidChangeMeta = cmpData[8];

  // component methods
  cmpMeta.methodsMeta = cmpData[9];

  // shadow
  cmpMeta.isShadowMeta = !!cmpData[10];

  return cmpMeta;
}


export function parsePropertyValue(propType: number, propValue: any) {
  // ensure this value is of the correct prop type
  if (isDef(propValue)) {
    if (propType === TYPE_BOOLEAN) {
      // per the HTML spec, any string value means it is a boolean "true" value
      // but we'll cheat here and say that the string "false" is the boolean false
      return (propValue === 'false' ? false :  propValue === '' || !!propValue);
    }

    if (propType === TYPE_NUMBER) {
      // force it to be a number
      return parseFloat(propValue);
    }
  }

  // not sure exactly what type we want
  // so no need to change to a different type
  return propValue;
}
