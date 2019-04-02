# Stencil One

## BREAKING CHANGES

### Import {h} is required

In order to render JSX in stencil apps, the `h()` function must be imported from `@stencil/core`:

```tsx
import { h } from '@stencil/core';

function app() {
  return <ion-app></ion-app>
}
```

### HTMLStencilElement was removed

The global type for `HTMLStencilElement`, it's recommended to replace it with `HTMLElement` or the actual type of your component like `HTMLIonButtonElement`.



### Global JSX was removed

In order to prevent type collision in the future, we have moved to local scoped JSX namespaces! a new typescript feature, unfortunately that means `JSX` is not longer global and it needs to be imported from `@stencil/core`:

```tsx
import {JSX, h} from '@stencil/core';

render(): JSX.Element {
  return <ion-button></ion-button>
}
```

### window.NAMESPACE is not longer a thing

Stencil will not read/write to the global `window` anymore. So things like `window.app` or `window.Ionic` are gone, and should be provided by the user's code.


### @Prop() mode is not longer reserved prop

`@Prop() mode` used to be way to define and read the current mode of a component. This API is completely going away since it was very local to the use case of ionic.

Instead, the `mode` can be read by using the `getMode()` method from `@stencil/core`.

### StencilIntrinsecElement was removed

### Context in global is removed

### Removed: @Listen('event.KEY’) (DEPRECATED)

### Removed: @Listen('event’, { enabled })

### Removed: @Listen('event’, { eventName })

### Removed: @Component({ host })

### Index.html must be updated to include type=”module”

Stencil used to generate a loader `.js` file that automatically decided which entry-point to load based in the browser's capabilities, in stencil 1.0 we have decided to completely remove the overhead of this loader by directly loading the collection's core.

```diff
- <script src="/build/app.js"></script>
+ <script src="/build/app.js" nomodule></script>
+ <script type="module" src="/build/app.mjs.js"></script>
```


## DEPRECATIONS


### @Prop(context)

Most of the functionality can be replaced by new functions exposed in `@stencil/core`.

- `@Prop({context: 'window'})` => `getWindow(this)`
- `@Prop({context: 'document'})` => `getDocument(this)`
- `@Prop({context: 'resourcesUrl'})` => `getAssetsPath(this, 'image.png')`

### @Prop(connect)

It will not be recommended to use `@Prop(connect)` in order to lazily load components. It's recommended to use ESM modules and/or dynamic import to load code lazyly.


### hostData()

hostData() usage might be replaced by the new `Host` exposed in `@stencil/core`:

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

### @Listen('TARGET:event’)

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

### @Component.assetsDir

```diff
@Component({
-  assetsDir: 'resource',
+  assetsDirs: ['resource']
})
```

### All void methods return promise (right now method(): void is valid)

Until Stencil 1.0, component methods decorated with `@Method()` could only return `Promise<...>` or `void`. Now, only the async methods are supported, meaning that retuning `void` is not valid.

```diff
  @Method()
- doSomething() {
+ async doSomething() {

    console.log('hello');
  }
```

### Stencil.config.ts root “copy” deprecated

### Global script should export a default function

### @Component.assetsDir
