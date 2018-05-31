<a name="0.9.7"></a>
## 🍺 [0.9.7](https://github.com/ionic-team/stencil/compare/v0.9.6...v0.9.7) (2018-05-31)


### Bug Fixes

* **jsx:** add "key" jsx attribute ([e92e490](https://github.com/ionic-team/stencil/commit/e92e490))
* **jsx:** set key property and reorder existing elements ([0b6d19d](https://github.com/ionic-team/stencil/commit/0b6d19d))
* **shadow-dom:** only run initHostSnapshot once ([4de6a50](https://github.com/ionic-team/stencil/commit/4de6a50))
* **shadow-dom:** immediately attachShadow when component connected ([9ecce82](https://github.com/ionic-team/stencil/commit/9ecce82))



<a name="0.9.6"></a>
## 🐓 [0.9.6](https://github.com/ionic-team/stencil/compare/v0.9.5...v0.9.6) (2018-05-30)


### Bug Fixes

* **bundle:** handle empty bundles ([f2f616f](https://github.com/ionic-team/stencil/commit/f2f616f))
* **cache:** do not cache global script bundles ([8ca27f6](https://github.com/ionic-team/stencil/commit/8ca27f6))
* **componentOnReady:** fix HostElement types ([ad77e14](https://github.com/ionic-team/stencil/commit/ad77e14))
* **componentOnReady:** null only for HTMLElement ([e2acba6](https://github.com/ionic-team/stencil/commit/e2acba6))
* **docs:** pass non standard property type values to docs ([1e8ec78](https://github.com/ionic-team/stencil/commit/1e8ec78))
* **types:** componentOnReady() does not accept a callback ([894c89e](https://github.com/ionic-team/stencil/commit/894c89e))
* **ssr:** add component meta to global registry before any components are defined for the browser. ([06af32a](https://github.com/ionic-team/stencil/commit/06af32a))


### Features
* **reporting:** make file paths clickable to line/char in error messages ([2654a0e](https://github.com/ionic-team/stencil/commit/2654a0e))


### Performance Improvements

* **compiler:** use Set over Array ([30295f1](https://github.com/ionic-team/stencil/commit/30295f1))
* **worker-farm:** init forking child processes to speed up builds ([5fa1b53](https://github.com/ionic-team/stencil/commit/5fa1b53))



<a name="0.9.5"></a>
## 🏝 [0.9.5](https://github.com/ionic-team/stencil/compare/v0.9.4...v0.9.5) (2018-05-24)


### Features

* **css:** `@import` css from `node_modules` with `~` prefix ([5cdc717](https://github.com/ionic-team/stencil/commit/5cdc717))
* **css:** concat css `@imports` ([bfe8454](https://github.com/ionic-team/stencil/commit/bfe8454))



<a name="0.9.4"></a>
## 🦀 [0.9.4](https://github.com/ionic-team/stencil/compare/v0.9.3...v0.9.4) (2018-05-23)


### Bug Fixes

* **define:** do not allow multiple cmps w/ same tag to be defined ([4665e04](https://github.com/ionic-team/stencil/commit/4665e04))
* **esm:** fix HTMLElement componentOnReady fn ([88fb519](https://github.com/ionic-team/stencil/commit/88fb519))



<a name="0.9.3"></a>
## 🏓 [0.9.3](https://github.com/ionic-team/stencil/compare/v0.9.2...v0.9.3) (2018-05-22)


### Bug Fixes

* **app:** allow multiple apps to work w/ componentOnReady() ([162ad68](https://github.com/ionic-team/stencil/commit/162ad68))
* **cli:** throw an error if passed an invalid config file arg ([deef15f](https://github.com/ionic-team/stencil/commit/deef15f))


### Features

* **build:** keep gitkeep files when emptying a directory ([375e9c2](https://github.com/ionic-team/stencil/commit/375e9c2))
* **loader:** allow using an explicit resources url setting ([383db85](https://github.com/ionic-team/stencil/commit/383db85))



<a name="0.9.2"></a>
## 🌳 [0.9.2](https://github.com/ionic-team/stencil/compare/v0.9.1...v0.9.2) (2018-05-21)


### Bug Fixes

* **slot:** fix slot order when using an array at the root ([9a36b0c](https://github.com/ionic-team/stencil/commit/9a36b0c))



<a name="0.9.1"></a>
## 🍁 [0.9.1](https://github.com/ionic-team/stencil/compare/v0.9.0...v0.9.1) (2018-05-16)


### Bug Fixes

* **compiler:** gather metadata from TS files ([#808](https://github.com/ionic-team/stencil/issues/808)) ([578fd93](https://github.com/ionic-team/stencil/commit/578fd93))
* **reflectToAttr:** set boolean attributes w/out true/false attr values ([657e61a](https://github.com/ionic-team/stencil/commit/657e61a))



<a name="0.9.0"></a>
# 🚌 [0.9.0](https://github.com/ionic-team/stencil/compare/v0.8.2...v0.9.0) (2018-05-16)

### Features

* **esm:** generate dist/esm distribution for external bundlers ([fed958d](https://github.com/ionic-team/stencil/commit/fed958d))


### Bug Fixes

* **global:** fix doubling up global script output ([557e470](https://github.com/ionic-team/stencil/commit/557e470))
* **platform:** leaking loaded bundles ([370ab1a](https://github.com/ionic-team/stencil/commit/370ab1a))



<a name="0.8.2"></a>
## 🎡 [0.8.2](https://github.com/ionic-team/stencil/compare/v0.8.1...v0.8.2) (2018-05-10)


### Bug Fixes

* **host:** functions must not be casted ([d8ff355](https://github.com/ionic-team/stencil/commit/d8ff355))
* **loader:** fixes CORS issue in unpkg ([dc482f3](https://github.com/ionic-team/stencil/commit/dc482f3))



<a name="0.8.1"></a>
## 🚕 [0.8.1](https://github.com/ionic-team/stencil/compare/v0.8.0...v0.8.1) (2018-05-09)


### Bug Fixes

* **bundler:** minify dynamic imports ([1ef8e91](https://github.com/ionic-team/stencil/commit/1ef8e91)), closes [#773](https://github.com/ionic-team/stencil/issues/773)
* **host:** set host prop are properly casted ([64ee27a](https://github.com/ionic-team/stencil/commit/64ee27a))
* **loader:** set crossorigin to use-credentials ([351fd73](https://github.com/ionic-team/stencil/commit/351fd73))


### Features

* add custom element target output. ([8bec1d4](https://github.com/ionic-team/stencil/commit/8bec1d4))
* **component:** add functional component utilities to update child attributes ([8730333](https://github.com/ionic-team/stencil/commit/8730333))



<a name="0.8.0"></a>
# 🐅 [0.8.0](https://github.com/ionic-team/stencil/compare/v0.7.26...v0.8.0) (2018-04-30)


### Features

* **bundler:** using es2017 in esm mode ([7e80772](https://github.com/ionic-team/stencil/commit/7e80772))
* **bundler:** support for dynamic import ([d68d5c1](https://github.com/ionic-team/stencil/commit/d68d5c1))
* **bundler:** expose Rollup node-resolve plugin configuration ([a7a2c6e](https://github.com/ionic-team/stencil/commit/a7a2c6e))
* **polyfill:** add Object.entries to polyfills ([fcc649f](https://github.com/ionic-team/stencil/commit/fcc649f))


### Bug Fixes

* **global:** bundle global script goes first ([0b9fdd4](https://github.com/ionic-team/stencil/commit/0b9fdd4))
* **karma:** make `npm run dev` work on Windows ([097799f](https://github.com/ionic-team/stencil/commit/097799f))
* **lifecycle:** ensure child components have connected before lifecycle checks ([5a1377f](https://github.com/ionic-team/stencil/commit/5a1377f)), closes [#747](https://github.com/ionic-team/stencil/issues/747)
* **prop:** prop type metadata ([2b638e0](https://github.com/ionic-team/stencil/commit/2b638e0))
* **props:** do not auto force prop types on objects ([6b94bf6](https://github.com/ionic-team/stencil/commit/6b94bf6))
* **props:** do not force a type when using mixed union types ([3bf75f7](https://github.com/ionic-team/stencil/commit/3bf75f7))
* **props:** force string types toString ([9e6f66a](https://github.com/ionic-team/stencil/commit/9e6f66a))
* **polyfill:** change promise polyfill from a UMD to a simple global polyfill. ([ffcbb14](https://github.com/ionic-team/stencil/commit/ffcbb14))
* **polyfill:** fix ie promise polyfill ([723b76d](https://github.com/ionic-team/stencil/commit/723b76d))
* **shadowDom:** fix render() returning array to update shadowRoot ([af87219](https://github.com/ionic-team/stencil/commit/af87219)), closes [#727](https://github.com/ionic-team/stencil/issues/727)
* **slot:** conditionally render slot and fallback slot content ([294c559](https://github.com/ionic-team/stencil/commit/294c559)), closes [#721](https://github.com/ionic-team/stencil/issues/721)
* **slot:** fix conditional slot reordering ([6489f8e](https://github.com/ionic-team/stencil/commit/6489f8e))
* **slot:** fix first child slot in child component w/ array slots ([f0ac435](https://github.com/ionic-team/stencil/commit/f0ac435))
* **tag:** fix legacy module lookups when using tags with numbers ([e918f48](https://github.com/ionic-team/stencil/commit/e918f48)), closes [#753](https://github.com/ionic-team/stencil/issues/753)
* **slot:** fix slot reordering ([7af3c6c](https://github.com/ionic-team/stencil/commit/7af3c6c))
* **slot:** move slot content to original location before removing ([7ef8afe](https://github.com/ionic-team/stencil/commit/7ef8afe))
* **slot:** fix slot reordering on async update ([39d1afe](https://github.com/ionic-team/stencil/commit/39d1afe))
* **slot:** relocate slot content at component root ([f1598fd](https://github.com/ionic-team/stencil/commit/f1598fd))


<a name="0.7.26"></a>
## 👻 [0.7.26](https://github.com/ionic-team/stencil/compare/v0.7.25...v0.7.26) (2018-04-23)


### Bug Fixes

* **angular:** methods proxy ([d014206](https://github.com/ionic-team/stencil/commit/d014206))
* **style:** Support multiple base64 variables ([5458790](https://github.com/ionic-team/stencil/commit/5458790))
* **styles:** prevent stackoverflow when shimming base64 css vars ([089636b](https://github.com/ionic-team/stencil/commit/089636b)), closes [#749](https://github.com/ionic-team/stencil/issues/749)
* **windows:** use npx for build scripts ([d67dcdb](https://github.com/ionic-team/stencil/commit/d67dcdb))


### Features

* **test:** adds auxiliar test utils ([093c425](https://github.com/ionic-team/stencil/commit/093c425))



<a name="0.7.25"></a>
## 🎬 [0.7.25](https://github.com/ionic-team/stencil/compare/v0.7.24...v0.7.25) (2018-04-18)


### Bug Fixes

* **ssr:** ensure ssr includes inlined styles ([e83c6be](https://github.com/ionic-team/stencil/commit/e83c6be)), closes [#734](https://github.com/ionic-team/stencil/issues/734)


### Features

* **ssr:** add server initApp() for express middleware ([89485c8](https://github.com/ionic-team/stencil/commit/89485c8))
* **watch:** emit error when watching to invalid prop ([18f03a0](https://github.com/ionic-team/stencil/commit/18f03a0))


### Performance Improvements

* **queue:** multi-stage scheduler queue ([#746](https://github.com/ionic-team/stencil/issues/746)) ([0c9e6ee](https://github.com/ionic-team/stencil/commit/0c9e6ee))



<a name="0.7.24"></a>
## 🍣 [0.7.24](https://github.com/ionic-team/stencil/compare/v0.7.23...v0.7.24) (2018-04-13)


### Bug Fixes

* **queue:** ensure all queued callbacks run ([e251802](https://github.com/ionic-team/stencil/commit/e251802))



<a name="0.7.23"></a>
## ☀️ [0.7.23](https://github.com/ionic-team/stencil/compare/v0.7.22...v0.7.23) (2018-04-13)


### Bug Fixes

* **css-shim:** fix relative paths ([67edcbd](https://github.com/ionic-team/stencil/commit/67edcbd))
* allow collection packages to use package.json 'module' to export esmodules. ([8aee1f0](https://github.com/ionic-team/stencil/commit/8aee1f0))



<a name="0.7.22"></a>
## ⛷ [0.7.22](https://github.com/ionic-team/stencil/compare/v0.7.21...v0.7.22) (2018-04-12)


### Bug Fixes

* **angular:** output decorator ([494fb18](https://github.com/ionic-team/stencil/commit/494fb18))
* **prerender:** pass property data down to child components ([35c0911](https://github.com/ionic-team/stencil/commit/35c0911))



<a name="0.7.21"></a>
## ⚾️ [0.7.21](https://github.com/ionic-team/stencil/compare/v0.7.20...v0.7.21) (2018-04-12)


### Bug Fixes

* **angular:** emit exact types ([2164ad3](https://github.com/ionic-team/stencil/commit/2164ad3))
* **css-shim:** Fix css-shim when base64 uri value is used ([84a1348](https://github.com/ionic-team/stencil/commit/84a1348)), closes [#393](https://github.com/ionic-team/stencil/issues/393)
* **svg:** remove svg attribute when undefined ([5a3c632](https://github.com/ionic-team/stencil/commit/5a3c632)), closes [#720](https://github.com/ionic-team/stencil/issues/720)
* **test:** correct tsconfig for karma tests. ([568c82d](https://github.com/ionic-team/stencil/commit/568c82d))


### Features

* **queue:** organize dom read/writes within queue ([0d865b8](https://github.com/ionic-team/stencil/commit/0d865b8))
* export component types ([41e4089](https://github.com/ionic-team/stencil/commit/41e4089))



<a name="0.7.20"></a>
## 🍭 [0.7.20](https://github.com/ionic-team/stencil/compare/v0.7.19...v0.7.20) (2018-04-10)


### Bug Fixes

* **declarations:** fix dialog type interface ([9e7da78](https://github.com/ionic-team/stencil/commit/9e7da78))
* **test:** fix accessing TestWindow properties ([1dabe1f](https://github.com/ionic-team/stencil/commit/1dabe1f))
* **test:** update to TestWindow ([aa41953](https://github.com/ionic-team/stencil/commit/aa41953))
* **test:** TestWindow types subclass Window ([a7feecc](https://github.com/ionic-team/stencil/commit/a7feecc))


### Features

* **autoprefix:** built-in css autoprefixing ([e141e8a](https://github.com/ionic-team/stencil/commit/e141e8a))



<a name="0.7.19"></a>
## 💾 [0.7.19](https://github.com/ionic-team/stencil/compare/v0.7.18...v0.7.19) (2018-04-09)


### Bug Fixes

* **props:** dash-case attributes to props ([0bf1796](https://github.com/ionic-team/stencil/commit/0bf1796)), closes [#697](https://github.com/ionic-team/stencil/issues/697)
* **props:** static type analysis for props ([b6e7863](https://github.com/ionic-team/stencil/commit/b6e7863))
* **test:** use TestWindow for Listen testing ([3279676](https://github.com/ionic-team/stencil/commit/3279676)), closes [#572](https://github.com/ionic-team/stencil/issues/572)
* **testing:** fix event emitter for test suite ([d388430](https://github.com/ionic-team/stencil/commit/d388430)), closes [#601](https://github.com/ionic-team/stencil/issues/601)
* **tests:** path is not correct on windows ([#701](https://github.com/ionic-team/stencil/issues/701)) ([f7acae4](https://github.com/ionic-team/stencil/commit/f7acae4))


### Refactor

The test suite now comes with a `TestWindow` class, with the ultimate goal of better simulating a standardized browser environment built on top of `window` and `document`. Using a `TestWindow` instance allows tests to stay compartmentalized, and not require global objects which get reused (which is not ideal for testing). Instead, each test creates a new instance of `window`, and by doing so lets each test to not affect others.

The test suite has been refactored to now use `TestWindow` instead of `render` and `flush`. Existing tests will continue to work, but warnings will be printed to use `TestWindow` instead. Here are [a few examples](https://github.com/ionic-team/stencil/commit/77dd1c79b4d8926995d9a48773c8516fff63e410).

##### Old test:

```
import { render, flush } from '@stencil/core/testing';
import { MyComponent } from './my-component';

it('should be the old way', async () => {
  const element = await render({
    components: [MyComponent],
    html: '<my-cmp first="Marty" last-name="McFly"></my-cmp>'
  });
  expect(element.textContent).toEqual('Hello, my name is Marty McFly');

  element.first = 'George';
  await flush(element);

  expect(element.textContent).toEqual('Hello, my name is George McFly');
});
```

##### New test:

```
import { TestWindow } from '@stencil/core/testing';
import { MyComponent } from './my-component';

it('should be the new way', async () => {
  const window = new TestWindow();
  const element = await window.load({
    components: [MyComponent],
    html: '<my-cmp first="Marty" last-name="McFly"></my-cmp>'
  });
  expect(element.textContent).toEqual('Hello, my name is Marty McFly');

  element.first = 'George';
  await window.flush();

  expect(element.textContent).toEqual('Hello, my name is George McFly');
});
```


<a name="0.7.18"></a>
## 🍹 [0.7.18](https://github.com/ionic-team/stencil/compare/v0.7.17...v0.7.18) (2018-04-06)


### Bug Fixes

* **angular:** outputs must be proxied ([e5647ac](https://github.com/ionic-team/stencil/commit/e5647ac))



<a name="0.7.17"></a>
## 🍸 [0.7.17](https://github.com/ionic-team/stencil/compare/v0.7.16...v0.7.17) (2018-04-06)


### Bug Fixes

* **angular:** method proxy ([e06a37d](https://github.com/ionic-team/stencil/commit/e06a37d))
* **angular:** proxy methods ([5e93ecb](https://github.com/ionic-team/stencil/commit/5e93ecb))
* **bundle:** also resolve paths of relative source files not in memory ([9991d1e](https://github.com/ionic-team/stencil/commit/9991d1e))



<a name="0.7.16"></a>
## 🏌 [0.7.16](https://github.com/ionic-team/stencil/compare/v0.7.15...v0.7.16) (2018-04-05)


### Bug Fixes

* **tests:** fix test suite API ([dcac32f](https://github.com/ionic-team/stencil/commit/dcac32f)), closes [#697](https://github.com/ionic-team/stencil/issues/697)



<a name="0.7.15"></a>
## 🚢 [0.7.15](https://github.com/ionic-team/stencil/compare/v0.7.14...v0.7.15) (2018-04-05)


### Bug Fixes

* **slot:** load host content on every render ([79fbf50](https://github.com/ionic-team/stencil/commit/79fbf50))
* **theme:** ensure elm.mode is always set ([33dd711](https://github.com/ionic-team/stencil/commit/33dd711))
* **types:** property possibly undefined ([18bac2a](https://github.com/ionic-team/stencil/commit/18bac2a))



<a name="0.7.14"></a>
## 😛 [0.7.14](https://github.com/ionic-team/stencil/compare/v0.7.13...v0.7.14) (2018-04-04)


### Bug Fixes

* **slot:** alway include slot ([803cfa3](https://github.com/ionic-team/stencil/commit/803cfa3))



<a name="0.7.13"></a>
## ⛱ [0.7.13](https://github.com/ionic-team/stencil/compare/v0.7.12...v0.7.13) (2018-04-04)


### Bug Fixes

* **docs:** only output readme docs w/ --docs flag ([0aad8e7](https://github.com/ionic-team/stencil/commit/0aad8e7)), closes [#690](https://github.com/ionic-team/stencil/issues/690)
* **svg:** update css class on svg element ([260b538](https://github.com/ionic-team/stencil/commit/260b538))
* **test:** add esModuleInterop so that tests will have proper interop with commonjs modules. ([8520059](https://github.com/ionic-team/stencil/commit/8520059))


### Features

* **docs:** add usage markdown to docs json output ([7d811f1](https://github.com/ionic-team/stencil/commit/7d811f1))
* **host:** apply static Component host data to host element ([00b6af6](https://github.com/ionic-team/stencil/commit/00b6af6)), closes [#562](https://github.com/ionic-team/stencil/issues/562)
* add commonjs config option that will allow additonal configuration of rollup like namedExports. ([d807ea1](https://github.com/ionic-team/stencil/commit/d807ea1))



<a name="0.7.12"></a>
## 😋 [0.7.12](https://github.com/ionic-team/stencil/compare/v0.7.11...v0.7.12) (2018-04-02)


### Bug Fixes

* **angular:** emit all props ([dc5ac70](https://github.com/ionic-team/stencil/commit/dc5ac70))



<a name="0.7.11"></a>
## 🔦 [0.7.11](https://github.com/ionic-team/stencil/compare/v0.7.10...v0.7.11) (2018-04-02)


### Bug Fixes

* **build:** separate cached build conditionals ([bc7873e](https://github.com/ionic-team/stencil/commit/bc7873e)), closes [#676](https://github.com/ionic-team/stencil/issues/676)
* **cli:** override previous flags in cli args ([da14e81](https://github.com/ionic-team/stencil/commit/da14e81))
* **render:** fix vnode key comparison ([6f380da](https://github.com/ionic-team/stencil/commit/6f380da))
* **render:** update parent host content from child changed element render ([6fe6a6e](https://github.com/ionic-team/stencil/commit/6fe6a6e)), closes [#679](https://github.com/ionic-team/stencil/issues/679)


### Features
* **angular:** directivesArrayFile ([ca11e0a](https://github.com/ionic-team/stencil/commit/ca11e0a))
* **build:** exclude slot polyfill for shadow-only, or not slot components ([191d90a](https://github.com/ionic-team/stencil/commit/191d90a))
* **docs:** cli flag for json docs ([7b9cedd](https://github.com/ionic-team/stencil/commit/7b9cedd))
* **props:** warn when using standardized props/methods ([e6ff67c](https://github.com/ionic-team/stencil/commit/e6ff67c)), closes [#309](https://github.com/ionic-team/stencil/issues/309)
* **typescript:** update to TypeScript 2.8.1 ([c98c7ce](https://github.com/ionic-team/stencil/commit/c98c7ce))



<a name="0.7.10"></a>
## 🐚 [0.7.10](https://github.com/ionic-team/stencil/compare/v0.7.9...v0.7.10) (2018-03-28)


### Bug Fixes

* **componentOnReady:** set host element as resolve value ([dcfdf06](https://github.com/ionic-team/stencil/commit/dcfdf06))



<a name="0.7.9"></a>
## 🎷 [0.7.9](https://github.com/ionic-team/stencil/compare/v0.7.8...v0.7.9) (2018-03-28)

### Features

* **refactor:** add `componentOnReady()` to prototype immediately ([57d14c7](https://github.com/ionic-team/stencil/commit/57d14c7))


<a name="0.7.8"></a>
## 👽 [0.7.8](https://github.com/ionic-team/stencil/compare/v0.7.7...v0.7.8) (2018-03-26)


### Features

* **config:** enable ng output target ([c2eb430](https://github.com/ionic-team/stencil/commit/c2eb430))
* **docs:** generate component docs in json format ([34bd335](https://github.com/ionic-team/stencil/commit/34bd335))


<a name="0.7.7"></a>
## 🍒 [0.7.7](https://github.com/ionic-team/stencil/compare/v0.7.6...v0.7.7) (2018-03-23)

### Features

* **events:** reduce restrictions on public member names that are similar to event names ([ef1b2e7](https://github.com/ionic-team/stencil/commit/ef1b2e7))
* **types:** add methods to components.d.ts file and remove localized dependency on components ([#654](https://github.com/ionic-team/stencil/issues/654)) ([ef304ea](https://github.com/ionic-team/stencil/commit/ef304ea))


### Bug Fixes

* **events:** fix adding listeners from JSX attributes ([527f2ac](https://github.com/ionic-team/stencil/commit/527f2ac)), closes [#662](https://github.com/ionic-team/stencil/issues/662)


<a name="0.7.6"></a>
## 🎺 [0.7.6](https://github.com/ionic-team/stencil/compare/v0.7.5...v0.7.6) (2018-03-22)

### Features

Listeners can now be added to specific elements within JSX. [#323](https://github.com/ionic-team/stencil/issues/323#issuecomment-375349412)

For example, if a component emits the event `ionChange`, then the JSX attribute `onIonChange` can be added, such as:

```
<ion-input onIonChange={(ev) => this.someMethod(ev)}/>
```

This matches how listeners are added for standard events. For example, to listen to a button's `click` event, the JSX attribute would be `onClick`.


### Bug Fixes

* **build:** avoid Object.entries (breaks Node 6) ([b39b2b9](https://github.com/ionic-team/stencil/commit/b39b2b9))
* **events:** keep event names case-sensitive ([bb09964](https://github.com/ionic-team/stencil/commit/bb09964))
* **loader:** more-specific "customElements" polyfill check ([f4823f7](https://github.com/ionic-team/stencil/commit/f4823f7)), closes [#648](https://github.com/ionic-team/stencil/issues/648)
* **render:** fix functional components patch when children aren't rendered ([3747dcd](https://github.com/ionic-team/stencil/commit/3747dcd)), closes [#649](https://github.com/ionic-team/stencil/issues/649)
* **styles:** escape unicode chars & octal literals in css ([f1af0bc](https://github.com/ionic-team/stencil/commit/f1af0bc)), closes [#656](https://github.com/ionic-team/stencil/issues/656)
* **types:** dash based event names should appear within quotes in the components.d.ts file. ([dafd02d](https://github.com/ionic-team/stencil/commit/dafd02d))



<a name="0.7.5"></a>
## 🐬 [0.7.5](https://github.com/ionic-team/stencil/compare/v0.7.4...v0.7.5) (2018-03-20)


### Bug Fixes

* **css:** update the CSS variable regexp for pseudo-classes ([97c35ce](https://github.com/ionic-team/stencil/commit/97c35ce)), closes [#603](https://github.com/ionic-team/stencil/issues/603)
* add event listeners and custom events types to components.d.ts ([#644](https://github.com/ionic-team/stencil/issues/644)) ([4644d91](https://github.com/ionic-team/stencil/commit/4644d91))



<a name="0.7.4"></a>
## 🏵 [0.7.4](https://github.com/ionic-team/stencil/compare/v0.7.3...v0.7.4) (2018-03-20)


### Bug Fixes

* **build:** reuse build conditionals from last build for non-typescript changes ([8127829](https://github.com/ionic-team/stencil/commit/8127829)), closes [#636](https://github.com/ionic-team/stencil/issues/636)
* **prop:** fix prop decorator parsing ([857d81c](https://github.com/ionic-team/stencil/commit/857d81c))



<a name="0.7.3"></a>
## 🏆 [0.7.3](https://github.com/ionic-team/stencil/compare/v0.7.2...v0.7.3) (2018-03-20)


### Features

* **reflectToAttr:** add Prop option to reflect property values to attribute ([741d97f](https://github.com/ionic-team/stencil/commit/741d97f)), closes [#588](https://github.com/ionic-team/stencil/issues/588)



<a name="0.7.2"></a>
## 🚔 [0.7.2](https://github.com/ionic-team/stencil/compare/v0.7.1...v0.7.2) (2018-03-19)


### Bug Fixes

* **canonical-link:** update `<link rel="canonical">` using existing href value ([0abcfbe](https://github.com/ionic-team/stencil/commit/0abcfbe))
* **prerender:** merge prerender diagnostics with build output ([bc6c638](https://github.com/ionic-team/stencil/commit/bc6c638))
* **render:** check if functional component on update element ([007b188](https://github.com/ionic-team/stencil/commit/007b188))
* **render:** fix functional components returning null ([10a3777](https://github.com/ionic-team/stencil/commit/10a3777)), closes [#610](https://github.com/ionic-team/stencil/issues/610)
* **whenDefined:** customElements.whenDefined() polyfill before the full polyfill ([8d92cc1](https://github.com/ionic-team/stencil/commit/8d92cc1))



<a name="0.7.1"></a>
## 🏐 [0.7.1](https://github.com/ionic-team/stencil/compare/v0.7.0...v0.7.1) (2018-03-17)


### Bug Fixes

* **crossorigin:** support crossorigin for dynamic import ([037839f](https://github.com/ionic-team/stencil/commit/037839f))
* **es5:** fix observedAttributes in es5 build ([7c93e85](https://github.com/ionic-team/stencil/commit/7c93e85)), closes [#623](https://github.com/ionic-team/stencil/issues/623)
* **prerender:** fix custom indexHtml build ([7768864](https://github.com/ionic-team/stencil/commit/7768864)), closes [#563](https://github.com/ionic-team/stencil/issues/563)
* **styles:** escape unicode characters in css ([b32d9da](https://github.com/ionic-team/stencil/commit/b32d9da)), closes [#545](https://github.com/ionic-team/stencil/issues/545)



<a name="0.7.0"></a>
# 🍬 [0.7.0](https://github.com/ionic-team/stencil/compare/v0.6.18...v0.7.0) (2018-03-16)


### Features

* **build:** allow for multiple build target configurations ([#582](https://github.com/ionic-team/stencil/issues/582)) ([a05dc00](https://github.com/ionic-team/stencil/commit/a05dc00))
* **config:** allow for multiple output target configurations ([c808dee](https://github.com/ionic-team/stencil/commit/c808dee))
* **docs:** write docs to multiple locations ([24fe78d](https://github.com/ionic-team/stencil/commit/24fe78d))
* **inspector:** add devInspector for improved debugging ([034f0a9](https://github.com/ionic-team/stencil/commit/034f0a9))
* **prerender:** add baseUrl outputTarget config ([6d08a70](https://github.com/ionic-team/stencil/commit/6d08a70))
* **prerender:** do not write empty attrs which are safe to remove ([18e7e2c](https://github.com/ionic-team/stencil/commit/18e7e2c))
* **types:** add image decode attribute to JSX definition ([#596](https://github.com/ionic-team/stencil/issues/596)) ([fbda0c8](https://github.com/ionic-team/stencil/commit/fbda0c8))


### Bug Fixes

* **build:** do not ignore watch flag ([982de3e](https://github.com/ionic-team/stencil/commit/982de3e))
* **config:** convert serviceWorker and prerender config to outputTargets ([148c41e](https://github.com/ionic-team/stencil/commit/148c41e))
* **css-shim:** improve tests for requiring css shim ([4a2a480](https://github.com/ionic-team/stencil/commit/4a2a480)), closes [#603](https://github.com/ionic-team/stencil/issues/603)
* **host-config:** add baseUrl to host.config.json output ([da52e02](https://github.com/ionic-team/stencil/commit/da52e02))
* **outputTargets:** fix collection targets ([797f1b4](https://github.com/ionic-team/stencil/commit/797f1b4))
* **polyfills:** makes polyfills writable properties ([b439cad](https://github.com/ionic-team/stencil/commit/b439cad)), closes [#606](https://github.com/ionic-team/stencil/issues/606)
* **prerender:** fix inlined loader script with baseUrl confg ([7907b94](https://github.com/ionic-team/stencil/commit/7907b94))
* **prerender:** fix urls w/ same as baseUrl but no trailing slash ([26bf09f](https://github.com/ionic-team/stencil/commit/26bf09f))
* **prerender:** update local prerender server w/ baseUrl ([f37d9d5](https://github.com/ionic-team/stencil/commit/f37d9d5))
* **prerender:** update prerender config defaults ([19b27e4](https://github.com/ionic-team/stencil/commit/19b27e4))
* **resourcePath:** improve loader script resource path ([58f9e99](https://github.com/ionic-team/stencil/commit/19b27e4))
* **service-worker:** add registry.json, host config and global js to globIgnore ([8e3f616](https://github.com/ionic-team/stencil/commit/8e3f616))
* **service-worker:** adjust sw.js w/ baseUrl ([eae035b](https://github.com/ionic-team/stencil/commit/eae035b))
* **service-worker:** do not build service worker in dev builds ([72e2997](https://github.com/ionic-team/stencil/commit/72e2997))
* **service-worker:** unregister sw when in dev mode ([7ea4307](https://github.com/ionic-team/stencil/commit/7ea4307))
* **svg:** build svg render into core w/ imports ([1b3904d](https://github.com/ionic-team/stencil/commit/1b3904d)), closes [#607](https://github.com/ionic-team/stencil/issues/607)
* **sw:** fix service worker config validation ([cdf890e](https://github.com/ionic-team/stencil/commit/cdf890e))
* **tag:** fix dash case conversion for tags with digits ([af12eb4](https://github.com/ionic-team/stencil/commit/af12eb4)), closes [#599](https://github.com/ionic-team/stencil/issues/599)
* **test:** normalize path for windows ([5e3fbc0](https://github.com/ionic-team/stencil/commit/5e3fbc0))
* **types:** adds forceUpdate() ([3640715](https://github.com/ionic-team/stencil/commit/3640715))


<a name="0.6.18"></a>
## 🗻 [0.6.18](https://github.com/ionic-team/stencil/compare/v0.6.17...v0.6.18) (2018-03-05)


### Bug Fixes

* **events:** always add dispatchEvent to build ([830d601](https://github.com/ionic-team/stencil/commit/830d601)), closes [#595](https://github.com/ionic-team/stencil/issues/595)



<a name="0.6.17"></a>
## [0.6.17](https://github.com/ionic-team/stencil/compare/v0.6.16...v0.6.17) (2018-03-03)


### Bug Fixes

* **sw:** update sw unregistration ([9864159](https://github.com/ionic-team/stencil/commit/9864159))


### Features

* **App:** expose addEventListener to app global so external libs can override ([ed99d45](https://github.com/ionic-team/stencil/commit/ed99d45))
* **App:** expose raf to app global so external libs can override raf ([0fb14a3](https://github.com/ionic-team/stencil/commit/0fb14a3))
* **Build:** user-land Build conditions ([c855353](https://github.com/ionic-team/stencil/commit/c855353))
* **events:** dispatch "appinit" and "appload" events on window ([639626b](https://github.com/ionic-team/stencil/commit/639626b))



<a name="0.6.16"></a>
## [0.6.16](https://github.com/ionic-team/stencil/compare/v0.6.15...v0.6.16) (2018-03-01)


### Bug Fixes

* **cli:** fix minimist dependency ([75dfab6](https://github.com/ionic-team/stencil/commit/75dfab6)), closes [#580](https://github.com/ionic-team/stencil/issues/580)



<a name="0.6.15"></a>
## [0.6.15](https://github.com/ionic-team/stencil/compare/v0.6.14...v0.6.15) (2018-03-01)


### Bug Fixes

* **prerender:** improve inline loader script ([cf72640](https://github.com/ionic-team/stencil/commit/cf72640))


### Performance Improvements

* **file hash:** init asset file versioning ([65c5783](https://github.com/ionic-team/stencil/commit/65c5783))
* **minify:** minify inline styles and scripts ([286bf7d](https://github.com/ionic-team/stencil/commit/286bf7d))
* **render:** microtask resolve all tasks until app loaded ([c9aee2b](https://github.com/ionic-team/stencil/commit/c9aee2b))



<a name="0.6.14"></a>
## [0.6.14](https://github.com/ionic-team/stencil/compare/v0.6.13...v0.6.14) (2018-02-28)


### Bug Fixes

* **collection:** add bundle data to collection manifest for prop connect tags ([6ba0150](https://github.com/ionic-team/stencil/commit/6ba0150))
* **watcher:** do not create more than one watcher ([0df1dff](https://github.com/ionic-team/stencil/commit/0df1dff))



<a name="0.6.13"></a>
## [0.6.13](https://github.com/ionic-team/stencil/compare/v0.6.9...v0.6.13) (2018-02-28)

0.6.10 to 0.6.13: Fix collection JSX types for redistribution.


### Bug Fixes

* **types:** export lifecycle method interfaces for collections ([ef1875f](https://github.com/ionic-team/stencil/commit/ef1875f))
* **types:** add JSX types to injected stencil core dts ([53bb4d1](https://github.com/ionic-team/stencil/commit/53bb4d1))
* **types:** remove global JSX Elements that should be provided by the host application. ([4d151cc](https://github.com/ionic-team/stencil/commit/4d151cc))



<a name="0.6.9"></a>
## [0.6.9](https://github.com/ionic-team/stencil/compare/v0.6.8...v0.6.9) (2018-02-27)


### Bug Fixes

* **bundling:** update to rollup 0.56.3 ([3904bd1](https://github.com/ionic-team/stencil/commit/3904bd1))
* **collection:** ship stencil/core interfaces w/ collections ([d462b7f](https://github.com/ionic-team/stencil/commit/d462b7f))
* **exports:** update renderer exports and refactor renderer location ([40faa65](https://github.com/ionic-team/stencil/commit/40faa65)), closes [#574](https://github.com/ionic-team/stencil/issues/574)
* **transpile:** implement directoryExists for compiler-host ([ebccbc1](https://github.com/ionic-team/stencil/commit/ebccbc1))



<a name="0.6.8"></a>
## [0.6.8](https://github.com/ionic-team/stencil/compare/v0.6.7...v0.6.8) (2018-02-25)


### Bug Fixes

* **css:** use default css if sass plugin not installed ([a61dc3b](https://github.com/ionic-team/stencil/commit/a61dc3b))
* **types:** import to missing dist/core folder after build process ([fb554c9](https://github.com/ionic-team/stencil/commit/fb554c9))


### Component CSS and Sass Plugin Update

For external collections that provide both CSS and Sass files, such as [Ionic](https://www.npmjs.com/package/@ionic/core), if the Stencil project does not have the [@stencil/sass](https://www.npmjs.com/package/@stencil/sass) plugin installed then it'll default to using the collection's CSS build. If project does have the sass plugin installed then it'll rebuild the external collection's sass files at compile time. This allows projects to override a collection's default Sass variables using the plugin's `injectGlobalPaths` option. Please see the [@stencil/sass options](https://www.npmjs.com/package/@stencil/sass) for more information.


<a name="0.6.7"></a>
## [0.6.7](https://github.com/ionic-team/stencil/compare/v0.6.6...v0.6.7) (2018-02-23)


### Bug Fixes

* **collection:** copy all src root level d.ts to dist/types directory for distribution ([9fcad83](https://github.com/ionic-team/stencil/commit/9fcad83))
* **collection:** remove side effect collection imports from JS output ([64b03d0](https://github.com/ionic-team/stencil/commit/64b03d0))
* **types:** gather collect types during ts typechecking ([03349be](https://github.com/ionic-team/stencil/commit/03349be))


### Refactor

* **collections:** use node module resolution for collection dependencies ([0dd621c](https://github.com/ionic-team/stencil/commit/0dd621c))


<a name="0.6.6"></a>
## [0.6.6](https://github.com/ionic-team/stencil/compare/v0.6.5...v0.6.6) (2018-02-22)


### Bug Fixes

* **ref:** execute ref on vnode items that get added during update. ([b192def](https://github.com/ionic-team/stencil/commit/b192def))
* **ref:** move callNodeRefs check to only occur on rerender not on initial load. ([f09a5ee](https://github.com/ionic-team/stencil/commit/f09a5ee))
* **global:** always add global script to built context ([db594bd](https://github.com/ionic-team/stencil/commit/db594bd))
* **types:** remove deprecated collection imports ([6103fef](https://github.com/ionic-team/stencil/commit/6103fef))


<a name="0.6.5"></a>
## [0.6.5](https://github.com/ionic-team/stencil/compare/v0.6.4...v0.6.5) (2018-02-20)


### Bug Fixes

* **prerender:** handle shadow components in patch ([0c9117e](https://github.com/ionic-team/stencil/commit/0c9117e)), closes [#553](https://github.com/ionic-team/stencil/issues/553)


### Performance Improvements

* **optimizeHtml:** default to optimize html when prerendering disabled ([d2def84](https://github.com/ionic-team/stencil/commit/d2def84))



<a name="0.6.4"></a>
## [0.6.4](https://github.com/ionic-team/stencil/compare/v0.6.3...v0.6.4) (2018-02-20)


### Bug Fixes

* **loader:** force es5 builds for file:// protocol ([851fcec](https://github.com/ionic-team/stencil/commit/851fcec)), closes [#517](https://github.com/ionic-team/stencil/issues/517)
* **package:** move rollup-pluginutils to an external for the rollup build. ([90b295b](https://github.com/ionic-team/stencil/commit/90b295b))



<a name="0.6.3"></a>
## [0.6.3](https://github.com/ionic-team/stencil/compare/v0.6.2...v0.6.3) (2018-02-19)


### Bug Fixes

* remove isBuildSvg from prop test in render. ([913d4d1](https://github.com/ionic-team/stencil/commit/913d4d1))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/ionic-team/stencil/compare/v0.6.1...v0.6.2) (2018-02-19)


### Bug Fixes

* **collection:** remove collection loader from global scripts ([a70476e](https://github.com/ionic-team/stencil/commit/a70476e))
* **json:** add rollup pluginutils to json plugin so that we can ignore commonjs proxy files. ([b148239](https://github.com/ionic-team/stencil/commit/b148239))
* **prerender:** handle anchor href values that contain quotes ([3f87e1d](https://github.com/ionic-team/stencil/commit/3f87e1d)), closes [#552](https://github.com/ionic-team/stencil/issues/552)
* **slot:** component provided default slot content ([59ff359](https://github.com/ionic-team/stencil/commit/59ff359)), closes [#171](https://github.com/ionic-team/stencil/issues/171)



<a name="0.6.1"></a>
## [0.6.1](https://github.com/ionic-team/stencil/compare/v0.6.0...v0.6.1) (2018-02-19)


### Bug Fixes

* **component:** keep references to components when temporarily disconnected ([bb7b8f5](https://github.com/ionic-team/stencil/commit/bb7b8f5)), closes [#527](https://github.com/ionic-team/stencil/issues/527)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/ionic-team/stencil/compare/v0.5.2...v0.6.0) (2018-02-16)

### Features

* **collections:** import collections through es module imports ([9015569](https://github.com/ionic-team/stencil/commit/9015569))
* **sass:** move sass to external plugin, [@stencil](https://github.com/stencil)/sass ([371c44c](https://github.com/ionic-team/stencil/commit/371c44c)), closes [#490](https://github.com/ionic-team/stencil/issues/490)


#### Collection Imports

The `config.collections` config has been deprecated in favor of standard ES module imports. Instead of listing collections within `stencil.config.js`, collections should now be imported by the app's root component. The benefit of this is to not only simplify the config by using a standards approach for imports, but to also automatically import the collection's types to improve development. If you are using any collections, such as `@ionic/core`, please remove the `config.collections` property entirely from `stencil.config.js`. Next, to include the collection and its types in the project, add the import to your root component. For example:

```
import '@ionic/core';
```


#### Sass moved to `@stencil/sass`

Previously Sass was embedded within `@stencil/core`, and styles with a scss extension were automatically precompiled to CSS. In order to better support all external projects, the plugin system is now apart of the compiler's public API and config. With this update, Sass has been moved out of core and into its own plugin, [@stencil/sass](https://www.npmjs.com/package/@stencil/sass). Additionally, this enables other external projects, such as [@stencil/postcss](https://www.npmjs.com/package/@stencil/postcss). If you are currently using Sass, please run the following:

```
npm run @stencil/sass --save-dev
```

And within `stencil.config.js`, add the plugins config property. For example:

```
const sass = require('@stencil/sass');

exports.config = {
  plugins: [
    sass()
  ]
};
```

(Also note that adding Stylus and Less plugins are on our roadmap.)


### Bug Fixes

* **config:** fix rebuilds from config updates ([1f46a92](https://github.com/ionic-team/stencil/commit/1f46a92))


<a name="0.5.2"></a>
## [0.5.2](https://github.com/ionic-team/stencil/compare/v0.5.1...v0.5.2) (2018-02-15)


### Performance Improvements

* **bundle:** use in-memory fs cache for local resolution ([d78bcc4](https://github.com/ionic-team/stencil/commit/d78bcc4))


### Bug Fixes

* **bundle:** fix directory index resolution ([605aa54](https://github.com/ionic-team/stencil/commit/605aa54)), closes [#537](https://github.com/ionic-team/stencil/issues/537)



<a name="0.5.1"></a>
## [0.5.1](https://github.com/ionic-team/stencil/compare/v0.5.0...v0.5.1) (2018-02-14)


### Bug Fixes

* **bundling:** add json resolution plugin for rollup to stencil. ([39dcfc6](https://github.com/ionic-team/stencil/commit/39dcfc6))
* **entries:** limit component references to call expressions and html ([7991017](https://github.com/ionic-team/stencil/commit/7991017)), closes [#532](https://github.com/ionic-team/stencil/issues/532)
* **node-dom:** fix errors when dom.window already closed ([065ed4e](https://github.com/ionic-team/stencil/commit/065ed4e))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/ionic-team/stencil/compare/v0.4.3...v0.5.0) (2018-02-13)


### Features

* **plugins:** add rollup plugins through config ([b8abbce](https://github.com/ionic-team/stencil/commit/b8abbce)), closes [#472](https://github.com/ionic-team/stencil/issues/472)


### Bug Fixes

* **entries:** ensure dependency data from collections remains ([f9fb09a](https://github.com/ionic-team/stencil/commit/f9fb09a))
* **entries:** use all strings for component reference graph ([6629aa1](https://github.com/ionic-team/stencil/commit/6629aa1))
* **publicPath:** allow for custom public path ([19095e7](https://github.com/ionic-team/stencil/commit/19095e7)), closes [#464](https://github.com/ionic-team/stencil/issues/464)
* **transpile:** remove unneded remove-imports transform because it is causing issues with wildcard imports. fixes [#526](https://github.com/ionic-team/stencil/issues/526) ([256e70a](https://github.com/ionic-team/stencil/commit/256e70a))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/ionic-team/stencil/compare/v0.4.2...v0.4.3) (2018-02-12)


### Bug Fixes

* **entries:** handle circular imports ([3f306ac](https://github.com/ionic-team/stencil/commit/3f306ac)), closes [#513](https://github.com/ionic-team/stencil/issues/513)
* **minify:** revert uglify to v3.3.9 ([0391259](https://github.com/ionic-team/stencil/commit/0391259))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/ionic-team/stencil/compare/v0.4.1...v0.4.2) (2018-02-12)

### Features

* **config:** do not require config file ([c8cc144](https://github.com/ionic-team/stencil/commit/c8cc144))


### Bug Fixes

* **entries:** component dependencies from module imports ([3eac82a](https://github.com/ionic-team/stencil/commit/3eac82a)), closes [#513](https://github.com/ionic-team/stencil/issues/513)
* **events:** ensure old events are removed ([ae68f98](https://github.com/ionic-team/stencil/commit/ae68f98)), closes [#500](https://github.com/ionic-team/stencil/issues/500)
* **minify:** minify chunks ([897f29b](https://github.com/ionic-team/stencil/commit/897f29b)), closes [#518](https://github.com/ionic-team/stencil/issues/518)
* **platform-client:** observedAttributes ([38c9201]


<a name="0.4.1"></a>
## [0.4.1](https://github.com/ionic-team/stencil/compare/v0.4.0...v0.4.1) (2018-02-09)


### Bug Fixes

* **distribution:** only copy distribution assets for generateDistribution ([09c6ea4](https://github.com/ionic-team/stencil/commit/09c6ea4))
* **init:** componentDidLoad called twice ([a49f1a6](https://github.com/ionic-team/stencil/commit/a49f1a6)), closes [#498](https://github.com/ionic-team/stencil/issues/498)
* **render:** State updates in componentWillLoad should not cause render ([9f7061d](https://github.com/ionic-team/stencil/commit/9f7061d)), closes [#449](https://github.com/ionic-team/stencil/issues/449)



<a name="0.4.0-0"></a>
# [0.4.0-0](https://github.com/ionic-team/stencil/compare/v0.3.0...v0.4.0) (2018-02-08)


### Breaking Changes

1. `www` directory is always emptied of all files and directories when a build starts. The `www` directory is now only a distribution directory, and should not be used to for production static source files. If an app has static source files that need to be copied to the `www` directory, please use the `src/assets` directory instead. Files within `src/assets` will automatically get copied to `www/assets` during the build.
2. `config.bundles` is no longer required. However, if the `config.bundles` is left within `stencil.config.js`, and that config didn't correctly have all the app's required components, then some components won't render. It's best to just remove `config.bundles` entirely since `0.4.0`.
3. App's root `tsconfig.json` file is used directly by stencil for further configuration during build. [See PR 451](https://github.com/ionic-team/stencil/pull/451). There may be settings within an app's existing tsconfig that didn't error out previous, but now would. But this is a good thing.


### Features

* **build:** default enableCache to true ([c75ac33](https://github.com/ionic-team/stencil/commit/c75ac33))
* **components:** componentOnReady() ([#479](https://github.com/ionic-team/stencil/issues/479)) ([f5a32ba](https://github.com/ionic-team/stencil/commit/f5a32ba))
* **config:** optionally set config values from functions, and test correct case ([d6e754a](https://github.com/ionic-team/stencil/commit/d6e754a))
* **config:** read user tsconfig for path resolution ([16d9008](https://github.com/ionic-team/stencil/commit/16d9008))
* **graph:** auto-gen bundles through component dependency graph ([78f0f59](https://github.com/ionic-team/stencil/commit/78f0f59))
* **polyfill:** add Element.remove() polyfill to es5 builds ([833a8da](https://github.com/ionic-team/stencil/commit/833a8da))
* **stats:** write build log and build stats options ([5f7e0b8](https://github.com/ionic-team/stencil/commit/5f7e0b8))


### Bug Fixes

* **build:** avoid using Object.entries (breaks Node 6) ([8283df7](https://github.com/ionic-team/stencil/commit/8283df7)), closes [#463](https://github.com/ionic-team/stencil/issues/463)
* **build:** fix es5 dev mode build message ([5ec6884](https://github.com/ionic-team/stencil/commit/5ec6884)), closes [#492](https://github.com/ionic-team/stencil/issues/492)
* **context:** apply falsy context values ([f3ba32f](https://github.com/ionic-team/stencil/commit/f3ba32f)), closes [#483](https://github.com/ionic-team/stencil/issues/483)
* **copy:** wait for processCopyTaskDestDir execution ([900bbb8](https://github.com/ionic-team/stencil/commit/900bbb8))
* **cssvars:** ensure css var polyfill used only when no support ([863f3fc](https://github.com/ionic-team/stencil/commit/863f3fc))
* **ie:** add startsWith polyfill ([e60085c](https://github.com/ionic-team/stencil/commit/e60085c)), closes [#481](https://github.com/ionic-team/stencil/issues/481)
* **shadowdom:** ensure "encapsulation" is not property renamed in prod builds ([a93704a](https://github.com/ionic-team/stencil/commit/a93704a)), closes [#419](https://github.com/ionic-team/stencil/issues/419)
* **slot:** insertBefore reference to old elm parentNode, also use remove() ([e380517](https://github.com/ionic-team/stencil/commit/e380517)), closes [#395](https://github.com/ionic-team/stencil/issues/395)
* **styles:** two different modes for the same component on the same page ([1d7c2f7](https://github.com/ionic-team/stencil/commit/1d7c2f7)), closes [#480](https://github.com/ionic-team/stencil/issues/480)
* **svg:** fix rendering entire svg ([1d73aa6](https://github.com/ionic-team/stencil/commit/1d73aa6)), closes [#448](https://github.com/ionic-team/stencil/issues/448)
* **svg:** isSvgMode must be reset when an svg node is patched ([50a088d](https://github.com/ionic-team/stencil/commit/50a088d)), closes [#503](https://github.com/ionic-team/stencil/issues/503)
* **transpile:** ensure initial transpile stays at es2015 target ([4545e9d](https://github.com/ionic-team/stencil/commit/4545e9d))
* **transpile:** validate tsconfig after merging user tsconfig ([dc2b087](https://github.com/ionic-team/stencil/commit/dc2b087))
* **types:** only add component type globals when there are components ([06cc217](https://github.com/ionic-team/stencil/commit/06cc217))
* **watcher:** limit rebuilds within a short period of time ([3683d85](https://github.com/ionic-team/stencil/commit/3683d85))
* **watcher:** recopy asset changes and index.html changes ([ec1f16e](https://github.com/ionic-team/stencil/commit/ec1f16e))


<a name="0.3.0"></a>
# [0.3.0](https://github.com/ionic-team/stencil/compare/v0.2.3...v0.3.0) (2018-02-05)


### Features

* **ES Modules:** load modules through native ES Modules ([#162](https://github.com/ionic-team/stencil/issues/162)) ([c3524a94](https://github.com/ionic-team/stencil/commit/c3524a94c2402ce47fdfdda7012854f3b0081817))
* **watch:** add pcss to recognized web dev extensions ([#477](https://github.com/ionic-team/stencil/issues/477)) ([f783273](https://github.com/ionic-team/stencil/commit/f783273))


### Bug Fixes

* **config:** fixes absolutizing of wwwIndexHtml ([#470](https://github.com/ionic-team/stencil/issues/470)) ([81dde18](https://github.com/ionic-team/stencil/commit/81dde18))
* **styles:** always place component styles below prerender/visibility styles ([8ed47b9](https://github.com/ionic-team/stencil/commit/8ed47b9))
* **sw:** build service worker after built fs commit ([9ea7235](https://github.com/ionic-team/stencil/commit/9ea7235))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/ionic-team/stencil/compare/v0.2.2...v0.2.3) (2018-01-24)


### Features

* **test:** add test transpile fn interface ([d68fffb](https://github.com/ionic-team/stencil/commit/d68fffb))


### Bug Fixes

* **attribute:** attr name from toDashCase of property name ([28740be](https://github.com/ionic-team/stencil/commit/28740be))
* **build:** update uglify-es to 3.3.8 ([690759d](https://github.com/ionic-team/stencil/commit/690759d))
* **compiler:** avoid global JSX namespace collisions ([9c1e721](https://github.com/ionic-team/stencil/commit/9c1e721))
* **test:** fix unit test hydration ([122b1cd](https://github.com/ionic-team/stencil/commit/122b1cd)), closes [#441](https://github.com/ionic-team/stencil/issues/441)
* **watcher:** ensure duplicate builds are not started ([b3d6cf2](https://github.com/ionic-team/stencil/commit/b3d6cf2))
* **watcher:** ensure duplicate paths are not added to queue ([767b879](https://github.com/ionic-team/stencil/commit/767b879))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/ionic-team/stencil/compare/v0.2.1...v0.2.2) (2018-01-23)


### Bug Fixes

* **core:** fix core js request for namespace w/ dash ([be074db](https://github.com/ionic-team/stencil/commit/be074db)), closes [#421](https://github.com/ionic-team/stencil/issues/421)
* **cssvars:** fix IE11 css vars ([31f4083](https://github.com/ionic-team/stencil/commit/31f4083)), closes [#422](https://github.com/ionic-team/stencil/issues/422)
* **fs:** clear file cache on change/add for non-web dev files ([f817109](https://github.com/ionic-team/stencil/commit/f817109))
* **render:** handle runtime errors within render() ([5a224d5](https://github.com/ionic-team/stencil/commit/5a224d5)), closes [#370](https://github.com/ionic-team/stencil/issues/370)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/ionic-team/stencil/compare/v0.2.0...v0.2.1) (2018-01-23)


### Bug Fixes

* **watch:** rebuild from copy task file changes ([e2a8632](https://github.com/ionic-team/stencil/commit/e2a8632))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/ionic-team/stencil/compare/v0.1.6...v0.2.0) (2018-01-22)


### Features

* **fs:** in-memory filesystem and caching updates ([7ad25bd](https://github.com/ionic-team/stencil/commit/7ad25bd)
* **plugins:** init plugins ([55827cc](https://github.com/ionic-team/stencil/commit/55827cc))
* **watch:** add member name as 3rd arg ([5bc261c](https://github.com/ionic-team/stencil/commit/5bc261c))


### Bug Fixes

* **async:** fix async writes ([614bb97](https://github.com/ionic-team/stencil/commit/614bb97))
* **build:** ensure stencil imports are removed from older collections ([9df9d7e](https://github.com/ionic-team/stencil/commit/9df9d7e))
* **bundle:** fix config.collections includeBundledOnly ([8b6fd11](https://github.com/ionic-team/stencil/commit/8b6fd11)), closes [#426](https://github.com/ionic-team/stencil/issues/426)
* **copy:** copy to distribution directory option ([267a66c](https://github.com/ionic-team/stencil/commit/267a66c)), closes [#246](https://github.com/ionic-team/stencil/issues/246)
* **fs:** remove queue delete when copying ([55f7aee](https://github.com/ionic-team/stencil/commit/55f7aee))
* **style:** handle octal escape sequences w/in compiled css ([40a030e](https://github.com/ionic-team/stencil/commit/40a030e))
* **watch:** correct globalStyle path on rebuild ([4843801](https://github.com/ionic-team/stencil/commit/4843801)), closes [#430](https://github.com/ionic-team/stencil/issues/430)
* **watcher:** always initWatcher ([70c27fd](https://github.com/ionic-team/stencil/commit/70c27fd))
* **ssr:** polyfill "Element.prototype.closest" on jsdom ([58d48ad](https://github.com/ionic-team/stencil/commit/58d48ad)), closes [#437](https://github.com/ionic-team/stencil/issues/437)



<a name="0.1.6"></a>
## [0.1.6](https://github.com/ionic-team/stencil/compare/v0.1.5...v0.1.6) (2018-01-18)


### Bug Fixes

* **loader:** detect dynamic import ([e4e2dc2](https://github.com/ionic-team/stencil/commit/e4e2dc2))
* **service-worker:** correct checks for service worker in dev mode ([9a3cce3](https://github.com/ionic-team/stencil/commit/9a3cce3))
* **service-worker:** workaround for a bug in workbox ([3bb761d](https://github.com/ionic-team/stencil/commit/3bb761d))
* **serviceworker:** Compiler prevents use of service worker in dev mode when forced ([#423](https://github.com/ionic-team/stencil/issues/423)) ([0704d05](https://github.com/ionic-team/stencil/commit/0704d05))
* **svg:** html after a svg node fails to render ([7ffb4ef](https://github.com/ionic-team/stencil/commit/7ffb4ef)), closes [#375](https://github.com/ionic-team/stencil/issues/375)



<a name="0.1.5"></a>
## [0.1.5](https://github.com/ionic-team/stencil/compare/v0.1.4...v0.1.5) (2018-01-16)


### Features

* **listeners:** enableListener accepts passive option ([1275327](https://github.com/ionic-team/stencil/commit/1275327))


### Performance Improvements

* **sw:** serviceWorker script is minified ([76bcc52](https://github.com/ionic-team/stencil/commit/76bcc52))


### Bug Fixes

* **events:** Event() options ([e1662a5](https://github.com/ionic-team/stencil/commit/e1662a5)), closes [#406](https://github.com/ionic-team/stencil/issues/406)
* **listeners:** addListenerEvent() options check ([1275327](https://github.com/ionic-team/stencil/commit/1275327))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/ionic-team/stencil/compare/v0.1.3...v0.1.4) (2018-01-12)


### Bug Fixes

* ensure node env vars are replaced with rollup plugin. ([688fc88](https://github.com/ionic-team/stencil/commit/688fc88))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/ionic-team/stencil/compare/v0.1.2...v0.1.3) (2018-01-11)


### Bug Fixes

* **styles:** styles applied in browsers using the legacy client ([d6bc15e](https://github.com/ionic-team/stencil/commit/d6bc15e))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/ionic-team/stencil/compare/v0.1.1...v0.1.2) (2018-01-09)

### Bug Fixes

* Call `@Watch` after property has been set
* Fix submodule references, such as `@stencil/core/tesing`


<a name="0.1.1"></a>
## [0.1.1](https://github.com/ionic-team/stencil/compare/v0.1.1-0...v0.1.1) (2018-01-09)

### Features

* Component output is now an ES module.
* Dynamic `import()` instead of global jsonp callbacks.
* ES5 and jsonp callback modules are still built for IE11 and server-side rendering.
* Component metadata is now stored within `static` properties on the component class.

### Breaking Changes

* `@Watch` decorator has replaced both `@PropWillChange` and `@PropDidChange`. Previous decorators will continue to work.


### Bug Fixes

* **loader:** fix incorrect feature detection ([db277a1](https://github.com/ionic-team/stencil/commit/db277a1))
* **serviceworker:** updating to workbox 3.0 ([63b2f1c](https://github.com/ionic-team/stencil/commit/63b2f1c))
* **testing:** fix preprocessor to only process .tsx files w/ transforms, .ts with vanilla typescript, and .d.ts to be ignored ([80f4d49](https://github.com/ionic-team/stencil/commit/80f4d49))



<a name="0.1.1-0"></a>
## [0.1.1-0](https://github.com/ionic-team/stencil/compare/v0.1.0...v0.1.1-0) (2017-12-22)


### Bug Fixes

* correct metadata in testing. fixes [#355](https://github.com/ionic-team/stencil/issues/355) ([6b19e6b](https://github.com/ionic-team/stencil/commit/6b19e6b))
* correct transpile test to not use absolute paths. ([aa58050](https://github.com/ionic-team/stencil/commit/aa58050))
* **helpers:** fix dash case and pascal case helpers ([cf0e38a](https://github.com/ionic-team/stencil/commit/cf0e38a))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/ionic-team/stencil/compare/v0.0.9-4...v0.1.0) (2017-12-20)


### Bug Fixes

* **distribution:** improve types distribution error ([5083ff1](https://github.com/ionic-team/stencil/commit/5083ff1))


### Features

* **serviceworker:** emit event when a new service worker is installed ([#368](https://github.com/ionic-team/stencil/issues/368)) ([2e3799c](https://github.com/ionic-team/stencil/commit/2e3799c))
