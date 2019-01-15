import { MockDocument } from '../document';


describe('element', () => {
  let doc: MockDocument;
  beforeEach(() => {
    doc = new MockDocument();
  });

  it('isConnected nested true', () => {
    const elmParent = document.createElement('div');
    const elmChild = document.createElement('div');
    elmParent.appendChild(elmChild);
    document.body.appendChild(elmParent);
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

});
