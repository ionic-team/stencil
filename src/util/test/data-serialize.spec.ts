import { CompiledModeStyles } from '../interfaces';
import { formatLoadComponents, formatLoadStyles } from '../data-serialize';


describe('data serialize', () => {

  describe('formatLoadStyles', () => {

    it('bracket notation', () => {
      const namespace = 'My-App';
      const styles: CompiledModeStyles[] = [
        { tag: 'cmp-a', modeName: 'ios', scopedStyles: 'body{color:red}' }
      ];
      const r = formatLoadStyles(namespace, styles, true);
      expect(r.split('(')[0]).toBe(`window['My-App'].loadStyles`);
    });

    it('dot notation', () => {
      const namespace = 'App';
      const styles: CompiledModeStyles[] = [
        { tag: 'cmp-a', modeName: 'ios', scopedStyles: 'body{color:red}' }
      ];
      const r = formatLoadStyles(namespace, styles, true);
      expect(r.split('(')[0]).toBe(`App.loadStyles`);
    });

  });

  describe('formatLoadComponents', () => {

    it('bracket notation', () => {
      const namespace = 'My-App';
      const moduleId = 'moduleId';
      const r = formatLoadComponents(namespace, moduleId, '', []);
      expect(r.split('(')[0]).toBe(`window['My-App'].loadComponents`);
    });

    it('dot notation', () => {
      const namespace = 'App';
      const moduleId = 'moduleId';
      const r = formatLoadComponents(namespace, moduleId, '', []);
      expect(r.split('(')[0]).toBe(`App.loadComponents`);
    });

  });

});
