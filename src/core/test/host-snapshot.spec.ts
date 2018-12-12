import * as d from '../../declarations';
import { initHostSnapshot } from '../host-snapshot';
import { mockDomApi } from '../../testing/mocks';
import { ENCAPSULATION } from '../../util/constants';
import { getDefaultBuildConditionals } from '../../util/build-conditionals';

describe('host-snapshot', () => {

  let domApi: d.DomApi;
  let cmpMeta: d.ComponentMeta;
  let hostElm: d.HostElement;

  beforeEach(() => {
    domApi = mockDomApi();
    cmpMeta = { tagNameMeta: 'ion-tag' };
    hostElm = domApi.$createElement('cmp-a') as any;
    _BUILD_ = getDefaultBuildConditionals();
  });

  it('do not attach shadow root when not shadow', () => {
    let wasAttached = false;
    domApi.$attachShadow = () => wasAttached = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.NoEncapsulation;
    _BUILD_.shadowDom = false;
    _BUILD_.slotPolyfill = true;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(wasAttached).toBe(false);
  });

  it('do not attach shadow root when shadow but no support', () => {
    let wasAttached = false;
    domApi.$attachShadow = () => wasAttached = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
    _BUILD_.isDev = false;
    domApi.$supportsShadowDom = false;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(wasAttached).toBe(false);
  });

  it('attach shadow root when shadow w/ support', () => {
    let wasAttached = false;
    domApi.$attachShadow = () => wasAttached = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
    domApi.$supportsShadowDom = true;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(wasAttached).toBe(true);
  });

  it('manually set shadowRoot to host element if no shadow dom $supportsShadowDom', () => {
    (window as any).HTMLElement = { prototype: {} };
    domApi.$supportsShadowDom = false;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
    _BUILD_.isDev = false;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm.shadowRoot).toBe(hostElm);
  });

  it('do not set content reference node is shadow and supports shadow', () => {
    domApi.$attachShadow = () => {/**/};
    domApi.$supportsShadowDom = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm['s-cr']).toBeUndefined();
  });

  it('do not set content reference node when ssr', () => {
    hostElm.setAttribute('ssrv', '88');
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm['s-cr']).toBeUndefined();
  });

  it('sets content reference text node and is content reference text node boolean', () => {
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm['s-cr']).toBeDefined();
    expect(hostElm['s-cr'].nodeType).toBe(3);
    expect(hostElm['s-cr'].textContent).toBe('');
    expect(hostElm['s-cr']['s-cn']).toBe(true);

    expect(hostElm['s-cr'].parentNode).toBe(hostElm);
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
    hostElm.setAttribute('dont-care', 'true');
    hostElm.setAttribute('first', 'Marty');
    hostElm.setAttribute('last-name', 'McFly');

    const s = initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(s.$attributes['dont-care']).toBeUndefined();
    expect(s.$attributes['first']).toBe('Marty');
    expect(s.$attributes['last-name']).toBe('McFly');
  });

});
