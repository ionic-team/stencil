import { doc } from '@platform';

import type * as d from '../declarations';

export const getConnect = (_ref: d.HostRef, tagName: string) => {
  const componentOnReady = (): Promise<any> => {
    let elm = doc.querySelector(tagName) as any;
    if (!elm) {
      elm = doc.createElement(tagName) as any;
      doc.body.appendChild(elm);
    }
    return typeof elm.componentOnReady === 'function' ? elm.componentOnReady() : Promise.resolve(elm);
  };

  const create = (...args: any[]) => {
    return componentOnReady().then((el) => el.create(...args));
  };

  return {
    create,
    componentOnReady,
  };
};
