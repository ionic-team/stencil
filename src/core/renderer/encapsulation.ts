import { ComponentMeta } from '../../util/interfaces';
import { ENCAPSULATION_TYPE } from '../../util/constants';


export function useShadowDom(supportsNativeShadowDom: boolean, cmpMeta: ComponentMeta) {
  return (supportsNativeShadowDom && cmpMeta.encapsulation === ENCAPSULATION_TYPE.ShadowDom);
}


export function useScopedCss(supportsNativeShadowDom: boolean, cmpMeta: ComponentMeta) {
  if (cmpMeta.encapsulation === ENCAPSULATION_TYPE.ScopedCss) {
    return true;
  }
  if (cmpMeta.encapsulation === ENCAPSULATION_TYPE.ShadowDom && !supportsNativeShadowDom) {
    return true;
  }
  return false;
}
