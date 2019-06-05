import { MockWindow } from '../window';

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
});
