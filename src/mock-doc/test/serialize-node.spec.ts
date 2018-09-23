import { MockDocument } from '../document';
import { serializeNodeToHtml } from '../serialize-node';


describe('serializeNodeToHtml', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
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
    expect(html).toBe(`<html><head></head><body></body></html>`);
  });

  it('empty document, pretty', () => {
    const html = serializeNodeToHtml(doc, { pretty: true });
    expect(html).toBe(`<html>
  <head></head>
  <body></body>
</html>`);
  });

});
