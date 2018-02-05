import { ConfigBundle, EntryModule, EntryPoint, ModuleFile } from '../../../declarations';
import { entryRequiresScopedStyles, getAppEntryTags, getEntryEncapsulations, getEntryModes,
  getUserConfigEntryTags, regroupEntryModules } from '../entry-modules';
import { ENCAPSULATION } from '../../../util/constants';


describe('graph-dependencies', () => {

  const allModules: ModuleFile[] = [
    { cmpMeta: { tagNameMeta: 'cmp-a' } },
    { cmpMeta: { tagNameMeta: 'cmp-b' } },
    { cmpMeta: { tagNameMeta: 'cmp-c' } },
    { cmpMeta: { tagNameMeta: 'cmp-d' } },
    { cmpMeta: { tagNameMeta: 'cmp-e' } }
  ];

  describe('bundleRequiresScopedStyles', () => {

    it('scoped if using shadow', () => {
      const requiresScopedCss = entryRequiresScopedStyles([
        ENCAPSULATION.ShadowDom
      ]);
      expect(requiresScopedCss).toBe(true);
    });

    it('scoped if using scoped', () => {
      const requiresScopedCss = entryRequiresScopedStyles([
        ENCAPSULATION.ScopedCss
      ]);
      expect(requiresScopedCss).toBe(true);
    });

    it('no scoped if only using no encapsulation', () => {
      const requiresScopedCss = entryRequiresScopedStyles([
        ENCAPSULATION.NoEncapsulation, ENCAPSULATION.NoEncapsulation
      ]);
      expect(requiresScopedCss).toBe(false);
    });

    it('no scoped if empty', () => {
      const requiresScopedCss = entryRequiresScopedStyles([]);
      expect(requiresScopedCss).toBe(false);
    });

  });

  describe('getBundleEncapsulations', () => {

    it('should add scoped when using shadow', () => {
      const entryModule: EntryModule = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } },
        ]
      };
      const modes = getEntryEncapsulations(entryModule);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[1]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get all encapsulations', () => {
      const entryModule: EntryModule = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } },
        ]
      };
      const modes = getEntryEncapsulations(entryModule);
      expect(modes.length).toBe(3);
      expect(modes[0]).toBe(ENCAPSULATION.NoEncapsulation);
      expect(modes[1]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[2]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get no encapsulation', () => {
      const entryModule: EntryModule = {
        moduleFiles: [
          { cmpMeta: { } },
        ]
      };
      const modes = getEntryEncapsulations(entryModule);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe(ENCAPSULATION.NoEncapsulation);
    });

  });

  describe('getBundleModes', () => {

    it('get specific modes and not default mode when theres a mix', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { $: {} } } },
        { cmpMeta: { stylesMeta: { $: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {} } } },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

    it('get modes only', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

    it('get default only', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { $: {} } } },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe('$');
    });

    it('get default if no modes found', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: {} },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe('$');
    });

    it('get modes without dups', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } }
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

  });

  describe('regroupEntryModules', () => {

    it('should prefer ShadowDom', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation } },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss } },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ShadowDom } },
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ShadowDom } },
      ];

      const entryPoints: EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' }, { tag: 'cmp-c' }, { tag: 'cmp-d' } ]
      ];

      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(3);
      expect(entryModules[0]).toHaveLength(1);
      expect(entryModules[0][0].cmpMeta.tagNameMeta).toBe('cmp-a');
      expect(entryModules[1]).toHaveLength(1);
      expect(entryModules[1][0].cmpMeta.tagNameMeta).toBe('cmp-b');
      expect(entryModules[2]).toHaveLength(2);
      expect(entryModules[2][0].cmpMeta.tagNameMeta).toBe('cmp-c');
      expect(entryModules[2][1].cmpMeta.tagNameMeta).toBe('cmp-d');
    });

    it('should prefer ScopedCss', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation } },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss } },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ScopedCss } },
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ShadowDom } },
      ];

      const entryPoints: EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' }, { tag: 'cmp-c' }, { tag: 'cmp-d' } ]
      ];

      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(3);
      expect(entryModules[0]).toHaveLength(1);
      expect(entryModules[0][0].cmpMeta.tagNameMeta).toBe('cmp-a');
      expect(entryModules[2]).toHaveLength(1);
      expect(entryModules[1][0].cmpMeta.tagNameMeta).toBe('cmp-b');
      expect(entryModules[1][1].cmpMeta.tagNameMeta).toBe('cmp-c');
      expect(entryModules[2]).toHaveLength(1);
      expect(entryModules[2][0].cmpMeta.tagNameMeta).toBe('cmp-d');
    });

    it('should prefer NoEncapsulation', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation } },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.NoEncapsulation } },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ScopedCss } },
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ShadowDom } },
      ];

      const entryPoints: EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' }, { tag: 'cmp-c' }, { tag: 'cmp-d' } ]
      ];

      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(3);
      expect(entryModules[0]).toHaveLength(2);
      expect(entryModules[0][0].cmpMeta.tagNameMeta).toBe('cmp-a');
      expect(entryModules[0][1].cmpMeta.tagNameMeta).toBe('cmp-b');
      expect(entryModules[1]).toHaveLength(1);
      expect(entryModules[1][0].cmpMeta.tagNameMeta).toBe('cmp-c');
      expect(entryModules[2]).toHaveLength(1);
      expect(entryModules[2][0].cmpMeta.tagNameMeta).toBe('cmp-d');
    });

    it('should evenly split when all the same', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation } },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss } },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ShadowDom } },
      ];

      const entryPoints: EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' }, { tag: 'cmp-c' } ]
      ];

      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(3);
      expect(entryModules[0]).toHaveLength(1);
      expect(entryModules[1]).toHaveLength(1);
      expect(entryModules[2]).toHaveLength(1);
    });

    it('should add only ShadowDom', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.ShadowDom } },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ShadowDom } },
      ];
      const entryPoints: EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' } ]
      ];
      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(1);
      expect(entryModules[0]).toHaveLength(2);
    });

    it('should add only ScopedCss', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.ScopedCss } },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss } },
      ];
      const entryPoints: EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' } ]
      ];
      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(1);
      expect(entryModules[0]).toHaveLength(2);
    });

    it('should add only NoEncapsulation', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation } },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.NoEncapsulation } },
        {/* empty on purpose */}
      ];
      const entryPoints: EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' } ]
      ];
      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(1);
      expect(entryModules[0]).toHaveLength(2);
    });

  });

  describe('getAppEntryTags', () => {

    it('not get collection deps', () => {
      const allModules: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a' } },
        { cmpMeta: { tagNameMeta: 'cmp-b' } },
        { cmpMeta: { tagNameMeta: 'collection-a' }, isCollectionDependency: true },
        { cmpMeta: { tagNameMeta: 'collection-b' }, isCollectionDependency: true },
      ];

      const entries = getAppEntryTags(allModules);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toBe('cmp-a');
      expect(entries[1]).toBe('cmp-b');
    });

  });

  describe('getUserConfigBundles', () => {

    it('throw for invalid component not found', () => {
      expect(() => {
        const bundles: ConfigBundle[] = [
          { components: ['cmp-xyz'] }
        ];
        const entries = getUserConfigEntryTags(bundles, allModules);
      }).toThrow();
    });

    it('throw for invalid component tag', () => {
      expect(() => {
        const bundles: ConfigBundle[] = [
          { components: ['cmpxyz'] }
        ];
        const entries = getUserConfigEntryTags(bundles, allModules);
      }).toThrow();
    });

    it('sort with most first', () => {
      const bundles: ConfigBundle[] = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c', 'cmp-d', 'cmp-e'] }
      ];
      const entries = getUserConfigEntryTags(bundles, allModules);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toHaveLength(3);
      expect(entries[1]).toHaveLength(2);
    });

    it('add components', () => {

      const bundles: ConfigBundle[] = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c', 'cmp-d'] }
      ];
      const entries = getUserConfigEntryTags(bundles, allModules);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toHaveLength(2);
      expect(entries[1]).toHaveLength(2);
    });

    it('no components', () => {
      const bundles: ConfigBundle[] = [];
      const entries = getUserConfigEntryTags(bundles, []);
      expect(entries).toHaveLength(0);
    });

    it('no bundles', () => {
      const entries = getUserConfigEntryTags(null, []);
      expect(entries).toHaveLength(0);
    });

  });

});
