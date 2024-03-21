import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('svg class', () => {
  beforeEach(() => {
    render({
      template: () => (
        <>
          <style>
            {`.primary circle {
                fill: red;
              }
              .primary rect {
                fill: blue;
              }`}
          </style>
          <svg-class></svg-class>
        </>
      ),
    });
  });

  it('toggles svg class', async () => {
    const app = document.body;
    await $('svg-class').waitForExist();
    const svg = app.querySelector('svg');
    const circle = app.querySelector('circle');
    const rect = app.querySelector('rect');

    expect(svg.getAttribute('class')).toBe(null);
    expect(circle.getAttribute('class')).toBe(null);
    expect(rect.getAttribute('class')).toBe(null);

    await $('button').click();
    await $('svg-class').waitForStable();

    expect(svg.getAttribute('class')).toBe('primary');
    expect(circle.getAttribute('class')).toBe('red');
    expect(rect.getAttribute('class')).toBe('blue');
  });
});
