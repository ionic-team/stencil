import { MockWindow } from '../window';
import {EventTarget} from "../event";

describe('event', () => {
  let win: MockWindow;
  beforeEach(() => {
    win = new MockWindow();
  });

  it('Event() requires type', () => {
    expect(() => {
      new win.Event();
    }).toThrow();
  });

  it('Event(type)', () => {
    const ev = new win.Event('click') as Event;
    expect(ev.bubbles).toBe(false);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(false);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('click');
  });

  it('Event(type, eventInitDict)', () => {
    const eventInitDict = {
      bubbles: true,
      composed: true
    };
    const ev = new win.Event('click', eventInitDict) as Event;
    expect(ev.bubbles).toBe(true);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(true);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('click');
  });

  it('CustomEvent() requires type', () => {
    expect(() => {
      new win.CustomEvent();
    }).toThrow();
  });

  it('CustomEvent(type)', () => {
    const ev = new win.CustomEvent('click') as CustomEvent;
    expect(ev.bubbles).toBe(false);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(false);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('click');
    expect(ev.detail).toBe(null);
  });

  it('CustomEvent(type, eventInitDict)', () => {
    const eventInitDict = {
      bubbles: true,
      composed: true,
      detail: 88
    };
    const ev = new win.CustomEvent('click', eventInitDict) as CustomEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(true);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('click');
    expect(ev.detail).toBe(88);
  });

  it('KeyboardEvent() requires type', () => {
    expect(() => {
      new win.KeyboardEvent();
    }).toThrow();
  });

  it('KeyboardEvent(type)', () => {
    const ev = new win.KeyboardEvent('keyup') as KeyboardEvent;
    expect(ev.bubbles).toBe(false);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(false);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('keyup');
    expect(ev.code).toBe('');
    expect(ev.key).toBe('');
    expect(ev.altKey).toBe(false);
    expect(ev.ctrlKey).toBe(false);
    expect(ev.metaKey).toBe(false);
    expect(ev.shiftKey).toBe(false);
    expect(ev.location).toBe(0);
    expect(ev.repeat).toBe(false);
  });

  it('KeyboardEvent(type, eventInitDict)', () => {
    const eventInitDict = {
      bubbles: true,
      composed: true,
      code: 'KeyA',
      key: 'A',
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
      location: 0,
      repeat: true
    };
    const ev = new win.KeyboardEvent('keyup', eventInitDict) as KeyboardEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(true);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('keyup');
    expect(ev.code).toBe('KeyA');
    expect(ev.key).toBe('A');
    expect(ev.altKey).toBe(false);
    expect(ev.ctrlKey).toBe(false);
    expect(ev.metaKey).toBe(false);
    expect(ev.shiftKey).toBe(true);
    expect(ev.location).toBe(0);
    expect(ev.repeat).toBe(true);
  });

  it('MouseEvent() requires type', () => {
    expect(() => {
      new win.MouseEvent();
    }).toThrow();
  });

  it('MouseEvent(type)', () => {
    const ev = new win.MouseEvent('onclick') as MouseEvent;
    expect(ev.bubbles).toBe(false);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(false);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('onclick');
    expect(ev.screenX).toBe(0);
    expect(ev.screenY).toBe(0);
    expect(ev.clientX).toBe(0);
    expect(ev.clientY).toBe(0);
    expect(ev.ctrlKey).toBe(false);
    expect(ev.shiftKey).toBe(false);
    expect(ev.altKey).toBe(false);
    expect(ev.metaKey).toBe(false);
    expect(ev.button).toBe(0);
    expect(ev.buttons).toBe(0);
    expect(ev.relatedTarget).toBe(null);
  });

  it('MouseEvent(type, eventInitDict)', () => {
    const eventInitDict = {
      bubbles: true,
      composed: true,
      screenX: 99,
      screenY: 99,
      clientX: 99,
      clientY: 99,
      ctrlKey: false,
      shiftKey: true,
      altKey: false,
      metaKey: false,
      button: 0,
      buttons: 99,
      relatedTarget: null
    };
    const ev = new win.MouseEvent('onmousedown', eventInitDict) as MouseEvent;
    expect(ev.bubbles).toBe(true);
    expect(ev.cancelBubble).toBe(false);
    expect(ev.cancelable).toBe(false);
    expect(ev.composed).toBe(true);
    expect(ev.currentTarget).toBe(null);
    expect(ev.defaultPrevented).toBe(false);
    expect(ev.srcElement).toBe(null);
    expect(ev.target).toBe(null);
    expect(typeof ev.timeStamp).toBe('number');
    expect(ev.type).toBe('onmousedown');
    expect(ev.screenX).toBe(99);
    expect(ev.screenY).toBe(99);
    expect(ev.clientX).toBe(99);
    expect(ev.clientY).toBe(99);
    expect(ev.ctrlKey).toBe(false);
    expect(ev.shiftKey).toBe(true);
    expect(ev.altKey).toBe(false);
    expect(ev.metaKey).toBe(false);
    expect(ev.button).toBe(0);
    expect(ev.buttons).toBe(99);
    expect(ev.relatedTarget).toBe(null);
  });
});
