# Stencil One

## BREAKING CHANGES

Most required changes are in order to avoid global types, which often cause issues for JSX and apps which import from numerous packages. The other significant change is having each component import its renderer, such as JSX's `h()` function.


### Import `{ h }` is required

In order to render JSX in Stencil apps, the `h()` function must be imported from `@stencil/core`:

```tsx
import { h } from '@stencil/core';

function app() {
  return <ion-app></ion-app>
}
```

The `h` stands for "hyperscript", which is what JSX elements are transformed into (it's the actual function exectued when rendering within the runtime). Stencil's `h` import is an equivalent to React's [React.createElement](https://reactjs.org/docs/react-without-jsx.html). This also explains why the app's `tsconfig.json` sets the `{ "jsxFactory": "h" }` config, which is detailed further in  [TypeScript's JSX Factory Function Docs](https://www.typescriptlang.org/docs/handbook/jsx.html#factory-functions).


### index.html scripts updated to use `type="module"`

Stencil used to generate a loader `.js` file that automatically decided which entry-point to load based in the browser's capabilities. In Stencil 1.0 we have decided to completely remove the overhead of this loader by directly loading the core using the web-standard `type="module"` script attribute. Less runtime and preferring native browser features. Win Win. For more for info, please see [Using JavaScript modules on the web](https://developers.google.com/web/fundamentals/primers/modules#browser).

```diff
- <script src="/build/app.js"></script>
+ <script type="module" src="/build/app.mjs.js"></script>
+ <script nomodule src="/build/app.js"></script>
```


### `window.NAMESPACE` is no longer a thing

Stencil will not read/write to the browser's global `window` anymore. So things like `window.App` or `window.Ionic` are gone, and should be provided by the user's code if need be.


### `@Prop() mode` is no longer reserved prop

`@Prop() mode` used to be way to define and read the current mode of a component. This API was removed since it was very local to the use case of Ionic.

Instead, the `mode` can be read by using the `getMode()` method from `@stencil/core`.


### Removed: Global `JSX` was removed

For all the same reasons for now importing `h`, in order to prevent type collision in the future, we have moved to local scoped JSX namespaces. Unfortunately this means `JSX` is no longer global and it needs to be imported from `@stencil/core`. Also note that while the below example has the render function with a return type of `JSX.Element`, we recommend to not have a return type at all:

```tsx
import { JSX, h } from '@stencil/core';

render(): JSX.Element {
  return <ion-button></ion-button>
}
```


### Removed: Global `HTMLStencilElement` was removed

The global type for `HTMLStencilElement` has been removed. Instead it's better is to use the exact type of your component, such as `HTMLIonButtonElement`. The HTML types are automatically generated within the `components.d.ts` file.


### Removed: `StencilIntrinsecElement`

### Removed: `Context` in global

### Removed: @Listen('event.KEY’) (DEPRECATED)

### Removed: @Listen('event’, { enabled })

### Removed: @Listen('event’, { eventName })

### Removed: @Component({ host })


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

Until Stencil 1.0, public component methods decorated with `@Method()` could only return `Promise<...>` or `void`. Now, only the `async` methods are supported, meaning that retuning `void` is not valid.

```diff
  @Method()
- doSomething() {
+ async doSomething() {
    console.log('hello');
  }
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

### Stencil.config.ts root “copy” deprecated

### Global script should export a default function
