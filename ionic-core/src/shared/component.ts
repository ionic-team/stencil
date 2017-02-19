import { ComponentClass, ComponentInstance } from '../shared/interfaces';


export function initComponent(cls: ComponentClass): ComponentInstance {
  const instance = new cls();


  return instance;
}
