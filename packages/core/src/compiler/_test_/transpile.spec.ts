import { describe, expect, it } from 'vitest';

import { transpile, transpileSync } from '../transpile';

describe('transpile() - CSS style docs', () => {
  it('does not collect styleDocs by default', async () => {
    const results = await transpile(
      `
        :host {
          /** Corner radius. */
          --my-radius: 4px;
        }
      `,
      { file: 'my-cmp.css?tag=my-cmp&encapsulation=shadow' },
    );

    expect(results.styleDocs).toBeUndefined();
  });

  it('collects an explicit @prop annotation when docs is requested', async () => {
    const results = await transpile(
      `
        /**
         * @prop --my-color: The text color
         */
        :host {
          color: var(--my-color);
        }
      `,
      { file: 'my-cmp.css?tag=my-cmp&encapsulation=shadow', docs: true },
    );

    expect(results.styleDocs).toEqual([
      { name: '--my-color', docs: 'The text color', annotation: 'prop', mode: '$' },
    ]);
  });

  it('auto-detects a doc-commented :host declaration when docs is requested', async () => {
    const results = await transpile(
      `
        :host {
          /** Corner radius. */
          --my-radius: 4px;
        }
      `,
      { file: 'my-cmp.css?tag=my-cmp&encapsulation=shadow', docs: true },
    );

    expect(results.styleDocs).toEqual([
      { name: '--my-radius', docs: 'Corner radius.', annotation: 'prop', mode: '$' },
    ]);
  });

  it('collects syntax/default from a native @property at-rule when docs is requested', async () => {
    const results = await transpile(
      `
        /** Corner radius. */
        @property --my-radius {
          syntax: "<length>";
          initial-value: 4px;
        }
      `,
      { file: 'my-cmp.css?tag=my-cmp&encapsulation=shadow', docs: true },
    );

    expect(results.styleDocs).toEqual([
      {
        name: '--my-radius',
        docs: 'Corner radius.',
        annotation: 'prop',
        mode: '$',
        syntax: '<length>',
        default: '4px',
      },
    ]);
  });

  it('is scoped to the tag selector for none encapsulation', async () => {
    const results = await transpile(
      `
        my-cmp {
          /** Corner radius. */
          --my-radius: 4px;
        }
      `,
      { file: 'my-cmp.css?tag=my-cmp&encapsulation=none', docs: true },
    );

    expect(results.styleDocs).toEqual([
      { name: '--my-radius', docs: 'Corner radius.', annotation: 'prop', mode: '$' },
    ]);
  });

  it('works the same way synchronously via transpileSync', () => {
    const results = transpileSync(
      `
        :host {
          /** Corner radius. */
          --my-radius: 4px;
        }
      `,
      { file: 'my-cmp.css?tag=my-cmp&encapsulation=shadow', docs: true },
    );

    expect(results.styleDocs).toEqual([
      { name: '--my-radius', docs: 'Corner radius.', annotation: 'prop', mode: '$' },
    ]);
  });
});

describe('transpileSync() - deprecated @Component API', () => {
  it('reports the error on every call, not just the first in the process', () => {
    const code = `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'my-cmp', shadow: true })
      export class MyCmp { render() { return <div />; } }
    `;
    for (let i = 0; i < 2; i++) {
      const { diagnostics } = transpileSync(code, { file: '/src/my-cmp.tsx' });
      expect(
        diagnostics.some((d) => d.level === 'error' && /deprecated API/.test(d.messageText)),
      ).toBe(true);
    }
  });
});

describe('transpileSync() - componentExport', () => {
  const component = (exportKeywords: string) => `
    import { Component, Prop, h } from '@stencil/core';
    @Component({ tag: 'my-cmp' })
    ${exportKeywords} class MyCmp {
      @Prop() label = 'hi';
      render() { return <div>{this.label}</div>; }
    }
  `;
  const transpileCmp = (exportKeywords: string, opts: Parameters<typeof transpileSync>[1] = {}) =>
    transpileSync(component(exportKeywords), { file: 'my-cmp.tsx', sourceMap: false, ...opts });

  it('attaches runtime metadata to a `module` export by default', () => {
    const { code } = transpileCmp('export', { componentExport: 'module' });
    expect(code).toContain('export const MyCmp = class extends HTMLElement');
    expect(code).toMatch(/proxyCustomElement\(MyCmp, \[/);
    expect(code).not.toContain('defineCustomElement');
  });

  it('leaves a `module` export unproxied when `proxy` is null', () => {
    const { code } = transpileCmp('export', { componentExport: 'module', proxy: null });
    expect(code).not.toContain('proxyCustomElement');
  });
});
