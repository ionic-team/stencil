import { BuildConfig, BuildContext, Bundle, ComponentMeta, ModuleFile } from '../../../util/interfaces';
import { getManifestBundleModes } from '../bundle-styles';


describe('bundle-styles', () => {

  describe('getManifestBundleModes', () => {

    it('only get module files with style meta', () => {
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', stylesMeta: { md: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-c' } },
        { }
      ];

      const modes = getManifestBundleModes(allModuleFiles);

      expect(modes[0]).toBe('ios');
      expect(modes[1]).toBe('md');
      expect(modes.length).toBe(2);
    });

  });

});
