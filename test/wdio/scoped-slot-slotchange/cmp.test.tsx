import { h, Fragment } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';
import { $, expect } from '@wdio/globals';

describe('scoped-slot-slotchange', () => {
  beforeEach(async () => {
    // @ts-expect-error - no components array?
    render({
      template: () => (
        <scoped-slot-slotchange-wrap>
          <p>My initial slotted content.</p>
        </scoped-slot-slotchange-wrap>
      ),
    });
    await $('scoped-slot-slotchange-wrap div').waitForExist();
  });

  it('checks that internal, stencil content changes fire slotchange events', async () => {
    const slotChangeEle: any = document.querySelector('scoped-slot-slotchange');
    expect(slotChangeEle).toBeDefined();
    expect(slotChangeEle.slotEventCatch).toBeDefined();
    expect(slotChangeEle.slotEventCatch).toStrictEqual([]);
  });
});
