import { newSpecPage } from '@stencil/core/testing';
import { MySimple } from './simple';
import { expect } from '@jest/globals';

/// <reference types="jest" />

describe('my-simple', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MySimple],
      html: '<my-simple></my-simple>',
    });

    // Currently this ugly cast is required for expect extensions in ESM - fix should be coming soon.
    // https://github.com/facebook/jest/issues/12267
    (expect(page.root) as unknown as jest.JestMatchers<HTMLElement>).toEqualHtml(`
      <my-simple>
        <span>
          simple!
        </span>
      </my-simple>
    `);
  });
});
