import * as d from '../../../declarations';
import { sortBundleComponents, sortBundleModules } from '../generate-lazy-module';


describe('generate lazy modules', () => {

  describe('sortBundleModules', () => {

    it('sort by dependants', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'a', dependants: ['f', 'f', 'f'] })
        ]),
        bundle('y', [
          cmp({ tagName: 'b', dependants: ['a', 'f', 'f'] })
        ]),
        bundle('x', [
          cmp({ tagName: 'c', dependants: ['a', 'b', 'f'] })
        ])
      ].sort(sortBundleModules);

      expect(bundleModules[0].entryKey).toBe('x');
      expect(bundleModules[1].entryKey).toBe('y');
      expect(bundleModules[2].entryKey).toBe('z');
    });

    it('sort by dependants length', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'a', dependants: ['l', 'm', 'n'] })
        ]),
        bundle('y', [
          cmp({ tagName: 'b', dependants: ['o', 'p'] })
        ]),
        bundle('x', [
          cmp({ tagName: 'c', dependants: ['q'] })
        ])
      ].sort(sortBundleModules);

      expect(bundleModules[0].entryKey).toBe('x');
      expect(bundleModules[1].entryKey).toBe('y');
      expect(bundleModules[2].entryKey).toBe('z');
    });

    it('sort by dependencies', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'a', dependencies: ['c', 'b', 'f'] })
        ]),
        bundle('y', [
          cmp({ tagName: 'b', dependencies: ['c', 'f', 'f'] })
        ]),
        bundle('x', [
          cmp({ tagName: 'c', dependencies: ['f', 'f', 'f'] })
        ])
      ].sort(sortBundleModules);

      expect(bundleModules[0].entryKey).toBe('x');
      expect(bundleModules[1].entryKey).toBe('y');
      expect(bundleModules[2].entryKey).toBe('z');
    });

    it('sort by dependency length', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'a', dependencies: ['l'] })
        ]),
        bundle('y', [
          cmp({ tagName: 'b', dependencies: ['m', 'n'] })
        ]),
        bundle('x', [
          cmp({ tagName: 'c', dependencies: ['o', 'p', 'q'] })
        ])
      ].sort(sortBundleModules);

      expect(bundleModules[0].entryKey).toBe('x');
      expect(bundleModules[1].entryKey).toBe('y');
      expect(bundleModules[2].entryKey).toBe('z');
    });

    it('sort by cmps tag names', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'z' }),
          cmp({ tagName: 'c' })
        ]),
        bundle('y', [
          cmp({ tagName: 'y' }),
          cmp({ tagName: 'b' })
        ]),
        bundle('x', [
          cmp({ tagName: 'z' }),
          cmp({ tagName: 'a' })
        ])
      ].sort(sortBundleModules);

      expect(bundleModules[0].entryKey).toBe('x');
      expect(bundleModules[1].entryKey).toBe('y');
      expect(bundleModules[2].entryKey).toBe('z');
    });

    it('sort by number of cmps', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'f' })
        ]),
        bundle('y', [
          cmp({ tagName: 'd' }),
          cmp({ tagName: 'e' })
        ]),
        bundle('x', [
          cmp({ tagName: 'a' }),
          cmp({ tagName: 'b' }),
          cmp({ tagName: 'c' })
        ])
      ].sort(sortBundleModules);

      expect(bundleModules[0].entryKey).toBe('x');
      expect(bundleModules[1].entryKey).toBe('y');
      expect(bundleModules[2].entryKey).toBe('z');
    });

  });

  describe('sortBundleComponents', () => {

    it('sort bundle cmps by dependencies length, more dependencies go to top', () => {
      const cmps = [
        cmp({ testId: 2, dependencies: [] }),
        cmp({ testId: 1, dependencies: ['z'] }),
        cmp({ testId: 0, dependencies: ['x', 'y'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by dependants length, more dependants go to bottom', () => {
      const cmps = [
        cmp({ testId: 2, dependants: ['x', 'y'] }),
        cmp({ testId: 1, dependants: ['z'] }),
        cmp({ testId: 0, dependants: [] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by dependencies', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', dependencies: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', dependencies: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', dependencies: ['f', 'f', 'f'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by directDependencies', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', directDependencies: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', directDependencies: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', directDependencies: ['f', 'f', 'f'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by dependants', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', dependants: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', dependants: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', dependants: ['f', 'f', 'f'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by directDependants', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', directDependants: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', directDependants: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', directDependants: ['f', 'f', 'f'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by dependants', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', dependants: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', dependants: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', dependants: ['f', 'f', 'f'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by tagname', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'c' }),
        cmp({ testId: 1, tagName: 'b' }),
        cmp({ testId: 0, tagName: 'a' })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

  });

  function cmp(c: { testId?: number, tagName?: string, dependants?: string[], directDependants?: string[], dependencies?: string[], directDependencies?: string[] }) {
    const r: TestComponentCompilerMeta = {
      testId: c.testId || 0,
      tagName: c.tagName || 'a',
      dependants: c.dependants || [],
      directDependants: c.directDependants || [],
      dependencies: c.dependencies || [],
      directDependencies: c.directDependencies || []
    } as any;
    return r;
  }

  interface TestComponentCompilerMeta extends d.ComponentCompilerMeta {
    testId: number;
  }

  function bundle(entryKey: string, cmps: d.ComponentCompilerMeta[]) {
    const bundleModule: d.BundleModule = {
      entryKey: entryKey,
      cmps: cmps
    } as any;
    return bundleModule;
  }

});
