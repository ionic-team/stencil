import { BuildConfig, BuildContext, Bundle, ComponentMeta, ModuleFile } from '../../../util/interfaces';
import { getModuleFilesWithStyles } from '../bundle-styles';


describe('bundle-styles', () => {

  describe('getModuleFilesWithStyles', () => {

    it('only get module files with style meta', () => {
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', stylesMeta: { md: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-c' } },
        { }
      ];

      const moduleFiles = getModuleFilesWithStyles(allModuleFiles);

      expect(moduleFiles[0].cmpMeta.tagNameMeta).toBe('cmp-b');
      expect(moduleFiles[1].cmpMeta.tagNameMeta).toBe('cmp-d');
      expect(moduleFiles.length).toBe(2);
    });

  });

});
