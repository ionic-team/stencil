import { MockDocument } from '../document';
import { MockDocumentFragment } from '../document-fragment';

describe('documentFragment', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
  });

  it('move children when appended', () => {
    const frag = new MockDocumentFragment(doc);
    const div = doc.createElement('div');
    const a = doc.createElement('a');
    const text = doc.createTextNode('text');

    frag.appendChild(div);
    frag.appendChild(a);
    frag.appendChild(text);

    expect(frag.childNodes).toHaveLength(3);
    expect(frag).toEqualHtml(`
    <div></div>
    <a></a>
    text
    `);

    doc.body.appendChild(frag);

    expect(frag.childNodes).toHaveLength(0);
    expect(frag).toEqualHtml(``);

    expect(doc.body).toEqualHtml(`
    <div></div>
    <a></a>
    text
    `);
  });
});
