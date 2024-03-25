import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('textContent patch', () => {
  beforeEach(async () => {
    render({
      template: () => (
        <>
          <text-content-patch-scoped></text-content-patch-scoped>
          <text-content-patch-scoped-with-slot>
            {/*This should be ignored*/}
            Slot content
            <p slot="suffix">Suffix content</p>
          </text-content-patch-scoped-with-slot>
        </>
      ),
    });

    await $('text-content-patch-scoped').waitForExist();
  });

  describe('scoped encapsulation', () => {
    it('should return the content of all slots', () => {
      const elm = document.querySelector('text-content-patch-scoped-with-slot');
      expect(elm.textContent.trim()).toBe('Slot content Suffix content');
    });

    it('should return an empty string if there is no slotted content', () => {
      const elm = document.querySelector('text-content-patch-scoped');
      expect(elm.textContent.trim()).toBe('');
    });

    it('should overwrite the default slot content', () => {
      const elm = document.querySelector('text-content-patch-scoped-with-slot');
      elm.textContent = 'New slot content';

      expect(elm.textContent.trim()).toBe('New slot content');
    });

    it('should not insert the text node if there is no default slot', () => {
      const elm = document.querySelector('text-content-patch-scoped');
      elm.textContent = 'New slot content';

      expect(elm.textContent.trim()).toBe('');
    });
  });
});
