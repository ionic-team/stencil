import { ComponentClass, ComponentInstance } from '../shared/interfaces';


export function initComponent(cls: ComponentClass): ComponentInstance {
  const instance = new cls();



  return instance;
}


export function componentDidLoad(instance: ComponentInstance) {
  instance.ionViewDidLoad && instance.ionViewDidLoad();
}


export function componentWillUnload(instance: ComponentInstance) {
  instance.ionViewWillUnload && instance.ionViewWillUnload();
}
