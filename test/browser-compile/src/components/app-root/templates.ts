

export interface QuickTemplate {
  source: string;
  html: string;
}
export const templates = new Map<string, QuickTemplate>();



templates.set(`hello-world.tsx`, {

source:  `
import { Component, h } from '@stencil/core';

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



templates.set(`my-name.tsx`, {
source: `

import { Component, h } from '@stencil/core';

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
`

});
