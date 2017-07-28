import { ATTR_LOWER_CASE, TYPE_BOOLEAN, TYPE_NUMBER } from './constants';
import { ComponentMeta, ComponentRegistry, LoadComponentMeta,
  ComponentEventData, ComponentListenersData, ComponentPropertyData, LoadComponentRegistry } from '../util/interfaces';
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
      var d: any = cmpRegistryData[4][i];
      cmpMeta.propsMeta.push({
        propName: (d as ComponentPropertyData)[0],
        attribName: ((d as ComponentPropertyData)[1] === ATTR_LOWER_CASE ? (d as ComponentPropertyData)[0].toLowerCase() : toDashCase((d as ComponentPropertyData)[0])),
        propType: (d as ComponentPropertyData)[2],
        isStateful: !!(d as ComponentPropertyData)[3]
      });
    }
  }

  if (cmpRegistryData[5]) {
    // parse listener meta
    cmpMeta.listenersMeta = [];
    for (i = 0; i < cmpRegistryData[5].length; i++) {
      d = cmpRegistryData[5][i];
      cmpMeta.listenersMeta.push({
        eventName: (d as ComponentListenersData)[0],
        eventMethodName: (d as ComponentListenersData)[1],
        eventDisabled: !!(d as ComponentListenersData)[2],
        eventPassive: !!(d as ComponentListenersData)[3],
        eventCapture: !!(d as ComponentListenersData)[4]
      });
    }
  }

  // bundle load priority
  cmpMeta.loadPriority = cmpRegistryData[6];

  return registry[cmpMeta.tagNameMeta] = cmpMeta;
}


export function parseComponentMeta(registry: ComponentRegistry, moduleImports: any, cmpMetaData: LoadComponentMeta) {
  // tag name will always be upper case
  const cmpMeta = registry[cmpMetaData[0]];

  // get the component class which was added to moduleImports
  // using the tag as the key on the export object
  cmpMeta.componentModule = moduleImports[cmpMetaData[0]];

  // host
  cmpMeta.hostMeta = cmpMetaData[1];

  // component listeners
  if (cmpMetaData[2]) {
    cmpMeta.listenersMeta = [];
    for (var i = 0; i < cmpMetaData[2].length; i++) {
      var data: any = cmpMetaData[2][i];
      cmpMeta.listenersMeta.push({
        eventMethodName: (data as ComponentListenersData)[0],
        eventName: (data as ComponentListenersData)[1],
        eventCapture: !!(data as ComponentListenersData)[2],
        eventPassive: !!(data as ComponentListenersData)[3],
        eventDisabled: !!(data as ComponentListenersData)[4],
      });
    }
  }

  // component states
  cmpMeta.statesMeta = cmpMetaData[2];

  // component instance prop WILL change methods
  cmpMeta.propsWillChangeMeta = cmpMetaData[3];

  // component instance prop DID change methods
  cmpMeta.propsDidChangeMeta = cmpMetaData[4];

  // component instance events
  if (cmpMetaData[5]) {
    cmpMeta.eventsMeta = [];
    for (i = 0; i < cmpMetaData[5].length; i++) {
      data = cmpMetaData[5][i];
      cmpMeta.eventsMeta.push({
        eventName: (data as ComponentEventData)[0],
        eventMethodName: (data as ComponentEventData)[1],
        eventBubbles: !!(data as ComponentEventData)[2],
        eventCancelable: !!(data as ComponentEventData)[3],
        eventComposed: !!(data as ComponentEventData)[4],
      });
    }
  }

  // component methods
  cmpMeta.methodsMeta = cmpMetaData[6];

  // member name which the component instance should
  // use when referencing the host element
  cmpMeta.hostElementMember = cmpMetaData[7];

  // is shadow
  cmpMeta.isShadowMeta = !!cmpMetaData[8];
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
