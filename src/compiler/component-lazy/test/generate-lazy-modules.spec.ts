import * as d from '../../../declarations';
import { sortBundleComponents, sortBundleModules } from '../generate-lazy-module';


describe('generate lazy modules', () => {

  describe('sortBundleModules', () => {

    it('sort by dependents', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'a', dependents: ['f', 'f', 'f'] })
        ]),
        bundle('y', [
          cmp({ tagName: 'b', dependents: ['a', 'f', 'f'] })
        ]),
        bundle('x', [
          cmp({ tagName: 'c', dependents: ['a', 'b', 'f'] })
        ])
      ].sort(sortBundleModules);

      expect(bundleModules[0].entryKey).toBe('x');
      expect(bundleModules[1].entryKey).toBe('y');
      expect(bundleModules[2].entryKey).toBe('z');
    });

    it('sort by dependents length', () => {
      const bundleModules = [
        bundle('z', [
          cmp({ tagName: 'a', dependents: ['l', 'm', 'n'] })
        ]),
        bundle('y', [
          cmp({ tagName: 'b', dependents: ['o', 'p'] })
        ]),
        bundle('x', [
          cmp({ tagName: 'c', dependents: ['q'] })
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

    it('sort bundle cmps by dependents length, more dependents go to bottom', () => {
      const cmps = [
        cmp({ testId: 2, dependents: ['x', 'y'] }),
        cmp({ testId: 1, dependents: ['z'] }),
        cmp({ testId: 0, dependents: [] })
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

    it('sort bundle cmps by dependents', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', dependents: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', dependents: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', dependents: ['f', 'f', 'f'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by directDependents', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', directDependents: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', directDependents: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', directDependents: ['f', 'f', 'f'] })
      ].sort(sortBundleComponents);

      expect(cmps[0].testId).toBe(0);
      expect(cmps[1].testId).toBe(1);
      expect(cmps[2].testId).toBe(2);
    });

    it('sort bundle cmps by dependents', () => {
      const cmps = [
        cmp({ testId: 2, tagName: 'x', dependents: ['z', 'y', 'f'] }),
        cmp({ testId: 1, tagName: 'y', dependents: ['z', 'f', 'f'] }),
        cmp({ testId: 0, tagName: 'z', dependents: ['f', 'f', 'f'] })
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

  function cmp(c: { testId?: number, tagName?: string, dependents?: string[], directDependents?: string[], dependencies?: string[], directDependencies?: string[] }) {
    const r: TestComponentCompilerMeta = {
      testId: c.testId || 0,
      tagName: c.tagName || 'a',
      dependents: c.dependents || [],
      directDependents: c.directDependents || [],
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
