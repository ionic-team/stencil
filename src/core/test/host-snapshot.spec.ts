import * as d from '../../declarations';
import { initHostSnapshot } from '../host-snapshot';
import { mockDomApi } from '../../testing/mocks';


describe('host-snapshot', () => {

  const domApi = mockDomApi();
  let cmpMeta: d.ComponentMeta;
  let elm: d.HostElement;

  beforeEach(() => {
    cmpMeta = {};
    elm = domApi.$createElement('cmp-a') as any;
  });


  it('set attributes', () => {
    cmpMeta.membersMeta = {
      first: {
        attribName: 'first'
      },
      lastName: {
        attribName: 'last-name'
      }
    };
    elm.setAttribute('dont-care', 'true');
    elm.setAttribute('first', 'Marty');
    elm.setAttribute('last-name', 'McFly');

    const s = initHostSnapshot(domApi, cmpMeta, elm);
    expect(s.$attributes['dont-care']).toBeUndefined();
    expect(s.$attributes['first']).toBe('Marty');
    expect(s.$attributes['last-name']).toBe('McFly');
  });

  it('set id, no members', () => {
    elm['s-id'] = 'App88';
    const s = initHostSnapshot(domApi, cmpMeta, elm);
    expect(s.$id).toBe('App88');
    expect(s.$attributes).toEqual({});
  });

});
