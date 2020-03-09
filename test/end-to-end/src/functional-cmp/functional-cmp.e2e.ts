import { newE2EPage } from '@stencil/core/testing';

describe('Functional Component', () => {
  it('should pass `undefined` as props param so it can be destructured and have a default value', async () => {
    const page = await newE2EPage({ html: `
      <functional-cmp-wrapper></functional-cmp-wrapper>
    `});

    const div = await page.find('functional-cmp-wrapper >>> div');

    expect(div.textContent).toBe('Hi, my name is Kim Doe.')
  })
})
