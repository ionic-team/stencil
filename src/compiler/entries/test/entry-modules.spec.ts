import * as d from '../../../declarations';
import { getAppEntryTags, getEntryEncapsulations, getEntryModes,
  getUserConfigEntryTags, regroupEntryModules } from '../entry-modules';
import { ENCAPSULATION } from '@utils';


describe('graph-dependencies', () => {

  const allModules: d.ModuleFile[] = [
    { cmpMeta: { tagNameMeta: 'cmp-a' }, sourceFilePath: '/cmp-a.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-b' }, sourceFilePath: '/cmp-b.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-c' }, sourceFilePath: '/cmp-c.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-d' }, sourceFilePath: '/cmp-d.tsx' },
    { cmpMeta: { tagNameMeta: 'cmp-e' }, sourceFilePath: '/cmp-e.tsx' }
  ];

  describe('getBundleEncapsulations', () => {

    it('should add scoped when using shadow', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: { encapsulationMeta: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-a.tsx' },
      ];
      const modes = getEntryEncapsulations(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[1]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get all encapsulations', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: { encapsulationMeta: ENCAPSULATION.NoEncapsulation }, sourceFilePath: '/cmp-a.tsx' },
        { cmpMeta: { encapsulationMeta: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-b.tsx' },
        { cmpMeta: { encapsulationMeta: ENCAPSULATION.ScopedCss }, sourceFilePath: '/cmp-c.tsx' },
        { cmpMeta: { encapsulationMeta: ENCAPSULATION.ShadowDom }, sourceFilePath: '/cmp-d.tsx' },
      ];
      const modes = getEntryEncapsulations(moduleFiles);
      expect(modes.length).toBe(3);
      expect(modes[0]).toBe(ENCAPSULATION.NoEncapsulation);
      expect(modes[1]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[2]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get no encapsulation', () => {
      const moduleFiles: d.ModuleFile[] = [
        { cmpMeta: { }, sourceFilePath: '/cmp-a.tsx' },
      ];
      const modes = getEntryEncapsulations(moduleFiles);
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
