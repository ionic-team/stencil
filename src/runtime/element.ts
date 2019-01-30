import { getHostRef } from '@platform';

export const getElement = (ref: any) => getHostRef(ref).hostElement;
