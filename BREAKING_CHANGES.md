# Stencil One

## BREAKING CHANGES

Most required changes are in order to avoid global types, which often cause issues for JSX and apps which import from numerous packages. The other significant change is having each component import its renderer, such as JSX's `h()` function.


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
+ <script type="module" src="/build/app.mjs.js"></script>
+ <script nomodule src="/build/app.js"></script>
```

### Collection's package.json

Stencil One has chaged the internal folder structure of the `dist` folder, and some entry-points are located in different location:

- **"module"**: `dist/esm/index.js` => `dist/index.mjs`
- **"jsnext:main**": `dist/esm/es2017/index.mjs.js` => `dist/esm/index.mjs.js`


Make sure you update the `package.json` in the root of your project, like this:

```diff
  {
-    "module": "dist/esm/index.js",
+    "module": "dist/index.mjs",

-    "es2015": "dist/esm/es2017/index.js",
-    "es2017": "dist/esm/es2017/index.mjs.js",
-    "jsnext:main": "dist/esm/es2017/index.mjs.js",
+    "es2015": "dist/esm/index.mjs.js",
+    "es2017": "dist/esm/index.mjs.js",
+    "jsnext:main": "dist/esm/index.mjs.js",
  }
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


### Removed: Global `HTMLStencilElement` was removed

The global type for `HTMLStencilElement` has been removed. Instead, it's better is to use the exact type of your component, such as `HTMLIonButtonElement`. The HTML types are automatically generated within the `components.d.ts` file.


### Removed: `StencilIntrinsicElement`

The global type `StencilIntrinsicElement` has been removed. It can be replaced by importing the `JSX` namespace from `@stencil/core`:

```tsx
import { JSX } from '@stencil/core';

export type StencilIntrinsicElement = JSX.IntrinsicElement;
```

### Removed: `Context` in global



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

It's not possible to programatically enable/disable an event listener defined using the `@Listen()` decorator. Please use the DOM API directly (`addEventListener` / `removeEventListener`).

### Removed: @Listen('event’, { eventName })

The event name should be provided excl

### Removed: @Component({ host })

This feature was deprecated a long time ago, and it is being removed definitely from Stencil.

### Removed: 'angular' output target


## DEPRECATIONS

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
  await doSomething() {
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


### `@Prop(context)`

Most of the functionality can be replaced by new functions exposed in `@stencil/core`.

- `@Prop({context: 'window'})` => `getWindow(this)`
- `@Prop({context: 'document'})` => `getDocument(this)`
- `@Prop({context: 'resourcesUrl'})` => `getAssetsPath(this, 'image.png')`


### `@Prop(connect)`

It will not be recommended to use `@Prop(connect)` in order to lazily load components. Instead it's recommended to use ES Modules and/or dynamic imports to load code lazily.


### `@Component.assetsDir`

```diff
@Component({
-  assetsDir: 'resource',
+  assetsDirs: ['resource']
})
```

### Global script should export a default function

Currently the collection's global script is executed as a side effect, this makes it impossible to execute the global script multiple times within the same execution context, this is a critical requirement in order to properly SSR (Server-Side Rendering) an application, or have isolated unit tests.

**BEFORE**:
```ts
console.log('global script ran');
```

**AFTER:**

```ts
export default function() {
  console.log('global script ran');
}
```

i.e., just wrap most of your logic within your global script around a exported default function:

```diff
+ export default function() {
    console.log('global script ran');
+ }
```


### OutputTarget local copy tasks

The root `copy` property in `stencil.config.ts` has been deprecated in favour of local copy tasks per output-target, ie. now the copy tasks are specific under the context of each output-target.

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

If the old behaviour is still desired, the config can be refactored to:

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

### getWindow(this) and getDocument(this)

`getWindow(this)` and `getDocument(this)` replaces `@Prop({context: 'window'})` and `@Prop({context: 'document'})` respectively. This methods can only be used within the context of a component by passing `this` as first argument, ie a reference to the component itself:

```diff
+ import { Component, getWindow } from '@stencil/core';

  @Component({...})
  export class MyComponent {
-   @Prop({ context: 'window' }) win!: Window;
+   win = getWindow(this);
  }
```

You might wonder why not use `window` or `document` directly. While technically it would work just fine in a browser, it will likely cause issues once you try to prerender your application.

This is due to the fact that prerendering runs in `node`, which is a different JavaScript environment that does not have the global `window` or `document` objects. These new APIs fill the gap! But if there are no plans to prerender components, using browser globals is perfectly acceptable.

### setMode() and getMode()

### getAssetsPath(this, relativePath)

### `dist-module` output target



## Testing

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


### `newSpecPage()` Spec Testing Utility

A new testing utility has been created to make it easier to unit test components. Its API is similar to `newE2EPage()` for consistency, but internally `newSpecPage()` does not use Puppeteer, but rather runs on top of a pure Node environment. Additionally, user code should not have to be written with legacy CommonJS, and code can safely use global browser variables like `window` and `document` . In the example below, a mock `CmpA` component was created in the test, but it could have also imported numerous existing components and registered them into the test using the `components` config.

```tsx
import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

it('override default values from attribute', async () => {
  @Component({ tag: 'cmp-a'})
  class CmpA {
    @Prop() someProp = '';
    render() {
      return `${this.someProp}`;
    }
  }

  const { root } = await newSpecPage({
    components: [CmpA],
    html: `<cmp-a some-prop="value"></cmp-a>`,
  });

  expect(root).toEqualHtml(`
    <cmp-a some-prop="value">
      value
    </cmp-a>
  `);

  expect(root.someProp).toBe('value');
});
```
