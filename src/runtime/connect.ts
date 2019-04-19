import * as d from '../declarations';
import { doc } from '@platform';


export const getConnect = (_ref: d.HostRef, tagName: string) => {
  function componentOnReady(): Promise<any> {
    let elm = doc.querySelector(tagName) as any;
    if (!elm) {
      elm = doc.createElement(tagName) as any;
      doc.body.appendChild(elm);
    }
    return 'componentOnReady' in elm ? elm.componentOnReady() : Promise.resolve(elm);
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
