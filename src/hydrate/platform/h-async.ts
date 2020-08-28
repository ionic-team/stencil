import * as d from '../../declarations';
import { h } from '@runtime';
import { isPromise } from '@utils';
import { consoleDevError } from '@platform';

export const hAsync = (nodeName: any, vnodeData: any, ...children: d.ChildType[]) => {
  if (Array.isArray(children) && children.length > 0) {
    // only return a promise if we have to
    if (children.some(isPromise)) {
      // has children and at least one of them is async
      // wait on all of them to be resolved
      return Promise.all(children)
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
