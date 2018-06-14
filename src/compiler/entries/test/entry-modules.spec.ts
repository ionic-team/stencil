import * as d from '../../../declarations';
import { entryRequiresScopedStyles, getAppEntryTags, getEntryEncapsulations, getEntryModes,
  getUserConfigEntryTags, regroupEntryModules } from '../entry-modules';
import { ENCAPSULATION } from '../../../util/constants';


describe('graph-dependencies', () => {

  const allModules: d.ModuleFile[] = [
    { cmpMeta: { tagNameMeta: 'cmp-a' }, sourceFilePath: '/cmp-a.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-b' }, sourceFilePath: '/cmp-b.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-c' }, sourceFilePath: '/cmp-c.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-d' }, sourceFilePath: '/cmp-d.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-e' }, sourceFilePath: '/cmp-e.tsx' }
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
      const entryModule: d.EntryModule = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-a.tsx' },
        ]
      };
      const modes = getEntryEncapsulations(entryModule);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[1]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get all encapsulations', () => {
      const entryModule: d.EntryModule = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-a.tsx' },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-b.tsx' },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-c.tsx' },
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-d.tsx' },
        ]
      };
      const modes = getEntryEncapsulations(entryModule);
      expect(modes.length).toBe(3);
      expect(modes[0]).toBe(ENCAPSULATION.NoEncapsulation);
      expect(modes[1]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[2]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get no encapsulation', () => {
      const entryModule: d.EntryModule = {
        moduleFiles: [
          { cmpMeta: { }, sourceFilePath: '/cmp-a.tsx' },
        ]
      };
      const modes = getEntryEncapsulations(entryModule);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe(ENCAPSULATION.NoEncapsulation);
    });

  });

  describe('getBundleModes', () => {

    it('get specific modes and not default mode when theres a mix', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: { stylesMeta: { $: {} } }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { stylesMeta: { $: {} } }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } }, sourceFilePath: '/cmp-c.tsx' },
        { cmpMeta: { stylesMeta: { modeB: {} } }, sourceFilePath: '/cmp-d.tsx' },
        { cmpMeta: { stylesMeta: { modeA: {} } }, sourceFilePath: '/cmp-e.tsx' },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

    it('get modes only', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } }, sourceFilePath: '/cmp-b.tsx' },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

    it('get default only', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: { stylesMeta: { $: {} } }, sourceFilePath: '/cmp-a.tsx' },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe('$');
    });

    it('get default if no modes found', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: {}, sourceFilePath: '/cmp-a.tsx' },
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe('$');
    });

    it('get modes without dups', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: { stylesMeta: { modeB: {} } }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { stylesMeta: { modeA: {} } }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } }, sourceFilePath: '/cmp-c.tsx' }
      ];
      const modes = getEntryModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

  });

  describe('regroupEntryModules', () => {

    it('should prefer ShadowDom', () => {
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-c.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-d.tsx' },
      ];

      const entryPoints: d.EntryPoint[] = [
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
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-c.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-d.tsx' },
      ];

      const entryPoints: d.EntryPoint[] = [
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
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-c.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-d.tsx' },
      ];

      const entryPoints: d.EntryPoint[] = [
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
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-c', encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-c.tsx' },
      ];

      const entryPoints: d.EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' }, { tag: 'cmp-c' } ]
      ];

      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(3);
      expect(entryModules[0]).toHaveLength(1);
      expect(entryModules[1]).toHaveLength(1);
      expect(entryModules[2]).toHaveLength(1);
    });

    it('should add only ShadowDom', () => {
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-b.tsx' },
      ];
      const entryPoints: d.EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' } ]
      ];
      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(1);
      expect(entryModules[0]).toHaveLength(2);
    });

    it('should add only ScopedCss', () => {
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-b.tsx' },
      ];
      const entryPoints: d.EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' } ]
      ];
      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(1);
      expect(entryModules[0]).toHaveLength(2);
    });

    it('should add only NoEncapsulation', () => {
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b', encapsulation: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-b.tsx' },
        {/* empty on purpose */} as any
      ];
      const entryPoints: d.EntryPoint[] = [
        [ { tag: 'cmp-a' }, { tag: 'cmp-b' } ]
      ];
      const entryModules = regroupEntryModules(allModules, entryPoints);
      expect(entryModules).toHaveLength(1);
      expect(entryModules[0]).toHaveLength(2);
    });

  });

  describe('getAppEntryTags', () => {

    it('not get collection deps', () => {
      const allModules: d.ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a' }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { tagNameMeta: 'cmp-b' }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { tagNameMeta: 'collection-a' }, sourceFilePath: '/col-a.tsx', isCollectionDependency: true },
        { cmpMeta: { tagNameMeta: 'collection-b' }, sourceFilePath: '/col-b.tsx', isCollectionDependency: true },
      ];

      const entries = getAppEntryTags(allModules);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toBe('cmp-a');
      expect(entries[1]).toBe('cmp-b');
    });

  });

  describe('getUserConfigBundles', () => {

    const buildCtx: d.BuildCtx = {} as any;

    it('throw for invalid component not found', () => {
      expect(() => {
        const bundles: d.ConfigBundle[] = [
          { components: ['cmp-xyz'] }
        ];
        const entries = getUserConfigEntryTags(buildCtx, bundles, allModules);
      }).toThrow();
    });

    it('throw for invalid component tag', () => {
      expect(() => {
        const bundles: d.ConfigBundle[] = [
          { components: ['cmpxyz'] }
        ];
        const entries = getUserConfigEntryTags(buildCtx, bundles, allModules);
      }).toThrow();
    });

    it('sort with most first', () => {
      const bundles: d.ConfigBundle[] = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c', 'cmp-d', 'cmp-e'] }
      ];
      const entries = getUserConfigEntryTags(buildCtx, bundles, allModules);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toHaveLength(3);
      expect(entries[1]).toHaveLength(2);
    });

    it('add components', () => {

      const bundles: d.ConfigBundle[] = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c', 'cmp-d'] }
      ];
      const entries = getUserConfigEntryTags(buildCtx, bundles, allModules);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toHaveLength(2);
      expect(entries[1]).toHaveLength(2);
    });

    it('no components', () => {
      const bundles: d.ConfigBundle[] = [];
      const entries = getUserConfigEntryTags(buildCtx, bundles, []);
      expect(entries).toHaveLength(0);
    });

    it('no bundles', () => {
      const entries = getUserConfigEntryTags(buildCtx, null, []);
      expect(entries).toHaveLength(0);
    });

  });

});
