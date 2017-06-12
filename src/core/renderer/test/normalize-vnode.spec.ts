import { normalizeVNode } from '../patch';
import { VNode } from '../../../util/interfaces';


describe('normalizeVNode()', () => {
  let vnode: VNode;

  beforeEach(() => {
    vnode = {};
  });


  it('should normalize child vnodes of child vnodes', () => {
    vnode.e = 'ion-tag';
    vnode.h = [
      [
        {
          e: 'ion-a',
          h: [{ t: '1' }, { t: '2' }]
        },
        {
          e: 'ion-b',
          h: [
            [
              {t: '3'}, {t: '4'}, {t: '5'}
            ]
          ]
        }
      ],
      {
        e: 'ion-c',
        h: [{ t: '6' }]
      }
    ];
    vnode = normalizeVNode(vnode);

    expect(vnode.h.length).toBe(3);

    expect(vnode.h[0].e).toBe('ion-a');
    expect(vnode.h[0].h.length).toBe(2);

    expect(vnode.h[1].e).toBe('ion-b');
    expect(vnode.h[1].h.length).toBe(3);

    expect(vnode.h[2].e).toBe('ion-c');
    expect(vnode.h[2].h.length).toBe(1);
  });

  it('should normalize child array of array', () => {
    vnode.e = 'ion-tag';
    vnode.h = [
      [{ t: 'child 1' }, { t: 'child 2' }],
      [{ t: 'child 3' }],
      { t: 'child 4' }
    ];
    vnode = normalizeVNode(vnode);

    expect(vnode.h.length).toBe(4);
    expect(vnode.h[0].t).toBe('child 1');
    expect(vnode.h[1].t).toBe('child 2');
    expect(vnode.h[2].t).toBe('child 3');
    expect(vnode.h[3].t).toBe('child 4');
  });

  it('should do nothing to child array of vnodes', () => {
    vnode.e = 'ion-tag';
    vnode.h = [
      { t: 'child a' },
      { t: 'child b' },
      null
    ];
    vnode = normalizeVNode(vnode);

    expect(vnode.e).toBe('ion-tag');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(3);
    expect(vnode.h[0].t).toBe('child a');
    expect(vnode.h[1].t).toBe('child b');
    expect(vnode.h[2].t).toBe('');
  });

  it('should do nothing to child array of vnodes', () => {
    vnode.e = 'ion-tag';
    vnode.h = [
      { t: 'child a' },
      { t: 'child b' }
    ];
    vnode = normalizeVNode(vnode);

    expect(vnode.e).toBe('ion-tag');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(2);
    expect(vnode.h[0].t).toBe('child a');
    expect(vnode.h[1].t).toBe('child b');
  });

  it('should convert child array of primitives to child vnodes', () => {
    vnode.e = 'ion-tag';
    vnode.h = [88, 'mph'];
    vnode = normalizeVNode(vnode);

    expect(vnode.e).toBe('ion-tag');
    expect(vnode.h).toBeDefined();
    expect(vnode.h.length).toBe(2);
    expect(vnode.h[0].t).toBe('88');
    expect(vnode.h[1].t).toBe('mph');
  });

  it('should do nothing for element with no children', () => {
    vnode.e = 'ion-tag';
    vnode = normalizeVNode(vnode);

    expect(vnode.e).toBe('ion-tag');
    expect(vnode.h).toBeUndefined();
  });

  it('should convert number to vnode text', () => {
    vnode = 88;
    vnode = normalizeVNode(vnode);

    expect(vnode.t).toBe('88');
    expect(vnode.h).toBeUndefined();
  });

  it('should convert text to vnode text', () => {
    vnode = 'Hello';
    vnode = normalizeVNode(vnode);

    expect(vnode.t).toBe('Hello');
    expect(vnode.h).toBeUndefined();
  });

  it('should convert null to empty text', () => {
    vnode = null;
    vnode = normalizeVNode(vnode);

    expect(vnode.t).toBe('');
    expect(vnode.h).toBeUndefined();
  });

  it('should convert undefined to empty text', () => {
    vnode = undefined;
    vnode = normalizeVNode(vnode);

    expect(vnode.t).toBe('');
    expect(vnode.h).toBeUndefined();
  });

});
