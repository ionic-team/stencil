import { DomApi, HostElement } from '../declarations';


export function proxyController(domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string) {
  return {
    'create': proxyProp(domApi, controllerComponents, ctrlTag, 'create'),
    'componentOnReady': proxyProp(domApi, controllerComponents, ctrlTag, 'componentOnReady')
  };
}


function proxyProp(domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string, proxyMethodName: string) {
  return function () {
    const args = arguments;
    return loadComponent(domApi, controllerComponents, ctrlTag)
      .then(ctrlElm => ctrlElm[proxyMethodName].apply(ctrlElm, args));
  };
}


export function loadComponent(domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string): Promise<any> {
  let ctrlElm = controllerComponents[ctrlTag];
  const body = domApi.$doc.body;
  if (body) {
    if (!ctrlElm) {
      ctrlElm = body.querySelector(ctrlTag) as HostElement;
    }
    if (!ctrlElm) {
      ctrlElm = controllerComponents[ctrlTag] = domApi.$createElement(ctrlTag) as any;
      domApi.$appendChild(body, ctrlElm);
    }
    return ctrlElm.componentOnReady();
  }
  return Promise.resolve();
}
