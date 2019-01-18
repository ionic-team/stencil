<a name="0.17.0"></a>
# 🔑 [0.17.0](https://github.com/ionic-team/stencil/compare/v0.16.4...v0.17.0) (2019-01-18)


### Bug Fixes

* **bundle:** force resolve@1.8.1 dep for rollup-plugin-node-resolve ([640de93](https://github.com/ionic-team/stencil/commit/640de93))
* **css:** disable MergeLonghand ([c208c60](https://github.com/ionic-team/stencil/commit/c208c60))
* **events:** ensure both listen decorator and jsx can assign same event ([42fa73a](https://github.com/ionic-team/stencil/commit/42fa73a))
* **events:** remove event listeners after lifecycle hook call ([#1293](https://github.com/ionic-team/stencil/issues/1293)) ([49b75d8](https://github.com/ionic-team/stencil/commit/49b75d8))
* **global:** ensure ts files are mapped to js ([b5ec9ea](https://github.com/ionic-team/stencil/commit/b5ec9ea))


### Features

* **rollup:** update to rollup 1.1.0 and rollup-plugin-node-resolve 4.0.0
* **puppeteer:** update to puppeteer 1.11.0
* **e2e:** add remote chrome support for puppeteer ([#1322](https://github.com/ionic-team/stencil/issues/1322)) ([18f6e9d](https://github.com/ionic-team/stencil/commit/18f6e9d))



<a name="0.16.4"></a>
## 🚘 [0.16.4](https://github.com/ionic-team/stencil/compare/v0.16.3...v0.16.4) (2019-01-15)


### Features

* **docs:** expose JSdocs tags ([#1319](https://github.com/ionic-team/stencil/issues/1319)) ([c726727](https://github.com/ionic-team/stencil/commit/c726727))


### Performance Improvements

* **css:** reenable MergeLonghand CSS optimization ([cbd3579](https://github.com/ionic-team/stencil/commit/cbd3579))



<a name="0.16.3"></a>
## ⚽️ [0.16.3](https://github.com/ionic-team/stencil/compare/v0.16.2...v0.16.3) (2019-01-14)


### Bug Fixes

* **angular:** this.el should not be exposed in types ([a82c8df](https://github.com/ionic-team/stencil/commit/a82c8df))


### Features

* **docs:** expose encapsulation ([e39268a](https://github.com/ionic-team/stencil/commit/e39268a))



<a name="0.16.2"></a>
## 🐣 [0.16.2](https://github.com/ionic-team/stencil/compare/v0.16.1...v0.16.2) (2019-01-07)

### Bug Fixes

* **amd:** fix amd module loading for modules w/out dependencies ([e040b7a](https://github.com/ionic-team/stencil/commit/e040b7a))
* **amd:** fix amd module without deps ([1213da3](https://github.com/ionic-team/stencil/commit/1213da3))
* **docs:** markdown event docs emit the type, not detail ([5878850](https://github.com/ionic-team/stencil/commit/5878850))
* **rollup:** update rollup ([4ce1008](https://github.com/ionic-team/stencil/commit/4ce1008))
* **ts:** update ts 3.2
* **angular:** do not emit internal components ([37e63e0](https://github.com/ionic-team/stencil/commit/37e63e0))
* **angular:** do not emit proxies for internal APIs ([7612fa0](https://github.com/ionic-team/stencil/commit/7612fa0))
* **angular:** angular uses es2015 🤷‍♂️ ([d0d215c](https://github.com/ionic-team/stencil/commit/d0d215c))
* **docs:** emit required metadata for props ([789e973](https://github.com/ionic-team/stencil/commit/789e973))
* **docs:** filter internal components ([040cacc](https://github.com/ionic-team/stencil/commit/040cacc))
* **listen:** ensure window events from Listen decorator are captured ([be49235](https://github.com/ionic-team/stencil/commit/be49235))
* **sys:** fix node resolving module w/out package.json main ([39b5d71](https://github.com/ionic-team/stencil/commit/39b5d71))

### Performance Improvements

* **angular:** emit fast proxies ([e48cf84](https://github.com/ionic-team/stencil/commit/e48cf84))
* **loader:** mark as sideEffect free ([4321cf0](https://github.com/ionic-team/stencil/commit/4321cf0))

### Features

* **angular:** emit proxies utils in a different file ([3377bc8](https://github.com/ionic-team/stencil/commit/3377bc8))



<a name="0.16.1"></a>
## 🐠 [0.16.1](https://github.com/ionic-team/stencil/compare/v0.16.0...v0.16.1) (2018-12-13)

### Bug Fixes

* **angular:** also update class name ([483a269](https://github.com/ionic-team/stencil/commit/483a269))
* **angular:** sort using tag-name ([24c9448](https://github.com/ionic-team/stencil/commit/24c9448))
* **angular:** use PascalCase tagname as class name ([7c9702a](https://github.com/ionic-team/stencil/commit/7c9702a))
* **console:** do not drop console for prod builds ([bcf4219](https://github.com/ionic-team/stencil/commit/bcf4219))
* **core:** always include svg support ([5308931](https://github.com/ionic-team/stencil/commit/5308931))
* **css-vars:** do not property rename css vars shim removeHost ([6ec39fb](https://github.com/ionic-team/stencil/commit/6ec39fb)), closes [#1285](https://github.com/ionic-team/stencil/issues/1285)
* **css-vars:** ensure shim initialized before defining components ([87c0b2e](https://github.com/ionic-team/stencil/commit/87c0b2e))
* **docs:** do not serialize path metadata ([a7d5e3a](https://github.com/ionic-team/stencil/commit/a7d5e3a))
* **docs:** generate component docs based in readme by default ([3612a05](https://github.com/ionic-team/stencil/commit/3612a05))
* **esm:** expose defineCustomElement() ([5d730ad](https://github.com/ionic-team/stencil/commit/5d730ad))
* **esm:** generate esm/es2017 correctly ([5ab6beb](https://github.com/ionic-team/stencil/commit/5ab6beb))
* **esm:** shortcut index should point to valid esm ([e4e5cca](https://github.com/ionic-team/stencil/commit/e4e5cca))
* **shadow:** ensure es5 build checks shadowRoot ([c5f9257](https://github.com/ionic-team/stencil/commit/c5f9257))
* **workers:** detect number of CPUs correctly ([b5f9ddc](https://github.com/ionic-team/stencil/commit/b5f9ddc))


### Features

* generate experimental web-components.json ([#1256](https://github.com/ionic-team/stencil/issues/1256)) ([8924561](https://github.com/ionic-team/stencil/commit/8924561))
* **loader:** add exclude option ([ea289f3](https://github.com/ionic-team/stencil/commit/ea289f3))
* **prerender:** Adding the prerender-external cli flag ([686c277](https://github.com/ionic-team/stencil/commit/686c277))


### Performance Improvements

* **build:** esm build without es5 ([fae97dd](https://github.com/ionic-team/stencil/commit/fae97dd))
* **bundling:** rollup cache + non-treeshake ([b7d2342](https://github.com/ionic-team/stencil/commit/b7d2342))
* **css-vars:** remove empty selector regex ([cb0b271](https://github.com/ionic-team/stencil/commit/cb0b271))
* **fs:** use Map ([f03ec9d](https://github.com/ionic-team/stencil/commit/f03ec9d))



<a name="0.16.0"></a>
# 🏀 [0.16.0](https://github.com/ionic-team/stencil/compare/v0.15.2...v0.16.0) (2018-11-29)

### Features

* **build:** conditionally include client side prerender hydration ([badf06f](https://github.com/ionic-team/stencil/commit/badf06f))
* **build:** conditionally include slot polyfill ([582ff53](https://github.com/ionic-team/stencil/commit/582ff53))
* **build:** conditionally include svg build features ([7d2e2df](https://github.com/ionic-team/stencil/commit/7d2e2df))
* **docs:** custom docs generators ([#1227](https://github.com/ionic-team/stencil/issues/1227)) ([1c08e90](https://github.com/ionic-team/stencil/commit/1c08e90))
* **docs:** generate api data ([2db19d3](https://github.com/ionic-team/stencil/commit/2db19d3))
* **docs:** include usages in the markdown ([#1254](https://github.com/ionic-team/stencil/issues/1254)) ([300df72](https://github.com/ionic-team/stencil/commit/300df72))
* **prop:** extract default value of props ([8bed57e](https://github.com/ionic-team/stencil/commit/8bed57e))
* **types:** add support for JSX required props ([#1199](https://github.com/ionic-team/stencil/issues/1199)) ([3f39b1b](https://github.com/ionic-team/stencil/commit/3f39b1b))
* **typescript:** update typescript ([127f0d5](https://github.com/ionic-team/stencil/commit/127f0d5))


### Performance Improvements

* **minify:** remove h() function when not used ([972cf6f](https://github.com/ionic-team/stencil/commit/972cf6f))
* **queue:** remove queue when it's not updatable ([9b18a97](https://github.com/ionic-team/stencil/commit/9b18a97))
* **styles:** remove logic for modes ([3119bbb](https://github.com/ionic-team/stencil/commit/3119bbb))


### Bug Fixes

* **angular:** fix error in strict mode ([09cff8b](https://github.com/ionic-team/stencil/commit/09cff8b))
* **build:** fix mode and resourceUrl ([9d79013](https://github.com/ionic-team/stencil/commit/9d79013))
* **bundling:** fix bundling node resolved import when using browser entry ([c78fe51](https://github.com/ionic-team/stencil/commit/c78fe51)), closes [#1185](https://github.com/ionic-team/stencil/issues/1185)
* **css-vars:** fix css vars polyfill for ie11 using defineCustomElements() ([7ce800b](https://github.com/ionic-team/stencil/commit/7ce800b))
* **esm:** fix global script for esm ([39940f3](https://github.com/ionic-team/stencil/commit/39940f3))
* **htmlFor:** remove htmlfor from jsx attributes ([d4b35a9](https://github.com/ionic-team/stencil/commit/d4b35a9)), closes [#1183](https://github.com/ionic-team/stencil/issues/1183)
* **jsx:** fix jsx htmlfor incompatibility ([2022ca5](https://github.com/ionic-team/stencil/commit/2022ca5))
* **mock-doc:** fix Event and CustomEvent eventInitDict ([32c5737](https://github.com/ionic-team/stencil/commit/32c5737)), closes [#1206](https://github.com/ionic-team/stencil/issues/1206)
* **mode:** ensure multiple component modes can async load ([d7d1914](https://github.com/ionic-team/stencil/commit/d7d1914))
* **test:** add getBoundingClientRect() to mock-doc ([88292c0](https://github.com/ionic-team/stencil/commit/88292c0)), closes [#1198](https://github.com/ionic-team/stencil/issues/1198)
* **types:** fix signature for classList.contains ([193cc6e](https://github.com/ionic-team/stencil/commit/193cc6e)), closes [#1207](https://github.com/ionic-team/stencil/issues/1207)
* **polyfill:** add array.fill() polyfill ([#1230](https://github.com/ionic-team/stencil/issues/1230)) ([7042932](https://github.com/ionic-team/stencil/commit/7042932))
* **testing:** do not ignore docs dir output ([7656292](https://github.com/ionic-team/stencil/commit/7656292))
* **esm:** fix minify es5 for esm ([5d8154c](https://github.com/ionic-team/stencil/commit/5d8154c))
* **host:** no mode still needs the mode to be set ([784c32a](https://github.com/ionic-team/stencil/commit/784c32a))
* **types:** resolve more types in docs ([bb48234](https://github.com/ionic-team/stencil/commit/bb48234))



<a name="0.15.2"></a>
## 🌯 [0.15.2](https://github.com/ionic-team/stencil/compare/v0.15.1...v0.15.2) (2018-11-01)

### Bug Fixes

* **compiler:** fix doc generation issue for windows ([#1195](https://github.com/ionic-team/stencil/issues/1195)) ([56c4185](https://github.com/ionic-team/stencil/commit/56c4185))
* **css:** disable postcss merge-longhand due to css vars bug ([2c081e5](https://github.com/ionic-team/stencil/commit/2c081e5))
* **e2e:** throw errors for 404 tests ([d83beb8](https://github.com/ionic-team/stencil/commit/d83beb8))
* **exit:** integrate exit module ([3557a4a](https://github.com/ionic-team/stencil/commit/3557a4a))
* **fs:** integrate graceful-fs ([af78764](https://github.com/ionic-team/stencil/commit/af78764)), closes [#1126](https://github.com/ionic-team/stencil/issues/1126)
* **lifecycle:** fix componentWillUpdate build conditional ([14f5e29](https://github.com/ionic-team/stencil/commit/14f5e29)), closes [#1193](https://github.com/ionic-team/stencil/issues/1193)
* **polyfill:** ensure promise polyfill applied for ie11 ([414fc55](https://github.com/ionic-team/stencil/commit/414fc55)), closes [#1188](https://github.com/ionic-team/stencil/issues/1188)
* **queue:** allow option to disable async queue ([#1186](https://github.com/ionic-team/stencil/issues/1186)) ([373e58c](https://github.com/ionic-team/stencil/commit/373e58c))
* **sass:** fix style rebuild from sass import change ([e86812b](https://github.com/ionic-team/stencil/commit/e86812b)), closes [#1019](https://github.com/ionic-team/stencil/issues/1019)



<a name="0.15.1"></a>
## 🤓 [0.15.1](https://github.com/ionic-team/stencil/compare/v0.15.0...v0.15.1) (2018-10-30)


### Features

* **profile:** add build condition performance marks and measures behind --profile flag ([265154f](https://github.com/ionic-team/stencil/commit/265154f))


### Bug Fixes

* **dev-server:** fix gzip response ([5b6b692](https://github.com/ionic-team/stencil/commit/5b6b692))
* **dev-server:** fix historyApiFallback disableDotRule ([af47de4](https://github.com/ionic-team/stencil/commit/af47de4)), closes [#1108](https://github.com/ionic-team/stencil/issues/1108)
* **polyfill:** add Number.isFinite, Number.isNaN, Number.isInteger ([4e54f85](https://github.com/ionic-team/stencil/commit/4e54f85)), closes [#1009](https://github.com/ionic-team/stencil/issues/1009)
* **test:** fix jest reporter config ([53998f5](https://github.com/ionic-team/stencil/commit/53998f5)), closes [#1160](https://github.com/ionic-team/stencil/issues/1160)
* **testing:** do not empty dist directory for tests ([ed282b9](https://github.com/ionic-team/stencil/commit/ed282b9)), closes [#1184](https://github.com/ionic-team/stencil/issues/1184)


<a name="0.15.0"></a>
# 🏇 [0.15.0](https://github.com/ionic-team/stencil/compare/v0.14.2...v0.15.0) (2018-10-24)

### Bug Fixes

* **autoprefix:** handle true value as autoprefixCss config ([50b9b88](https://github.com/ionic-team/stencil/commit/50b9b88))
* **build:** fix month in build timestamp ([#1177](https://github.com/ionic-team/stencil/issues/1177)) ([448a7d9](https://github.com/ionic-team/stencil/commit/448a7d9))
* **css:** cssnano for minifying css, and optimize postcss and autoprefixer ([7e6a55c](https://github.com/ionic-team/stencil/commit/7e6a55c)), closes [#1152](https://github.com/ionic-team/stencil/issues/1152)
* **event:** fix CustomEvent polyfill ([e22fd30](https://github.com/ionic-team/stencil/commit/e22fd30)), closes [#1173](https://github.com/ionic-team/stencil/issues/1173)
* **polyfill:** add Array.prototype.findIndex polyfill ([6015be8](https://github.com/ionic-team/stencil/commit/6015be8)), closes [#1179](https://github.com/ionic-team/stencil/issues/1179)



<a name="0.14.2"></a>
## 💍 [0.14.2](https://github.com/ionic-team/stencil/compare/v0.14.1...v0.14.2) (2018-10-23)


### Bug Fixes

* **clean-css:** update to clean-css 4.2.1 ([6a648d7](https://github.com/ionic-team/stencil/commit/6a648d7))
* **css-vars:** fix removing inline css variables ([9fcd7ee](https://github.com/ionic-team/stencil/commit/9fcd7ee)), closes [#1159](https://github.com/ionic-team/stencil/issues/1159)
* **hmr:** fix hmr styles updates with escaped characters ([db2456a](https://github.com/ionic-team/stencil/commit/db2456a)), closes [#1156](https://github.com/ionic-team/stencil/issues/1156)
* **service-worker:** do not default to sw cache ico, png, and svg files ([822c7b3](https://github.com/ionic-team/stencil/commit/822c7b3)), closes [#1164](https://github.com/ionic-team/stencil/issues/1164)
* **service-worker:** do not sw cache legacy bundles ([93e16b1](https://github.com/ionic-team/stencil/commit/93e16b1)), closes [#1006](https://github.com/ionic-team/stencil/issues/1006)



<a name="0.14.1"></a>
## 🍐 [0.14.1](https://github.com/ionic-team/stencil/compare/v0.14.0...v0.14.1) (2018-10-19)

### Features

* **event:** get event from EventEmitter.emit allow check on e.defaultPrevented ([#1162](https://github.com/ionic-team/stencil/issues/1162)) ([f04a8f1](https://github.com/ionic-team/stencil/commit/f04a8f1))
* **waitForEvent:** add page.waitForEvent() to e2e testing ([77d7b7c](https://github.com/ionic-team/stencil/commit/77d7b7c))


### Bug Fixes

* **pixelmatch:** fork pixelmatch to another process ([95ebbc1](https://github.com/ionic-team/stencil/commit/95ebbc1))
* **screenshot:** improve screenshot caching and memory usage ([d8f6112](https://github.com/ionic-team/stencil/commit/d8f6112))



<a name="0.14.0"></a>
# 🐳 [0.14.0](https://github.com/ionic-team/stencil/compare/v0.13.2...v0.14.0) (2018-10-16)

### Features

* **core:** reduce `@stencil/core` dependencies and package size
* **docs:** add component jsdoc to json docs ([#1125](https://github.com/ionic-team/stencil/issues/1125)) ([e3ae28b](https://github.com/ionic-team/stencil/commit/e3ae28b))
* **docs:** support [@param](https://github.com/param) and [@returns](https://github.com/returns) jsdoc tags ([#1131](https://github.com/ionic-team/stencil/issues/1131)) ([ec2e224](https://github.com/ionic-team/stencil/commit/ec2e224))
* **test:** add emulate cli arg to test specific emulate config ([10ce9cd](https://github.com/ionic-team/stencil/commit/10ce9cd))
* **test:** integrate test runner w/ builds ([92a3a71](https://github.com/ionic-team/stencil/commit/92a3a71))
* **docs:** prop types are resolved to primitive types ([4dc5c32](https://github.com/ionic-team/stencil/commit/4dc5c32))


### Bug Fixes

* **appload:** emit appload when no components in dom ([15fcfef](https://github.com/ionic-team/stencil/commit/15fcfef))
* **dev-server:** make iframe a block element to avoid unwanted space ([a1cb469](https://github.com/ionic-team/stencil/commit/a1cb469))
* minify esm-es5 to improve webpack perf ([e070507](https://github.com/ionic-team/stencil/commit/e070507))
* **angular:** do not update proxies in dev ([16ccb77](https://github.com/ionic-team/stencil/commit/16ccb77))
* **bundle:** add dev-only runtime helpers for node globals ([e098e00](https://github.com/ionic-team/stencil/commit/e098e00))
* **bundle:** do not bundle node globals/builtins ([1102b0b](https://github.com/ionic-team/stencil/commit/1102b0b))
* **bundle:** test for \0 ids ([45bf040](https://github.com/ionic-team/stencil/commit/45bf040))
* **cli:** print warning if --config path does not exist ([492402f](https://github.com/ionic-team/stencil/commit/492402f))
* **compiler:** reflectToAttrib is serialized to manifest ([4980042](https://github.com/ionic-team/stencil/commit/4980042))
* **config:** ensure allowSyntheticDefaultImports setting in tsconfig ([ba7c673](https://github.com/ionic-team/stencil/commit/ba7c673))
* **config:** ensure esModuleInterop setting in tsconfig ([be1c18d](https://github.com/ionic-team/stencil/commit/be1c18d))
* **config:** user's tsconfig is not parsed ([ca0b9fc](https://github.com/ionic-team/stencil/commit/ca0b9fc))
* **dist:** normalizePath for windows ([#1142](https://github.com/ionic-team/stencil/issues/1142)) ([93214ee](https://github.com/ionic-team/stencil/commit/93214ee))
* **docs:** support strict docs and [@internal](https://github.com/internal) tag ([1ba029a](https://github.com/ionic-team/stencil/commit/1ba029a))
* **docs:** escape markdown docs generation columns ([e06ebce](https://github.com/ionic-team/stencil/commit/e06ebce))
* **docs-json:** ensure docs-json flag applies to docs outputTarget ([dd9e7e6](https://github.com/ionic-team/stencil/commit/dd9e7e6))
* **e2e:** check if page closed ([4d25144](https://github.com/ionic-team/stencil/commit/4d25144))
* **loader:** avoid relative path in package.json ([a4892eb](https://github.com/ionic-team/stencil/commit/a4892eb))
* **log:** print out build errors from initial build ([196f302](https://github.com/ionic-team/stencil/commit/196f302))
* **methods:** add focus/blur back to blacklisted methods ([6ad1be1](https://github.com/ionic-team/stencil/commit/6ad1be1))
* **minified:** topLevel is not safe in ES5 ([8f17c32](https://github.com/ionic-team/stencil/commit/8f17c32))
* **mock-doc:** improve style attr parse/serialize ([a6d4a1c](https://github.com/ionic-team/stencil/commit/a6d4a1c))
* **package:** ensure compatible [@types](https://github.com/types)/node with typescript ([fb5f76f](https://github.com/ionic-team/stencil/commit/fb5f76f))
* **polyfill:** add polyfill for Object.values() ([24f637e](https://github.com/ionic-team/stencil/commit/24f637e)), closes [#1098](https://github.com/ionic-team/stencil/issues/1098)
* **render:** add slot css class in scoped mode ([a0c6f07](https://github.com/ionic-team/stencil/commit/a0c6f07))
* **resolve:** fix bundled node resolved plugin ([dfc3c19](https://github.com/ionic-team/stencil/commit/dfc3c19))
* **rollup:** improve rollup error logging ([0b64d5f](https://github.com/ionic-team/stencil/commit/0b64d5f))
* **runtime:** remove node globals runtime helpers ([c4eddf0](https://github.com/ionic-team/stencil/commit/c4eddf0))
* **screenshot:** ensure masterBuild data ([8ee4a56](https://github.com/ionic-team/stencil/commit/8ee4a56))
* **screenshot:** disable GPU and antialiasing ([cab2b87](https://github.com/ionic-team/stencil/commit/cab2b87))
* **screenshot:** provide compare url and update base connector ([3bbd609](https://github.com/ionic-team/stencil/commit/3bbd609))
* **test:** do not print tsconfig errors during testing ([83ecade](https://github.com/ionic-team/stencil/commit/83ecade))
* **test:** mock e2e test data when not doing screenshot tests ([339d842](https://github.com/ionic-team/stencil/commit/339d842))
* **testing:** parse user tsconfig for unit tests ([7c8fc4f](https://github.com/ionic-team/stencil/commit/7c8fc4f))
* **tsconfig:** parse tsconfig w/ comments ([e1b54ea](https://github.com/ionic-team/stencil/commit/e1b54ea))
* **tsconfig:** fix ts.findConfigFile ([d473d7a](https://github.com/ionic-team/stencil/commit/d473d7a))



<a name="0.13.2"></a>
## ⚡️ [0.13.2](https://github.com/ionic-team/stencil/compare/v0.13.1...v0.13.2) (2018-09-27)


### Bug Fixes

* **pixelmatch:** require pixelmatch within fn ([36a4b37](https://github.com/ionic-team/stencil/commit/36a4b37))



<a name="0.13.1"></a>
## 🐨 [0.13.1](https://github.com/ionic-team/stencil/compare/v0.13.0...v0.13.1) (2018-09-26)


### Bug Fixes

* **resolve:** ensure paths are normalized in NodeResolveModule ([80fda2a](https://github.com/ionic-team/stencil/commit/80fda2a))
* **screenshot:** ensure pixelmatch is installed ([1fba6c8](https://github.com/ionic-team/stencil/commit/1fba6c8))


### Features

* **testing:** --no-build flag to skip build before e2e testing ([110ccaa](https://github.com/ionic-team/stencil/commit/110ccaa))



<a name="0.13.0"></a>
# 🏁 [0.13.0](https://github.com/ionic-team/stencil/compare/v0.12.4...v0.13.0) (2018-09-26)

### Stencil Testing Features

Testing within Stencil is now broken up into two distinct types: Unit tests with [Jest](https://jestjs.io/), and End-to-end tests with [Puppeteer](https://pptr.dev/). Previous versions already used Jest, but Stencil provided a `TestWindow` and mocked the browser environment using JSDom.

With the latest changes, the browser environment for e2e testing is done using Puppeteer, which provides many advantages Stencil can start to incorporate into its builds later on. This means the previous testing methods using `TestWindow` has been removed in place of Puppeteer's API.

Unit testing is for testing small chunks of code at the lowest level. For example, when a method is given X, it should return Y. Unit tests should not be doing full rendering of the component, but rather focused on logic only. E2E tests would be testing rendering and components working together. For example, when `my-component` has the X attribute, the child component then renders the text Y, and expects to receive the event Z. By using Puppeteer for rendering tests (rather than a Node environment simulating how a browser works), your end-to-end tests are able to run within an actual browser in order to give better results.

Stencil also provides many utility functions to help test Jest and Puppeteer. For example, a component's shadow dom can now be queried and tested with the Stencil utility functions built on top of Puppeteer. Tests can not only be provided mock HTML content, but they can also go to URLs of your app which Puppeteer is able to open up and test on Stencil's dev server.

End-to-end tests require a fresh build, dev-server, and puppeteer browser instance created before the tests can actually run. With the added build complexities, the `stencil test` command is able to organize the build requirements beforehand.

Previously, the `jest` command was directly within an `npm` script, and Jest's config was within the app's `package.json` file. While this is certainly still doable, the `stencil test` command handles the build requirements, keeps configurations centralized in `stencil.config.ts`, and lazily installs Jest and Puppeteer when they're needed for the first time.

With this release, the `jest` config within the app's `package.json` file can be safely removed, and the `npm` `test` script can be set to `stencil test --spec` instead of `jest`. It's also recommended to add an `npm` script `test.e2e` pointing to `stencil test --e2e`. Note that both unit tests and end-to-end tests could be ran with the same command, such as `stencil test --spec --e2e`. Below would be a common setup:

```javascript
"scripts": {
  "test": "stencil test --spec",
  "test.watch": "stencil test --spec --watch",
  "test.e2e": "stencil test --e2e"
}
```

Providing a Jest config is no longer required and Stencil will apply defaults from data it has already gathered. For example, Stencil already knows what directories to look through, and what files are spec and e2e files. Jest can still be configured using the same config names, but now using the stencil config `testing` property. It's also recommended to use the typed version of stencil.config *.ts* so you'll be able to see the typed configs and descriptions.

```javascript
import { Config } from '@stencil/core';

export const config: Config = {
  testing: {
    testPathIgnorePatterns: [...]
  }
};
```


### Example E2E Test

```javascript
import { newE2EPage } from '@stencil/core/testing';

it('should create toggle, unchecked by default', async () => {
  const page = await newE2EPage();

  await page.setContent(`
    <ion-toggle class="pretty-toggle"></ion-toggle>
  `);

  const ionChange = await page.spyOnEvent('ionChange');

  const toggle = await page.find('ion-toggle');

  expect(toggle).toHaveClasses(['pretty-toggle', 'hydrated']);

  expect(toggle).not.toHaveClass('toggle-checked');

  toggle.setProperty('checked', true);

  await page.waitForChanges();

  expect(toggle).toHaveClass('toggle-checked');

  expect(ionChange).toHaveReceivedEventDetail({
    checked: true,
    value: 'on'
  });
});
```


### Async @Method

Stencil's architecture is async at all levels which allows for many performance benefits and ease of use. By ensuring publicly exposed methods using the `@Method` decorator return a promise:

* Developers can call methods before the implementation was downloaded without `componentOnReady()`, which queues the method calls and resolves after the component has finished loading.
* Interaction with the component is the same whether it still needs to be lazy-loaded, or is already fully hydrated.
* By keeping a component's public API async, apps could move the components transparently to web workers and the API would still be the same.
* Returning a promise is only required for publicly exposed methods which have the `@Method` decorator. All other component methods are private to the component and are not required to be async.

Also note, developers should try to rely on publicly exposed methods as little as possible, and instead default to using properties and events as much as possible. As an app scales, we've found it's easier to manage and pass data through `@Prop` rather than public methods.


### defineCustomElements()

Stencil injects `defineCustomElements()` into the generated collections so the generated web components can be easily consumed in projects that use a build system such as Webpack. For example, projects written using Angular or Vue.
We have been working to make it more performant and smaller while still providing transparent lazy loading out of the box.

This releases introduces a subtle change in how this function is exported. Previously it was exported in the main entry-point, but now it lives in its own entry-point. This entry point is called loader by default but that can be modified via the `stencil.config.ts` file.
This change will lead to much better tree-shaking and performance.

```diff
- import { defineCustomElements }  from 'my-collection';
+ import { defineCustomElements }  from 'my-collection/dist/loader';
```


### Features

* **bundle:** export esm-es2017 ([efd985d](https://github.com/ionic-team/stencil/commit/efd985d))
* **cli:** add prerelease warning ([5052fe2](https://github.com/ionic-team/stencil/commit/5052fe2))
* **compiler:** methods should return a promise ([98510d5](https://github.com/ionic-team/stencil/commit/98510d5))
* **e2e:** add isVisible() and waitForVisible() to e2e testing ([acb8cd6](https://github.com/ionic-team/stencil/commit/acb8cd6))
* **e2e:** add waitForNotVisible() to e2e testing ([8b10b56](https://github.com/ionic-team/stencil/commit/8b10b56))
* **e2e:** find element by text content ([309c250](https://github.com/ionic-team/stencil/commit/309c250))
* **e2e:** add dom api for e2e testing ([3a2a884](https://github.com/ionic-team/stencil/commit/3a2a884))
* **e2e:** test computed styles of an e2e element ([c1a613c](https://github.com/ionic-team/stencil/commit/c1a613c))
* **onReady:** onReady() resolves after app load/update finished ([bba5fbc](https://github.com/ionic-team/stencil/commit/bba5fbc))
* **puppeteer:** allow specification of Chrome executable ([6b80237](https://github.com/ionic-team/stencil/commit/6b80237))
* **screenshot:** compare screenshots against master during e2e tests ([892b8b1](https://github.com/ionic-team/stencil/commit/892b8b1))
* **serialize:** serialize pretty print html option ([c6e34b5](https://github.com/ionic-team/stencil/commit/c6e34b5))
* **testing:** e2e testing with puppeteer ([ad2c0d4](https://github.com/ionic-team/stencil/commit/ad2c0d4))
* **testing:** add toMatchClasses() ([bf4ff31](https://github.com/ionic-team/stencil/commit/bf4ff31))
* **docs:** skip private methods ([42bf7ce](https://github.com/ionic-team/stencil/commit/42bf7ce))


### Performance Improvements

* **bundle:** enable rollup optimizeChunks ([7e00230](https://github.com/ionic-team/stencil/commit/7e00230))
* **bundling:** improve cross encapsulation bundling ([3e181c1](https://github.com/ionic-team/stencil/commit/3e181c1))
* **core:** reduce size and improve runtime perf ([#787](https://github.com/ionic-team/stencil/issues/787)) ([8e94403](https://github.com/ionic-team/stencil/commit/8e94403))
* **dev:** shadow-dom polyfill is not needed in dev mode ([b3bfd9a](https://github.com/ionic-team/stencil/commit/b3bfd9a))
* **esm:** using webpack comments to reduce number of chunks ([91c9a09](https://github.com/ionic-team/stencil/commit/91c9a09))
* tune optimizeChunks integration ([518b425](https://github.com/ionic-team/stencil/commit/518b425))
* remove duplicated TS helpers ([1320afc](https://github.com/ionic-team/stencil/commit/1320afc))


### Bug Fixes

* **angular:** do not build dist ([5a3dfde](https://github.com/ionic-team/stencil/commit/5a3dfde))
* **bundle:** return undefined when something fails ([52e650a](https://github.com/ionic-team/stencil/commit/52e650a))
* **compiler:** emit optional token when appropriated ([#1050](https://github.com/ionic-team/stencil/issues/1050)) ([870a0fc](https://github.com/ionic-team/stencil/commit/870a0fc))
* **compiler:** esm index.js ([49e8a74](https://github.com/ionic-team/stencil/commit/49e8a74))
* **compiler:** mark any types correctly ([8c6bcd9](https://github.com/ionic-team/stencil/commit/8c6bcd9))
* **compiler:** no emit promise warning while testing ([fceb3a1](https://github.com/ionic-team/stencil/commit/fceb3a1))
* **compiler:** relax error for exports in Component files ([33fffe2](https://github.com/ionic-team/stencil/commit/33fffe2))
* **core:** the request of a dependency is an expression ([b3d2e75](https://github.com/ionic-team/stencil/commit/b3d2e75))
* **css-shim:** using class scoped CSS ([2b969cc](https://github.com/ionic-team/stencil/commit/2b969cc))
* **dev:** add dynamic and shadow-dom checks ([fd2016e](https://github.com/ionic-team/stencil/commit/fd2016e))
* **e2e:** fix button and user input interaction ([5be55c9](https://github.com/ionic-team/stencil/commit/5be55c9))
* **esm:** esm builds are enabled if es5=true ([8f4f30d](https://github.com/ionic-team/stencil/commit/8f4f30d))
* **esm:** treeshakable esm output ([62164b0](https://github.com/ionic-team/stencil/commit/62164b0))
* **host:** adds Component host deprecation warning ([9cd8e2e](https://github.com/ionic-team/stencil/commit/9cd8e2e))
* **platform:** scoped css check ([da796c4](https://github.com/ionic-team/stencil/commit/da796c4))
* **styles:** ensure styles added after meta[charset] ([2979f6e](https://github.com/ionic-team/stencil/commit/2979f6e))
* **styles:** insert styles after meta charset ([df40ca8](https://github.com/ionic-team/stencil/commit/df40ca8))
* **tslib:** rollup tslib in dist ([1b66f3b](https://github.com/ionic-team/stencil/commit/1b66f3b))
* **dev-server:** ensure dev-server web socket is open ([5d292c0](https://github.com/ionic-team/stencil/commit/5d292c0)), closes [#1013](https://github.com/ionic-team/stencil/issues/1013)
* **dev-server:** fix ie11 dev-server errors ([a43915f](https://github.com/ionic-team/stencil/commit/a43915f))
* **dom-api:** classList.add polyfill for IE11 svgs ([e451d88](https://github.com/ionic-team/stencil/commit/e451d88))
* **hydrated:** apply hydrated visibility to all components ([3c9c2d4](https://github.com/ionic-team/stencil/commit/3c9c2d4))
* **lifecycle:** run componentDidUpdate after all child cmps load ([12fcf75](https://github.com/ionic-team/stencil/commit/12fcf75))
* **testing:** handle errors ([2dc2bce](https://github.com/ionic-team/stencil/commit/2dc2bce))
* **validate:** not recommended pkg.module value ([c6c4281](https://github.com/ionic-team/stencil/commit/c6c4281))
* **lifecycle:** ensure es5 builds wait on returned lifecycle async/await ([c3a7655](https://github.com/ionic-team/stencil/commit/c3a7655))
* **prerender:** ensure that platform-server prerender follows amd format for require/exports. ([f5e5e0c](https://github.com/ionic-team/stencil/commit/f5e5e0c))
* **config:** ensure correct target/module tsconfig ([7c20d52](https://github.com/ionic-team/stencil/commit/7c20d52))
* **mock-doc:** check for text node nodeValue ([19f734e](https://github.com/ionic-team/stencil/commit/19f734e))
* **mock-doc:** do not escape script content ([2498835](https://github.com/ionic-team/stencil/commit/2498835))
* **mock-doc:** do not escape script innerHTML ([be1c43f](https://github.com/ionic-team/stencil/commit/be1c43f))
* **mock-doc:** fix document methods ([f8a96ff](https://github.com/ionic-team/stencil/commit/f8a96ff))
* **mock-doc:** fix serialize svg attrs ([107f6a9](https://github.com/ionic-team/stencil/commit/107f6a9))
* **mock-doc:** fix template content ([8a61a15](https://github.com/ionic-team/stencil/commit/8a61a15))
* **screenshot:** disable screenshot tests in e2e ([d530586](https://github.com/ionic-team/stencil/commit/d530586))
* **testing:** click returns a promise ([36ec6dd](https://github.com/ionic-team/stencil/commit/36ec6dd))
* **tslint:** tslint:disabled must be first line ([b21b432](https://github.com/ionic-team/stencil/commit/b21b432))



<a name="0.12.4"></a>
## 🏋 [0.12.4](https://github.com/ionic-team/stencil/compare/v0.12.3...v0.12.4) (2018-08-30)


### Bug Fixes

* move functional component definitions to file for external builds. ([4e17c9e](https://github.com/ionic-team/stencil/commit/4e17c9e))


### Features

* add rollup module info to stats and upgrade rollup. ([b6ee592](https://github.com/ionic-team/stencil/commit/b6ee592))



<a name="0.12.3"></a>
## 🎩 [0.12.3](https://github.com/ionic-team/stencil/compare/v0.12.2...v0.12.3) (2018-08-29)


### Bug Fixes

* **angular:** promisy types is not longer needed ([d6ba49b](https://github.com/ionic-team/stencil/commit/d6ba49b))



<a name="0.12.2"></a>
## 🚖 [0.12.2](https://github.com/ionic-team/stencil/compare/v0.12.2-0...v0.12.2) (2018-08-28)


### Bug Fixes

* correct rollup globals plugin to include the correct local path to the globals files. ([cf81429](https://github.com/ionic-team/stencil/commit/cf81429))


### Features

* add types to decorators to ensure that they are assigned correctly. ([99d058e](https://github.com/ionic-team/stencil/commit/99d058e))



<a name="0.12.1"></a>
## 🤘 [0.12.1](https://github.com/ionic-team/stencil/compare/v0.12.0...v0.12.1) (2018-08-27)


### Bug Fixes

* ensure all '@stencil/core' types are changed to './stencil.core' in components.d.ts file. ([638ad47](https://github.com/ionic-team/stencil/commit/638ad47))



<a name="0.12.0"></a>
# 🚑 [0.12.0](https://github.com/ionic-team/stencil/compare/v0.12.0-8...v0.12.0) (2018-08-27)


### Features

* **compiler:** adds more compiler checks ([6fa63fd](https://github.com/ionic-team/stencil/commit/6fa63fd))
* **URL:** add URL polyfill for ie11 ([8d07ee9](https://github.com/ionic-team/stencil/commit/8d07ee9))


### Bug Fixes

* **angular:** event emitters work programatically ([dabcf5e](https://github.com/ionic-team/stencil/commit/dabcf5e))
* **angular:** promisify methods ([0ad19de](https://github.com/ionic-team/stencil/commit/0ad19de))
* **angular:** using Component instead of Directive ([d3b3c80](https://github.com/ionic-team/stencil/commit/d3b3c80))
* **config:** add esModuleInterop ([2865fae](https://github.com/ionic-team/stencil/commit/2865fae))
* **escapeCssForJs:** test for string input ([297fa2e](https://github.com/ionic-team/stencil/commit/297fa2e))
* **method:** remove focus() and blur() from blacklist ([fbcc368](https://github.com/ionic-team/stencil/commit/fbcc368))
* **angular:** export local element interfaces to be used in angular type definitions. ([fc081a3](https://github.com/ionic-team/stencil/commit/fc081a3))
* **types:** export StencilComponents from core builds and all import to angular builds. ([#1033](https://github.com/ionic-team/stencil/issues/1033)) ([a8ba582](https://github.com/ionic-team/stencil/commit/a8ba582))
* **build:** move rollup node globals plugin local to resolve its issue with dynamic imports. ([ce72eb6](https://github.com/ionic-team/stencil/commit/ce72eb6))
* **build:** do not exclude **/test/** directory from build ([12f650d](https://github.com/ionic-team/stencil/commit/12f650d))
* **exports:** remap esm exports from collection directory to a local es5 directory. ([dbd8cac](https://github.com/ionic-team/stencil/commit/dbd8cac))
* **types:** move global type definitions of JSX into a projects component.d.ts file ([#1018](https://github.com/ionic-team/stencil/issues/1018)) ([7e4e501](https://github.com/ionic-team/stencil/commit/7e4e501))



<a name="0.11.4"></a>
## ⛰ [0.11.4](https://github.com/ionic-team/stencil/compare/v0.11.3...v0.11.4) (2018-08-12)

### Functional Component Interface change

This release includes a change to the interface of functional components. This change should make working with components simpler and more predictable.

Previously children were included with props as the first parameter in the components signature.  The change has moved children out into the second parameter.  You can now assume that children is always passed and its value will always be an array.  If there are no children the array lenght will be zero.

```diff
- const Component: FunctionalComponent<PropInterface> = ({ children, ...props}, utils) => {
+ const Component: FunctionalComponent<PropInterface> = (props, children, utils) => {
```

### Bug Fixes

* **types:** Update available config options for nodeResolveConfig to allow for string arrays. ([72dca29](https://github.com/ionic-team/stencil/commit/72dca29))


### Features

* **functional components:** add index and array to functional utility methods map and foreach. ([a3abc85](https://github.com/ionic-team/stencil/commit/a3abc85))



<a name="0.11.3"></a>
## 🔥 [0.11.3](https://github.com/ionic-team/stencil/compare/v0.11.2...v0.11.3) (2018-08-08)


### Bug Fixes

* **events:** prevent ael and rel property renaming ([509fca2](https://github.com/ionic-team/stencil/commit/509fca2))



<a name="0.11.2"></a>
## 🎯 [0.11.2](https://github.com/ionic-team/stencil/compare/v0.11.1...v0.11.2) (2018-08-07)


### Bug Fixes

* **testing:** ensure that testing files are getting Build conditionals propertly removed. ([f039aab](https://github.com/ionic-team/stencil/commit/f039aab))



<a name="0.11.1"></a>
## 🐝 [0.11.1](https://github.com/ionic-team/stencil/compare/v0.11.0...v0.11.1) (2018-08-06)


### Bug Fixes

* **angular:** disable tslint for generated code ([4ea8b9c](https://github.com/ionic-team/stencil/commit/4ea8b9c))


### Features

* **config:** expose limited rollup options for input and output. ([9f969a6](https://github.com/ionic-team/stencil/commit/9f969a6))


### Performance Improvements

* **components:** reduce size of components.d.ts distribution  ([e149120](https://github.com/ionic-team/stencil/commit/e149120))



<a name="0.11.0"></a>
# 🍇 [0.11.0](https://github.com/ionic-team/stencil/compare/v0.10.10...v0.11.0) (2018-07-31)

**Update stencil.config.js:**

```diff
- const sass = require('sass');
- const postcss = require('@stencil/postcss');
+ const { sass } = require('@stencil/sass');
+ const { postcss } = require('@stencil/postcss');
```

**Or migrate to strong typed configuration:**

- **Step 1:** rename
`stencil.config.js` => `stencil.config.ts`

- **Step 2:** use ES modules instead of commonjs

```ts
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import * as autoprefixer from 'autoprefixer';

export const config: Config = {
  plugins: [
    postcss({
      sass(),
      plugins: [autoprefixer()]
    })
  ]
};
```

> Using **stencil.config.ts** provides many DX improvements such as: autocompletion and documentation built into the IDE and detection of errors at compiler time!

**Example:** https://github.com/ionic-team/ionic-pwa-toolkit/blob/master/stencil.config.ts



### Features

* **config:** typed stencil.config.ts and config error reporting
* **config:** export public config interface ([b15d5e7](https://github.com/ionic-team/stencil/commit/b15d5e7))


### Refactor

* **prerender:** css scope ids as classnames instead of attributes
* **prerender:** use ssrc and ssrv attributes instead of data-ssrc and data-ssrv attributes
* **set-accesor:** boolean values ([aac503b](https://github.com/ionic-team/stencil/commit/aac503b))



### Bug Fixes

* **cache:** bust fs cache for internal encapsulation rename ([9db7d49](https://github.com/ionic-team/stencil/commit/9db7d49))
* **cache:** commit cache for all builds and clean up fs cache periodically ([5c1a1cc](https://github.com/ionic-team/stencil/commit/5c1a1cc))
* **cache:** ensure external imports are correctly read from the fs cache ([646314c](https://github.com/ionic-team/stencil/commit/646314c))
* **css:** strips comments before resolving css imports ([f822c08](https://github.com/ionic-team/stencil/commit/f822c08)), closes [#955](https://github.com/ionic-team/stencil/issues/955)
* **fs-watch:** reload window if service worker changed ([5c9268b](https://github.com/ionic-team/stencil/commit/5c9268b))
* **minifier:** migrate js minifier from uglify-es to terser ([cbaa274](https://github.com/ionic-team/stencil/commit/cbaa274)), closes [#913](https://github.com/ionic-team/stencil/issues/913)
* **prerender:** fix prerendered styles for scoped css ([fd8784f](https://github.com/ionic-team/stencil/commit/fd8784f))
* **queue:** always pass timestamp ([12a440c](https://github.com/ionic-team/stencil/commit/12a440c))
* **types:** relax types for plugins ([c949659](https://github.com/ionic-team/stencil/commit/c949659))



<a name="0.10.10"></a>
## 📍 [0.10.10](https://github.com/ionic-team/stencil/compare/v0.10.9...v0.10.10) (2018-07-26)


### Bug Fixes

* **compiler:** skip globalStyles if buildDir is undefined ([400c131](https://github.com/ionic-team/stencil/commit/400c131))
* **css-docs:** parse source style files for docs ([d1b83f0](https://github.com/ionic-team/stencil/commit/d1b83f0))
* **minify:** do not minify inline scripts that are not js types ([71b2c8d](https://github.com/ionic-team/stencil/commit/71b2c8d)), closes [#948](https://github.com/ionic-team/stencil/issues/948)


### Features

* **css-docs:** generate docs for css custom properties ([c0336e0](https://github.com/ionic-team/stencil/commit/c0336e0))



<a name="0.10.9"></a>
## 🚞 [0.10.9](https://github.com/ionic-team/stencil/compare/v0.10.8...v0.10.9) (2018-07-24)


### Bug Fixes

* **esm:** fix esm style imports for browsers w/ no shadow dom support ([610be85](https://github.com/ionic-team/stencil/commit/610be85))



<a name="0.10.8"></a>
## 🎖 [0.10.8](https://github.com/ionic-team/stencil/compare/v0.10.7...v0.10.8) (2018-07-23)


### Bug Fixes

* **dev-server:** fix dev-server when using custom baseUrl ([29e25a4](https://github.com/ionic-team/stencil/commit/29e25a4))
* incorrect types on utils fixed. ([bce3ecc](https://github.com/ionic-team/stencil/commit/bce3ecc))
* **dev-server:** set src for dev-server client to requested url ([17cb7ee](https://github.com/ionic-team/stencil/commit/17cb7ee)), closes [#940](https://github.com/ionic-team/stencil/issues/940)
* **globalStyle:** fix autoprefixer for globalStyle and improve rebuild times ([03472f0](https://github.com/ionic-team/stencil/commit/03472f0))


### Features

* update functional component util to have map and foreach. ([a0daaae](https://github.com/ionic-team/stencil/commit/a0daaae))
* **check-version:** periodically check if using latest stencil version ([3a558b1](https://github.com/ionic-team/stencil/commit/3a558b1))



<a name="0.10.7"></a>
## 🚐 [0.10.7](https://github.com/ionic-team/stencil/compare/v0.10.6...v0.10.7) (2018-07-16)


### Bug Fixes

* **style:** fix resolving css imports ([268840e](https://github.com/ionic-team/stencil/commit/268840e))



<a name="0.10.6"></a>
## 🎭 [0.10.6](https://github.com/ionic-team/stencil/compare/v0.10.5...v0.10.6) (2018-07-14)


### Features

* **dev-server:** open build error in editor and go to line/column ([e37daca](https://github.com/ionic-team/stencil/commit/e37daca))
* **dev-server:** open file in editor ([78f73fc](https://github.com/ionic-team/stencil/commit/78f73fc))


### Bug Fixes

* **dev-server:** fix dev-server --root cmd arg ([43a554b](https://github.com/ionic-team/stencil/commit/43a554b)), closes [#928](https://github.com/ionic-team/stencil/issues/928)
* **types:** fix input capture attr type ([594683f](https://github.com/ionic-team/stencil/commit/594683f)), closes [#925](https://github.com/ionic-team/stencil/issues/925)



<a name="0.10.5"></a>
## 🚡 [0.10.5](https://github.com/ionic-team/stencil/compare/v0.10.4...v0.10.5) (2018-07-13)


### Bug Fixes

* **hmr:** call componentDidLoad on hmr reload ([74f9ad0](https://github.com/ionic-team/stencil/commit/74f9ad0))


### Performance Improvements

* **build:** improve style rebuild times ([fbfc237](https://github.com/ionic-team/stencil/commit/fbfc237))



<a name="0.10.4"></a>
## 🌷 [0.10.4](https://github.com/ionic-team/stencil/compare/v0.10.3...v0.10.4) (2018-07-12)


### Bug Fixes

* **dev-server:** include domain in href to dev server client script ([41c03a8](https://github.com/ionic-team/stencil/commit/41c03a8)), closes [#921](https://github.com/ionic-team/stencil/issues/921)
* **styles:** fix applying jsCase css properties in style attribute ([f1ea5b0](https://github.com/ionic-team/stencil/commit/f1ea5b0)), closes [#919](https://github.com/ionic-team/stencil/issues/919) [#924](https://github.com/ionic-team/stencil/issues/924)



<a name="0.10.3"></a>
## 🌺 [0.10.3](https://github.com/ionic-team/stencil/compare/v0.10.2...v0.10.3) (2018-07-12)


### Bug Fixes

* **dev-server:** update web socket library for node10 fixes ([deb31e0](https://github.com/ionic-team/stencil/commit/deb31e0))



<a name="0.10.2"></a>
## 🍔 [0.10.2](https://github.com/ionic-team/stencil/compare/v0.10.1...v0.10.2) (2018-07-10)


### Bug Fixes

* **dist:** fix local core stencil types ([1fdcbdc](https://github.com/ionic-team/stencil/commit/1fdcbdc))
* **hmr:** add/remove listeners from component changes ([93d7158](https://github.com/ionic-team/stencil/commit/93d7158)), closes [#915](https://github.com/ionic-team/stencil/issues/915)
* **set-accessor:** css vars in inline style ([cf09375](https://github.com/ionic-team/stencil/commit/cf09375))
* **types:** root d.ts are properly generated ([3d5a8bc](https://github.com/ionic-team/stencil/commit/3d5a8bc))
* **worker:** fallback to main thread runner when child processes never startup ([d8cd648](https://github.com/ionic-team/stencil/commit/d8cd648))



<a name="0.10.1"></a>
## 🐵 [0.10.1](https://github.com/ionic-team/stencil/compare/v0.10.0...v0.10.1) (2018-07-09)


### Bug Fixes

* **worker:** create unique worker ids ([57b3055](https://github.com/ionic-team/stencil/commit/57b3055))



<a name="0.10.0"></a>
# 🚀 [0.10.0](https://github.com/ionic-team/stencil/compare/v0.9.11...v0.10.0) (2018-07-09)

`@stencil/core` now ships with an integrated dev-server which communicates directly with the build process. Stencil's integrated dev-server enables hot module replacement (HMR), which allows components to self-update without requiring a full webpage reload. Additionally, style changes within web components are also able to reload styles without a webpage reload. Other features from the integrated dev-server include build-time error reporting directly within the browser, both as an overlay and within console.logs.

The new `@stencil/core` integrated dev-server is a replacement for the external `@stencil/dev-server` package, but the previous package will continue to work if no changes are made to an app's npm scripts. To start testing out the new dev-server, within the app's `package.json` scripts:

**Update:**

`sd concurrent \"stencil build --dev --watch\" \"stencil-dev-server\"`

**To:**

`stencil build --dev --watch --serve`

Note that the updated command is no longer requiring `sd concurrent`, which is from the `@stencil/utils` package, and no longer requires `stencil-dev-server`, which is from the `@stencil/dev-server` package. Unless the app is using these packages elsewhere, both can
safely be removed as a dependency.

Next, the `stencil.config.js` file can also remove the entire `exports.devServer = {...}` config since it is no longer used.


### Features

* **dev-server:** integrate dev server w/ build and hot module replacement ([b8f56b4](https://github.com/ionic-team/stencil/commit/b8f56b4))
* **dev-server:** initial build logs w/in browser ([5cc8821](https://github.com/ionic-team/stencil/commit/5cc8821))
* **hmr:** add devServer.excludeHmr config glob ([e46f0d0](https://github.com/ionic-team/stencil/commit/e46f0d0))
* **hmr:** enable hot module replacement for legacy builds ([8533ec6](https://github.com/ionic-team/stencil/commit/8533ec6))
* **hmr:** init dev-mode hot module replacement ([b698710](https://github.com/ionic-team/stencil/commit/b698710))
* **serve:** create `stencil serve` for stand-alone http server ([33056ac](https://github.com/ionic-team/stencil/commit/33056ac))
* **styles:** ensure multiple style modes can be used on same page ([26a40f5](https://github.com/ionic-team/stencil/commit/26a40f5))


### Bug Fixes

* **angular:** emit proxies ([ae4afd4](https://github.com/ionic-team/stencil/commit/ae4afd4))
* **builds:** overkill async checks w/ multiple builds working in parallel ([aec9e96](https://github.com/ionic-team/stencil/commit/aec9e96))
* **build:** re-run module map on every change ([4c14c39](https://github.com/ionic-team/stencil/commit/4c14c39))
* **cache:** ensure cache dir exists before removing ([58c5a9a](https://github.com/ionic-team/stencil/commit/58c5a9a)), closes [#876](https://github.com/ionic-team/stencil/issues/876)
* **client:** fix possibility of document.body not being available yet ([0f1393e](https://github.com/ionic-team/stencil/commit/0f1393e))
* **css-shim:** CSS_URL_REGEXP check relative to root paths ([77a9b5f](https://github.com/ionic-team/stencil/commit/77a9b5f))
* **dev-server:** fix img reloading ([0d39f7b](https://github.com/ionic-team/stencil/commit/0d39f7b))
* **hmr:** always init host snapshot ([da7f961](https://github.com/ionic-team/stencil/commit/da7f961))
* **hmr:** ensure shadowRoot not already added ([25efff6](https://github.com/ionic-team/stencil/commit/25efff6))
* **hmr:** reload page when app adds or deletes scripts ([6352ead](https://github.com/ionic-team/stencil/commit/6352ead))
* **hmr:** update components when imported files change ([954618a](https://github.com/ionic-team/stencil/commit/954618a))
* **props:** ensure mode value set to host element is not deleted ([0671ea1](https://github.com/ionic-team/stencil/commit/0671ea1))
* **serve:** fix serve config from cli ([9ed7ae3](https://github.com/ionic-team/stencil/commit/9ed7ae3))
* **scoped-css:** descendant selectors ([9e7fffb](https://github.com/ionic-team/stencil/commit/9e7fffb))
* **styles:** fix race condition w/ multiple modes for same component ([50307bd](https://github.com/ionic-team/stencil/commit/50307bd))
* **styles:** update scoped styles on dev server reload ([607b93e](https://github.com/ionic-team/stencil/commit/607b93e))
* **styles:** use default style if host elm mode set, but no mode style set ([c0cf468](https://github.com/ionic-team/stencil/commit/c0cf468))
* **sys.node:** do not reset __dirname during bundling ([3c953c5](https://github.com/ionic-team/stencil/commit/3c953c5))
* **watch:** close fs watcher on exit ([9ae0268](https://github.com/ionic-team/stencil/commit/9ae0268))
* **watch:** fix rebuild on config file change ([0d30b57](https://github.com/ionic-team/stencil/commit/0d30b57)), closes [#829](https://github.com/ionic-team/stencil/issues/829)
* **watch:** refactor fs watch, rebuilds w/ parallel builds ([e855e4f](https://github.com/ionic-team/stencil/commit/e855e4f))
* **worker:** imporove worker on windows ([32746ca](https://github.com/ionic-team/stencil/commit/32746ca))


<a name="0.9.11"></a>
## 🏙 [0.9.11](https://github.com/ionic-team/stencil/compare/v0.9.10...v0.9.11) (2018-06-21)


### Bug Fixes

* **build:** fix file renaming/deleting during watch builds ([e5aa212](https://github.com/ionic-team/stencil/commit/e5aa212)), closes [#754](https://github.com/ionic-team/stencil/issues/754)
* **minify:** ensure es5 chunks are minified ([4f3eecd](https://github.com/ionic-team/stencil/commit/4f3eecd)), closes [#794](https://github.com/ionic-team/stencil/issues/794)
* **slot:** only update shadowRoot for host elm patch ([2fddcbd](https://github.com/ionic-team/stencil/commit/2fddcbd))
* **ssr:** do not leave worker processes hanging during ssr ([bfe666b](https://github.com/ionic-team/stencil/commit/bfe666b)), closes [#856](https://github.com/ionic-team/stencil/issues/856)


### Performance Improvements

* **build:** move es5 transpile to workers ([dc6c986](https://github.com/ionic-team/stencil/commit/dc6c986))
* **cache:** improve build times w/ consistent cache dir between releases ([82373cc](https://github.com/ionic-team/stencil/commit/82373cc))



<a name="0.9.10"></a>
## 🐼 [0.9.10](https://github.com/ionic-team/stencil/compare/v0.9.9...v0.9.10) (2018-06-20)


### Bug Fixes

* **cssvars:** implement scoped css var shim ([f6e75cf](https://github.com/ionic-team/stencil/commit/f6e75cf))
* **cssvars:** non-scoped components are global scoped ([d8d6176](https://github.com/ionic-team/stencil/commit/d8d6176))
* **types:** remove value from jsx tyles for select elements. ([020dda0](https://github.com/ionic-team/stencil/commit/020dda0))


### Performance Improvements

* **bundling:** cache bundle builds ([27083d1](https://github.com/ionic-team/stencil/commit/27083d1))
* **watch:** do not wait on dist outputs for rebuilds ([a57f7bb](https://github.com/ionic-team/stencil/commit/a57f7bb))



<a name="0.9.9"></a>
## 🐍 [0.9.9](https://github.com/ionic-team/stencil/compare/v0.9.8...v0.9.9) (2018-06-19)


### Bug Fixes

* **collection:** set paths relative to collection manifest json ([bcf4a29](https://github.com/ionic-team/stencil/commit/bcf4a29))
* **service-worker:** finish prerender first, then run service workers ([787a9be](https://github.com/ionic-team/stencil/commit/787a9be))
* **stats:** stats should build when defined as an output target. ([cf506c5](https://github.com/ionic-team/stencil/commit/cf506c5))
* **transpile:** do not isolate modules in ts service ([2b71d15](https://github.com/ionic-team/stencil/commit/2b71d15))
* **watch:** recover from errors from initial build ([8a42cf1](https://github.com/ionic-team/stencil/commit/8a42cf1))



<a name="0.9.8"></a>
## ⛴ [0.9.8](https://github.com/ionic-team/stencil/compare/v0.9.7...v0.9.8) (2018-06-19)


### Performance Improvements

* **build:** improve parallelization and caching ([a7f4768](https://github.com/ionic-team/stencil/commit/a7f4768))
* **transpile:** cache transpiled files ([c7050ee](https://github.com/ionic-team/stencil/commit/c7050ee))
* **typescript:** improve typescript build times ([b6b7eb3](https://github.com/ionic-team/stencil/commit/b6b7eb3))


### Bug Fixes

* **attributes:** properly remove unknown html attributes on standard html elements ([75836c5](https://github.com/ionic-team/stencil/commit/75836c5))
* **build:** reset typescript service cache on config change ([008a0a7](https://github.com/ionic-team/stencil/commit/008a0a7))
* **dev-inspector:** correct dev server source to use nodeName instead of tagName. ([45ed330](https://github.com/ionic-team/stencil/commit/45ed330))
* **dist:** wait on validate types build to finish for dist builds ([b46e9a7](https://github.com/ionic-team/stencil/commit/b46e9a7))
* **polyfill:** ensure custom element polyfill does not run more than once ([13192d4](https://github.com/ionic-team/stencil/commit/13192d4))
* **service-worker:** insert build timestamp for index cache busting ([3008db7]


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
