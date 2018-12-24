import { refs } from './data';

export const getElement = (ref: any) => refs.get(ref).elm;
