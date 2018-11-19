import { MockDocument } from '../document';


describe('element', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
  });

  it('getBoundingClientRect', () => {
    const elm = doc.createElement('div');
    const rect = elm.getBoundingClientRect();

    expect(rect).toEqual({
      bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0
    });
  });

});
