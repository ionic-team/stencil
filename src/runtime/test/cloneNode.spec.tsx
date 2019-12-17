import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('cloneNode', () => {

  it('non shadow-dom', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return (
          <div>
            <slot name='start'></slot>
            <section>
              <slot></slot>
            </section>
            <slot name='end'></slot>
          </div>
        );
      }
    }
    const { root, body, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a>
          <h1>Content</h1>
          <h3 slot="end">End</h3>
          <h2 slot="start">Start</h2>
        </cmp-a>`,
    });

    const deepClone = root.cloneNode(true);
    expect(deepClone).toEqualHtml(`
      <cmp-a>
        <h1>Content</h1>
        <h3 slot="end">End</h3>
        <h2 slot="start">Start</h2>
      </cmp-a>
    `);
    const shallowClone = root.cloneNode();
    expect(shallowClone).toEqualHtml(`<cmp-a></cmp-a>`);


    // Append clones to the dom
    body.appendChild(deepClone);
    body.appendChild(shallowClone);
    await waitForChanges();
    await waitForChanges();

    expect(deepClone).toEqualHtml(`
      <cmp-a>
        <div>
          <h2 slot=\"start\">
            Start
          </h2>
          <section>
            <h1>
              Content
            </h1>
          </section>
          <h3 slot=\"end\">
            End
          </h3>
        </div>
      </cmp-a>
    `);

    expect(shallowClone).toEqualHtml(`
      <cmp-a>
        <div>
          <section></section>
        </div>
      </cmp-a>
    `);
  });

  it('shadow-dom', async () => {
    @Component({ tag: 'cmp-a', shadow: true})
    class CmpA {
      render() {
        return (
          <div>
            <slot name='start'></slot>
            <section>
              <slot></slot>
            </section>
            <slot name='end'></slot>
          </div>
        );
      }
    }
    const { root, body, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a>
          <h1>Content</h1>
          <h3 slot="end">End</h3>
          <h2 slot="start">Start</h2>
        </cmp-a>`,
    });

    const deepClone = root.cloneNode(true);
    expect(deepClone).toEqualHtml(`
      <cmp-a>
        <mock:shadow-root></mock:shadow-root>
        <h1>Content</h1>
        <h3 slot="end">End</h3>
        <h2 slot="start">Start</h2>
      </cmp-a>
    `);
    const shallowClone = root.cloneNode();
    expect(shallowClone).toEqualHtml(`
      <cmp-a>
        <mock:shadow-root></mock:shadow-root>
      </cmp-a>`);


    // Append clones to the dom
    body.appendChild(deepClone);
    body.appendChild(shallowClone);
    await waitForChanges();
    await waitForChanges();

    expect(deepClone).toEqualHtml(`
      <cmp-a>
        <mock:shadow-root>
          <div>
            <slot name=\"start\"></slot>
            <section>
              <slot></slot>
            </section>
            <slot name=\"end\"></slot>
          </div>
        </mock:shadow-root>

        <h1>Content</h1>
        <h3 slot=\"end\">End</h3>
        <h2 slot=\"start\">Start</h2>
      </cmp-a>
    `);

    expect(shallowClone).toEqualHtml(`
      <cmp-a>
        <mock:shadow-root>
          <div>
            <slot name=\"start\"></slot>
            <section>
              <slot></slot>
            </section>
            <slot name=\"end\"></slot>
          </div>
        </mock:shadow-root>
      </cmp-a>
    `);
  });

});
