import type * as d from '../declarations';
import { BUILD } from '@app-data';
import { getHostRef } from '@platform';

export const getElement = (ref: any) => (BUILD.lazyLoad ? getHostRef(ref).$hostElement$ : (ref as d.HostElement));
