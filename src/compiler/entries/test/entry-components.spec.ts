import { ConfigBundle, EntryModule, ModuleFile } from '../../../declarations';
import { ENCAPSULATION } from '../../../util/constants';
import { getDeepDependencies } from '../entry-components';


describe('entry components', () => {

  describe('getDeepDependencies', () => {

    it('circular', () => {
      const tag = 'cmp-a';
      const depencencyOf = '';
      const tags = getDeepDependencies([
        { cmpMeta: { tagNameMeta: 'cmp-a', dependencies: ['cmp-b'] } },
        { cmpMeta: { tagNameMeta: 'cmp-b', dependencies: ['cmp-a', 'cmp-c'] } },
        { cmpMeta: { tagNameMeta: 'cmp-c', dependencies: ['cmp-d'] } },
        { cmpMeta: { tagNameMeta: 'cmp-d', dependencies: ['cmp-a', 'cmp-b', 'cmp-c'] } }
      ], tag, depencencyOf);
      expect(tags).toHaveLength(4);
    });

    it('no dups', () => {
      const tag = 'cmp-a';
      const depencencyOf = '';
      const tags = getDeepDependencies([
        { cmpMeta: { tagNameMeta: 'cmp-a', dependencies: ['cmp-b', 'cmp-c', 'cmp-d'] } },
        { cmpMeta: { tagNameMeta: 'cmp-b', dependencies: ['cmp-c'] } },
        { cmpMeta: { tagNameMeta: 'cmp-c', dependencies: ['cmp-d'] } },
        { cmpMeta: { tagNameMeta: 'cmp-d' } }
      ], tag, depencencyOf);
      expect(tags).toHaveLength(4);
    });

    it('simple graph', () => {
      const tag = 'cmp-a';
      const depencencyOf = '';
      const tags = getDeepDependencies([
        { cmpMeta: { tagNameMeta: 'cmp-a', dependencies: ['cmp-b'] } },
        { cmpMeta: { tagNameMeta: 'cmp-b', dependencies: ['cmp-c'] } },
        { cmpMeta: { tagNameMeta: 'cmp-c', dependencies: ['cmp-d'] } },
        { cmpMeta: { tagNameMeta: 'cmp-d' } }
      ], tag, depencencyOf);
      expect(tags).toHaveLength(4);
    });

    it('no sub graph', () => {
      const tag = 'cmp-a';
      const depencencyOf = '';
      const tags = getDeepDependencies([
        { cmpMeta: { tagNameMeta: 'cmp-a' } }
      ], tag, depencencyOf);
      expect(tags).toHaveLength(1);
    });

  });

});
