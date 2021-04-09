import { MockWindow } from '../window';

describe('matchMedia', () => {
  let win: MockWindow;
  let media;
  beforeEach(() => {
    win = new MockWindow(`
      <html>
        <head>
        </head>
      </head>
      `);
    media = win.matchMedia('(prefers-color-scheme: dark)');
  });

  it('MediaQueryList.media', () => {
    expect(media.media).toBe('(prefers-color-scheme: dark)');
  });
  it('MediaQueryList.matches', () => {
    expect(media.matches).toBe(false);
  });
  it('MediaQueryList.addEventListener', () => {
    expect(media.addEventListener).toBeDefined();
  });
  it('MediaQueryList.dispatchEvent', () => {
    expect(media.dispatchEvent).toBeDefined();
  });
  it('MediaQueryList.removeEventListener', () => {
    expect(media.removeEventListener).toBeDefined();
  });
  it('MediaQueryList.onchange', () => {
    expect(media.onchange).toBe(null);
  });
});
