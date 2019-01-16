import * as d from '../declarations';
import { BUILD } from '@stencil/core/build-conditionals';
import { refs } from '@stencil/core/platform';


export const getElement = (ref: any) => refs.get(ref).elm;


export const getElmRef = (elm: d.HostElement, elmData?: d.ElementData) => {
  elmData = refs.get(elm);

  if (!elmData) {
    refs.set(elm, elmData = {
      elm: elm,
      instanceValues: new Map(),
      instance: BUILD.lazyLoad ? null : elm
    });
  }

  return elmData;
};


export const registerLazyInstance = (lazyInstance: any, elmData: d.ElementData) =>
  refs.set(elmData.instance = lazyInstance, elmData);
