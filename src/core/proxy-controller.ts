import { DomApi, HostElement } from '../declarations';


export const proxyController = (domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string) => (
  {
    'create': proxyProp(domApi, controllerComponents, ctrlTag, 'create'),
    'componentOnReady': proxyProp(domApi, controllerComponents, ctrlTag, 'componentOnReady')
  }
);


const proxyProp = (domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string, proxyMethodName: string) =>
  function () {
    const args = arguments;
    return loadComponent(domApi, controllerComponents, ctrlTag)
      .then(ctrlElm => ctrlElm[proxyMethodName].apply(ctrlElm, args));
  };


export const loadComponent = (domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string, ctrlElm?: any, body?: any): Promise<any> => {
  ctrlElm = controllerComponents[ctrlTag];
  body = domApi.$doc.body;
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
};
