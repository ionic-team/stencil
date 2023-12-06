import { createFragment } from '../document';
import { MockDocument } from '../document';
import { MockDOMMatrix, MockDOMPoint, MockSVGRect } from '../element';
import { parseHtmlToDocument, parseHtmlToFragment } from '../parse-html';
describe('parseHtml', () => {
    let doc;
    beforeEach(() => {
        doc = new MockDocument();
    });
    it('should create multiple node documentFragment', () => {
        const frag = createFragment('<div>1</div><div>2</div>');
        expect(frag.childNodes.length).toBe(2);
        expect(frag.childNodes[0].textContent).toBe('1');
        expect(frag.childNodes[1].textContent).toBe('2');
    });
    it('should create one node documentFragment', () => {
        const frag = createFragment('<div>1</div>');
        expect(frag.childNodes.length).toBe(1);
        expect(frag.childNodes[0].textContent).toBe('1');
    });
    it('should create empty documentFragment', () => {
        const frag = createFragment();
        expect(frag.childNodes.length).toBe(0);
        expect(frag.nodeType).toBe(11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */);
    });
    it('body innerHTML/querySelector', () => {
        doc = new MockDocument();
        doc.body.innerHTML = '<cmp-a>text</cmp-a>';
        expect(doc.body.innerHTML).toBe(`<cmp-a>text</cmp-a>`);
        expect(doc.body.outerHTML).toBe(`<body><cmp-a>text</cmp-a></body>`);
        const article = doc.querySelector('cmp-a');
        expect(article.tagName).toBe('CMP-A');
    });
    it('svg', () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
        doc = new MockDocument(`
      <div>
        <svg>
          <a>Hello</a>
          <feImage></feImage>
          <foreignObject>
            <a>Hello</a>
            <feImage></feImage>
          </foreignObject>
        <svg>
      </div>
    `);
        expect((_b = (_a = doc.body) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.tagName).toEqual('DIV');
        expect((_e = (_d = (_c = doc.body) === null || _c === void 0 ? void 0 : _c.firstElementChild) === null || _d === void 0 ? void 0 : _d.firstElementChild) === null || _e === void 0 ? void 0 : _e.tagName).toEqual('svg');
        expect((_k = (_j = (_h = (_g = (_f = doc.body) === null || _f === void 0 ? void 0 : _f.firstElementChild) === null || _g === void 0 ? void 0 : _g.firstElementChild) === null || _h === void 0 ? void 0 : _h.children) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.tagName).toEqual('a');
        expect((_q = (_p = (_o = (_m = (_l = doc.body) === null || _l === void 0 ? void 0 : _l.firstElementChild) === null || _m === void 0 ? void 0 : _m.firstElementChild) === null || _o === void 0 ? void 0 : _o.children) === null || _p === void 0 ? void 0 : _p[1]) === null || _q === void 0 ? void 0 : _q.tagName).toEqual('feImage');
        expect((_v = (_u = (_t = (_s = (_r = doc.body) === null || _r === void 0 ? void 0 : _r.firstElementChild) === null || _s === void 0 ? void 0 : _s.firstElementChild) === null || _t === void 0 ? void 0 : _t.children) === null || _u === void 0 ? void 0 : _u[2]) === null || _v === void 0 ? void 0 : _v.tagName).toEqual('foreignObject');
        expect((_1 = (_0 = (_z = (_y = (_x = (_w = doc.body) === null || _w === void 0 ? void 0 : _w.firstElementChild) === null || _x === void 0 ? void 0 : _x.firstElementChild) === null || _y === void 0 ? void 0 : _y.children) === null || _z === void 0 ? void 0 : _z[2].children) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.tagName).toEqual('A');
        expect((_8 = (_7 = (_6 = (_5 = (_4 = (_3 = (_2 = doc.body) === null || _2 === void 0 ? void 0 : _2.firstElementChild) === null || _3 === void 0 ? void 0 : _3.firstElementChild) === null || _4 === void 0 ? void 0 : _4.children) === null || _5 === void 0 ? void 0 : _5[2]) === null || _6 === void 0 ? void 0 : _6.children) === null || _7 === void 0 ? void 0 : _7[1]) === null || _8 === void 0 ? void 0 : _8.tagName).toEqual('FEIMAGE');
        expect(doc.body).toEqualHtml(`
    <div>
      <svg>
        <a>
          Hello
        </a>
        <feImage></feImage>
        <foreignObject>
          <a>
            Hello
          </a>
          <feimage></feimage>
        </foreignObject>
        <svg></svg>
      </svg>
    </div>
    `);
    });
    it('svg attributes', () => {
        var _a, _b, _c, _d;
        doc = new MockDocument(`
      <svg viewBox="0 0 100 100"></svg>
    `);
        expect((_d = (_c = (_b = (_a = doc.body) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c.item(0)) === null || _d === void 0 ? void 0 : _d.name).toEqual('viewBox');
    });
    it('svg matrix members', () => {
        var _a;
        doc = new MockDocument(`
      <svg viewBox="0 0 100 100">
        <svg>
          <rect x="0" y="0" width="10" height="10"></rect>
        </svg>
      </svg>
    `);
        const svgElem = (_a = doc.body.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild;
        expect(svgElem).toBeDefined();
        expect(svgElem.getBBox()).toEqual(new MockSVGRect());
        expect(svgElem.createSVGPoint()).toEqual(new MockDOMPoint());
        expect(svgElem.getScreenCTM()).toEqual(new MockDOMMatrix());
        expect(svgElem.getCTM()).toEqual(new MockDOMMatrix());
    });
    it('svg text members', () => {
        var _a;
        doc = new MockDocument(`
      <svg viewBox="0 0 100 100">
        <text x="10" y="10">
          Hello
          <tspan>world</tspan>
        </text>
      </svg>
    `);
        const text = (_a = doc.body.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild;
        expect(text).toBeDefined();
        expect(text.tagName).toEqual('text');
        const tspan = text.firstElementChild;
        expect(tspan).toBeDefined();
        expect(tspan.getComputedTextLength()).toEqual(0);
    });
    it('template', () => {
        var _a, _b;
        doc = new MockDocument(`
      <template>text</template>
    `);
        expect(doc.head.innerHTML).toBe(`<template>text</template>`);
        const tmplElm = doc.head.firstElementChild;
        expect(tmplElm.outerHTML).toBe(`<template>text</template>`);
        expect((_b = (_a = tmplElm.content) === null || _a === void 0 ? void 0 : _a.firstChild) === null || _b === void 0 ? void 0 : _b.textContent).toBe(`text`);
        expect(tmplElm.childNodes).toHaveLength(0);
    });
    it('getElementsByTagName', () => {
        var _a, _b;
        doc = new MockDocument(`
      <article>article</article>
      <section>section</section>
      <section>section</section>
    `);
        expect(doc.nodeType).toBe(9 /* NODE_TYPES.DOCUMENT_NODE */);
        expect(doc.childElementCount).toBe(1);
        expect((_a = doc.firstElementChild) === null || _a === void 0 ? void 0 : _a.tagName).toBe('HTML');
        expect((_b = doc.lastChild) === null || _b === void 0 ? void 0 : _b.nodeName).toBe('HTML');
        expect(doc.children[0].nodeName).toBe('HTML');
        expect(doc.children[0].nodeType).toBe(1 /* NODE_TYPES.ELEMENT_NODE */);
        const htmlElms = doc.getElementsByTagName('html');
        expect(htmlElms).toHaveLength(1);
        expect(htmlElms[0].tagName).toBe('HTML');
        const bodyElms = doc.getElementsByTagName('body');
        expect(bodyElms).toHaveLength(1);
        expect(bodyElms[0].tagName).toBe('BODY');
        const articleElms = doc.getElementsByTagName('article');
        expect(articleElms).toHaveLength(1);
        expect(articleElms[0].tagName).toBe('ARTICLE');
        const sectionElms = doc.getElementsByTagName('section');
        expect(sectionElms).toHaveLength(2);
        expect(sectionElms[0].tagName).toBe('SECTION');
        expect(sectionElms[1].tagName).toBe('SECTION');
    });
    it('getElementsByName', () => {
        doc = new MockDocument(`
      <form name="form-name">
        <input name="a">
        <input name="a">
      </form>
    `);
        const formElms = doc.getElementsByName('form-name');
        expect(formElms).toHaveLength(1);
        const inputElms = doc.getElementsByName('a');
        expect(inputElms).toHaveLength(2);
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
    it('should respect case in svg', () => {
        const elm = parseHtmlToFragment('<svg  viewbox="0 0 97 20"><symbol viewbox="0 0 97 20"></symbol></svg>');
        expect(elm.children.length).toBe(1);
        expect(elm.children[0].attributes.item(0).name).toBe('viewBox');
        expect(elm.children[0].children[0].attributes.item(0).name).toBe('viewBox');
    });
    it('should mock canvas api', () => {
        const elm = parseHtmlToFragment('<canvas id="canvas" width="300" height="300"></canvas>');
        const canvas = elm.children[0];
        const ctx = canvas.getContext('2d');
        expect(elm.children.length).toBe(1);
        expect(elm.children[0].nodeName).toBe('CANVAS');
        expect(ctx.getImageData(0, 0, 300, 300).data.length).toBe(300 * 300 * 4);
    });
});
//# sourceMappingURL=html-parse.spec.js.map