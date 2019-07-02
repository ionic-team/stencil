import { MockDocument } from '../document';
import { MockWindow, cloneWindow } from '../window';
import { MockElement, MockHTMLElement } from '../node';
import { XLINK_NS } from '../../runtime/runtime-constants';


describe('element', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
  });

  it('clone elements', () => {
    const win = new MockWindow(`
      <html>
        <head>
          <meta id="test">
        </head>
        <body></body>
      </head>
    `);

    const clonedWin = cloneWindow(win as any);

    const elm = clonedWin.document.getElementById('test') as any;
    expect((elm as HTMLMetaElement).content).toBe('');
    expect(elm).toEqualHtml(`<meta id="test">`);

    (elm as HTMLMetaElement).content = 'value';
    expect((elm as HTMLMetaElement).content).toBe('value');
    expect(elm).toEqualHtml(`<meta content="value" id="test">`);

    clonedWin.document.title = 'Hello Title!';
    const titleElm = clonedWin.document.head.querySelector('title');
    expect(titleElm).toEqualHtml(`<title>Hello Title!</title>`);

    titleElm.text = 'Hello Text!';
    expect(titleElm).toEqualHtml(`<title>Hello Text!</title>`);
  });

  it('meta content', () => {
    const metaElm = doc.createElement('meta');
    metaElm.content = 'value';
    metaElm.id = 'test';
    doc.head.appendChild(metaElm);
    expect(metaElm).toEqualHtml(`<meta content="value" id="test">`);

    const elm = doc.getElementById('test');
    expect(elm).toEqualHtml(`<meta content="value" id="test">`);

    elm['content'] = 'updated';
    expect(elm).toEqualHtml(`<meta content="updated" id="test">`);
  });

  it('document.title', () => {
    document.title = 'Hello Title';
    expect(document.title).toBe('Hello Title');

    const titleElm = document.head.querySelector('title');
    expect(titleElm.textContent).toBe('Hello Title');
    expect(titleElm.text).toBe('Hello Title');

    titleElm.text = 'Hello Text';
    expect(document.title).toBe('Hello Text');
    expect(titleElm.text).toBe('Hello Text');
    expect(titleElm.textContent).toBe('Hello Text');
  });

  it('document.baseURI', () => {
    const win = new MockWindow(`
    <html>
      <head>
        <base href="/en">
      </head>
    </head>
    `);
    win.location.href = 'http://stenciljs.com/path/to/page';
    expect(win.document.baseURI).toBe('http://stenciljs.com/en');
    expect(win.document.URL).toBe('http://stenciljs.com/path/to/page');
    expect(win.document.location.href).toBe('http://stenciljs.com/path/to/page');

    win.document.querySelector('base').remove();
    expect(win.document.baseURI).toBe('http://stenciljs.com/path/to/page');
    expect(win.document.URL).toBe('http://stenciljs.com/path/to/page');
    expect(win.document.location.href).toBe('http://stenciljs.com/path/to/page');
  });

  it('isConnected nested true', () => {
    const elmParent = document.createElement('div');
    const elmChild = document.createElement('div');
    elmParent.appendChild(elmChild);
    expect(document.body.contains(elmParent)).toBe(false);
    document.body.appendChild(elmParent);
    expect(document.body.contains(elmParent)).toBe(true);
    expect(elmParent.isConnected).toBe(true);
    expect(elmChild.isConnected).toBe(true);
    expect(document.body.isConnected).toBe(true);
    expect(document.documentElement.isConnected).toBe(true);
    expect(document.isConnected).toBe(true);
  });

  it('isConnected true', () => {
    const elm = document.createElement('div');
    document.body.appendChild(elm);
    expect(elm.isConnected).toBe(true);
  });

  it('isConnected false', () => {
    const elm = document.createElement('div');
    expect(elm.isConnected).toBe(false);
  });

  it('getBoundingClientRect', () => {
    const elm = doc.createElement('div');
    const rect = elm.getBoundingClientRect();

    expect(rect).toEqual({
      bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0
    });
  });

  describe('attributes', () => {
    it('attributes are case sensible in Element', () => {
      const element = new MockElement(doc, 'div');

      element.setAttribute('viewBox', '0 0 10 10');
      expect(element.getAttribute('viewBox')).toEqual('0 0 10 10');
      expect(element.getAttribute('viewbox')).toEqual(null);

      element.removeAttribute('viewbox');
      expect(element.getAttribute('viewBox')).toEqual('0 0 10 10');
      expect(element.getAttribute('viewbox')).toEqual(null);

      element.removeAttribute('viewBox');
      expect(element.getAttribute('viewBox')).toEqual(null);

      element.setAttribute('viewBox', '0 0 10 10');
      element.setAttribute('viewbox', '0 0 20 20');

      expect(element.attributes.length).toBe(2);
      expect(element.attributes.getNamedItem('viewBox').value).toEqual('0 0 10 10');
      expect(element.attributes.getNamedItem('viewbox').value).toEqual('0 0 20 20');

      expect(element.attributes.getNamedItemNS(null, 'viewBox').value).toEqual('0 0 10 10');
      expect(element.attributes.getNamedItemNS(null, 'viewbox').value).toEqual('0 0 20 20');

      element.removeAttribute('viewBox');
      element.removeAttribute('viewbox');

      testNsAttributes(element);
    });

    it('attributes are case insensible in HTMLElement', () => {
      const element = new MockHTMLElement(doc, 'div');

      element.setAttribute('viewBox', '0 0 10 10');
      expect(element.getAttribute('viewBox')).toEqual('0 0 10 10');
      expect(element.getAttribute('viewbox')).toEqual('0 0 10 10');
      expect(element.getAttributeNS(null, 'viewbox')).toEqual('0 0 10 10');
      expect(element.getAttributeNS(null, 'viewBox')).toEqual(null);

      expect(element.attributes.length).toEqual(1);
      expect(element.attributes.item(0).name).toEqual('viewbox');

      element.removeAttribute('viewBox');

      expect(element.getAttribute('viewBox')).toEqual(null);
      expect(element.getAttribute('viewbox')).toEqual(null);

      element.setAttribute('viewBox', '0 0 10 10');
      element.setAttribute('viewbox', '0 0 20 20');
      expect(element.attributes.getNamedItem('viewBox').value).toEqual('0 0 20 20');
      expect(element.attributes.getNamedItem('viewbox').value).toEqual('0 0 20 20');

      expect(element.attributes.getNamedItemNS(null, 'viewBox')).toEqual(null);
      expect(element.attributes.getNamedItemNS(null, 'viewbox').value).toEqual('0 0 20 20');

      element.removeAttribute('viewbox');

      testNsAttributes(element);
    });

    it('xlink_ns namespaces should be reset', () => {
      const element = new MockHTMLElement(doc, 'div');
      element.setAttributeNS(XLINK_NS, 'href', 'google.com');
      expect(element.getAttribute('href')).toEqual('google.com');
    });

    function testNsAttributes(element) {
      element.setAttributeNS('tEst', 'viewBox', '1');
      element.setAttributeNS('tEst', 'viewbox', '2');

      expect(element.attributes.length).toBe(2);
      expect(element.attributes.getNamedItemNS('test', 'viewBox')).toEqual(null);
      expect(element.attributes.getNamedItemNS('test', 'viewbox')).toEqual(null);
      expect(element.attributes.getNamedItemNS('tEst', 'viewBox').name).toEqual('viewBox');
      expect(element.attributes.getNamedItemNS('tEst', 'viewbox').name).toEqual('viewbox');
      expect(element.attributes.getNamedItemNS('tEst', 'viewBox').value).toEqual('1');
      expect(element.attributes.getNamedItemNS('tEst', 'viewbox').value).toEqual('2');

      element.removeAttributeNS('test', 'viewBox');
      element.removeAttributeNS('test', 'viewbox');

      expect(element.attributes.length).toBe(2);

      element.removeAttributeNS('tEst', 'viewBox');
      element.removeAttributeNS('tEst', 'viewbox');

      expect(element.attributes.length).toBe(0);

      element.setAttribute('value', '123');
      expect(element.getAttributeNS(null, 'Value')).toBe(null);
    }
  });

});
