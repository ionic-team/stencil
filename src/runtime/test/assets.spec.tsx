import { getAssetPath } from '@stencil/core';


describe('assets', () => {

  it('can call getAssetPath from tests', async () => {

    expect(() => getAssetPath("foo.png")).not.toThrow();

  });

});
