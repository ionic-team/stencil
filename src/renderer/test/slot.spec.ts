
import { initRenderer, h } from '../index';
import { attributesModule } from '../modules/attributes';
import { classModule } from '../modules/class';
import { eventListenersModule } from '../modules/eventlisteners';
import { styleModule } from '../modules/style';
import { BrowserDomApi } from '../api/browser-api';


describe('slot', function() {

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

    let hostVNode = patch(hostEle, hostRender);
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

  it('should move the host content to the only slot', function() {
    hostEle.textContent = 'hello';

    let hostRender = h('ion-host', [
      h('div.a', [
        h('slot')
      ])
    ]);

    let hostVNode = patch(hostEle, hostRender);
    hostVNode.isHost = true;

    expect(hostEle.childNodes.length).toEqual(1);

    let divA = hostEle.children[0];
    expect(divA.className).toEqual('a');

    expect(divA.childNodes.length).toEqual(1);
    expect(divA.childNodes[0].textContent).toEqual('hello');

    expect(hostEle.textContent).toEqual('hello');
  });

  it('should not get host content if not children', function() {
    let hostVNode = patch(hostEle, h('ion-host', 'hello'));
    hostVNode.isHost = true;
    expect(hostEle.textContent).toEqual('hello');
  });

  it('should do nothing for vnode without child slot', function() {
    let hostVNode = patch(hostEle, h('ion-host', 'hello'));
    hostVNode.isHost = true;
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
], new BrowserDomApi(document));
