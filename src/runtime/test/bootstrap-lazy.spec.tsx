import { doc } from '@platform';

import { bootstrapLazy } from '../bootstrap-lazy';

describe('assets', () => {
  it('should not append broken css', () => {
    const spy = jest.spyOn(doc.head, 'insertBefore');

    /**
     * To make the test shorter I called bootstrapLazy without any bundles
     * When a user call defineCustomElements multiple times it will prevent defining the same elements within
     * the bootstrapLazy method. Although this works it does still add the broken css.
     */
    bootstrapLazy([]);

    expect(spy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        sheet: expect.objectContaining({
          cssRules: [
            expect.objectContaining({
              // This html is not valid since it does not start with a selector for the visibility hidden block
              cssText: '{visibility:hidden}.hydrated{visibility:inherit}',
            }),
          ],
        }),
      }),
      null,
    );
  });
});
