import type * as d from '../../declarations';
import { consoleDevError } from '@platform';
import { h } from '@runtime';
import { isPromise } from '@utils';

export const hAsync = (nodeName: any, vnodeData: any, ...children: d.ChildType[]) => {
  if (Array.isArray(children) && children.length > 0) {
    // only return a promise if we have to
    const flatChildren = children.flat(Infinity);
    if (flatChildren.some(isPromise)) {
      // has children and at least one of them is async
      // wait on all of them to be resolved
      return Promise.all(flatChildren)
        .then(resolvedChildren => {
          return h(nodeName, vnodeData, ...resolvedChildren);
        })
        .catch(err => {
          consoleDevError(err);
          return h(nodeName, vnodeData);
        });
    }

    // no async children, return sync
    return h(nodeName, vnodeData, ...children);
  }

  // no children, return sync
  return h(nodeName, vnodeData);
};
