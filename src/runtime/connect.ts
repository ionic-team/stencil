import * as d from '../declarations';
import { getDoc, getElement } from '@platform';


export const getConnect = (ref: d.HostRef, tagName: string) => {
  function componentOnReady(): Promise<any> {
    const doc = getDoc(getElement(ref));
    const elm = doc.querySelector(tagName) || doc.createElement(tagName) as any;
    return '' ? elm.componentOnReady() : Promise.resolve(ref.$hostElement$);
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
