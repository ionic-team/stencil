import { ATTR_CASE, MEMBER_TYPE, PROP_TYPE } from './constants';
import { ComponentMeta, ComponentRegistry, ComponentListenersData, LoadComponentRegistry, PropertyType } from '../util/interfaces';
import { isDef, toDashCase, toLowerCase } from './helpers';


export function parseComponentLoaders(cmpRegistryData: LoadComponentRegistry, registry: ComponentRegistry, attr?: number) {
  // tag name will always be lower case
  const cmpMeta: ComponentMeta = {
    tagNameMeta: cmpRegistryData[0],
    membersMeta: {
      // every component defaults to always have
      // the mode and color properties
      // but only color should observe any attribute changes
      'mode': { memberType: MEMBER_TYPE.Prop },
      'color': { memberType: MEMBER_TYPE.Prop, attribName: 'color' }
    }
  };

  // map of the modes w/ bundle id and style data
  cmpMeta.bundleIds = cmpRegistryData[1] as any;

  // parse member meta
  // this data only includes props that are attributes that need to be observed
  // it does not include all of the props yet
  const memberData = cmpRegistryData[3];
  if (memberData) {
    for (var i = 0; i < memberData.length; i++) {
      var d = memberData[i];
      cmpMeta.membersMeta[d[0]] = {
        memberType: d[1],
        attribName: d[2] ? attr === ATTR_CASE.LowerCase ? toLowerCase(d[0]) : toDashCase(d[0]) : (0 as any),
        propType: d[3]
      };
    }
  }

  // encapsulation
  cmpMeta.encapsulation = cmpRegistryData[4];

  if (cmpRegistryData[5]) {
    // parse listener meta
    cmpMeta.listenersMeta = cmpRegistryData[5].map(parseListenerData);
  }

  return registry[cmpMeta.tagNameMeta] = cmpMeta;
}

function parseListenerData(listenerData: ComponentListenersData) {
  return {
    eventName: listenerData[0],
    eventMethodName: listenerData[1],
    eventDisabled: !!listenerData[2],
    eventPassive: !!listenerData[3],
    eventCapture: !!listenerData[4]
  };
}


export function parsePropertyValue(propType: PropertyType | PROP_TYPE, propValue: any) {
  // ensure this value is of the correct prop type
  // we're testing both formats of the "propType" value because
  // we could have either gotten the data from the attribute changed callback,
  // which wouldn't have Constructor data yet, and because this method is reused
  // within proxy where we don't have meta data, but only constructor data

  if (isDef(propValue)) {
    if ((propType as PropertyType) === Boolean || (propType as PROP_TYPE) === PROP_TYPE.Boolean) {
      // per the HTML spec, any string value means it is a boolean true value
      // but we'll cheat here and say that the string "false" is the boolean false
      return (propValue === 'false' ? false :  propValue === '' || !!propValue);
    }

    if ((propType as PropertyType) === Number || (propType as PROP_TYPE) === PROP_TYPE.Number) {
      // force it to be a number
      return parseFloat(propValue);
    }
  }

  // not sure exactly what type we want
  // so no need to change to a different type
  return propValue;
}
