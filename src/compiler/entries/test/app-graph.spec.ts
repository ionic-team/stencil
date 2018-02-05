import { ModuleFile } from '../../../declarations';
import { processAppGraph } from '../app-graph';


describe('processAppGraph', () => {

  it('circular', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'x', dependencies: ['y', 'x'] } },
      { cmpMeta: { tagNameMeta: 'y', dependencies: ['z', 'z'] } },
      { cmpMeta: { tagNameMeta: 'z', dependencies: ['x'] } },
    ];
    const entryTags = [
      'z', 'x', 'y'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'x', dependencyOf: ['z'] },
      { tag: 'y', dependencyOf: [] },
      { tag: 'z', dependencyOf: ['y'] }
    ]);
  });

  it('random orders 2', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'y', dependencies: ['x', 'w', 'v'] } },
      { cmpMeta: { tagNameMeta: 'v' } },
      { cmpMeta: { tagNameMeta: 'x', dependencies: ['w', 'v'] } },
      { cmpMeta: { tagNameMeta: 'z', dependencies: ['v', 'x', 'w'] } },
      { cmpMeta: { tagNameMeta: 'w' } },
    ];
    const entryTags = [
      'y', 'z'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([
      { tag: 'v', dependencyOf: ['y', 'z'] },
      { tag: 'w', dependencyOf: ['y', 'z'] },
      { tag: 'x', dependencyOf: ['y', 'z'] }
    ]);
    expect(g[1]).toEqual([{ tag: 'y', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'z', dependencyOf: [] }]);
  });

  it('random orders 1', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'w' } },
      { cmpMeta: { tagNameMeta: 'y', dependencies: ['w', 'x', 'v'] } },
      { cmpMeta: { tagNameMeta: 'x', dependencies: ['w', 'v'] } },
      { cmpMeta: { tagNameMeta: 'v' } },
      { cmpMeta: { tagNameMeta: 'z', dependencies: ['x', 'v', 'w'] } },
      { cmpMeta: { tagNameMeta: 'a' } },
    ];
    const entryTags = [
      'z', 'y', 'z', 'y',
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([
      { tag: 'v', dependencyOf: ['y', 'z'] },
      { tag: 'w', dependencyOf: ['y', 'z'] },
      { tag: 'x', dependencyOf: ['y', 'z'] }
    ]);
    expect(g[1]).toEqual([{ tag: 'y', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'z', dependencyOf: [] }]);
  });

  it('common c,d,e', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd', 'e'] } },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd', 'e'] } },
      { cmpMeta: { tagNameMeta: 'c', dependencies: ['d', 'e'] } },
      { cmpMeta: { tagNameMeta: 'd' } },
      { cmpMeta: { tagNameMeta: 'e' } }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([
      { tag: 'c', dependencyOf: ['a', 'b'] },
      { tag: 'd', dependencyOf: ['a', 'b'] },
      { tag: 'e', dependencyOf: ['a', 'b'] }
    ]);
  });

  it('common c,d and b,e', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd'] } },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd', 'e'] } },
      { cmpMeta: { tagNameMeta: 'c' } },
      { cmpMeta: { tagNameMeta: 'd' } },
      { cmpMeta: { tagNameMeta: 'e' } }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([
      { tag: 'b', dependencyOf: [] },
      { tag: 'e', dependencyOf: ['b'] }
    ]);
    expect(g[2]).toEqual([
      { tag: 'c', dependencyOf: ['a', 'b'] },
      { tag: 'd', dependencyOf: ['a', 'b'] }
    ]);
  });

  it('common c,d w/ no entry c,d', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd'] } },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd'] } },
      { cmpMeta: { tagNameMeta: 'c' } },
      { cmpMeta: { tagNameMeta: 'd' } }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([
      { tag: 'c', dependencyOf: ['a', 'b'] },
      { tag: 'd', dependencyOf: ['a', 'b'] }
    ]);
  });

  it('common c,d', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd'] } },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd'] } },
      { cmpMeta: { tagNameMeta: 'c' } },
      { cmpMeta: { tagNameMeta: 'd' } }
    ];
    const entryTags = [
      'a', 'b', 'c', 'd'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([
      { tag: 'c', dependencyOf: ['a', 'b'] },
      { tag: 'd', dependencyOf: ['a', 'b'] }
    ]);
  });

  it('common c, include module not an entry tags', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c'] } },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c'] } },
      { cmpMeta: { tagNameMeta: 'c' } }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'c', dependencyOf: ['a', 'b'] }]);
  });

  it('group three together', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['b'] } },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c'] } },
      { cmpMeta: { tagNameMeta: 'c' } }
    ];
    const entryTags = [
      'a', 'b', 'c'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'a', dependencyOf: [] },
      { tag: 'b', dependencyOf: ['a'] },
      { tag: 'c', dependencyOf: ['b'] }
    ]);
  });

  it('exclude modules not used in entry modules', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['b'] } },
      { cmpMeta: { tagNameMeta: 'b' } },
      { cmpMeta: { tagNameMeta: 'c', dependencies: ['d', 'e'] } },
      { cmpMeta: { tagNameMeta: 'd', dependencies: ['e', 'a'] } },
      { cmpMeta: { tagNameMeta: 'e', dependencies: ['b'] } }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'a', dependencyOf: [] },
      { tag: 'b', dependencyOf: ['a'] }
    ]);
  });

  it('group two together', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['b'] } },
      { cmpMeta: { tagNameMeta: 'b' } }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'a', dependencyOf: [] },
      { tag: 'b', dependencyOf: ['a'] }
    ]);
  });

  it('simple, no deps', () => {
    const allModules: ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a' } },
      { cmpMeta: { tagNameMeta: 'b' } },
      { cmpMeta: { tagNameMeta: 'c' } }
    ];
    const entryTags = [
      'a', 'b', 'c'
    ];
    const g = processAppGraph(allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'c', dependencyOf: [] }]);
  });

});
