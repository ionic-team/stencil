# Output Targets

Stencil is able to generate components into various formats so they can be best integrated into the many different apps types, no matter what framework or bundler is used.


## Output Target Terms

`script`: A prebuilt, stand-alone webapp already built from the components. These are already built to be loaded by just a script tag, no additional builds or bundling required. Both the `www` and `dist` output target types save an "app" into their directories. When saving the webapp into the `dist/` directory, it can be easily packaged up and used with a service like `unpkg.com`. See https://www.npmjs.com/package/@ionic/core

`collection`: Source files transpiled down to simple JavaScript, and all component metadata placed on the component class as static getters. When one Stencil distribution imports another, it will use these files when generating its own distribution. What's important is that the source code of a `collection` is future proof, meaning no matter what version of Stencil it can import and understand the component metadata.

`host`: The actual "host" element sitting in the webpage's DOM.

`lazy-loaded`: A lazy-loaded webapp creates all the proxied host web components up front, but only downloads the component implementation on-demand. Lazy-loaded components work by having a proxied "host" web component, and lazy-loads the component class and css, and rather than the host element having the "instance", such as a traditional web component, the instance is of the lazy-loaded component class. If a Stencil library has a low number of components, then having them all packaged into a single-file would be best. But for a very large library of components, such as Ionic, it'd be best to have them lazy-loaded instead. Part of the configuration can decide when to make a library either lazy-loaded or single-file.

`module`: Component code meant to be imported by other bundlers in order for them to be intergrated within other apps.

`native`: Lazy-loaded components split the host web component and the component implementation apart. A "native" component is a traditional web component in that the instance and host element are the same.

`self-contained`: Individual web components packaged up into stand-alone, self-contained code. Each component has it's own runtime, but customized to only include exact what that component requires.

`single-file`: Opposite of lazy-loaded. When a library has a low number of components, it'd be best to have them all in one file rather than lazy-loading them.


## Output Target Types

### `www`

- Default output target when not configured.
- Generates a stand-alone `app` into the `www/` directory.
- Depending on the number of components and configuration, the app may be lazy-loaded of single-file.


### `dist`

- Generates `modules` to be imported by other bundlers, such as `dist/es2017/` and `dist/es5`.
- Generates an `app` at the root of the `dist/` directory. It's the same stand-alone webapp as the `www` type, but located in dist so it's easy to package up and shared.
- Generates a `collection` into the `dist/collection/` directory to be used by other projects.


### `dist-custom-elements-bundle`

- Generates a single, tree-shakable, bundle of all the components.
- Does not define the custom elements.
- Consumers importing individual components from the bundle must define each custom element.


### `angular`

- Generates a wrapper Angular component proxy.
- Web componets themselves work fine within Angular, but you loose out on many of Angular's features, such as types or `@ViewChild`. In order for a Stencil project to fit right into the Angular ecosystem, this output target generates thin wrapper that can be imported by Angular.


### `dist-hydrate-script`

- Generates a hydrate app, which is used by prerendering and Angular Universal server module.


## Output Folder Structure

```
- dist/
  - collection/
    - components
      - cmp-a
        - cmp-a.css
        - cmp-a.mjs
      - cmp-b
        - cmp-b.css
        - cmp-b.mjs
      - collection-manifest.json

  - loader
    - index.mjs (points to the esm/es2017/ directory)

  - components/ (custom elements to be imported)

  - components-es5/ (custom elements to be imported)
    - es5/
      - index.mjs

    - es2017/
      - index.mjs

    - package.json
        {
          "module": "es5/",
          "main": "es5/",
          "es2015": "es2017/"
        }

  - selfcontained/
    - cmp-a.mjs
    - cmp-b.mjs
    - app.mjs (self-contained of all native components)

  - hydrate/
    - hydrate.d.ts
    - hydrate.js
    - index.js
    - package.json

  - types/
    - index.d.ts

  - app.js (legacy es5 script)
  - app.mjs (modern esm script)

- www/
  - build/
    - app.js (legacy es5 script)
    - app.mjs (modern esm script)

  - index.html

- package.json
- stencil.config.ts
```


### Module Format

```
dist/module/index.mjs
---------

class IonButton extends HTMLElement {

  static get observedAttributes() {
    return proxyComponent(IonButton, meta);
  }

  render() {
    // implementation
    return (
      'Hello World'
    );
  }
}


export class IonButton_ios extends IonButton {
  static get mode() {
    return 'ios';
  }
  static get styles() {
    return 'ios';
  }
}

export class IonButton_md extends IonButton {
  static get mode() {
    return 'md';
  }
  static get styles() {
    return 'md';
  }
}
```