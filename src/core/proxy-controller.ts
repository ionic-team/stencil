import * as d from '../declarations';


export function proxyController(domApi: d.DomApi, controllerComponents: Map<string, d.HostElement>, ctrlTag: string) {
  return {
    'create': proxyProp(domApi, controllerComponents, ctrlTag, 'create'),
    'componentOnReady': proxyProp(domApi, controllerComponents, ctrlTag, 'componentOnReady')
  };
}


function proxyProp(domApi: d.DomApi, controllerComponents: Map<string, d.HostElement>, ctrlTag: string, proxyMethodName: string) {
  return function () {
    const args = arguments;
    return loadComponent(domApi, controllerComponents, ctrlTag)
      .then(ctrlElm => ctrlElm[proxyMethodName].apply(ctrlElm, args));
  };
}


export function loadComponent(domApi: d.DomApi, controllerComponents: Map<string, d.HostElement>, ctrlTag: string): Promise<any> {
  let ctrlElm = controllerComponents.get(ctrlTag);
  const body = domApi.$doc.body;
  if (body) {
    if (!ctrlElm) {
      ctrlElm = body.querySelector(ctrlTag);
      if (!ctrlElm) {
        ctrlElm = domApi.$createElement(ctrlTag);
        controllerComponents.set(ctrlTag, ctrlElm);
        domApi.$appendChild(body, ctrlElm);
      }
    }
    return ctrlElm.componentOnReady();
  }
  return Promise.resolve();
}
