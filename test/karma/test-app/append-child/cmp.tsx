import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'append-child',
  styles: `
    h1 {
      color: red;
      font-weight: bold;
    }
    article {
      color: green;
      font-weight: bold;
    }
    section {
      color: blue;
      font-weight: bold;
    }
  `,
  scoped: true,
})
export class AppendChild {
  render() {
    return (
      <Host>
        <h1>
          H1 Top
          <slot name="h1" />
          <div>H1 Bottom</div>
        </h1>
        <article>
          Default Top
          <slot />
          Default Bottom
        </article>
        <h6>
          <section>
            H6 Top
            <slot name="h6" />
            <div>H6 Bottom</div>
          </section>
        </h6>
      </Host>
    );
  }
}
