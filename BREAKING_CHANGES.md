# Stencil One

Most of the updates for the `1.0.0` release involve removing custom APIs, and continuing to leverage web-standards in order to generate future-proof components that scale.

Additionally, these updates allow Stencil to further improve its tooling, with a focus on great developer experience for teams maintaining codebases across large organizations.


## BREAKING CHANGES

A common issue with JSX is each separate project's use of global JSX types. Many of the required changes are in order to avoid global types, which often cause issues for apps which import from numerous packages. The other change is having each component import its renderer, such as JSX's `h()` function.

### Import `{ h }` is required

In order to render JSX in Stencil apps, the `h()` function must be imported from `@stencil/core`:

```diff
+ import { h } from '@stencil/core';

function app() {
  return <ion-app></ion-app>
}
```

The `h` stands for "hyperscript", which is what JSX elements are transformed into (it's the actual function executed when rendering within the runtime). Stencil's `h` import is an equivalent to React's [React.createElement](https://reactjs.org/docs/react-without-jsx.html). This also explains why the app's `tsconfig.json` sets the `{ "jsxFactory": "h" }` config, which is detailed further in  [TypeScript's JSX Factory Function Docs](https://www.typescriptlang.org/docs/handbook/jsx.html#factory-functions).

You might think that `h` will be marked as "unused" by linters, but it's not! Any JSX syntax you write, is equivalent to using `h` directly, and the typescript's tooling is aware of that.

```tsx
const jsx = <ion-button>;
```

is the same as:

```tsx
const jsx = h('ion-button', null, null);
```


### index.html's `<script>`s updated to use `type="module"`

Stencil used to generate a loader `.js` file that automatically decided which entry-point to load based in the browser's capabilities. In Stencil 1.0 we have decided to completely remove the overhead of this loader by directly loading the core using the web-standard `type="module"` script attribute. Less runtime and preferring native browser features. Win Win. For more for info, please see [Using JavaScript modules on the web](https://developers.google.com/web/fundamentals/primers/modules#browser).

```diff
- <script src="/build/app.js"></script>
+ <script type="module" src="/build/app.esm.js"></script>
+ <script nomodule src="/build/app.js"></script>
```

### Collection's package.json

Stencil One has changed the internal folder structure of the `dist` folder, and some entry-points are located in different location:

- **"module"**: `dist/esm/index.js` => `dist/index.mjs`
- **"jsnext:main**": `dist/esm/es2017/index.js` => `dist/esm/index.mjs`


Make sure you update the `package.json` in the root of your project, like this:

```diff
  {
     "main": "dist/index.js",

-    "module": "dist/esm/index.js",
+    "module": "dist/index.mjs",

-    "es2015": "dist/esm/es2017/index.js",
-    "es2017": "dist/esm/es2017/index.js",
-    "jsnext:main": "dist/esm/es2017/index.js",
+    "es2015": "dist/esm/index.mjs",
+    "es2017": "dist/esm/index.mjs",
+    "jsnext:main": "dist/esm/index.mjs",
  }
```

### Dependencies

Some packages, specially the ones from the Stencil and Ionic core teams used some private APIs of Stencil, that's why if your collection depends of `@ionic/core`, `@stencil/router` or `@stencil/state-tunnel`, you might need to update your `package.json` to point these dependencies to the `"one"` tag.

```
"@ionic/core": "one",
"@stencil/router": "^1.0.0",
"@stencil/state-tunnel": "^1.0.0",

"@stencil/sass": "^1.0.0",
"@stencil/less": "^1.0.0",
"@stencil/stylus": "^1.0.0",
"@stencil/postcss": "^1.0.0",
```

### `window.NAMESPACE` is no longer a thing

Stencil will not read/write to the browser's global `window` anymore. So things like `window.App` or `window.Ionic` are gone, and should be provided by the user's code if need be.


### `@Prop() mode` is no longer reserved prop

`@Prop() mode` used to be the way to define and read the current mode of a component. This API was removed since it was very local to the use case of Ionic.

Instead, the `mode` can be read by using the `getMode()` method from `@stencil/core`.


### Removed: Global `JSX`

For all the same reasons for now importing `h`, in order to prevent type collision in the future, we have moved to local scoped JSX namespaces. Unfortunately, this means `JSX` is no longer global and it needs to be imported from `@stencil/core`. Also, note that while the below example has the render function with a return type of `JSX.Element`, we recommend to not have a return type at all:

```tsx
import { JSX, h } from '@stencil/core';

render(): JSX.Element {
  return <ion-button></ion-button>
}
```

- `HTMLAttributes` might not be available as a global
- `JSX`

### Removed: Global `HTMLAttributes`

`HTMLAttributes` used to be exposed as a global interface, just like the `JSX` namespace, but that caused type conflicts when mixing different versions of stencil in the same project.

Now `HTMLAttributes` is part of `JSXBase`, exposed in `@stencil/core`:

```ts
import { JSXBase } from '@stencil/core';

JSXBase.HTMLAttributes

```

### Removed: Global `HTMLStencilElement`

The global type for `HTMLStencilElement` has been removed. Instead, it's better is to use the exact type of your component, such as `HTMLIonButtonElement`. The HTML types are automatically generated within the `components.d.ts` file.


### Removed: Global `StencilIntrinsicElement`

The global type `StencilIntrinsicElement` has been removed. It can be replaced by importing the `JSX` namespace from `@stencil/core`:

```tsx
import { JSX } from '@stencil/core';

export type StencilIntrinsicElement = JSX.IntrinsicElement;
```

### Removed: @Listen('event.KEY’)

It's no longer possible to use the `event.KEY` syntax in the `@Listen` decorator in order to only listen for specific key strokes.
Instead, the browser already implements easy-to-use APIs:

**BEFORE:**

```ts
@Listen('keydown.enter')
onEnter() {
  console.log('enter pressed');
}
```

**AFTER:**

```ts
@Listen('keydown')
onEnter(ev: KeyboardEvent) {
  if (ev.key === 'Enter') {
    console.log('enter pressed');
  }
}
```

### Removed: @Listen('event’, { enabled })

It's not possible to programmatically enable/disable an event listener defined using the `@Listen()` decorator. Please use the DOM API directly (`addEventListener` / `removeEventListener`).

### Removed: @Listen('event’, { eventName })

The event name should be provided excl

### Removed: @Component({ host })

This feature was deprecated a long time ago, and it is being removed definitely from Stencil.

### `mockDocument()` and `mockWindow()` has been moved

The `mockDocument()` and `mockWindow()` functions previously in `@stencil/core/mock-dom` has been moved to:
`@stencil/core/testing`:

```diff
- import { mockDocument, mockWindow } from '@stencil/core/mock-dom';
+ import { mockDocument, mockWindow } from '@stencil/core/testing';
```

## DEPRECATIONS

### outputTarget "docs"

The output target "docs" has been renamed to "docs-readme":

In your `stencil.config.ts` file:
```diff
export const config = {
  outputTargets: [
    {
-     type: 'docs',
+     type: 'docs-readme',
    }
  ]
};
```


### `hostData()`

hostData() usage has been replaced by the new `Host` exposed in `@stencil/core`. The `<Host>` JSX element represents the "host" element of the component, and simplifies being able to add attributes and CSS classes to the host element:

```diff
+ import { Host } from '@stencil/core';

-  hostData() {
-    return {
-      'class': {
-        'my-class': true,
-        'disabled': this.isDisabled
-      },
-      attr: this.attrValue
-    };
-  }
  render() {
    return (
+      <Host
+        class={{
+          'my-class': true,
+          'disabled': this.isDisabled
+        }}
+        attr={this.attrValue}
+      />
    );
  }
```

### All void methods return promise (right now method(): void is valid)

Until Stencil 1.0, public component methods decorated with `@Method()` could only return `Promise<...>` or `void`.
Now, only the `async` methods are supported, meaning that retuning `void` is not valid.

```diff
  @Method()
- doSomething() {
+ async doSomething() {
    console.log('hello');
  }
```

This change was motivated by the fact that Stencil's 1.0 runtime will be able to proxy all component method calls!
That means, developers will be able to call component methods safely without using componentOnReady()! even if the actual component has not been downloaded yet.

#### Given an example component like:

```ts
@Component(...)
export class Cmp {
  @Method()
  async doSomething() {
    console.log('called');
  }
}
```

**BEFORE:**

```ts
// Calling `componentOnReady()` was required in order to make sure the "component"
// was properly lazy loaded and the methods are available.
await element.componentOnReady()
element.doSomething();
```

**AFTER:**

```ts
// Stencil One will automatically proxy the method call (like an RPC),
// and it's safe to call any method without using `componentOnReady()`.
await element.doSomething();
```


### `@Listen('TARGET:event’)`

The first argument of the `@Listen()` decorator is now only the event name, such as `click` or `resize`. Previously you could set the target of the listener by prefixing the event name with something like `window:resize`. Instead, the target is now set using the options.

```diff
- @Listen('window:event')
+ @Listen('event’, { target: 'window' })

- @Listen('document:event')
+ @Listen('event’, { target: 'document' })

- @Listen('body:event’)
+ @Listen('event’, { target: 'body’ })

- @Listen('parent:event’)
+ @Listen('event’, { target: 'parent’ })
```

This change was motivated by the fact that `body:event` is a valid DOM event name.
In addition, the new syntax allows for strong typing, since the `{target}` only accepts the following string values (`'window'`, `'document'`, `'body'`, `'parent'`).

### `@Prop({context})`

Using the `@Prop` decorator with the `context` has been deprecated and their usage is highly unrecommended. Here's how update each case:


#### `'window'`

Accessing `window` using `Prop({context: 'window'})` was previously required because of Server-side-rendering requirements, fortunately this is no longer needed, and developers can use global `window` directly.

- `Prop({context: 'window'})` becomes `window`

```diff
-  @Prop({context: 'window'}) win!: Window;

   method() {
     // print window
-    console.log(this.win);
+    console.log(window);
   }
```

#### `'document'`

Accessing `document` using `Prop({context: 'document'})` was previously required because of Server-side-rendering requirements, fortunately this is no longer needed, and developers can use global `document` directly.

- `Prop({context: 'document'})` becomes `document`

```diff
-  @Prop({context: 'document'}) doc!: Document;

   method() {
     // print document
-    console.log(this.doc);
+    console.log(document);
   }
```

#### `'isServer'`

In order to determine if the your component is being rendered in the browser or the server as part of some prerendering/ssr process, stencil exposes a compiler-time constant through the `Build` object, exposed in `@stencil/core`:

- `Prop({context: 'isServer'})` becomes `!Build.isBrowser`

```diff
+  import { Build } from '@stencil/core';

   [...]

-  @Prop({context: 'isServer'}) isServer!: boolean;

   method() {
-    if (!this.isServer) {
+    if (Build.isBrowser) {
       console.log('only log in the browser');
     }
   }
```

### `@Prop(connect)`

It will not be recommended to use `@Prop(connect)` in order to lazily load components. Instead it's recommended to use ES Modules and/or dynamic imports to load code lazily.


### `@Component.assetsDir`

```diff
@Component({
-  assetsDir: 'resource',
+  assetsDirs: ['resource']
})
```

### OutputTarget local copy tasks

The root `copy` property in `stencil.config.ts` has been deprecated in favor of local copy tasks per output-target, ie. now the copy tasks are specific under the context of each output-target.

```diff
  const copy =
  export const config = {
    outputTargets: [
      {
        type: 'www',
+       copy: [
+        {
+           src: 'index-module.html',
+           dest: 'index-module.html'
+         }
+       ]
      }
    ],
-   copy: [
-     {
-       src: 'index-module.html',
-       dest: 'index-module.html'
-     }
-   ]
  };
```

This change has been motivated by the confusing semantics of the root copy task, currently the copy tasks are executed multiple times within different working-directories for each output-target.

Take this example:

```ts
export const config = {
  outputTargets: [
    { type: 'dist' },
    { type: 'dist', dir: 'dist-app' },
    { type: 'www' }
  ],
  copy: [
    { src: 'main.html' }
  ]
};
```

In the example above, the `main.html` file is actually copied into 5 different places!!

- dist/collection/main.html
- dist/app/main.html
- dist-app/collection/main.html
- dist-app/app/main.html
- www/main.html

If the old behavior is still desired, the config can be refactored to:

```ts
const copy = [
  { src: 'main.html' }
];

export const config = {
  outputTargets: [
    { type: 'dist', copy },
    { type: 'dist', dir: 'dist-app', copy },
    { type: 'www', copy }
  ]
};
```

## New APIs

### setMode() and getMode()

### getAssetsPath(this, relativePath)

### `dist-module` output target



## Testing

### `newSpecPage()` Spec Testing Utility

A new testing utility has been created to make it easier to unit test components. Its API is similar to `newE2EPage()` for consistency, but internally `newSpecPage()` does not use Puppeteer, but rather runs on top of a pure Node environment. Additionally, user code should not have to be written with legacy CommonJS, and code can safely use global browser variables such as `window` and `document`. In the example below, a mock `CmpA` component was created in the test, but it could have also imported numerous existing components and registered them into the test using the `components` config. The returned `page` variable also has a  `root` property, which is convenience property to get the top-level component found in the test.

```tsx
import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

it('override default values from attribute', async () => {
  @Component({
    tag: 'cmp-a'
  })
  class CmpA {
    @Prop() someProp = '';
    render() {
      return `${this.someProp}`;
    }
  }

  const page = await newSpecPage({
    components: [CmpA],
    html: `<cmp-a some-prop="value"></cmp-a>`,
  });

  // "root" is a convenience property which is the
  // the top level component found in the test
  expect(page.root).toEqualHtml(`
    <cmp-a some-prop="value">
      value
    </cmp-a>
  `);

  expect(page.root.someProp).toBe('value');
});
```


### Serialized `<mock:shadow-root>`

Traditionally, when a component is serialized to a string its shadow-root is ignored and not include within the HTML output. However, when building web components and using Shadow DOM, the nodes generated within the components are just as important as any other nodes to be tested. For this reason, both spec and e2e tests will serialize the shadow-root content into a mocked `<mock:shadow-root>` element. Note that this serialized shadow-root is simply for testing and comparing values, and is not used at browser runtime.

```tsx
import { Component } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

it('test shadow root innerHTML', async () => {
  @Component({
    tag: 'cmp-a',
    shadow: true
  })
  class CmpA {
    render() {
      return (
        <div>Shadow Content</div>
      );
    }
  }

  const page = await newSpecPage({
    components: [CmpA],
    html: `
      <cmp-a>
        Light Content
      </cmp-a>
    `,
  });

  expect(page.root).toEqualHtml(`
    <cmp-a>
      <mock:shadow-root>
        <div>
          Shadow Content
        </div>
      </mock:shadow-root>
      Light Content
    </cmp-a>
  `);
});
```


### Jest Presets

When running Jest directly, previously most of Jest had to be manually configured within each app's `package.json`, and required the `transform` config to be manually wired up to Stencil's `jest.preprocessor.js`. With the latest changes, most of the Jest config can be replaced with just `"preset": "@stencil/core/testing"`. You can still override the preset defaults, but it's best to start with the defaults first. Also note, the Jest config can be avoided entirely by using the `stencil test --spec` command rather than calling Jest directly.

```diff
  "jest": {
+    "preset": "@stencil/core/testing"
-    "transform": {
-      "^.+\\.(ts|tsx)$": "<rootDir>/node_modules/@stencil/core/testing/jest.preprocessor.js"
-    },
-    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(tsx?|jsx?)$",
-    "moduleFileExtensions": [
-      "ts",
-      "tsx",
-      "js",
-      "json",
-      "jsx"
-    ]
  }
```

# Stencil v3.0.0 [Unreleased]

Stencil v3.0.0 is in development at this time and has not been released. The list below is not final and is subject to
change. Further details on each of these items will be included prior to the release.

- [fix(testing): puppeteer v10 support #2934](https://github.com/ionic-team/stencil/pull/2934)