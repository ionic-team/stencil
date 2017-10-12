import { ComponentMeta } from '../../../util/interfaces';
import { ENCAPSULATION_TYPE } from '../../../util/constants';
import { useShadowDom, useScopedCss } from '../encapsulation';


describe('render encapsulation', () => {

  describe('useScopedCss', () => {

    it('should not use scoped when component wants no encapsulation', () => {
      const supportsShadowDom = true;
      const cmpMeta: ComponentMeta = {
        encapsulation: ENCAPSULATION_TYPE.NoEncapsulation
      };
      expect(useScopedCss(supportsShadowDom, cmpMeta)).toBe(false);
    });

    it('use scoped when component wants shadow, but shadow is not supported', () => {
      const supportsShadowDom = false;
      const cmpMeta: ComponentMeta = {
        encapsulation: ENCAPSULATION_TYPE.ShadowDom
      };
      expect(useScopedCss(supportsShadowDom, cmpMeta)).toBe(true);
    });

    it('use scoped when component wants no scoped', () => {
      const supportsShadowDom = true;
      const cmpMeta: ComponentMeta = {
        encapsulation: ENCAPSULATION_TYPE.ScopedCss
      };
      expect(useScopedCss(supportsShadowDom, cmpMeta)).toBe(true);
    });

  });

  describe('useShadowDom', () => {

    it('use shadow when component wants shadow, and its supported', () => {
      const supportsShadowDom = true;
      const cmpMeta: ComponentMeta = {
        encapsulation: ENCAPSULATION_TYPE.ShadowDom
      };
      expect(useShadowDom(supportsShadowDom, cmpMeta)).toBe(true);
    });

    it('should not use shadow when component wants shadow, but its not supported', () => {
      const supportsShadowDom = false;
      const cmpMeta: ComponentMeta = {
        encapsulation: ENCAPSULATION_TYPE.ShadowDom
      };
      expect(useShadowDom(supportsShadowDom, cmpMeta)).toBe(false);
    });

    it('should not use shadow when component wants scoped css encapsulation', () => {
      const supportsShadowDom = true;
      const cmpMeta: ComponentMeta = {
        encapsulation: ENCAPSULATION_TYPE.ScopedCss
      };
      expect(useShadowDom(supportsShadowDom, cmpMeta)).toBe(false);
    });

    it('should not use shadow when component does not want any encapsulation', () => {
      const supportsShadowDom = true;
      const cmpMeta: ComponentMeta = {
        encapsulation: ENCAPSULATION_TYPE.NoEncapsulation
      };
      expect(useShadowDom(supportsShadowDom, cmpMeta)).toBe(false);
    });

  });

});
