export interface QuickTemplate {
  source: string;
  html: string;
}
export const templates = new Map<string, QuickTemplate>();

templates.set(`hello-world.tsx`, {
  source: `
import { Component } from '@stencil/core';

@Component({
  tag: 'hello-world'
})
export class HelloWorld {

  render() {
    return 'Hello World';
  }

}
`,
  html: `
<hello-world></hello-world>
`,
});

templates.set(`properties.tsx`, {
  source: `

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-name'
})
export class MyName {

  @Prop() first: string;
  @Prop() last: string;

  render() {
    return (
      <h1>{this.first} {this.last}</h1>
    );
  }

}

`,
  html: `
<my-name first="Stencil" last="JS"></my-name>
`,
});

templates.set(`shadow-inline-styles.tsx`, {
  source: `

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  shadow: true,
  styles: ':host { display: block; padding: 20px; background: #ddd; } :host::before { content: "shadow :host"; position: absolute; left: 0; top: 0; } button { font-size: 24px; background: red; color: white; font-weight: bold; }'
})
export class MyButton {

  render() {
    return (
      <button style={{background: this.color}}>
        <slot/>
      </button>
    );
  }

}

`,
  html: `
<my-button>Shadow / Inline Styles</my-button>
`,
});

templates.set(`scoped-inline-styles.tsx`, {
  source: `

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  scoped: true,
  styles: ':host { display: block; padding: 20px; background: #ddd; } :host::before { content: "scoped :host"; position: absolute; left: 0; top: 0; } button { font-size: 24px; background: green; color: white; font-weight: bold; }'
})
export class MyButton {

  render() {
    return (
      <button>
        <slot/>
      </button>
    );
  }

}

`,
  html: `
<my-button>Scoped / Inline Styles</my-button>
`,
});

templates.set(`style-esm-import.tsx`, {
  source: `

import { Component, Prop, h } from '@stencil/core';
import styleEsmImport from './style-import.css';

@Component({
  tag: 'my-button',
  styles: styleEsmImport
})
export class MyButton {

  render() {
    return (
      <button>
        <slot/>
      </button>
    );
  }

}

`,
  html: `
<my-button>Style ESM Import</my-button>
`,
});

templates.set(`style-local-const.tsx`, {
  source: `

import { Component, Prop, h } from '@stencil/core';
const styleLocal = ':host { display: block; padding: 20px; background: #ddd; } :host::before { content: "styleLocal"; position: absolute; left: 0; top: 0; } button { font-size: 24px; background: maroon; color: white; font-weight: bold; }';

@Component({
  tag: 'my-button',
  styles: styleLocal,
  shadow: true
})
export class MyButton {

  render() {
    return (
      <button>
        <slot/>
      </button>
    );
  }

}

`,
  html: `
<my-button>Style Local Const</my-button>
`,
});

templates.set(`style-url.tsx`, {
  source: `

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  styleUrl: 'style-import.css'
})
export class MyButton {

  render() {
    return (
      <button>
        <slot/>
      </button>
    );
  }

}

`,
  html: `
<my-button>Style Url</my-button>
`,
});

templates.set(`scoped-style-url.tsx`, {
  source: `

  import { Component, Prop, h } from '@stencil/core';

  @Component({
    tag: 'my-button',
    scoped: true,
    styleUrl: 'scoped-style-import.css'
  })
  export class MyButton {

    render() {
      return (
        <button>
          <slot/>
        </button>
      );
    }

  }

  `,
  html: `
  <my-button>Scoped Style Url</my-button>
  `,
});

templates.set(`shadow-modes.tsx`, {
  source: `

import { Component, Prop, h, setMode } from '@stencil/core';

setMode(elm => {
  return elm.getAttribute('mode');
});

@Component({
  tag: 'my-button',
  shadow: true,
  styleUrls: {
    ios: 'ios.css',
    md: 'md.css'
  }
})
export class MyButton {

  render() {
    return (
      <button>
        <slot/>
      </button>
    );
  }

}

`,
  html: `
<my-button mode="ios">ios Shadow Url - Blue</my-button>
<my-button mode="md">md Shadow Url - Green</my-button>
`,
});

templates.set(`scoped-modes.tsx`, {
  source: `

import { Component, Prop, h, setMode } from '@stencil/core';

setMode(elm => {
  return elm.getAttribute('mode');
});

@Component({
  tag: 'my-button',
  scoped: true,
  styleUrls: {
    ios: 'ios.css',
    md: 'md.css'
  }
})
export class MyButton {

  render() {
    return (
      <button>
        <slot/>
      </button>
    );
  }

}

`,
  html: `
<my-button mode="ios">ios Scoped Url - Blue</my-button>
<my-button mode="md">md Scoped Url - Green</my-button>
`,
});

templates.set(`my-css.css`, {
  source: `
@import "some-import.css";
body {
  background: gray;
}
header div > span.panic {
  color: red;
}
`,
  html: ``,
});

export const templateList = Array.from(templates).map(([fileName]) => fileName);
