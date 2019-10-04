import { MockDocument } from '../document';
import { MockWindow, cloneWindow } from '../window';
import { MockElement, MockHTMLElement } from '../node';
import { XLINK_NS } from '../../runtime/runtime-constants';
import { MockSVGElement } from '../element';


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

  it('document.styleSheets', () => {
    expect(document.styleSheets).toEqual([]);
    const style = document.createElement('style');
    document.head.appendChild(style);
    expect(document.styleSheets).toEqual([style]);
  });

  it('document.forms', () => {
    expect(document.forms).toEqual([]);
    const form = document.createElement('form');
    document.head.appendChild(form);
    expect(document.forms).toEqual([form]);
  });

  it('document.scripts', () => {
    expect(document.scripts).toEqual([]);
    const script = document.createElement('script');
    document.head.appendChild(script);
    expect(document.scripts).toEqual([script]);
  });

  it('document.images', () => {
    expect(document.images).toEqual([]);
    const img = document.createElement('img');
    document.head.appendChild(img);
    expect(document.images).toEqual([img]);
  });

  it('document.scrollingElement', () => {
    expect(document.scrollingElement).toBe(document.documentElement);
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

  describe('namespaceURI', () => {
    it('HTMLElement namespaceURI is always http://www.w3.org/1999/xhtml', () => {
      const htmlElement = new MockHTMLElement(doc, 'svg');
      expect(htmlElement.namespaceURI).toEqual('http://www.w3.org/1999/xhtml');

      const createdElement1 = doc.createElement('div');
      expect(createdElement1.namespaceURI).toEqual('http://www.w3.org/1999/xhtml');

      const createdElement2 = doc.createElement('svg');
      expect(createdElement2.namespaceURI).toEqual('http://www.w3.org/1999/xhtml');
      expect(createdElement2 instanceof MockHTMLElement).toBe(true);

      const createdElement3 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'svg');
      expect(createdElement3.namespaceURI).toEqual('http://www.w3.org/1999/xhtml');
      expect(createdElement3 instanceof MockHTMLElement).toBe(true);
    });

    it('Element namespace is null by defualt', () => {
      const element = new MockElement(doc, 'svg');
      expect(element.namespaceURI).toEqual(null);
    });

    it('createElementNS sets the namespace', () => {
      const element = doc.createElementNS('random', 'svg');
      expect(element.namespaceURI).toEqual('random');
      expect(element instanceof MockSVGElement).toBe(false);

      const element1 = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      expect(element1.namespaceURI).toEqual('http://www.w3.org/2000/svg');
      expect(element1 instanceof MockSVGElement).toBe(true);
    });
  });

  describe('tagName', () => {
    it('Element tagName/nodeName is case sensible', () => {
      const element = new MockElement(doc, 'myElement');
      expect(element.tagName).toEqual('myElement');
      expect(element.nodeName).toEqual('myElement');

      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      expect(foreignObject.tagName).toEqual('foreignObject');
      expect(foreignObject.nodeName).toEqual('foreignObject');
    });

    it('HTMLElement tagName/nodeName is case insensible', () => {
      const element = new MockHTMLElement(doc, 'myElement');
      expect(element.tagName).toEqual('MYELEMENT');
      expect(element.nodeName).toEqual('MYELEMENT');

      const foreignObject = document.createElement('foreignObject');
      expect(foreignObject.tagName).toEqual('FOREIGNOBJECT');
      expect(foreignObject.nodeName).toEqual('FOREIGNOBJECT');

      const foreignObject2 = document.createElementNS('http://www.w3.org/1999/xhtml', 'foreignObject');
      expect(foreignObject2.tagName).toEqual('FOREIGNOBJECT');
      expect(foreignObject2.nodeName).toEqual('FOREIGNOBJECT');

      const createdElement = document.createElement('myElement');
      expect(createdElement.tagName).toEqual('MYELEMENT');
      expect(createdElement.nodeName).toEqual('MYELEMENT');
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

    it('should cast attribute values to string', () => {
      const element = new MockHTMLElement(doc, 'div');
      element.setAttribute('prop1', null);
      element.setAttribute('prop2', undefined);
      element.setAttribute('prop3', 0);
      element.setAttribute('prop4', 1);
      element.setAttribute('prop5', 'hola');
      element.setAttribute('prop6', '');

      expect(element.getAttribute('prop1')).toBe('null');
      expect(element.getAttribute('prop2')).toBe('undefined');
      expect(element.getAttribute('prop3')).toBe('0');
      expect(element.getAttribute('prop4')).toBe('1');
      expect(element.getAttribute('prop5')).toBe('hola');
      expect(element.getAttribute('prop6')).toBe('');

      expect(element).toEqualHtml(`<div prop1=\"null\" prop2=\"undefined\" prop3=\"0\" prop4=\"1\" prop5=\"hola\" prop6></div>`);
    });

    it('should cast attributeNS values to string', () => {
      const element = new MockHTMLElement(doc, 'div');
      element.setAttributeNS(null, 'prop1', null);
      element.setAttributeNS(null, 'prop2', undefined);
      element.setAttributeNS(null, 'prop3', 0);
      element.setAttributeNS(null, 'prop4', 1);
      element.setAttributeNS(null, 'prop5', 'hola');
      element.setAttributeNS(null, 'prop6', '');

      expect(element.getAttribute('prop1')).toBe('null');
      expect(element.getAttribute('prop2')).toBe('undefined');
      expect(element.getAttribute('prop3')).toBe('0');
      expect(element.getAttribute('prop4')).toBe('1');
      expect(element.getAttribute('prop5')).toBe('hola');
      expect(element.getAttribute('prop6')).toBe('');

      expect(element).toEqualHtml(`<div prop1=\"null\" prop2=\"undefined\" prop3=\"0\" prop4=\"1\" prop5=\"hola\" prop6></div>`);
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
