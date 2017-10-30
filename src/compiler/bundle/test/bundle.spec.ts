import { Bundle, Diagnostic, ManifestBundle, ModuleFile } from '../../../util/interfaces';
import { ENCAPSULATION } from '../../../util/constants';
import { getManifestBundles, findPrimaryEncapsulation, sortBundles, validateManifestBundle } from '../bundle';


describe('bundle', () => {

  describe('validateManifestBundle', () => {

    it('should add when majority shadow, secondary scoped and no encapsulation', () => {
      const validatedBundles: ManifestBundle[] = [];
      const manifestBundle: ManifestBundle = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom, stylesMeta: {} } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom, stylesMeta: {} } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom, stylesMeta: {} } },
          { cmpMeta: { } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss, stylesMeta: {} } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss, stylesMeta: {} } },
          { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation, stylesMeta: {} } }
        ],
      };
      validateManifestBundle(validatedBundles, manifestBundle);
      expect(validatedBundles.length).toBe(3);
      expect(validatedBundles[0].moduleFiles.length).toBe(4);
      expect(validatedBundles[0].moduleFiles[0].cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);
      expect(validatedBundles[0].moduleFiles[1].cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);
      expect(validatedBundles[0].moduleFiles[2].cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);

      expect(validatedBundles[1].moduleFiles.length).toBe(2);
      expect(validatedBundles[1].moduleFiles[0].cmpMeta.encapsulation).toBe(ENCAPSULATION.ScopedCss);
      expect(validatedBundles[1].moduleFiles[1].cmpMeta.encapsulation).toBe(ENCAPSULATION.ScopedCss);

      expect(validatedBundles[2].moduleFiles.length).toBe(1);
      expect(validatedBundles[2].moduleFiles[0].cmpMeta.encapsulation).toBe(ENCAPSULATION.NoEncapsulation);
    });

    it('should add when all no encapsulation', () => {
      const validatedBundles: ManifestBundle[] = [];
      const manifestBundle: ManifestBundle = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation } },
          { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation } }
        ],
      };
      validateManifestBundle(validatedBundles, manifestBundle);
      expect(validatedBundles.length).toBe(1);
      expect(validatedBundles[0].moduleFiles.length).toBe(2);
    });

    it('should add when all scoped', () => {
      const validatedBundles: ManifestBundle[] = [];
      const manifestBundle: ManifestBundle = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } }
        ],
      };
      validateManifestBundle(validatedBundles, manifestBundle);
      expect(validatedBundles.length).toBe(1);
      expect(validatedBundles[0].moduleFiles.length).toBe(2);
    });

    it('should add when all shadow', () => {
      const validatedBundles: ManifestBundle[] = [];
      const manifestBundle: ManifestBundle = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } }
        ]
      };
      validateManifestBundle(validatedBundles, manifestBundle);
      expect(validatedBundles.length).toBe(1);
      expect(validatedBundles[0].moduleFiles.length).toBe(2);
    });

    it('should add when only 1 module', () => {
      const validatedBundles: ManifestBundle[] = [];
      const moduleFile: ModuleFile = {};
      const manifestBundle: ManifestBundle = {
        moduleFiles: [moduleFile]
      };
      validateManifestBundle(validatedBundles, manifestBundle);
      expect(validatedBundles[0]).toBe(manifestBundle);
      expect(validatedBundles[0].moduleFiles[0]).toBe(moduleFile);
      expect(validatedBundles.length).toBe(1);
    });

    it('should not add when no module files', () => {
      const validatedBundles: ManifestBundle[] = [];
      const manifestBundle: ManifestBundle = {
        moduleFiles: []
      };
      validateManifestBundle(validatedBundles, manifestBundle);
      expect(validatedBundles.length).toBe(0);
    });

  });

  describe('findPrimaryEncapsulation', () => {

    it('find no ecapsulation as primary', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation } },
        { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation } }
      ];
      expect(findPrimaryEncapsulation(moduleFiles)).toBe(ENCAPSULATION.NoEncapsulation);
    });

    it('find scoped as primary', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } },
        { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } }
      ];
      expect(findPrimaryEncapsulation(moduleFiles)).toBe(ENCAPSULATION.ScopedCss);
    });

    it('find shadow as primary', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } },
        { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } }
      ];
      expect(findPrimaryEncapsulation(moduleFiles)).toBe(ENCAPSULATION.ShadowDom);
    });

  });

  describe('getManifestBundles', () => {

    it('should error when component isnt found in bundle', () => {
      const bundles: Bundle[] = [
        { components: ['cmp-b', 'cmp-a', 'cmp-z'] },
      ];
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {}, wp: {} } } },
      ];
      const diagnostics: Diagnostic[] = [];

      const manifestBundles = getManifestBundles(allModuleFiles, bundles, diagnostics);

      expect(manifestBundles.length).toBe(1);
      expect(manifestBundles[0].moduleFiles.length).toBe(2);
      expect(diagnostics.length).toBe(1);
    });

    it('not bundle with no components', () => {
      const bundles: Bundle[] = [
        { components: ['cmp-d', 'cmp-e'] },
        { components: ['cmp-b', 'cmp-a'] },
        { components: [] },
      ];
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', stylesMeta: { md: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {}, wp: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-e', stylesMeta: { ios: {} } } },
      ];
      const diagnostics: Diagnostic[] = [];

      const manifestBundles = getManifestBundles(allModuleFiles, bundles, diagnostics);

      expect(manifestBundles.length).toBe(2);
      expect(diagnostics.length).toBe(0);
    });

    it('load bundles and sort alpha', () => {
      const bundles: Bundle[] = [
        { components: ['cmp-e', 'cmp-d'] },
        { components: ['cmp-b', 'cmp-a'] },
        { components: ['cmp-c'] },
      ];
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', stylesMeta: { md: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {}, wp: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-e', stylesMeta: { ios: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-c' } },
        {}
      ];
      const diagnostics: Diagnostic[] = [];

      let manifestBundles = getManifestBundles(allModuleFiles, bundles, diagnostics);
      manifestBundles = sortBundles(manifestBundles);

      expect(manifestBundles[0].moduleFiles[0].cmpMeta.tagNameMeta).toBe('cmp-a');
      expect(manifestBundles[0].moduleFiles[1].cmpMeta.tagNameMeta).toBe('cmp-b');
      expect(manifestBundles[1].moduleFiles[0].cmpMeta.tagNameMeta).toBe('cmp-c');
      expect(manifestBundles[2].moduleFiles[0].cmpMeta.tagNameMeta).toBe('cmp-d');
      expect(manifestBundles[2].moduleFiles[1].cmpMeta.tagNameMeta).toBe('cmp-e');
      expect(manifestBundles.length).toBe(3);
      expect(diagnostics.length).toBe(0);
    });

  });

});
