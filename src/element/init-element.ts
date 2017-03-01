import { IonElement } from './ion-element';
import { toCamelCase } from '../utils/helpers';


export function initProperties(elm: IonElement) {
  if (!elm._obAttrs) return;

  const propValues: any = {};

  elm._obAttrs.forEach(attrName => {
    const propName = toCamelCase(attrName);

    propValues[propName] = (<any>elm)[propName];

    Object.defineProperty(elm, propName, {
      get: () => {
        return propValues[propName];
      },
      set: (value: any) => {
        if (propValues[propName] !== value) {
          propValues[propName] = value;
          elm.update();
        }
      }
    });
  });
}
