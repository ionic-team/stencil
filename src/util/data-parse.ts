import { ATTR_LOWER_CASE, TYPE_BOOLEAN, TYPE_NUMBER } from './constants';
import { ComponentMeta, ComponentRegistry, LoadComponentMeta, LoadComponentRegistry } from '../util/interfaces';
import { isDef, toDashCase } from './helpers';


export function parseComponentRegistry(cmpRegistryData: LoadComponentRegistry, registry: ComponentRegistry) {
  // tag name will always be upper case
  const cmpMeta: ComponentMeta = {
    tagNameMeta: cmpRegistryData[0],
    propsMeta: [
      // every component defaults to always have
      // the mode and color properties
      // but only observe the color attribute
      // mode cannot change after the component was created
      { propName: 'color', attribName: 'color' },
      { propName: 'mode' },
    ]
  };

  cmpMeta.moduleId = cmpRegistryData[1];

  // map of the modes w/ bundle id and style data
  cmpMeta.styleIds = cmpRegistryData[2] || {};

  // slot
  cmpMeta.slotMeta = cmpRegistryData[3];

  if (cmpRegistryData[4]) {
    // parse prop meta
    for (var i = 0; i < cmpRegistryData[4].length; i++) {
      var data = cmpRegistryData[4][i];
      cmpMeta.propsMeta.push({
        propName: data[0],
        attribName: (data[1] === ATTR_LOWER_CASE ? data[0].toLowerCase() : toDashCase(data[0])),
        propType: data[2],
        isStateful: !!data[3]
      });
    }
  }

  // bundle load priority
  cmpMeta.loadPriority = cmpRegistryData[5];

  return registry[cmpMeta.tagNameMeta] = cmpMeta;
}


export function parseComponentMeta(registry: ComponentRegistry, moduleImports: any, cmpMetaData: LoadComponentMeta): ComponentMeta {
  // tag name will always be upper case
  const cmpMeta = registry[cmpMetaData[0]];

  // get the component class which was added to moduleImports
  // using the tag as the key on the export object
  cmpMeta.componentModuleMeta = moduleImports[cmpMetaData[0]];

  // host
  cmpMeta.hostMeta = cmpMetaData[1];

  // component listeners
  if (cmpMetaData[2]) {
    cmpMeta.listenersMeta = [];
    for (var i = 0; i < cmpMetaData[2].length; i++) {
      var data = cmpMetaData[2][i];
      cmpMeta.listenersMeta.push({
        eventMethodName: data[0],
        eventName: data[1],
        eventCapture: !!data[2],
        eventPassive: !!data[3],
        eventEnabled: !!data[4],
      });
    }
  }

  // component states
  cmpMeta.statesMeta = cmpMetaData[3];

  // component instance prop WILL change methods
  cmpMeta.propsWillChangeMeta = cmpMetaData[4];

  // component instance prop DID change methods
  cmpMeta.propsDidChangeMeta = cmpMetaData[5];

  // component methods
  cmpMeta.methodsMeta = cmpMetaData[6];

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
