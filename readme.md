[![npm][npm-badge]][npm-badge-url]
[![Build Status][circle-badge]][circle-badge-url]
# Stencil: A Compiler for Web Components

Stencil is a simple compiler for generating Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool.  Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all. In many cases, Stencil can be used as a drop in replacement for traditional frontend frameworks given the capabilities now available in the browser, though using it as such is certainly not required.

Stencil also enables a number of key capabilities on top of Web Components, in particular Server Side Rendering (SSR) without the need to run a headless browser, pre-rendering, and objects-as-properties (instead of just strings).

*Note: Stencil and Ionic are completely independent projects. Stencil does not prescribe any specific UI framework, but Ionic is the largest user of Stencil (today!)*

## Why Stencil?

Stencil is a new approach to a popular idea: building fast and feature-rich apps in the browser. Stencil was created to take advantage of major new capabilities available natively in the browser, such as Custom Elements v1, enabling developers to ship far less code and build faster apps that are compatible with any and all frameworks.

Stencil is also a solution to organizations and library authors struggling to build reusable components across a diverse spectrum of frontend frameworks, each with their own component system. Stencil components work in Angular, React, Ember, and Vue as well as they work with jQuery or with no framework at all, because they are just plain HTML elements.

Compared to using Custom Elements directly, inside of every Stencil component is an efficient Virtual DOM rendering system, JSX rendering capabilities, asynchronous rendering pipeline (like React Fiber), and more. This makes Stencil components more performant while maintaining full compatibility with plain Custom Elements. Think of Stencil as creating pre-baked Custom Elements as if you wrote in those features yourself.

## Getting Started

To start a new project using Stencil, clone the starter project and get to work:

```bash
git clone https://github.com/ionic-team/stencil-starter.git my-app
cd my-app
git remote rm origin
npm install
```

To build your new Stencil project, just run

```bash
npm start
```


## Creating components

Stencil components are plain ES6/TypeScript classes with some decorator metadata.

Create new components by creating files with a `.tsx` extension, such as `my-component.tsx`, and place them in `src/components`.

```typescript
import { Component, Prop, State } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss'
})
export class MyComponent {
  // Indicate that name should be a property on our new component
  @Prop() first: string;

  @Prop() last: string;

  @State() isVisible: boolean = true;

  render() {
    return (
      <p>
        Hello, my name is {this.first} {this.last}
      </p>
    );
  }
}
```

Note: the `.tsx` extension is required, as this is the standard for TypeScript classes that use JSX.

To use this component, just use it like any other HTML tag:

```html
<my-component first="Stencil" last="JS"></my-component>
```

## Naming Components

When creating new component tags, we recommend _not_ using `stencil` in the component name (ex: `<stencil-datepicker>`). This is because the generated component has little to nothing to do with Stencil; it's just a web component!

Instead, use a prefix that fits your company or any name for a group of related components. For example, all of the Ionic generated web components use the prefix `ion`.

## Hosting the app

Stencil components run directly in the browser through script includes just like normal Custom Elements (because they are just that!), and run by using the tag just like any other HTML component:

Here's an example `index.html` file that runs a Stencil app:

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>My App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">

  <script src="build/app.js"></script>
</head>

<body>
  <my-component first="Stencil" last="JS"></my-component>
</body>

</html>
```

## API

The API for stencil closely mirrors the API for Custom Elements v1.

### Components

| Decorator      | Description                             |
| -------------- | ---                                     |
| `@Component()` | Indicate a class is a Stencil component. |
|                |                                         |
| `@Prop()`      | Creates a property that will exist on the element and be data-bound to this component.  |
| `@State()`     | Creates a local state variable that will not be placed on the element. |
| `@Method()`    | Expose specifc methods to be publicly accessible. |


## Why "Stencil?"

A Stencil is a tool artists use for drawing perfect shapes easily. We want Stencil to be a similar tool for web developers: a tool that helps web developers build powerful Web Components and apps that use them, but without creating non-standard runtime requirements.

Stencil is a tool developers use to create Web Components with some powerful features baked in, but it gets out of the way at runtime.

[Using Web Components in Ionic - Polymer Summit 2017](https://youtu.be/UfD-k7aHkQE)


## Browser Support

Web Components, specifically Custom Elements, are natively supported in Chrome and Safari and are coming to both Edge and Firefox. A dynamic polyfill loader is already included in order to only load the polyfills for the browsers that are missing specific features.

 - Chrome (and all Chromium based browsers)
 - Safari
 - Edge
 - Firefox
 - IE 11


## Polyfills

For the small minority of browsers that do not support modern browser features and APIs, Stencil will automatically polyfill them on-demand. What this means is that for browsers that already support the feature natively, they will not have to download and parse any unnecessary JavaScript. The great news is that in today's web landscape, most modern APIs are already shipping for what Stencil requires. Polyfills which are loaded on-demand include:

 - [Custom Element](https://github.com/WebReflection/document-register-element)
 - [CSS Variables](https://github.com/webcomponents/shadycss)
 - [Promise](https://github.com/stefanpenner/es6-promise)
 - [fetch()](https://github.com/github/fetch)
 - [&lt;template&gt;](https://github.com/webcomponents/template)
 - [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
 - [performance.now()](https://gist.github.com/paulirish/5438650)
 - [requestAnimationFrame()](https://gist.github.com/paulirish/1579671)
 - [Element.closest](https://github.com/jonathantneal/closest)
 - [Element.matches](https://github.com/jonathantneal/closest)

[npm-badge]: https://img.shields.io/npm/v/@stencil/core.svg
[npm-badge-url]: https://www.npmjs.com/package/@stencil/core
[circle-badge]: https://circleci.com/gh/ionic-team/stencil.svg?style=shield
[circle-badge-url]: https://circleci.com/gh/ionic-team/stencil
