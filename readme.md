<p align="center">
  <a href="#">
    <img alt="stencil-logo" src="https://github.com/ionic-team/stencil/blob/main/stencil-logo.png" width="60">
  </a>
</p>

<h1 align="center">
  Stencil
</h1>

<p align="center">
  A compiler for generating <a href="https://www.webcomponents.org/introduction">Web Components</a> 
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@stencil/core">
    <img src="https://img.shields.io/npm/v/@stencil/core.svg" alt="StencilJS is released under the MIT license." /></a>
  <a href="https://github.com/ionic-team/stencil/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="StencilJS is released under the MIT license." />
  </a>
  <a href="https://github.com/ionic-team/stencil/blob/main/.github/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/stenciljs">
    <img src="https://img.shields.io/twitter/follow/stenciljs.svg?label=Follow%20@stenciljs" alt="Follow @stenciljs">
  </a>
</p>

<h2 align="center">
  <a href="https://stenciljs.com/docs/getting-started#starting-a-new-project">Quick Start</a>
  <span> · </span>
  <a href="https://stenciljs.com/docs/introduction">Documentation</a>
  <span> · </span>
  <a href="https://github.com/ionic-team/stencil/blob/main/.github/CONTRIBUTING.md">Contribute</a>
  <span> · </span>
  <a href="https://ionicframework.com/blog/tag/stencil/">Blog</a>
  <br />
  Community: 
  <a href="https://stencil-worldwide.herokuapp.com">Slack</a>
  <span> · </span>
  <a href="https://forum.ionicframework.com/c/stencil/21/">Forums</a>
  <span> · </span>
  <a href="https://twitter.com/stenciljs">Twitter</a>
</h2>

[Stencil](https://stenciljs.com/) is a simple compiler for generating Web Components and static site generated progressive web apps (PWA). Stencil was built by the [Ionic](https://ionic.io/) team for its next generation of performant mobile and desktop Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool. It combines TypeScript, JSX, an asynchronous rendering pipeline to ensure smooth running animations and lazy-loading, to generate 100% standards-based Web Components that run on both [modern browsers and legacy browsers](https://stenciljs.com/docs/browser-support).

Stencil components are just Web Components, so they work in any major framework or with no framework at all. In many cases, Stencil can be used as a drop in replacement for traditional frontend frameworks given the capabilities now available in the browser, though using it as such is certainly not required.

Stencil also enables a number of key capabilities on top of Web Components, in particular Server Side Rendering (SSR) without the need to run a headless browser, pre-rendering, and objects-as-properties (instead of just strings).

## Getting Started

To create a new project using an interactive cli, run:

```bash
npm init stencil
```

To start developing your new Stencil project, run:

```bash
npm start
```

## Creating components

Stencil components are TypeScript classes with decorator metadata. The decorators themselves are purely build-time annotations so the compiler can read metadata about each component, and removed entirely for smaller efficient components.

Create new components by creating files with a `.tsx` extension, such as `my-component.tsx`, and place them in `src/components`.

```tsx
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css'
})
export class MyComponent {

  @Prop() first: string;
  @Prop() last: string;

  render() {
    return (
      <div>
        Hello, my name is {this.first} {this.last}
      </div>
    );
  }
}
```

To use this component, just use it like any other HTML element:

```html
<my-component first="Stencil" last="JS"></my-component>
```

## Thanks
Stencil's internal testing suite is supported by the [BrowserStack Open-Source Program](https://www.browserstack.com/open-source)
<br>
<a target="_blank" href="https://www.browserstack.com/"><img width="200" src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png"></a>
