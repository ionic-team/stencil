import { ComponentMeta } from '../../../../util/interfaces';
import { ENCAPSULATION } from '../../../../util/constants';
import { normalizeEncapsulation } from '../component-decorator';


describe('component decorator', () => {

  describe('normalizeEncapsulation', () => {

    it('force shadow encapsulation with both shadow and scoped set', () => {
      const cmpMeta: ComponentMeta = {};
      normalizeEncapsulation({
        tag: 'ion-tag',
        shadow: true,
        scoped: true
      }, cmpMeta);
      expect(cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);
    });

    it('set shadow encapsulation', () => {
      const cmpMeta: ComponentMeta = {};
      normalizeEncapsulation({
        tag: 'ion-tag',
        shadow: true
      }, cmpMeta);
      expect(cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);
    });

    it('set scoped css encapsulation', () => {
      const cmpMeta: ComponentMeta = {};
      normalizeEncapsulation({
        tag: 'ion-tag',
        scoped: true,
      }, cmpMeta);
      expect(cmpMeta.encapsulation).toBe(ENCAPSULATION.ScopedCss);
    });

    it('default no encapsulation', () => {
      const cmpMeta: ComponentMeta = {};
      normalizeEncapsulation({ tag: 'ion-tag' }, cmpMeta);
      expect(cmpMeta.encapsulation).toBe(ENCAPSULATION.NoEncapsulation);
    });

  });

});
