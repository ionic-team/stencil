import { CompilerCtx, ComponentMeta, Config, EntryModule, ModuleFile } from '../../../declarations';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../../util/constants';
import { getBundleIdDev, getBundleIdHashed, injectComponentStyleMode } from '../generate-bundles';
import { mockStencilSystem } from '../../../testing/mocks';
import { getStylePlaceholder } from '../../../util/data-serialize';


describe('generate-bundles', () => {

  describe('getBundleId', () => {

    it('get bundle id from hashed content', () => {
      const config: Config = { hashFileNames: true, hashedFileNameLength: 4 };
      config.sys = mockStencilSystem();

      const id = getBundleIdHashed(config, 'abcdefg');
      expect(id).toBe('l7xh');
    });

    it('get bundle id and sort with collection dependencies at the end', () => {
      const entryModule: EntryModule = {
        moduleFiles: [
          { cmpMeta: { tagNameMeta: 'cmp-z' } },
          { cmpMeta: { tagNameMeta: 'cmp-x' } },
          { cmpMeta: { tagNameMeta: 'cmp-b' }, isCollectionDependency: true },
          { cmpMeta: { tagNameMeta: 'cmp-a' }, isCollectionDependency: true }
        ]
      };
      const id = getBundleIdDev(entryModule, null);
      expect(id).toBe('cmp-x');
    });

    it('get bundle id from components and mode', () => {
      const entryModule: EntryModule = {
        moduleFiles: [
          { cmpMeta: { tagNameMeta: 'cmp-a' } },
          { cmpMeta: { tagNameMeta: 'cmp-b' } }
        ]
      };
      const id = getBundleIdDev(entryModule, 'ios');
      expect(id).toBe('cmp-a.ios');
    });

    it('get bundle id from components and default mode mode', () => {
      const entryModule: EntryModule = {
        moduleFiles: [
          { cmpMeta: { tagNameMeta: 'cmp-a' } },
          { cmpMeta: { tagNameMeta: 'cmp-b' } }
        ]
      };
      const id = getBundleIdDev(entryModule, null);
      expect(id).toBe('cmp-a');
    });

  });

  describe('injectComponentStyleMode', () => {

    it('inject mode style unscoped css when asking for scoped, but doesnt exist', () => {
      const cmpMeta: ComponentMeta = {
        stylesMeta: {
          ios: {
            compiledStyleText: 'ios-css'
          }
        }
      };
      const modeName = `ios`;
      const inputJs = getStylePlaceholder(cmpMeta.tagNameMeta);
      const outputJs = injectComponentStyleMode(cmpMeta, modeName, inputJs, true);
      expect(outputJs).toBe('ios-css');
    });

    it('inject mode style', () => {
      const cmpMeta: ComponentMeta = {
        stylesMeta: {
          ios: {
            compiledStyleText: 'ios-css'
          }
        }
      };
      const modeName = `ios`;
      const inputJs = getStylePlaceholder(cmpMeta.tagNameMeta);
      const outputJs = injectComponentStyleMode(cmpMeta, modeName, inputJs, false);
      expect(outputJs).toBe('ios-css');
    });

    it('inject default style when no matching mode', () => {
      const cmpMeta: ComponentMeta = {
        stylesMeta: {
          $: {
            compiledStyleText: 'default-css'
          }
        }
      };
      const modeName = `ios`;
      const inputJs = getStylePlaceholder(cmpMeta.tagNameMeta);
      const outputJs = injectComponentStyleMode(cmpMeta, modeName, inputJs, false);
      expect(outputJs).toBe('default-css');
    });

    it('inject default scoped style when no matching mode', () => {
      const cmpMeta: ComponentMeta = {
        stylesMeta: {
          $: {
            compiledStyleText: 'default-css',
            compiledStyleTextScoped: 'default-scoped-css'
          }
        }
      };
      const modeName = `ios`;
      const inputJs = getStylePlaceholder(cmpMeta.tagNameMeta);
      const outputJs = injectComponentStyleMode(cmpMeta, modeName, inputJs, true);
      expect(outputJs).toBe('default-scoped-css');
    });

    it('inject default scoped style', () => {
      const cmpMeta: ComponentMeta = {
        stylesMeta: {
          $: {
            compiledStyleText: 'default-css',
            compiledStyleTextScoped: 'default-scoped-css'
          }
        }
      };
      const modeName = DEFAULT_STYLE_MODE;
      const inputJs = getStylePlaceholder(cmpMeta.tagNameMeta);
      const outputJs = injectComponentStyleMode(cmpMeta, modeName, inputJs, true);
      expect(outputJs).toBe('default-scoped-css');
    });

    it('inject default style', () => {
      const cmpMeta: ComponentMeta = {
        stylesMeta: {
          $: {
            compiledStyleText: 'default-css'
          }
        }
      };
      const modeName = DEFAULT_STYLE_MODE;
      const inputJs = getStylePlaceholder(cmpMeta.tagNameMeta);
      const outputJs = injectComponentStyleMode(cmpMeta, modeName, inputJs, false);
      expect(outputJs).toBe('default-css');
    });

    it('inject empty string when no style', () => {
      const cmpMeta: ComponentMeta = {};
      const modeName = DEFAULT_STYLE_MODE;
      const inputJs = getStylePlaceholder(cmpMeta.tagNameMeta);
      const outputJs = injectComponentStyleMode(cmpMeta, modeName, inputJs, false);
      expect(outputJs).toBe('');
    });

  });

});
