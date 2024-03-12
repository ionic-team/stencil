import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

import { isSafari } from '../util.js';

const css = `main {
  background: rgb(0, 0, 0);
  padding: 30px;
}
header {
  background: rgb(230, 230, 230);
  padding: 30px;
}
section {
  background: rgb(160, 160, 160);
  padding: 30px;
}
footer {
  background: rgb(100, 100, 100);
  padding: 30px;
}
nav {
  background: rgb(50, 50, 50);
  padding: 30px;
}`;

describe('conditional-rerender', function () {
  beforeEach(() => {
    render({
      template: () => (
        <>
          <style>{css}</style>
          <conditional-rerender-root></conditional-rerender-root>
        </>
      ),
    });
  });

  it('contains a button as a child', async () => {
    await $('main').waitForExist();
    await expect($('main')).toHaveText(isSafari() ? 'HeaderContentFooterNav' : 'Header\nContent\nFooter\nNav');
  });
});
