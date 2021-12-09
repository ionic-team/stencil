<p align="center">
  <img align="center" href="#">
    ![stencil](https://github.com/ionic-team/stencil/blob/main/stencil-logo.png)
  </img>
</p>

<h1 align="center">
  Stencil
</h1>

<p align="center">
  A compiler for generating <a href="https://www.webcomponents.org/introduction">Web Components</a> 
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@stencil/core">
    <img src="https://img.shields.io/npm/v/@stencil/core.svg" alt="StencilJS is released under the MIT license." />
  </a>
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

[Stencil](https://stenciljs.com/) is a simple compiler for generating Web Components and static site generated progressive web apps (PWA). Stencil was built by the [Ionic](http://ionic.io/) team for its next generation of performant mobile and desktop Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool. It takes TypeScript, JSX, an asynchronous rendering pipeline to ensure smooth running animations, lazy-loading out of the box, and generates 100% standards-based Web Components that run on both [modern browsers and legacy browsers](https://stenciljs.com/docs/browser-support).

Stencil components are just Web Components, so they work in any major framework or with no framework at all. In many cases, Stencil can be used as a drop in replacement for traditional frontend frameworks given the capabilities now available in the browser, though using it as such is certainly not required.

Stencil also enables a number of key capabilities on top of Web Components, in particular Server Side Rendering (SSR) without the need to run a headless browser, pre-rendering, and objects-as-properties (instead of just strings).

*Note: Stencil and [Ionic Framework](https://ionicframework.com/) are completely independent projects. Stencil does not prescribe any specific UI framework, but Ionic Framework is the largest user of Stencil (today!)*


## Getting Started

To create a new project using an interactive cli, run:

```bash
npm init stencil
```

To start developing your new Stencil project, run:

```bash
npm start
```

## Why Stencil?

Stencil is a new approach to a popular idea: building fast and feature-rich apps in the browser. Stencil was created to take advantage of major new capabilities available natively in the browser, such as Custom Elements v1, enabling developers to ship far less code and build faster apps that are compatible with any and all frameworks.

Stencil is also a solution to organizations and library authors struggling to build reusable components across a diverse spectrum of frontend frameworks, each with their own component system. Stencil components work in React, Vue, Angular and Ember, as well as they work with jQuery or with no framework at all, because they are just plain HTML elements.

Compared to using Custom Elements directly, inside every Stencil component is an efficient JSX rendering system, asynchronous rendering pipeline to prevent jank, and more. This makes Stencil components more performant while maintaining full compatibility with plain Custom Elements. Think of Stencil as creating pre-baked Custom Elements as if you wrote in those features yourself.


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

## Testing powered by 
<a target="_blank" href="https://www.browserstack.com/"><img width="200" src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png"></a><br>
[BrowserStack Open-Source Program](https://www.browserstack.com/open-source)

## License

 - [MIT](https://raw.githubusercontent.com/ionic-team/stencil/main/LICENSE.md)
 
