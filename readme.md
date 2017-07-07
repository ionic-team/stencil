# Stencil: A Compiler for Web Components

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool.  Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, and an asynchronous rendering pipeline (similar to React Fiber) to generate 100% standards-based Web Components that run in any browser supporting the Web Components v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all. In many cases, Stencil can be used as a drop in replacement for traditional frontend frameworks given the capabilities now available in the browser, though using it as such is certainly not required.

Stencil also supports a number of key capabilities that Web Components do not, in particular Server Side Rendering (SSR) without the need to run a headless browser.

## Getting Started

To start a new project using Stencil, clone the starter project and get to work:

```bash
git clone git@github.com:ionic-team/stencil-starter my-app
cd my-app
git remote rm origin
```

To build your new Stencil project, just run

```bash
npm start
```

This will build and watch your app for changes, as well as starting a development server, available by default at `http://localhost:8080`.

## Creating components

Stencil components are plan ES6/TypeScript classes with some decorator metadata.

```typescript
// Import the Component decorator, and h, the virtual dom call that our JSX compiles to.
import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss'
})
export class MyComponent {
  // Indicate that name should be a property on our new component
  @Prop() name: string;

  @State() isVisible: boolean = true

  render() {
    return (
      <p>
        My name is {name}
      </p>
    );
  }
}
```

Create new components by creating files of the form `my-component.tsx` in `src/components`, organized as you see fit.

Note: the `.tsx` extension is required, as this is the standard for TypeScript classes that use JSX.

