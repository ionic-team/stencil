import { ComponentMeta } from '../../util/interfaces';
import { ENCAPSULATION } from '../../util/constants';


export function useShadowDom(supportsNativeShadowDom: boolean, cmpMeta: ComponentMeta) {
  return (supportsNativeShadowDom && cmpMeta.encapsulation === ENCAPSULATION.ShadowDom);
}


export function useScopedCss(supportsNativeShadowDom: boolean, cmpMeta: ComponentMeta) {
  if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
    return true;
  }
  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom && !supportsNativeShadowDom) {
    return true;
  }
  return false;
}
