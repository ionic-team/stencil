import * as d from '@declarations';
import { getDoc, getElement } from '@platform';


export const getConnect = (ref: d.HostRef, tagName: string) => {
  function componentOnReady(): Promise<any> {
    let elm = getDoc(getElement(ref)).querySelector(tagName) as any;
    if (!elm) {
      elm = getDoc(getElement(ref)).createElement(tagName);
    }
    return elm.componentOnReady ? elm.componentOnReady() : Promise.resolve(ref.$hostElement$);
  }

  function create() {
    return componentOnReady()
      .then(el => el.create(...arguments));
  }
  return {
    create,
    componentOnReady,
  };
};
