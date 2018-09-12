import { MockDocument } from '../document';
import { parseHtmlToDocument, parseHtmlToFragment } from '../parse-html';


describe('parseHtml', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
  });

  it('get text only outerHTML', () => {
    const elm = doc.createElement('div');
    const text = doc.createTextNode('text');
    elm.appendChild(text);
    expect(elm.outerHTML).toBe('<div>text</div>');
  });

  it('get text only innerHTML', () => {
    const elm = doc.createElement('div');
    const text = doc.createTextNode('text');
    elm.appendChild(text);
    expect(elm.innerHTML).toBe('text');
  });

  it('set innerHTML', () => {
    const elm = doc.createElement('div');
    elm.innerHTML = '<div>hello</div>';
    expect(elm.childNodes).toHaveLength(1);
    expect(elm.children).toHaveLength(1);
    expect(elm.firstElementChild.tagName).toBe('DIV');
    expect(elm.firstElementChild.innerHTML).toBe('hello');
    expect(elm.innerHTML).toBe('<div>hello</div>');
  });

  it('get empty innerHTML', () => {
    const elm = doc.createElement('div');
    expect(elm.innerHTML).toBe('');
  });

  it('comment', () => {
    const html = `
      a<!--comment-->b
    `;
    const elm = parseHtmlToFragment(html, doc);
    expect(elm.childNodes).toHaveLength(3);
    expect(elm.firstChild.nodeValue).toBe('a');
    expect(elm.firstChild.nextSibling.nodeName).toBe('#comment');
    expect(elm.firstChild.nextSibling.nodeType).toBe(8);
    expect(elm.firstChild.nextSibling.nodeValue).toBe('comment');
    expect(elm.firstChild.nextSibling.textContent).toBe('comment');
    expect(elm.firstChild.nextSibling.nextSibling.nodeValue).toBe('b');
    expect(elm.lastChild.nodeValue).toBe('b');
  });

  it('div > span', () => {
    const html = `
      <div><span></span></div>
    `;
    const elm = parseHtmlToFragment(html, doc);
    expect(elm.children).toHaveLength(1);
    expect(elm.firstElementChild.tagName).toBe('DIV');
    expect(elm.firstElementChild.firstElementChild.tagName).toBe('SPAN');
    expect(elm.firstElementChild.lastChild.nodeName).toBe('SPAN');
    expect(elm.firstElementChild.firstElementChild.parentElement.tagName).toBe('DIV');
  });

  it('div span', () => {
    const html = `
      <div></div>
      <span></span>
    `;
    const elm = parseHtmlToFragment(html, doc);
    expect(elm.children).toHaveLength(2);
    expect(elm.children[0].tagName).toBe('DIV');
    expect(elm.children[0].nextElementSibling.tagName).toBe('SPAN');
    expect(elm.children[1].tagName).toBe('SPAN');
    expect(elm.children[1].previousElementSibling.tagName).toBe('DIV');
  });

  it('article', () => {
    const html = `
      <article>text</article>
    `;
    const elm = parseHtmlToFragment(html, doc);
    expect(elm.children).toHaveLength(1);
    expect(elm.firstElementChild.tagName).toBe('ARTICLE');
    expect(elm.firstElementChild.firstChild.nodeName).toBe('#text');
    expect(elm.firstElementChild.firstChild.nodeValue).toBe('text');
  });

  it('element with < text', () => {
    const html = `
      <article>a < b</article>
    `;
    const elm = parseHtmlToFragment(html, doc);
    expect(elm.children).toHaveLength(1);
    expect(elm.firstElementChild.tagName).toBe('ARTICLE');
    expect(elm.firstElementChild.firstChild.nodeName).toBe('#text');
    expect(elm.firstElementChild.firstChild.nodeValue).toBe('a < b');
  });

  it('div', () => {
    const html = `
      <div class="doc">hello</div>
    `;
    const elm = parseHtmlToDocument(html, doc);
    expect(elm.children).toHaveLength(1);
    expect(elm.children[0].tagName).toBe('HTML');
    expect(elm.children[0].firstChild.nodeName).toBe('HEAD');
    expect(elm.children[0].firstChild.nextSibling.nodeName).toBe('BODY');
    expect(elm.children[0].firstChild.nextSibling.firstChild.nodeName).toBe('DIV');
    expect(elm.children[0].firstChild.nextSibling.firstChild.firstChild.nodeValue).toBe('hello');
  });

});
