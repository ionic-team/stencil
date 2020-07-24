import * as d from '../../declarations';
import { h } from '@runtime';

export const hAsync = async (nodeName: any, vnodeData: any, ...children: d.ChildType[]) => {
  if (children) {
    children = await Promise.all(children);
  }
  return h(nodeName, vnodeData, ...children);
};
