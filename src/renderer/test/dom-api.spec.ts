import { AppGlobal, DomApi } from '../../declarations';
import { mockWindow } from '../../testing/mocks';
import { createDomApi } from '../dom-api';


describe('dom api', () => {

  let domApi: DomApi;
  let win: Window;
  let doc: Document;
  let elm: Element;
  let App: AppGlobal;

  beforeEach(() => {
    win = mockWindow();
    doc = win.document;
    elm = doc.createElement('div');
    App = {};
    domApi = createDomApi(App, win, doc);
  });


  describe('$nodeIs', () => {

    it('is not case sensitive', () => {

      const r = domApi.$nodeIs('dIv', elm);
      expect(r).toBe(true);
    })

    it('is not', () => {

      const r = domApi.$nodeIs('span', elm);
      expect(r).toBe(false);
    });
  });

  describe('$insertBefore', () => {

    it('when inserting child on a template, goes in content fragment', () => {

      const parentElm = doc.createElement('template');
      const referenceElm = doc.createElement('div');
      parentElm.content.appendChild(referenceElm);

      domApi.$insertBefore(parentElm, elm, referenceElm);
      const r = parentElm.content.childNodes[0];
      expect(r).toBe(elm);
    });
  });

  describe('$appendChild', () => {

    it('when appending child on a template, goes in content fragment', () => {

      const parentElm = doc.createElement('template');
      parentElm.content.appendChild(doc.createElement('div'));

      domApi.$appendChild(parentElm, elm);
      const r = parentElm.content.childNodes[1];
      expect(r).toBe(elm);
    });
  });

  describe('$childNodes', () => {

    it('returning childNodes from a template', () => {

      const parentElm = doc.createElement('template');
      parentElm.content.appendChild(elm);

      const r = domApi.$childNodes(parentElm)[0];
      expect(r).toBe(elm);
    });
  });

  describe('$parentElement', () => {

    it('element w/ parentNode thats is a shadow root should return host', () => {
      const parentElement = doc.createElement('parent');
      const frag = doc.createDocumentFragment();
      frag.appendChild(elm);
      (frag as any).host = parentElement;
      const r = domApi.$parentElement(elm);
      expect(r).toBe(parentElement);
    });

    it('element w/ parentNode thats not a shadow root should return parentNode', () => {
      const parentElement = doc.createElement('parent');
      parentElement.appendChild(elm);
      const r = domApi.$parentElement(elm);
      expect(r).toBe(parentElement);
    });

    it('no parent should return null', () => {
      const r = domApi.$parentElement(elm);
      expect(r).toBeNull();
    });

  });

  describe('$elementRef', () => {

    it('window', () => {
      const r = domApi.$elementRef(elm, 'window');
      expect(r).toBe(win);
    });

    it('document', () => {
      const r = domApi.$elementRef(elm, 'document');
      expect(r).toBe(doc);
    });

    it('body', () => {
      const r = domApi.$elementRef(elm, 'body');
      expect(r).toBe(doc.body);
    });

    it('parent', () => {
      const parentElement = doc.createElement('div');
      parentElement.appendChild(elm);
      const r = domApi.$elementRef(elm, 'parent');
      expect(r).toBe(parentElement);
    });

    it('child', () => {
      const r = domApi.$elementRef(elm, 'child');
      expect(r).toBe(elm.firstElementChild);
    });

    it('self', () => {
      const r = domApi.$elementRef(elm, '');
      expect(r).toBe(elm);
    });

  });

  describe('$addClass', () => {

    it('should apply a class to svg elements', () => {
      const elm = doc.createElement('svg');
      domApi.$addClass(elm, 'something');
      expect(elm).toHaveClass('something');
    });

  });

});
