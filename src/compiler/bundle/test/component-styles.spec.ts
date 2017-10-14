import { BuildContext, BuildConfig, ComponentMeta, CompiledModeStyles, ModuleFile } from '../../../util/interfaces';
import { componentRequiresScopedStyles } from '../../util';
import { ENCAPSULATION } from '../../../util/constants';
import { fillStyleText, groupComponentModeStyles } from '../component-styles';


describe('component-styles', () => {

  describe('fillStyleText', () => {

    it('should create scoped styles', () => {
      const cmpMeta: ComponentMeta = {
        tagNameMeta: 'my-tag',
        encapsulation: ENCAPSULATION.ScopedCss
      };
      const compiledModeStyles: CompiledModeStyles = {};
      fillStyleText(config, ctx, cmpMeta, compiledModeStyles, 'h1{color:blue;}');
      expect(compiledModeStyles.unscopedStyles).toBe('h1{color:blue;}');
      expect(compiledModeStyles.scopedStyles).toBe('h1[data-my-tag]{color:blue;}');
    });

    it('should not create scoped styles', () => {
      const cmpMeta: ComponentMeta = {
        tagNameMeta: 'my-tag'
      };
      const compiledModeStyles: CompiledModeStyles = {};
      fillStyleText(config, ctx, cmpMeta, compiledModeStyles, 'h1{color:blue;}');
      expect(compiledModeStyles.unscopedStyles).toBe('h1{color:blue;}');
      expect(compiledModeStyles.scopedStyles).toBe(null);
    });

  });

  describe('groupComponentModeStyles', () => {

    it('should concat w/ correct order and group', () => {
      const cmpMeta: ComponentMeta = { tagNameMeta: 'my-tag' };
      const modeName = 'ios';
      const compiledModeStyles: CompiledModeStyles[] = [
        { styleOrder: 99, unscopedStyles: 'h99{}', scopedStyles: 'h99[a]{}' },
        { styleOrder: 1, unscopedStyles: 'h1{}', scopedStyles: 'h1[a]{}' },
        { styleOrder: 55, unscopedStyles: 'h55{}', scopedStyles: 'h55[a]{}' }
      ];

      const groupedCmpStyleDetail = groupComponentModeStyles(cmpMeta.tagNameMeta, modeName, compiledModeStyles);

      expect(groupedCmpStyleDetail.unscopedStyles).toBe('h1{}\n\nh55{}\n\nh99{}');
      expect(groupedCmpStyleDetail.scopedStyles).toBe('h1[a]{}\n\nh55[a]{}\n\nh99[a]{}');
    });

  });

  describe('componentRequiresScopedStyles', () => {

    it('create scoped for scoped css', () => {
      expect(componentRequiresScopedStyles(ENCAPSULATION.ScopedCss)).toBe(true);
    });

    it('create scoped for shadow dom', () => {
      expect(componentRequiresScopedStyles(ENCAPSULATION.ShadowDom)).toBe(true);
    });

    it('not create scoped', () => {
      expect(componentRequiresScopedStyles(ENCAPSULATION.NoEncapsulation)).toBe(false);
    });

  });

  let config: BuildConfig = {};
  let ctx: BuildContext = {};


});
