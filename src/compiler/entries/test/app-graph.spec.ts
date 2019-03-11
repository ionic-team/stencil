import * as d from '../../declarations';
import { processAppGraph } from '../app-graph';
import { mockBuildCtx } from '../../../testing/mocks';


describe('processAppGraph', () => {

  const buildCtx = mockBuildCtx();

  it('ion app', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'stencil-route', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'stencil-route-link', dependencies: ['stencil-route-link'] } },
      { cmpMeta: { tagNameMeta: 'stencil-router', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-action-sheet', dependencies: ['ion-animation-controller', 'ion-backdrop', 'ion-icon'] } },
      { cmpMeta: { tagNameMeta: 'ion-action-sheet-controller', dependencies: ['ion-action-sheet'] } },
      { cmpMeta: { tagNameMeta: 'ion-animation-controller', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-app', dependencies: ['ion-tap-click'] } },
      { cmpMeta: { tagNameMeta: 'ion-backdrop', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-button', dependencies: ['ion-ripple-effect'] } },
      { cmpMeta: { tagNameMeta: 'ion-buttons', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-content', dependencies: ['ion-scroll'] } },
      { cmpMeta: { tagNameMeta: 'ion-header', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-icon', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-page', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-ripple-effect', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-scroll', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-tap-click', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-title', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'ion-toast', dependencies: ['ion-animation-controller', 'ion-button'] } },
      { cmpMeta: { tagNameMeta: 'ion-toast-controller', dependencies: ['ion-toast'] } },
      { cmpMeta: { tagNameMeta: 'ion-toolbar', dependencies: [] } },
      { cmpMeta: { tagNameMeta: 'profile-header', dependencies: ['ion-action-sheet-controller', 'ion-header', 'ion-toolbar', 'ion-title', 'ion-buttons', 'ion-button'] } },
      { cmpMeta: { tagNameMeta: 'profile-page', dependencies: ['ion-toast-controller', 'ion-page', 'ion-header', 'ion-toolbar', 'ion-title', 'ion-content', 'ion-button'] } },
      { cmpMeta: { tagNameMeta: 'stencil-beer', dependencies: ['ion-app', 'stencil-router', 'stencil-route'] } },
    ];
    const entryTags = [ 'profile-header', 'profile-page', 'stencil-beer' ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(5);
    expect(g[0]).toEqual([
      { tag: 'ion-action-sheet', dependencyOf: ['ion-action-sheet-controller'] },
      { tag: 'ion-action-sheet-controller', dependencyOf: ['profile-header'] },
      { tag: 'ion-backdrop', dependencyOf: ['ion-action-sheet'] },
      { tag: 'ion-buttons', dependencyOf: ['profile-header'] },
      { tag: 'ion-header', dependencyOf: ['profile-header', 'profile-page'] },
      { tag: 'ion-icon', dependencyOf: ['ion-action-sheet'] },
      { tag: 'ion-title', dependencyOf: ['profile-header', 'profile-page'] },
      { tag: 'ion-toolbar', dependencyOf: ['profile-header', 'profile-page'] },
      { tag: 'profile-header', dependencyOf: [] },
    ]);
    expect(g[1]).toEqual([
      { tag: 'ion-animation-controller', dependencyOf: ['ion-action-sheet', 'ion-toast'] },
    ]);
    expect(g[2]).toEqual([
      { tag: 'ion-app', dependencyOf: ['stencil-beer'] },
      { tag: 'ion-tap-click', dependencyOf: ['ion-app'] },
      { tag: 'stencil-beer', dependencyOf: [] },
      { tag: 'stencil-route', dependencyOf: ['stencil-beer'] },
      { tag: 'stencil-router', dependencyOf: ['stencil-beer'] },
    ]);
    expect(g[3]).toEqual([
      { tag: 'ion-button', dependencyOf: ['ion-toast', 'profile-header', 'profile-page'] },
      { tag: 'ion-ripple-effect', dependencyOf: ['ion-button'] },
    ]);
    expect(g[4]).toEqual([
      { tag: 'ion-content', dependencyOf: ['profile-page'] },
      { tag: 'ion-page', dependencyOf: ['profile-page'] },
      { tag: 'ion-scroll', dependencyOf: ['ion-content'] },
      { tag: 'ion-toast', dependencyOf: ['ion-toast-controller'] },
      { tag: 'ion-toast-controller', dependencyOf: ['profile-page'] },
      { tag: 'profile-page', dependencyOf: [] },
    ]);
  });

  it('circular', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'x', dependencies: ['y', 'x'] }, sourceFilePath: 'x' },
      { cmpMeta: { tagNameMeta: 'y', dependencies: ['z', 'z'] }, sourceFilePath: 'y' },
      { cmpMeta: { tagNameMeta: 'z', dependencies: ['x'] }, sourceFilePath: 'z' },
    ];
    const entryTags = [
      'z', 'x', 'y'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'x', dependencyOf: ['z'] },
      { tag: 'y', dependencyOf: [] },
      { tag: 'z', dependencyOf: ['y'] }
    ]);
  });

  it('random orders 2', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'y', dependencies: ['x', 'w', 'v'] }, sourceFilePath: 'y' },
      { cmpMeta: { tagNameMeta: 'v' }, sourceFilePath: 'v' },
      { cmpMeta: { tagNameMeta: 'x', dependencies: ['w', 'v'] }, sourceFilePath: 'x' },
      { cmpMeta: { tagNameMeta: 'z', dependencies: ['v', 'x', 'w'] }, sourceFilePath: 'z' },
      { cmpMeta: { tagNameMeta: 'w' }, sourceFilePath: 'w' },
    ];
    const entryTags = [
      'y', 'z'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([
      { tag: 'v', dependencyOf: ['x', 'y', 'z'] },
      { tag: 'w', dependencyOf: ['x', 'y', 'z'] },
      { tag: 'x', dependencyOf: ['y', 'z'] }
    ]);
    expect(g[1]).toEqual([{ tag: 'y', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'z', dependencyOf: [] }]);
  });

  it('random orders 1', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'w' }, sourceFilePath: 'w' },
      { cmpMeta: { tagNameMeta: 'y', dependencies: ['w', 'x', 'v'] }, sourceFilePath: 'y' },
      { cmpMeta: { tagNameMeta: 'x', dependencies: ['w', 'v'] }, sourceFilePath: 'x' },
      { cmpMeta: { tagNameMeta: 'v' }, sourceFilePath: 'v' },
      { cmpMeta: { tagNameMeta: 'z', dependencies: ['x', 'v', 'w'] }, sourceFilePath: 'z' },
      { cmpMeta: { tagNameMeta: 'a' }, sourceFilePath: 'a' },
    ];
    const entryTags = [
      'z', 'y', 'z', 'y',
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([
      { tag: 'v', dependencyOf: ['x', 'y', 'z'] },
      { tag: 'w', dependencyOf: ['x', 'y', 'z'] },
      { tag: 'x', dependencyOf: ['y', 'z'] }
    ]);
    expect(g[1]).toEqual([{ tag: 'y', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'z', dependencyOf: [] }]);
  });

  it('common c,d,e', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd', 'e'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd', 'e'] }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c', dependencies: ['d', 'e'] }, sourceFilePath: 'c' },
      { cmpMeta: { tagNameMeta: 'd' }, sourceFilePath: 'd' },
      { cmpMeta: { tagNameMeta: 'e' }, sourceFilePath: 'e' }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
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
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd', 'e'] }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c' }, sourceFilePath: 'c' },
      { cmpMeta: { tagNameMeta: 'd' }, sourceFilePath: 'd' },
      { cmpMeta: { tagNameMeta: 'e' }, sourceFilePath: 'e' }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
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
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd'] }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c' }, sourceFilePath: 'c' },
      { cmpMeta: { tagNameMeta: 'd' }, sourceFilePath: 'd' }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([
      { tag: 'c', dependencyOf: ['a', 'b'] },
      { tag: 'd', dependencyOf: ['a', 'b'] }
    ]);
  });

  it('common c,d', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c', 'd'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c', 'd'] }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c' }, sourceFilePath: 'c' },
      { cmpMeta: { tagNameMeta: 'd' }, sourceFilePath: 'd' }
    ];
    const entryTags = [
      'a', 'b', 'c', 'd'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([
      { tag: 'c', dependencyOf: ['a', 'b'] },
      { tag: 'd', dependencyOf: ['a', 'b'] }
    ]);
  });

  it('common c, include module not an entry tags', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['c'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c'] }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c' }, sourceFilePath: 'c' }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'c', dependencyOf: ['a', 'b'] }]);
  });

  it('group three together', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['b'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b', dependencies: ['c'] }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c' }, sourceFilePath: 'c' }
    ];
    const entryTags = [
      'a', 'b', 'c'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'a', dependencyOf: [] },
      { tag: 'b', dependencyOf: ['a'] },
      { tag: 'c', dependencyOf: ['b'] }
    ]);
  });

  it('exclude modules not used in entry modules', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['b'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b' }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c', dependencies: ['d', 'e'] }, sourceFilePath: 'c' },
      { cmpMeta: { tagNameMeta: 'd', dependencies: ['e', 'a'] }, sourceFilePath: 'd' },
      { cmpMeta: { tagNameMeta: 'e', dependencies: ['b'] }, sourceFilePath: 'e' }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'a', dependencyOf: [] },
      { tag: 'b', dependencyOf: ['a'] }
    ]);
  });

  it('group two together', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a', dependencies: ['b'] }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b' }, sourceFilePath: 'b' }
    ];
    const entryTags = [
      'a', 'b'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(1);
    expect(g[0]).toEqual([
      { tag: 'a', dependencyOf: [] },
      { tag: 'b', dependencyOf: ['a'] }
    ]);
  });

  it('simple, no deps', () => {
    const allModules: d.ModuleFile[] = [
      { cmpMeta: { tagNameMeta: 'a' }, sourceFilePath: 'a' },
      { cmpMeta: { tagNameMeta: 'b' }, sourceFilePath: 'b' },
      { cmpMeta: { tagNameMeta: 'c' }, sourceFilePath: 'c' }
    ];
    const entryTags = [
      'a', 'b', 'c'
    ];
    const g = processAppGraph(buildCtx, allModules, entryTags);
    expect(g).toHaveLength(3);
    expect(g[0]).toEqual([{ tag: 'a', dependencyOf: [] }]);
    expect(g[1]).toEqual([{ tag: 'b', dependencyOf: [] }]);
    expect(g[2]).toEqual([{ tag: 'c', dependencyOf: [] }]);
  });

});
