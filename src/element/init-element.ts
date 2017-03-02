import { IonElement, Props } from './ion-element';
import { toCamelCase } from '../utils/helpers';


export function initProperties(elm: IonElement, props: Props) {
  if (!props) {
    return;
  }

  const propValues: any = {};
  const propNames = Object.keys(props);

  propNames.forEach(attrName => {
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
