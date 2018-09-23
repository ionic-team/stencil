import { MockDocument } from '../document';
import { serializeNodeToHtml } from '../serialize-node';


describe('serializeNodeToHtml', () => {

  it('do not escape scripts', () => {
    const doc = new MockDocument();
    const elm = doc.createElement('script');
    elm.innerHTML = `if (true && false) { console.log('hi); }`;
    const html = serializeNodeToHtml(elm, { outerHTML: true });
    expect(html).toBe(`<script>if (true && false) { console.log('hi); }</script>`);
  });

  it('empty document', () => {
    const doc = new MockDocument();
    const html = serializeNodeToHtml(doc);
    expect(html).toBe(`<html><head></head><body></body></html>`);
  });

  it('empty document, pretty', () => {
    const doc = new MockDocument();
    const html = serializeNodeToHtml(doc, { pretty: true });
    expect(html).toBe(`<html>
  <head></head>
  <body></body>
</html>`);
  });

});
