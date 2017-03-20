import { IonElement, Props } from './ion-element';
import { PropOptions } from '../utils/interfaces';
import { isNumber, isString, toCamelCase } from '../utils/helpers';


export function initProperties(elm: IonElement, props: Props) {
  props = props || {};

  // all components have mode and color props
  props.mode = true;
  props.color = true;

  const propValues: {[propName: string]: any} = {};

  Object.keys(props).forEach(propName => {
    propName = toCamelCase(propName);

    Object.defineProperty(elm, propName, {

      get: () => {
        return propValues[propName];
      },

      set: (value: any) => {
        value = getValue(props[propName], value);

        if (propValues[propName] !== value) {
          propValues[propName] = value;

          elm.update();
        }
      }

    });

  });
}

function getValue(propOpts: PropOptions, value: any): any {
  if (propOpts.type === 'boolean') {
    if (isString(value)) {
      return true;
    }
    return !!value;

  } else if (propOpts.type === 'number') {
    if (isNumber(value)) {
      return value;
    }
    return parseFloat(value);
  }

  return value;
}
