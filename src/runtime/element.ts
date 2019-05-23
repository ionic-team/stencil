import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { getHostRef } from '@platform';


export const getElement = (ref: any) => BUILD.lazyLoad ? getHostRef(ref).$hostElement$ : ref as d.HostElement;
