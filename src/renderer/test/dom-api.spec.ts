import { createDomApi } from '../dom-api';
import { DomApi } from '../../declarations';
import { mockElement, mockWindow } from '../../testing/mocks';


describe('dom api', () => {

  describe('$parentElement', () => {

    it('element w/ parentNode thats is a shadow root should return host', () => {
      const parentElement = mockElement('parent');
      const frag = doc.createDocumentFragment();
      frag.appendChild(elm);
      frag.host = parentElement;
      const r = domApi.$parentElement(elm);
      expect(r).toBe(parentElement);
    });

    it('element w/ parentNode thats not a shadow root should return parentNode', () => {
      const parentElement = mockElement('parent');
      parentElement.appendChild(elm);
      const r = domApi.$parentElement(elm);
      expect(r).toBe(parentElement);
    });

    it('no parent should return undefined', () => {
      const r = domApi.$parentElement(elm);
      expect(r).toBeUndefined();
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
      const parentElement = mockElement('div');
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


  var domApi: DomApi;
  var win: any;
  var doc: any;
  var elm: any;

  beforeEach(() => {
    win = mockWindow();
    doc = win.document;
    elm = mockElement('div');
    domApi = createDomApi(win, doc);
  });

});
