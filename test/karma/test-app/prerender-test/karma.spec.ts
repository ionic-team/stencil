import { setupDomTests } from '../util';

describe('prerender', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeAll(async () => {
    app = await setupDom('/prerender/index.html');
  });
  afterAll(tearDownDom);

  it('server componentWillLoad Order', () => {
    const elm = app.querySelector('#server-componentWillLoad');
    expect(elm.children[0].textContent.trim()).toBe('CmpA server componentWillLoad');
    expect(elm.children[1].textContent.trim()).toBe('CmpD - a1-child server componentWillLoad');
    expect(elm.children[2].textContent.trim()).toBe('CmpD - a2-child server componentWillLoad');
    expect(elm.children[3].textContent.trim()).toBe('CmpD - a3-child server componentWillLoad');
    expect(elm.children[4].textContent.trim()).toBe('CmpD - a4-child server componentWillLoad');
    expect(elm.children[5].textContent.trim()).toBe('CmpB server componentWillLoad');
    expect(elm.children[6].textContent.trim()).toBe('CmpC server componentWillLoad');
    expect(elm.children[7].textContent.trim()).toBe('CmpD - c-child server componentWillLoad');
  });

  it('server componentDidLoad Order', () => {
    const elm = app.querySelector('#server-componentDidLoad');
    expect(elm.children[0].textContent.trim()).toBe('CmpD - a1-child server componentDidLoad');
    expect(elm.children[1].textContent.trim()).toBe('CmpD - a2-child server componentDidLoad');
    expect(elm.children[2].textContent.trim()).toBe('CmpD - a3-child server componentDidLoad');
    expect(elm.children[3].textContent.trim()).toBe('CmpD - a4-child server componentDidLoad');
    expect(elm.children[4].textContent.trim()).toBe('CmpD - c-child server componentDidLoad');
    expect(elm.children[5].textContent.trim()).toBe('CmpC server componentDidLoad');
    expect(elm.children[6].textContent.trim()).toBe('CmpB server componentDidLoad');
    expect(elm.children[7].textContent.trim()).toBe('CmpA server componentDidLoad');
  });


  it('set data-ssrv', () => {
    const appRoot = app.querySelector('app-root');
    expect(appRoot.getAttribute('data-ssrv')).toBe('0');
    expect(appRoot.getAttribute('class')).toBe('hydrated');

    const main = app.querySelector('app-root main');
    expect(main.getAttribute('data-ssrc')).toBe('0.0');
  });

});

// <app-root data-ssrv="0" class="hydrated"><main data-ssrc="0.0"><header data-ssrc="0.0"><!--s.0.0-->App Root<!--/--> </header><cmp-a data-ssrc="0.1." data-ssrv="1" class="hydrated"><div data-ssrc="1.0"><div data-ssrc="1.0"><!--s.1.0-->CmpA<!--/--> </div><cmp-b data-ssrc="1.1." data-ssrv="2" class="hydrated"><div data-ssrc="2.0"><div data-ssrc="2.0"><!--s.2.0-->CmpB<!--/--> </div><cmp-c data-ssrc="2.1." data-ssrv="3" class="hydrated"><div data-ssrc="3.0"><div data-ssrc="3.0"><!--s.3.0-->CmpC<!--/--> </div><cmp-d data-ssrc="3.1." data-ssrv="4" class="hydrated"><div data-ssrc="4.0"><!--s.4.0-->CmpD<!--/--> </div></cmp-d></div></cmp-c></div></cmp-b></div></cmp-a><div class="server server" data-ssrc="0.2">
// <div id="server-componentWillLoad" data-ssrc="0.0."><div>CmpA server componentWillLoad</div><div>CmpBserver componentWillLoad</div><div>CmpC server componentWillLoad</div><div>CmpD server componentWillLoad</div></div>
// <div id="server-componentDidLoad" data-ssrc="0.1."><div>CmpD server componentDidLoad</div><div>CmpC server componentDidLoad</div><div>CmpB server componentDidLoad</div><div>CmpA server componentDidLoad</div></div></div><div class="client client" data-ssrc="0.3">
// <div id="client-componentWillLoad" data-ssrc="0.0."><div>CmpA client componentWillLoad</div><div>CmpB client componentWillLoad</div><div>CmpC client componentWillLoad</div><div>CmpD client componentWillLoad</div></div>
// <div id="client-componentDidLoad" data-ssrc="0.1."><div>CmpD client componentDidLoad</div><div>CmpCclient componentDidLoad</div><div>CmpB client componentDidLoad</div><div>CmpA client componentDidLoad</div></div></div></main></app-root>
