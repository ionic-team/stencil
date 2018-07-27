import * as d from '../declarations';
import { isDef } from './helpers';
import { PROP_TYPE } from './constants';


export function parseComponentLoader(cmpData: d.ComponentHostData, i?: number, d?: d.ComponentMemberData) {
  // tag name will always be lower case
  const cmpMeta: d.ComponentMeta = {
    tagNameMeta: cmpData[0],
    membersMeta: {
      // every component defaults to always have
      // the mode and color properties
      // but only color should observe any attribute changes
      'color': { attribName: 'color' }
    }
  };

  // map of the bundle ids
  // can contain modes, and array of esm and es5 bundle ids
  cmpMeta.bundleIds = cmpData[1] as any;

  // parse member meta
  // this data only includes props that are attributes that need to be observed
  // it does not include all of the props yet
  const memberData = cmpData[3];
  if (memberData) {
    for (i = 0; i < memberData.length; i++) {
      d = memberData[i];
      cmpMeta.membersMeta[d[0]] = {
        memberType: d[1],
        reflectToAttrib: !!d[2],
        attribName: typeof d[3] === 'string' ? d[3] as string : d[3] ? d[0] : 0 as any,
        propType: d[4]
      };
    }
  }

  // encapsulation
  cmpMeta.encapsulationMeta = cmpData[4];

  if (cmpData[5]) {
    // parse listener meta
    cmpMeta.listenersMeta = cmpData[5].map(parseListenerData);
  }

  return cmpMeta;
}

function parseListenerData(listenerData: d.ComponentListenersData) {
  return {
    eventName: listenerData[0],
    eventMethodName: listenerData[1],
    eventDisabled: !!listenerData[2],
    eventPassive: !!listenerData[3],
    eventCapture: !!listenerData[4]
  };
}


export function parsePropertyValue(propType: d.PropertyType | PROP_TYPE, propValue: any) {
  // ensure this value is of the correct prop type
  // we're testing both formats of the "propType" value because
  // we could have either gotten the data from the attribute changed callback,
  // which wouldn't have Constructor data yet, and because this method is reused
  // within proxy where we don't have meta data, but only constructor data

  if (isDef(propValue) && typeof propValue !== 'object' && typeof propValue !== 'function') {
    if ((propType as d.PropertyType) === Boolean || (propType as PROP_TYPE) === PROP_TYPE.Boolean) {
      // per the HTML spec, any string value means it is a boolean true value
      // but we'll cheat here and say that the string "false" is the boolean false
      return (propValue === 'false' ? false : propValue === '' || !!propValue);
    }

    if ((propType as d.PropertyType) === Number || (propType as PROP_TYPE) === PROP_TYPE.Number) {
      // force it to be a number
      return parseFloat(propValue);
    }

    if ((propType as d.PropertyType) === String || (propType as PROP_TYPE) === PROP_TYPE.String) {
      // could have been passed as a number or boolean
      // but we still want it as a string
      return propValue.toString();
    }
  }

  // not sure exactly what type we want
  // so no need to change to a different type
  return propValue;
}
