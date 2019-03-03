import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getDoc, getHostRef, getWin } from '@platform';


export const getElement = (ref: any) => BUILD.lazyLoad || BUILD.hydrateServerSide ? getHostRef(ref).$hostElement$ : ref as d.HostElement;

export const getWindow = (ref: any) => getWin(getElement(ref));

export const getDocument = (ref: any) => getDoc(getElement(ref));
