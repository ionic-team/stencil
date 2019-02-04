# Output Targets

Stencil is able to generate components into various formats so they can be best integrated into the many different apps types, no matter what framework or bundler is used.


## Output Target Terms

`app`: A prebuilt, stand-alone webapp built from the components. These are already built to be loaded by just a script tag, no additional builds or bundling required. Both the `www` and `dist` output target types save an "app" into their directories. When saving the webapp into the `dist/` directory, it can be easily packaged up and used with a service like `unpkg.com`. See https://www.npmjs.com/package/@ionic/core

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

- Generates an `app` at the root of the `dist/` directory. It's the same stand-alone webapp as the `www` type, but located in dist so it's easy to package up and shared.
- Generates a `collection` into the `dist/collection/` directory to be used by other projects.
- Generates ES Modules to be imported by other bundlers, such as `dist/es2017/` and `dist/es5`.


### `angular`

- Generates a wrapper Angular component proxy.
- Web componets themselves work fine within Angular, but you loose out on many of Angular's features, such as types or `@ViewChild`. In order for a Stencil project to fit right into the Angular ecosystem, this output target generates thin wrapper that can be imported by Angular.
