# Stencil Compiler

The Stencil compiler is bundled into a single file that can be used within a browser or node environment.


## Compiler

Relative to the root of the `@stencil/core` package, the file can be found at `compiler/stencil.js`. An example path found within node modules would be `node_modules/@stencil/core/compiler/stencil.js`.

The Stencil Compiler is an Immediately Invoked Function Expression (IIFE) and places all exports on the `stencil` variable, which ends up on the `globalThis`.

The global `stencil` can be executed within a web worker, main thread or node environment.


## TypeScript Dependency

TypeScript is a dependency of stencil, but TypeScript is not bundled within the stencil compiler. In order for the stencil compiler to work it must also have the `ts` global from the TypeScript compiler also assigned to the same `globalThis`.


## Compiler API

### `compile(code, options?)`

The `stencil.compile()` function inputs source code as a string, with various options within the second argument. The function returns a Promise of the results, including diagnostics and the compiled code. The `compile()` function does not handle any bundling, or compiling any css preprocessing like Sass or Less.


#### Compile Options

| Option              | Description        | Default |
|---------------------|--------------------|---------|
| `file`              | The filename of the code being compiled. | `undefined` |
| `module`            | Module format of compiled code, which can be either `esm` or `cjs`. | `esm` |
| `script`            | The JavaScript source target to transpile to. Values can be `latest`, `esnext`, `es2017`, `es2015`, or `es5`. | `es2017` |
| `style`             | How component styles are associated to the component. The `import` value will update the `styleUrl` value to be an import. The `inline` value will inline the styles into the static style getter. | `import` |
| `componentExport`   | A component can automatically get defined as a custom element by using `customelement`, or it can be exported by using `module`. | `customelement` |
| `componentMetadata` | Sets how and if component metadata should be assigned on the compiled component output. The `proxy` value sets the metadata through a proxy function. The `static` value will set the metadata to a static getter on the component class. | `proxy` |


### `getMinifyScriptOptions(opts)`

Helper function which provides recommended options to be best optimize component minifying. The returned object contains `options` and `minifier`. The `minifier` data states the exact minifier and version to use for the recommended options.


### `dependencies`

An array of dependencies required for the stencil compiler. This data is used to set which dependencies versions work with this particular version of the compiler. The `url` value is only a recommendation of a CDN.

Example `dependencies`:

```
// stencil.dependencies
[
  {
    "name": "typescript",
    "version": "3.5.3",
    "url": "https://cdn.jsdelivr.net/npm/typescript@3.5.3/lib/typescript.js"
  }
]
```


### `version`

The Stencil compiler version, for example: `1.2.0`.


## Example

```html
<script src="https://cdn.jsdelivr.net/npm/typescript@3.5.3/lib/typescript.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@stencil/core@1.2.0/compiler/stencil.js"></script>
<script>

const code = '@Component...';
const opts = {
  file: 'my-cmp.tsx'
};

stencil.compile(code, opts).then(results => {
  console.log(results.diagnostics);
  console.log(results.code);
});

</script>
```

