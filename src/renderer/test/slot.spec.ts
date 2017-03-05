import { initRenderer, h } from '../core';
import { attributesModule } from '../modules/attributes';
import { classModule } from '../modules/class';
import { eventListenersModule } from '../modules/eventlisteners';
import { styleModule } from '../modules/style';
import { PlatformClient } from '../../platform/platform-client';


describe('slot', function() {

  it('should slot w/ select', function() {
    hostEle.innerHTML = `
      Text 0
      <span class="a">span.a</span>
      Text 1
      <span class="b">span.b</span>
      Text 2
      <span class="c">span.c<span class="d">span.d</span></span>
      Text 3
    `;

    let hostRender = h('ion-host', [
      h('div.a', [
        h('slot'),
        h('div.c', [
          h('slot', { select: '.b' })
        ])
      ]),
      h('div.b', [
        h('slot', { select: '.c' })
      ])
    ]);

    let hostVNode = patch(hostEle, hostRender, true);
    hostVNode.isHost = true;

    let divA = hostEle.children[0];
    let divB = hostEle.children[1];
    let divANodes = divA.childNodes;
    let divBNodes = divB.childNodes;

    expect(divANodes[0].textContent.trim()).toEqual('Text 0');
    expect(divANodes[1].textContent.trim()).toEqual('span.a');
    expect(divANodes[2].textContent.trim()).toEqual('Text 1');

    expect(divANodes[3].textContent.trim()).toEqual('Text 2');
    expect(divANodes[4].textContent.trim()).toEqual('Text 3');
    expect(divANodes[5].textContent.trim()).toEqual('span.b');
    expect(divANodes[5].childNodes[0].textContent.trim()).toEqual('span.b');

    expect(divBNodes[0].textContent.trim()).toEqual('span.cspan.d');
  });

  it('should move multiple host content to the only slot', function() {
    hostEle.innerHTML = `
      Text 0
      <span class="a">span.a</span>
      Text 1
      <span class="b">span.b</span>
      Text 2
      <span class="c">span.c<span class="d">span.d</span></span>
      Text 3
    `;

    let hostRender = h('ion-host', [
      h('div.a', [
        h('slot')
      ])
    ]);

    let hostVNode = patch(hostEle, hostRender, true);
    hostVNode.isHost = true;

    let divA = hostEle.children[0];
    let divANodes = divA.childNodes;
    expect(divANodes.length).toEqual(7);

    expect(divANodes[0].textContent.trim()).toEqual('Text 0');
    expect(divANodes[1].textContent.trim()).toEqual('span.a');
    expect(divANodes[2].textContent.trim()).toEqual('Text 1');
    expect(divANodes[3].textContent.trim()).toEqual('span.b');
    expect(divANodes[4].textContent.trim()).toEqual('Text 2');
    expect(divANodes[5].textContent.trim()).toEqual('span.cspan.d');
    expect(divANodes[6].textContent.trim()).toEqual('Text 3');
  });

  it('should not move host content on second patch', function() {
    hostEle.textContent = 'hello';

    let hostRender = h('ion-host', [
      h('div.a', [
        h('slot')
      ])
    ]);

    let vnode1 = patch(hostEle, hostRender, true);
    vnode1.isHost = true;

    let divA = hostEle.children[0];
    expect(divA.childNodes[0].textContent).toEqual('hello');

    let vnode2 = patch(vnode1, hostRender, false);
    vnode2.isHost = true;

    expect(divA.childNodes[0].textContent).toEqual('hello');
  });

  it('should relocate the host content to the only slot', function() {
    hostEle.textContent = 'hello';

    let hostRender = h('ion-host', [
      h('div.a', [
        h('slot')
      ])
    ]);

    let hostVNode = patch(hostEle, hostRender, true);
    hostVNode.isHost = true;

    expect(hostEle.childNodes.length).toEqual(1);

    let divA = hostEle.children[0];
    expect(divA.className).toEqual('a');

    expect(divA.childNodes.length).toEqual(1);
    expect(divA.childNodes[0].textContent).toEqual('hello');

    expect(hostEle.textContent).toEqual('hello');
  });


  var hostEle: HTMLElement;

  beforeEach(function() {
    hostEle = document.createElement('ion-host');
  });

});

const document: HTMLDocument = (<any>global).document;

var patch = initRenderer([
  attributesModule,
  classModule,
  eventListenersModule,
  styleModule,
], new PlatformClient(document));
