import * as d from '../declarations';
import { getDocument } from './element';


export const getConnect = (ref: d.HostRef, tagName: string) => {
  function componentOnReady(): Promise<any> {
    const doc = getDocument(ref) as Document;
    let elm = doc.querySelector(tagName) as any;
    if (!elm) {
      elm = doc.createElement(tagName) as any;
      doc.body.appendChild(elm);
    }
    return elm.componentOnReady();
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
