import { MockDocument } from '../document';


describe('cloneNode', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
  });

  it('style', () => {
    const elm = doc.createElement('div');
    elm.setAttribute('style', 'color: red;');

    const cloned = elm.cloneNode(true);
    expect(cloned.getAttribute('style')).toEqual(`color: red;`);
  });

  it('id', () => {
    const elm = doc.createElement('div');
    elm.setAttribute('id', 'value');

    const cloned = elm.cloneNode(true);
    expect(cloned.getAttribute('id')).toEqual(`value`);
  });

});
