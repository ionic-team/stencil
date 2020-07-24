import * as d from '../../declarations';
import { h } from '@runtime';

export const hAsync = (nodeName: any, vnodeData: any, ...children: d.ChildType[]): d.VNode => {
  return h(nodeName, vnodeData, ...children);
};
