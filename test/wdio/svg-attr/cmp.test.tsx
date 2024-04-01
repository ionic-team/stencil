import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('svg attr', () => {
  beforeEach(() => {
    render({
      template: () => <svg-attr></svg-attr>,
    });
  });

  it('adds and removes attribute', async () => {
    const app = document.body;
    await $('svg-attr').waitForStable();
    let rect = app.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe(null);

    await $('button').click();
    rect = app.querySelector('rect');
    await expect(rect).toHaveAttribute('transform', 'rotate(45 27 27)');

    await $('button').click();
    rect = app.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe(null);
  });
});
