import { MockDocument } from '../document';
import { MockWindow, cloneWindow } from '../window';


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

});
