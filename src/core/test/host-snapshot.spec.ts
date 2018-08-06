import * as d from '../../declarations';
import { initHostSnapshot } from '../host-snapshot';
import { mockDomApi } from '../../testing/mocks';
import { ENCAPSULATION, NODE_TYPE } from '../../util/constants';
import { getDefaultBuildConditionals } from '../../util/build-conditionals';

describe('host-snapshot', () => {

  let domApi: d.DomApi;
  let cmpMeta: d.ComponentMeta;
  let hostElm: d.HostElement;

  beforeEach(() => {
    domApi = mockDomApi();
    cmpMeta = { tagNameMeta: 'ion-tag' };
    hostElm = domApi.$createElement('cmp-a') as any;
    __BUILD_CONDITIONALS__ = getDefaultBuildConditionals();
  });

  it('do not attach shadow root when not shadow', () => {
    let wasAttached = false;
    domApi.$attachShadow = () => wasAttached = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.NoEncapsulation;
    __BUILD_CONDITIONALS__.hasShadowDom = false;
    __BUILD_CONDITIONALS__.slotPolyfill = true;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(wasAttached).toBe(false);
  });

  it('do not attach shadow root when shadow but no support', () => {
    let wasAttached = false;
    domApi.$attachShadow = () => wasAttached = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
    __BUILD_CONDITIONALS__.isDev = false;
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
    domApi.$supportsShadowDom = false;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
    __BUILD_CONDITIONALS__.isDev = false;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm.shadowRoot).toBe(hostElm);
  });

  it('set content reference node when ssr shadow dom component', () => {
    domApi.$attachShadow = () => {/**/};
    domApi.$supportsShadowDom = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
    hostElm['s-ssr-id'] = 88;
    __BUILD_CONDITIONALS__.ssrServerSide = true;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm['s-cr'].nodeType).toBe(NODE_TYPE.CommentNode);
    expect(hostElm['s-cr'].textContent).toBe(`c.88`);
    expect(hostElm['s-cr']['s-cn']).toBe(true);
  });

  it('set content reference node when ssr scoped css component', () => {
    domApi.$attachShadow = () => {/**/};
    domApi.$supportsShadowDom = true;
    cmpMeta.encapsulationMeta = ENCAPSULATION.ScopedCss;
    hostElm['s-ssr-id'] = 88;
    __BUILD_CONDITIONALS__.ssrServerSide = true;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm['s-cr'].nodeType).toBe(NODE_TYPE.CommentNode);
    expect(hostElm['s-cr'].textContent).toBe(`c.88`);
    expect(hostElm['s-cr']['s-cn']).toBe(true);
  });

  it('sets content reference text node and is content reference text node boolean', () => {
    __BUILD_CONDITIONALS__.ssrServerSide = false;
    initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(hostElm['s-cr']).toBeDefined();
    expect(hostElm['s-cr'].nodeType).toBe(NODE_TYPE.TextNode);
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

  it('set id, no members', () => {
    hostElm['s-id'] = 'App88';
    const s = initHostSnapshot(domApi, cmpMeta, hostElm);
    expect(s.$id).toBe('App88');
    expect(s.$attributes).toEqual({});
  });

});
