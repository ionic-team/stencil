import { mockWindow } from '@stencil/core/testing';
import { createSandbox } from '../vm-sandbox';


describe('createSandbox', () => {

  it('getComputedStyle()', () => {
    const win = mockWindow();
    const body = win.document.body;
    const sandbox = createSandbox(win);
    const color = sandbox.getComputedStyle(body).getPropertyValue(`color`);
    expect(color).toBe('');
  });

  it('scrollX prop', () => {
    const win = mockWindow();
    const sandbox = createSandbox(win);
    expect(sandbox.scrollX).toBe(0);
  });

  it('globalThis', () => {
    const win = mockWindow();
    const sandbox = createSandbox(win);
    expect(sandbox.globalThis).toBe(win);
  });

});
