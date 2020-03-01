# Stencil Compiler

The Stencil compiler is bundled into a single file that can be used within a browser or Node environment.

https://unpkg.com/@stencil/core@1.2.2/compiler/stencil.js


## Compiler

Relative to the root of the `@stencil/core` package, the file can be found at `compiler/stencil.js`. An example path found within node modules would be `node_modules/@stencil/core/compiler/stencil.js`.

The Stencil compiler is an Immediately Invoked Function Expression (IIFE) and places all of its exports on the global `stencil` variable. The global `stencil` variable can be executed within a browser's web worker, browser's main thread or Node environment.


## TypeScript Dependency

TypeScript is a dependency of Stencil, but TypeScript is not bundled within the Stencil compiler. In order for the Stencil compiler to work it must also have the `ts` global from the TypeScript compiler assigned to the same global.


## Compiler API

### `compile(code, options?)`

The `stencil.compile()` function inputs source code as a string, with various options within the second argument. The function returns a Promise of the results, including diagnostics and the compiled code. The `compile()` function does not handle any bundling, minifying, or precompiling any CSS preprocessing like Sass or Less.

Since TypeScript is used, the compiler is able to transpile from TypeScript to JavaScript, and does not require Babel presets. Additionally, the compile results includes an `imports` array of all the import paths found in the source file. The compile options below can be used to set the `module` format, such as `cjs`, and JavaScript version, such as `es2017`.


#### Compile Options

| Option              | Description                     | Default |
|---------------------|---------------------------------|---------|
| `file`              | The filename of the code being compiled. | `module.tsx` |
| `module`            | Module format of compiled code, which can be either `esm` or `cjs`. | `esm` |
| `target`            | The JavaScript source target to transpile to. Values can be `latest`, `esnext`, `es2017`, `es2015`, or `es5`. | `es2017` |
| `componentExport`   | A component can be defined as a custom element by using `customelement`, or the component class can be exported by using `module`. | `customelement` |
| `componentMetadata` | Sets how and if component metadata should be assigned on the compiled component output. The `compilerstatic` value will set the metadata to a static `COMPILER_META` getter on the component class. | `null` |
| `proxy`             | Sets how and if any properties, methods and events are proxied on the component class. The `defineproperty` value sets the getters and setters using Object.defineProperty. | `defineproperty` |


#### Compile Results

The returned results of `compile()` is a Promise, and the resolved value contains the following:

| Property          | Description                     |
|-------------------|---------------------------------|
| `code`            | The compiled code. |
| `diagnostics`     | Any array of diagnostics. Note that the call to compile() does not throw an error or reject the Promise. |
| `inputFilePath`   | The input file path. If `file` was not provided in the options it'll use the default. |
| `outputFilePath`  | The output file path. For example, if the input file is `my-cmp.tsx`, the output file would be `my-cmp.js`. |
| `inputOptions`    | The compile options used after the user's compile options have been normalized and defaults applied. |
| `imports`         | An array of all the imports found in the source code. This includes paths for both ESM `import` and CJS `require()`. Each import in the array is an object with a `path` property, which is the original path and has not been normalized or resolved. |
| `componentMeta`   | An array of component metadata for each component in the module. |


### `version`

The Stencil compiler version, for example: `1.2.2`.


## Example

```html
<script src="https://unpkg.com/typescript@3.5.3/lib/typescript.js"></script>
<script src="https://unpkg.com/@stencil/core@1.2.2/compiler/stencil.js"></script>
<script>

console.log('stencil', stencil.version);
console.log('typescript', ts.version);

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
