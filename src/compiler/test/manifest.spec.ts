import { Bundle, Collection, ComponentMeta, Manifest, ModuleFileMeta } from '../interfaces';
import { convertManifestUrlToRelative, processDependentManifest } from '../manifest';
import { mockStencilSystem } from '../../test';
import { validateDependentCollection } from '../validation';


describe('manifest', () => {
  const sys = mockStencilSystem();

  describe('processDependentManifest', () => {

    it('should remove components not found in user bundles if includeBundledOnly is true', () => {
      const bundles: Bundle[] = [
        { components: ['cmp-a'] },
        { components: ['cmp-b', 'cmp-e'] }
      ];
      const dependentCollection: Collection = {
        name: '@awesome/collection',
        includeBundledOnly: true
      };
      const dependentManifest: Manifest = {
        components: [
          { tagNameMeta: 'cmp-a' },
          { tagNameMeta: 'cmp-b' },
          { tagNameMeta: 'cmp-c' },
          { tagNameMeta: 'cmp-d' },
          { tagNameMeta: 'cmp-e' }
        ]
      };

      const manifest = processDependentManifest(bundles, dependentCollection, dependentManifest);

      expect(manifest.components.length).toBe(3);
      expect(manifest.components[0].tagNameMeta).toBe('cmp-a');
      expect(manifest.components[1].tagNameMeta).toBe('cmp-b');
      expect(manifest.components[2].tagNameMeta).toBe('cmp-e');
    });

    it('should keep all components if includeBundledOnly is falsy', () => {
      const bundles: Bundle[] = [];
      const dependentCollection: Collection = { name: '@awesome/collection' };
      const dependentManifest: Manifest = {
        components: [
          { tagNameMeta: 'cmp-a' },
          { tagNameMeta: 'cmp-b' },
          { tagNameMeta: 'cmp-c' }
        ]
      };

      const manifest = processDependentManifest(bundles, dependentCollection, dependentManifest);

      expect(manifest.components.length).toBe(3);
    });

  });

  describe('convertManifestUrlToRelative', () => {

    it('should create styleUrls unix relative path', () => {
      const collectionDest = '/Users/some/root/dist/collection';
      const moduleFile: ModuleFileMeta = {
        jsFilePath: '/Users/some/root/dist/collection/components/badge/badge.js'
      };
      const cmpMeta: ComponentMeta = {
        styleMeta: {
          ios: {
            parsedStyleUrls: ['badge.ios.scss']
          },
          md: {
            parsedStyleUrls: ['badge.md.scss', 'nested/badge.md.scss']
          }
        }
      };

      convertManifestUrlToRelative(sys, collectionDest, moduleFile, cmpMeta);

      expect(cmpMeta.styleMeta.ios.styleUrls[0]).toBe('components/badge/badge.ios.scss');
      expect(cmpMeta.styleMeta.md.styleUrls[0]).toBe('components/badge/badge.md.scss');
      expect(cmpMeta.styleMeta.md.styleUrls[1]).toBe('components/badge/nested/badge.md.scss');
    });

    it('should create styleUrls windows relative path', () => {
      const collectionDest = 'C:\\some\\root\\dist\\collection';
      const moduleFile: ModuleFileMeta = {
        jsFilePath: 'C:\\some\\root\\dist\\collection\\components\\badge\\badge.js'
      };
      const cmpMeta: ComponentMeta = {
        styleMeta: {
          ios: {
            parsedStyleUrls: ['badge.ios.scss']
          },
          md: {
            parsedStyleUrls: ['badge.md.scss', 'nested\\badge.md.scss']
          }
        }
      };

      convertManifestUrlToRelative(sys, collectionDest, moduleFile, cmpMeta);

      expect(cmpMeta.styleMeta.ios.styleUrls[0]).toBe('components/badge/badge.ios.scss');
      expect(cmpMeta.styleMeta.md.styleUrls[0]).toBe('components/badge/badge.md.scss');
      expect(cmpMeta.styleMeta.md.styleUrls[1]).toBe('components/badge/nested/badge.md.scss');
    });

    it('should create componentUrl unix relative path', () => {
      const collectionDest = '/Users/some/root/dist/collection';
      const moduleFile: ModuleFileMeta = {
        jsFilePath: '/Users/some/root/dist/collection/components/cmp-a.js'
      };
      const cmpMeta: ComponentMeta = {};

      convertManifestUrlToRelative(sys, collectionDest, moduleFile, cmpMeta);

      expect(cmpMeta.componentUrl).toBe('components/cmp-a.js');
    });

    it('should create componentUrl windows relative path', () => {
      const collectionDest = 'C:\\some\\root\\dist\\collection';
      const moduleFile: ModuleFileMeta = {
        jsFilePath: 'C:\\some\\root\\dist\\collection\\components\\cmp-a.js'
      };
      const cmpMeta: ComponentMeta = {};

      convertManifestUrlToRelative(sys, collectionDest, moduleFile, cmpMeta);

      expect(cmpMeta.componentUrl).toBe('components/cmp-a.js');
    });

  });

  describe('validateDependentCollection', () => {

    it('should set includeBundledOnly', () => {
      const collection = validateDependentCollection({
        name: '@ionic/core',
        includeBundledOnly: true
      });
      expect(collection.includeBundledOnly).toBe(true);
    });

    it('should use the same collection object', () => {
      const collection = validateDependentCollection({
        name: '@ionic/core'
      });
      expect(collection.name).toBe('@ionic/core');
      expect(collection.includeBundledOnly).toBe(false);
    });

    it('should convert a string value to a collection object', () => {
      const collection = validateDependentCollection('@ionic/core');
      expect(collection.name).toBe('@ionic/core');
      expect(collection.includeBundledOnly).toBe(false);
    });

  });

});
