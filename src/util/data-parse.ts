import * as d from '../declarations';
import { isDef } from './helpers';
import { PROP_TYPE } from './constants';


export const parseComponentLoader = (cmpRegistryData: d.ComponentHostData, i?: number, cmpData?: any): d.ComponentMeta => {
  // tag name will always be lower case
  // parse member meta
  // this data only includes props that are attributes that need to be observed
  // it does not include all of the props yet
  const [tagNameMeta, bundleIds, , memberData, encapsulationMeta, listenerMeta] = cmpRegistryData;

  const membersMeta: any = {
    // every component defaults to always have
    // the mode and color properties
    // but only color should observe any attribute changes
    'color': { attribName: 'color' }
  };

  if (_BUILD_.hasMembers && memberData) {
    for (i = 0; i < memberData.length; i++) {
      cmpData = memberData[i];
      membersMeta[cmpData[0]] = {
        memberType: cmpData[1],
        reflectToAttrib: !!cmpData[2],
        attribName: typeof cmpData[3] === 'string' ? cmpData[3] : cmpData[3] ? cmpData[0] : 0 as any,
        propType: cmpData[4]
      };
    }
  }

  return {
    tagNameMeta,

    // map of the bundle ids
    // can contain modes, and array of esm and es5 bundle ids
    bundleIds,
    membersMeta: { ...membersMeta },

    // encapsulation
    encapsulationMeta,

    // parse listener meta
    listenersMeta: listenerMeta ? listenerMeta.map(parseListenerData) : undefined
  };
};

const parseListenerData = (listenerData: d.ComponentListenersData) => ({
  eventName: listenerData[0],
  eventMethodName: listenerData[1],
  eventDisabled: !!listenerData[2],
  eventPassive: !!listenerData[3],
  eventCapture: !!listenerData[4]
});


export const parsePropertyValue = (propType: d.PropertyType | PROP_TYPE, propValue: any) => {
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

    // redundant return here for better minification
    return propValue;
  }

  // not sure exactly what type we want
  // so no need to change to a different type
  return propValue;
};
