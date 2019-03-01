import { getDoc, getHostRef, getWin } from '@platform';

export const getElement = (ref: any) => getHostRef(ref).$hostElement$;

export const getWindow = (ref: any) => getWin(getElement(ref));

export const getDocument = (ref: any) => getDoc(getElement(ref));
