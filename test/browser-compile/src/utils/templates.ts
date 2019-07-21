

export interface QuickTemplate {
  source: string;
  html: string;
}
export const templates = new Map<string, QuickTemplate>();



templates.set(`hello-world.tsx`, {

source:  `
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
`
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
`});



templates.set(`shadow-inline-styles.tsx`, {
source: `

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  shadow: true,
  styles: ':host { padding: 20px; background: #ddd; } :host::before { content: "shadow :host"; position: absolute; left: 0; top: 0; } button { font-size: 24px; background: red; color: white; font-weight: bold; }'
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
`
});



templates.set(`scoped-inline-styles.tsx`, {
source: `

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  scoped: true,
  styles: ':host { padding: 20px; background: #ddd; } :host::before { content: "scoped :host"; position: absolute; left: 0; top: 0; } button { font-size: 24px; background: green; color: white; font-weight: bold; }'
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
`
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
`
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
`
});


export const templateList = Array.from(templates).map(([fileName]) => fileName);
