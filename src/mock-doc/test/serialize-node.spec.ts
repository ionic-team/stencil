import { MockDocument } from '../document';
import { serializeNodeToHtml } from '../serialize-node';


describe('serializeNodeToHtml', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
  });

  it('svg', () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>`;
    doc.body.innerHTML = input;

    const output = serializeNodeToHtml(doc.body);
    expect(input).toBe(output);
  });

  it('collapse boolean attributes', () => {
    const input = `<input type="checkbox" checked="">`;
    doc.body.innerHTML = input;

    const output = serializeNodeToHtml(doc.body, { collapseBooleanAttributes: true});
    expect(output).toBe(`<input type="checkbox" checked>`);
  });

  it('do not collapse boolean attributes', () => {
    const input = `<input type="checkbox" checked="">`;
    doc.body.innerHTML = input;

    const output = serializeNodeToHtml(doc.body);
    expect(input).toBe(output);
  });

  it('do not remove empty attrs', () => {
    const elm = doc.createElement('button');

    elm.setAttribute('class', '');
    elm.setAttribute('dir', '');
    elm.setAttribute('my-attr', '');
    elm.setAttribute('id', '');
    elm.setAttribute('data-custom', '');
    elm.setAttribute('lang', '');
    elm.setAttribute('name', '');
    elm.setAttribute('title', '');

    const html = serializeNodeToHtml(elm, { outerHTML: true, removeEmptyAttributes: false });
    expect(html).toBe(`<button class="" dir="" my-attr="" id="" data-custom="" lang="" name="" title=""></button>`);
  });

  it('remove empty attrs', () => {
    const elm = doc.createElement('button');

    elm.setAttribute('class', '');
    elm.setAttribute('dir', '');
    elm.setAttribute('my-attr', '');
    elm.setAttribute('id', '');
    elm.setAttribute('data-custom', '');
    elm.setAttribute('lang', '');
    elm.setAttribute('name', '');
    elm.setAttribute('title', '');

    const html = serializeNodeToHtml(elm, { outerHTML: true });
    expect(html).toBe(`<button my-attr="" data-custom></button>`);
  });

  it('set attributes, pretty', () => {
    const elm = doc.createElement('button');
    elm.setAttribute('type', 'submit');
    elm.setAttribute('id', 'btn');
    elm.textContent = `Text`;
    const html = serializeNodeToHtml(elm, { outerHTML: true, pretty: true });
    expect(html).toBe(`<button id="btn" type="submit">
  Text
</button>`);
  });

  it('set attributes', () => {
    const elm = doc.createElement('button');
    elm.setAttribute('type', 'submit');
    elm.setAttribute('id', 'btn');
    elm.textContent = `Text`;
    const html = serializeNodeToHtml(elm, { outerHTML: true });
    expect(html).toBe(`<button type="submit" id="btn">Text</button>`);
  });

  it('set attributes, removeAttributeQuotes', () => {
    const elm = doc.createElement('button');
    elm.setAttribute('type', 'submit');
    elm.setAttribute('id', 'btn');
    elm.textContent = `Text`;
    const html = serializeNodeToHtml(elm, { outerHTML: true, removeAttributeQuotes: true });
    expect(html).toBe(`<button type=submit id=btn>Text</button>`);
  });

  it('do not escape scripts', () => {
    const elm = doc.createElement('script');
    elm.innerHTML = `if (true && false) { console.log('hi); }`;
    const html = serializeNodeToHtml(elm, { outerHTML: true });
    expect(html).toBe(`<script>if (true && false) { console.log('hi); }</script>`);
  });

  it('empty document', () => {
    const html = serializeNodeToHtml(doc);
    expect(html).toBe(`<!doctype html><html><head></head><body></body></html>`);
  });

  it('empty document, pretty', () => {
    const html = serializeNodeToHtml(doc, { pretty: true });
    expect(html).toBe(`<!doctype html>
<html>
  <head></head>
  <body></body>
</html>`);
  });

});
