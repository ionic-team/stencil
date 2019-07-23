## 🐕 [1.1.9](https://github.com/ionic-team/stencil/compare/v1.1.8...v1.1.9) (2019-07-22)


### Bug Fixes

* **vdom:** classes with consecutive spaces ([f25b9eb](https://github.com/ionic-team/stencil/commit/f25b9eb))



## 📍 [1.1.8](https://github.com/ionic-team/stencil/compare/v1.1.6...v1.1.8) (2019-07-22)


### Bug Fixes

* render jsdocs tags in component.d.ts ([3f90962](https://github.com/ionic-team/stencil/commit/3f90962))
* **mock-doc:** fully svg compliant ([#1739](https://github.com/ionic-team/stencil/issues/1739)) ([ff46cbc](https://github.com/ionic-team/stencil/commit/ff46cbc))
* **vdom:** check dom value before assign ([#1736](https://github.com/ionic-team/stencil/issues/1736)) ([5f2fc80](https://github.com/ionic-team/stencil/commit/5f2fc80)), closes [ionic-team/ionic#18768](https://github.com/ionic-team/ionic/issues/18768) [ionic-team/ionic#18757](https://github.com/ionic-team/ionic/issues/18757)
* **vdom:** use classList instead of className ([#1737](https://github.com/ionic-team/stencil/issues/1737)) ([667e668](https://github.com/ionic-team/stencil/commit/667e668))
* move promise polyfill ([#1720](https://github.com/ionic-team/stencil/issues/1720)) ([2e05e0d](https://github.com/ionic-team/stencil/commit/2e05e0d))
* **angular:** property assignment happens after append ([#1732](https://github.com/ionic-team/stencil/issues/1732)) ([4a3982d](https://github.com/ionic-team/stencil/commit/4a3982d))
* **copy:** emit copy www in appDir ([d61e6a8](https://github.com/ionic-team/stencil/commit/d61e6a8))


### Features

* **loader:** add CDN fallback loader ([#1746](https://github.com/ionic-team/stencil/issues/1746)) ([ad33c31](https://github.com/ionic-team/stencil/commit/ad33c31))
* **mock-doc:** add canvas ([#1716](https://github.com/ionic-team/stencil/issues/1716)) ([0459e22](https://github.com/ionic-team/stencil/commit/0459e22))
* expose CopyTask.keepDirStructure API ([4b8d71d](https://github.com/ionic-team/stencil/commit/4b8d71d))



## 👒 [1.1.7](https://github.com/ionic-team/stencil/compare/v1.1.6...v1.1.7) (2019-07-16)


### Bug Fixes

* **angular:** property assignment happens after append ([#1732](https://github.com/ionic-team/stencil/issues/1732)) ([4a3982d](https://github.com/ionic-team/stencil/commit/4a3982d))
* **copy:** emit copy www in appDir ([d61e6a8](https://github.com/ionic-team/stencil/commit/d61e6a8))


### Features

* **mock-doc:** add canvas ([#1716](https://github.com/ionic-team/stencil/issues/1716)) ([0459e22](https://github.com/ionic-team/stencil/commit/0459e22))
* expose CopyTask.keepDirStructure API ([4b8d71d](https://github.com/ionic-team/stencil/commit/4b8d71d))



## 🍪 [1.1.6](https://github.com/ionic-team/stencil/compare/v1.1.5...v1.1.6) (2019-07-09)


### Bug Fixes

* **polyfill:** ensure window context w/ fetch polyfill ([37c78f3](https://github.com/ionic-team/stencil/commit/37c78f3))


### Features

* **compiler:** warn about event name conflicts ([015ea32](https://github.com/ionic-team/stencil/commit/015ea32))
* **logger:** expose logger config for custom logging ([709454f](https://github.com/ionic-team/stencil/commit/709454f))



## 🍸 [1.1.5](https://github.com/ionic-team/stencil/compare/v1.1.4...v1.1.5) (2019-07-05)


### Bug Fixes

* **ie11:** strict mode bug ([bf27172](https://github.com/ionic-team/stencil/commit/bf27172)), closes [#1712](https://github.com/ionic-team/stencil/issues/1712)
* **runtime:** watch is enabled before connectedCallback ([45e99f6](https://github.com/ionic-team/stencil/commit/45e99f6))


### Performance Improvements

* expose api to bypass zone ([d5ccef5](https://github.com/ionic-team/stencil/commit/d5ccef5))
* **angular:** skip zone on method and prop set ([d1bde58](https://github.com/ionic-team/stencil/commit/d1bde58))
* **runtime:** optimize dom write scheduling ([8897c6f](https://github.com/ionic-team/stencil/commit/8897c6f))



## 🍗 [1.1.4](https://github.com/ionic-team/stencil/compare/v1.1.3...v1.1.4) (2019-07-03)


### Bug Fixes

* **copy:** if dest is specified copy task is not relative ([4292f74](https://github.com/ionic-team/stencil/commit/4292f74)), closes [#1697](https://github.com/ionic-team/stencil/issues/1697)
* **hydrate:** improve hydrate app builds ([3267f66](https://github.com/ionic-team/stencil/commit/3267f66))
* **runtime:** dispatch queue events before willLoad ([2d1a0aa](https://github.com/ionic-team/stencil/commit/2d1a0aa))
* **jsx:** add slot attribute to DOMAttributes ([3b2de4e](https://github.com/ionic-team/stencil/commit/3b2de4e)), closes [#1690](https://github.com/ionic-team/stencil/issues/1690)
* **mock-doc:** createElementNS follows spec better ([9f83b54](https://github.com/ionic-team/stencil/commit/9f83b54))
* **mock-doc:** use document.baseURI has base URL ([b05ae9c](https://github.com/ionic-team/stencil/commit/b05ae9c))
* **testing:** goto options are optional ([da73dda](https://github.com/ionic-team/stencil/commit/da73dda)), closes [#1689](https://github.com/ionic-team/stencil/issues/1689)


### Features

* **mock-doc:** add NodeList ([#1614](https://github.com/ionic-team/stencil/issues/1614)) ([ee3fdf9](https://github.com/ionic-team/stencil/commit/ee3fdf9))
* **testing:** add MockSVGElement ([#1694](https://github.com/ionic-team/stencil/issues/1694)) ([17d90c9](https://github.com/ionic-team/stencil/commit/17d90c9))



## 🎀 [1.1.3](https://github.com/ionic-team/stencil/compare/v1.1.2...v1.1.3) (2019-06-28)


### Bug Fixes

* **copy:** copy files on watch ([3ea354a](https://github.com/ionic-team/stencil/commit/3ea354a))
* **copy:** glob copy ([f39b376](https://github.com/ionic-team/stencil/commit/f39b376))
* **ie11:** remove unnecessary polyfills ([fb6606d](https://github.com/ionic-team/stencil/commit/fb6606d)), closes [#1668](https://github.com/ionic-team/stencil/issues/1668)
* **runtime:** prevent call Watch before willLoad ([91fb61d](https://github.com/ionic-team/stencil/commit/91fb61d))
* **runtime:** prevent forceUpdate before first render ([67b4ae8](https://github.com/ionic-team/stencil/commit/67b4ae8))
* **vdom:** relocation bug ([e953e22](https://github.com/ionic-team/stencil/commit/e953e22))
* back-compatibility with old stencil runtime ([10a5704](https://github.com/ionic-team/stencil/commit/10a5704))
* core-js only targeting ie11 ([07a5296](https://github.com/ionic-team/stencil/commit/07a5296))
* update ComponentInterface definition ([e5bae1b](https://github.com/ionic-team/stencil/commit/e5bae1b))


### Features

* generate empty entry point for loader ([144e966](https://github.com/ionic-team/stencil/commit/144e966))


### Performance Improvements

* only inline <1KB entry-point ([a2a8033](https://github.com/ionic-team/stencil/commit/a2a8033))
* use JSON.parse() when metadata is > 10KB ([ab0e9d6](https://github.com/ionic-team/stencil/commit/ab0e9d6))



## 🐏 [1.1.2](https://github.com/ionic-team/stencil/compare/v1.1.1...v1.1.2) (2019-06-25)


### Bug Fixes

* **testing:** ev is not defined ([c6bd82d](https://github.com/ionic-team/stencil/commit/c6bd82d))
* normalize default mode ([b15c6a5](https://github.com/ionic-team/stencil/commit/b15c6a5))
* **e2e:** consistent font rendering ([3b2cc94](https://github.com/ionic-team/stencil/commit/3b2cc94))
* **prerendering:** filter download links ([2f664f0](https://github.com/ionic-team/stencil/commit/2f664f0))
* **testing:** close browser context and better error reporting ([0a2fcf3](https://github.com/ionic-team/stencil/commit/0a2fcf3))
* **testing:** disable concurrency ([e12993b](https://github.com/ionic-team/stencil/commit/e12993b))


### Performance Improvements

* don't cap max workers ([82d8094](https://github.com/ionic-team/stencil/commit/82d8094))
* generate modulepreload for mode ([29d87c2](https://github.com/ionic-team/stencil/commit/29d87c2))



## 🚨 [1.1.1](https://github.com/ionic-team/stencil/compare/v1.1.0...v1.1.1) (2019-06-25)


### Bug Fixes

* **testing:** better error reporting ([8acf74e](https://github.com/ionic-team/stencil/commit/8acf74e))
* **testing:** respect user config ([70e711f](https://github.com/ionic-team/stencil/commit/70e711f))
* **testing:** Skip puppeteer install ([01f0a93](https://github.com/ionic-team/stencil/commit/01f0a93)), closes [#1529](https://github.com/ionic-team/stencil/issues/1529)



# 🍻 [1.1.0](https://github.com/ionic-team/stencil/compare/v1.0.7...v1.1.0) (2019-06-24)


### Bug Fixes

* **ie:** cascadian css in :roor and html ([28e99c3](https://github.com/ionic-team/stencil/commit/28e99c3))
* **ie:** global css variables ([56c5f68](https://github.com/ionic-team/stencil/commit/56c5f68))
* fix timeout for screenshot ([71ebdac](https://github.com/ionic-team/stencil/commit/71ebdac))
* **testing:** remove request listener after first load ([f569ac8](https://github.com/ionic-team/stencil/commit/f569ac8)), closes [#1567](https://github.com/ionic-team/stencil/issues/1567)
* disable hmr in testing mode ([8f33df8](https://github.com/ionic-team/stencil/commit/8f33df8))
* **compiler:** warning regex for .ts(x) imports ([#1583](https://github.com/ionic-team/stencil/issues/1583)) ([4f976dd](https://github.com/ionic-team/stencil/commit/4f976dd))
* **testing:** SpecPage is not exported ([#1657](https://github.com/ionic-team/stencil/issues/1657)) ([dd88c56](https://github.com/ionic-team/stencil/commit/dd88c56))
* fix small typo (necesary -> necessary) ([#1663](https://github.com/ionic-team/stencil/issues/1663)) ([75d89ec](https://github.com/ionic-team/stencil/commit/75d89ec))
* **tests:** let tests run unless build triggers error ([#1678](https://github.com/ionic-team/stencil/issues/1678)) ([ee28980](https://github.com/ionic-team/stencil/commit/ee28980))
* add runtime dev error for common <Host> issues ([2ee6db0](https://github.com/ionic-team/stencil/commit/2ee6db0))
* **compiler:** generate loader when es5 is disabled ([0b4d814](https://github.com/ionic-team/stencil/commit/0b4d814))
* emit loader if es5 is disabled ([0bbda39](https://github.com/ionic-team/stencil/commit/0bbda39))


### Features

* **e2e:** devtools flag and page.debugger() ([0b8fe24](https://github.com/ionic-team/stencil/commit/0b8fe24))
* **testing:** expose waitFor option ([62839d8](https://github.com/ionic-team/stencil/commit/62839d8))


### Performance Improvements

* **testing:** only wait for network0 during screenshot ([1d8ece5](https://github.com/ionic-team/stencil/commit/1d8ece5))
* **testing:** reduce memory usage by closing pages after each test ([66ad23d](https://github.com/ionic-team/stencil/commit/66ad23d))
* property read does not have side effects ([ac312b3](https://github.com/ionic-team/stencil/commit/ac312b3))


### Reverts

* **test:** timeoutBeforeScreenshot values ([a5f40c3](https://github.com/ionic-team/stencil/commit/a5f40c3))



## 🍵 [1.0.7](https://github.com/ionic-team/stencil/compare/v1.0.6...v1.0.7) (2019-06-19)


### Bug Fixes

* **styles:** add styles before links ([05d242d](https://github.com/ionic-team/stencil/commit/05d242d))



## 😋 [1.0.6](https://github.com/ionic-team/stencil/compare/v1.0.5...v1.0.6) (2019-06-17)


### Bug Fixes

* **collection:** generate dist/collection in dev mode ([3082c02](https://github.com/ionic-team/stencil/commit/3082c02))
* **runtime:** disable constructable stylesheets in document ([adedb82](https://github.com/ionic-team/stencil/commit/adedb82))



## 🐔 [1.0.5](https://github.com/ionic-team/stencil/compare/v1.0.4...v1.0.5) (2019-06-17)


### Bug Fixes

* install dev deps ([16588cb](https://github.com/ionic-team/stencil/commit/16588cb))
* **hydrate:** fix light-dom nodes relocated within shadow ([95cbc3b](https://github.com/ionic-team/stencil/commit/95cbc3b))
* **mock-doc:** case sensible attributes in element ([#1642](https://github.com/ionic-team/stencil/issues/1642)) ([e0c2ba5](https://github.com/ionic-team/stencil/commit/e0c2ba5))
* **sys:** update sys.browser ([51efaa5](https://github.com/ionic-team/stencil/commit/51efaa5))
* **testing:** fix e2e tests when without www output ([13f0c2f](https://github.com/ionic-team/stencil/commit/13f0c2f))
* **transform:** fix crash will undefined node ([8f2d82c](https://github.com/ionic-team/stencil/commit/8f2d82c))
* **validate:** don't validate in watch mode ([46f78ab](https://github.com/ionic-team/stencil/commit/46f78ab)), closes [#1647](https://github.com/ionic-team/stencil/issues/1647)
* empty.js resolver is not longer needed ([97c0ed0](https://github.com/ionic-team/stencil/commit/97c0ed0))
* **sys:** update sys.browser ([e835203](https://github.com/ionic-team/stencil/commit/e835203))
* **testing:** run e2e tests ([89102e3](https://github.com/ionic-team/stencil/commit/89102e3))
* add all public members from HTMLElement ([#1639](https://github.com/ionic-team/stencil/issues/1639)) ([d43f210](https://github.com/ionic-team/stencil/commit/d43f210))
* allow inputMode ([5c737d6](https://github.com/ionic-team/stencil/commit/5c737d6))
* update screenshot app ([4557148](https://github.com/ionic-team/stencil/commit/4557148))



## 🐯 [1.0.4](https://github.com/ionic-team/stencil/compare/v1.0.3...v1.0.4) (2019-06-14)


### Bug Fixes

* **bundler:** treat core as a normal chunk ([2453ba8](https://github.com/ionic-team/stencil/commit/2453ba8))
* ensure only components are exported ([0712e88](https://github.com/ionic-team/stencil/commit/0712e88))
* only emit index-org on prerendering ([5f75c03](https://github.com/ionic-team/stencil/commit/5f75c03))
* **mock-doc:** use correct element base class within cloneNode() ([0578dda](https://github.com/ionic-team/stencil/commit/0578dda))


### Features

* **sys:** init sys.browser for browser based compiler ([d058b44](https://github.com/ionic-team/stencil/commit/d058b44))



## 🍭 [1.0.3](https://github.com/ionic-team/stencil/compare/v1.0.2...v1.0.3) (2019-06-12)

If you are using any of the following plugins:

- `@stencil/sass`
- `@stencil/less`
- `@stencil/stylus`
- `@stencil/postcss`

Please, make sure you are using the latest version (1.0.x) of those plugins.


### Bug Fixes

* **bundle:** fix tree-shaking regression ([f9fe153](https://github.com/ionic-team/stencil/commit/f9fe153))
* **bundle:** only exclude system ([0581dec](https://github.com/ionic-team/stencil/commit/0581dec))
* **bundle:** plugin helper ([0db4650](https://github.com/ionic-team/stencil/commit/0db4650))
* **compiler:** always emit hashed filenames in prod ([282dd66](https://github.com/ionic-team/stencil/commit/282dd66))
* **config:** filter rollup plugins ([0163e58](https://github.com/ionic-team/stencil/commit/0163e58))
* **mock-doc:** title.text ([c92bf41](https://github.com/ionic-team/stencil/commit/c92bf41))
* **prerendering:** apply low priority css ([cd87b30](https://github.com/ionic-team/stencil/commit/cd87b30))
* **testing:** get page.root when using setContent() ([8544d1e](https://github.com/ionic-team/stencil/commit/8544d1e))


### Performance Improvements

* **build:** skip lazy build when html change ([c8a0ab6](https://github.com/ionic-team/stencil/commit/c8a0ab6))



## 🍯 [1.0.2](https://github.com/ionic-team/stencil/compare/v1.0.1...v1.0.2) (2019-06-08)


### Bug Fixes

* internal type ([1a6f696](https://github.com/ionic-team/stencil/commit/1a6f696))
* **compiler:** document CSS variables in the MD file even if 'docs-json' is not set ([#1599](https://github.com/ionic-team/stencil/issues/1599)) ([413dcf7](https://github.com/ionic-team/stencil/commit/413dcf7))
* **declarations:** avoid exposing typescript ([889943f](https://github.com/ionic-team/stencil/commit/889943f))
* **plugins:** filter rollup plugins ([071afa7](https://github.com/ionic-team/stencil/commit/071afa7))
* **svg:** add support for ref JSX ([e2f76ef](https://github.com/ionic-team/stencil/commit/e2f76ef)), closes [#1601](https://github.com/ionic-team/stencil/issues/1601)
* **test:** support for window.JSON ([c75e4d5](https://github.com/ionic-team/stencil/commit/c75e4d5))
* avoid const / let ([06986ab](https://github.com/ionic-team/stencil/commit/06986ab))
* export PluginTransformResults in internal ([140b164](https://github.com/ionic-team/stencil/commit/140b164))
* fixing unsafe usage of target="_blank" ([#1604](https://github.com/ionic-team/stencil/issues/1604)) ([9dbb88f](https://github.com/ionic-team/stencil/commit/9dbb88f))
* **sw:** do not provide navigateFallback by default ([e84cb11](https://github.com/ionic-team/stencil/commit/e84cb11))


### Features

* **mock-doc:** add Element ([#1602](https://github.com/ionic-team/stencil/issues/1602)) ([1eeb780](https://github.com/ionic-team/stencil/commit/1eeb780))



## ⛑ [1.0.1](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.8...v1.0.1) (2019-06-06)


### Bug Fixes

* **build:** suppress worker EPIPE errors ([37e50e3](https://github.com/ionic-team/stencil/commit/37e50e3))
* **bundle:** handle browser: true correctly ([8b4597c](https://github.com/ionic-team/stencil/commit/8b4597c))
* **compiler:** full qualified exports ([ca60073](https://github.com/ionic-team/stencil/commit/ca60073)), closes [#1352](https://github.com/ionic-team/stencil/issues/1352)
* **dev-server:** avoid Promise in dev server client ([729cdf2](https://github.com/ionic-team/stencil/commit/729cdf2))
* **tests:** reset defaults ([de5f3d1](https://github.com/ionic-team/stencil/commit/de5f3d1))
* don't mock fetch() if provided ([09aa4ab](https://github.com/ionic-team/stencil/commit/09aa4ab))
* **e2e:** wait for idle network ([#1579](https://github.com/ionic-team/stencil/issues/1579)) ([f9a323f](https://github.com/ionic-team/stencil/commit/f9a323f))


### Features

* **test:** add mock for Node.contains() ([560d322](https://github.com/ionic-team/stencil/commit/560d322))
* add pluginHelper() ([b375e65](https://github.com/ionic-team/stencil/commit/b375e65))
* **config:** skip collectionsDir ([048118b](https://github.com/ionic-team/stencil/commit/048118b))
* **dev-server:** clickable line numbers open in editor ([ac13652](https://github.com/ionic-team/stencil/commit/ac13652))
* **dev-server:** minify dev server client ([5ed19ec](https://github.com/ionic-team/stencil/commit/5ed19ec))
* **mock-doc:** add KeyboardEvent ([#1581](https://github.com/ionic-team/stencil/issues/1581)) ([44393a9](https://github.com/ionic-team/stencil/commit/44393a9))


### Performance Improvements

* **prerendering:** use media query to prevent blocking ([a1c760a](https://github.com/ionic-team/stencil/commit/a1c760a))



# ☎️ [1.0.0](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.8...v1.0.0) (2019-06-01)

Check out the [blog post](https://blog.ionicframework.com/announcing-stencil-one-beta/) to know everything coming in Stencil One!
Also, it might be interesting to take a quick look at the [breaking change files](https://github.com/ionic-team/stencil/blob/master/BREAKING_CHANGES.md), to know what changes you might need to apply to you components.

### Bug Fixes

* **build:** suppress worker EPIPE errors ([37e50e3](https://github.com/ionic-team/stencil/commit/37e50e3))
* **dev-server:** avoid Promise in dev server client ([729cdf2](https://github.com/ionic-team/stencil/commit/729cdf2))
* **e2e:** wait for idle network ([#1579](https://github.com/ionic-team/stencil/issues/1579)) ([f9a323f](https://github.com/ionic-team/stencil/commit/f9a323f))


### Features

* **config:** skip collectionsDir ([048118b](https://github.com/ionic-team/stencil/commit/048118b))
* **dev-server:** clickable line numbers open in editor ([ac13652](https://github.com/ionic-team/stencil/commit/ac13652))
* **dev-server:** minify dev server client ([5ed19ec](https://github.com/ionic-team/stencil/commit/5ed19ec))
* **mock-doc:** add KeyboardEvent ([#1581](https://github.com/ionic-team/stencil/issues/1581)) ([44393a9](https://github.com/ionic-team/stencil/commit/44393a9))



# 🌻 [1.0.0-beta.8](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2019-05-29)


### Bug Fixes

* **bundler:** commonjs before user's plugins ([3adfaad](https://github.com/ionic-team/stencil/commit/3adfaad))
* **ie:** avoid top level Promise ([913b8fc](https://github.com/ionic-team/stencil/commit/913b8fc))
* **ie:** baseURI is not available ([ab8e304](https://github.com/ionic-team/stencil/commit/ab8e304))
* **ie:** fix async test ([e0ed00c](https://github.com/ionic-team/stencil/commit/e0ed00c))
* **ie:** heavy optimizations break IE11 ([103a9ba](https://github.com/ionic-team/stencil/commit/103a9ba))
* **ie:** polyfill Element.classList ([d7f6646](https://github.com/ionic-team/stencil/commit/d7f6646))
* **ie:** use core-js polyfills ([5afaa7e](https://github.com/ionic-team/stencil/commit/5afaa7e))
* **karma:** longer timeout for IE11 :( ([ae6a21c](https://github.com/ionic-team/stencil/commit/ae6a21c))
* **karma:** reduce logging ([f878282](https://github.com/ionic-team/stencil/commit/f878282))
* **legacy:** use in to check for classList ([bc5bbdb](https://github.com/ionic-team/stencil/commit/bc5bbdb))
* **runtime:** grab location from window ([26fd3cf](https://github.com/ionic-team/stencil/commit/26fd3cf))
* **tests:** increase timeout ([d8bec5a](https://github.com/ionic-team/stencil/commit/d8bec5a))
* **types:** remove ElementTagNameMap ([a5b199d](https://github.com/ionic-team/stencil/commit/a5b199d))
* add polyfill for composedPath() ([381ded9](https://github.com/ionic-team/stencil/commit/381ded9))



# ⛺️ [1.0.0-beta.7](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2019-05-29)


### Bug Fixes

* **vdom:** don't render booleans ([8106936](https://github.com/ionic-team/stencil/commit/8106936))



# 👻 [1.0.0-beta.6](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.4...v1.0.0-beta.6) (2019-05-29)


### Bug Fixes

* **angular:** ChangeDetectionStrategy.OnPush to generated angular bindings ([#1575](https://github.com/ionic-team/stencil/issues/1575)) ([0830959](https://github.com/ionic-team/stencil/commit/0830959))
* **build:** fix validate package json for prod builds ([f27dd6b](https://github.com/ionic-team/stencil/commit/f27dd6b))
* **build:** vdom/svg build conditionals also from imported modules ([f0a9dfc](https://github.com/ionic-team/stencil/commit/f0a9dfc))
* **bundle:** prioritize user plugins ([#1564](https://github.com/ionic-team/stencil/issues/1564)) ([69980f1](https://github.com/ionic-team/stencil/commit/69980f1))
* **compiler:** conflict between namespace and components ([d58bea6](https://github.com/ionic-team/stencil/commit/d58bea6))
* **compiler:** fix static analysis of dependencies ([c22a0a4](https://github.com/ionic-team/stencil/commit/c22a0a4))
* **html:** avoid duplicated modulepreload ([d68a478](https://github.com/ionic-team/stencil/commit/d68a478))
* skip initHtml when not serving ([ecafff2](https://github.com/ionic-team/stencil/commit/ecafff2))
* **system:** use same scheme ([345fcc7](https://github.com/ionic-team/stencil/commit/345fcc7))
* **types:** avoid in-memory fs for file existance check ([208c393](https://github.com/ionic-team/stencil/commit/208c393))
* **types:** normalize stencil.core import path ([30204ee](https://github.com/ionic-team/stencil/commit/30204ee))
* **types:** ref returns the correct interface ([f32598b](https://github.com/ionic-team/stencil/commit/f32598b))
* generate legacy loader for CDN ([9dde96a](https://github.com/ionic-team/stencil/commit/9dde96a))


### Features

* load images with imports ([#1565](https://github.com/ionic-team/stencil/issues/1565)) ([ee28dc0](https://github.com/ionic-team/stencil/commit/ee28dc0))
* **build:** add manifest.json validation ([570d741](https://github.com/ionic-team/stencil/commit/570d741))
* **compiler:** warn about typescript imports ([#1576](https://github.com/ionic-team/stencil/issues/1576)) ([d9881f6](https://github.com/ionic-team/stencil/commit/d9881f6))
* **jest:** add snapshot serializer ([#1570](https://github.com/ionic-team/stencil/issues/1570)) ([4e2eba0](https://github.com/ionic-team/stencil/commit/4e2eba0))


### Performance Improvements

* improve runtime for native build ([#1549](https://github.com/ionic-team/stencil/issues/1549)) ([8c5ae51](https://github.com/ionic-team/stencil/commit/8c5ae51))



# 🍷 [1.0.0-beta.5](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2019-05-22)


### Bug Fixes

* **system:** use same scheme ([345fcc7](https://github.com/ionic-team/stencil/commit/345fcc7))
* generate legacy loader for CDN ([9dde96a](https://github.com/ionic-team/stencil/commit/9dde96a))



# 🎡 [1.0.0-beta.4](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.2...v1.0.0-beta.4) (2019-05-22)


### Bug Fixes

* **build:** skip initIndexHtml if there is not devServer ([4841b6e](https://github.com/ionic-team/stencil/commit/4841b6e))
* **config:** revert esmLoaderPath change ([#1561](https://github.com/ionic-team/stencil/issues/1561)) ([99add67](https://github.com/ionic-team/stencil/commit/99add67))
* **dev-server:** fix reloading styles after external script changes ([6003871](https://github.com/ionic-team/stencil/commit/6003871))
* **dev-server:** fix updating inline styles hmr ([896022d](https://github.com/ionic-team/stencil/commit/896022d))
* **hmr:** call all callbacks in build event subscribers ([#1552](https://github.com/ionic-team/stencil/issues/1552)) ([d5cfea5](https://github.com/ionic-team/stencil/commit/d5cfea5))
* **hydrate:** fix hydrating style elements ([0007acb](https://github.com/ionic-team/stencil/commit/0007acb))
* **hydrate:** pass nodeResolve and commonjs config ([#1556](https://github.com/ionic-team/stencil/issues/1556)) ([ddc200e](https://github.com/ionic-team/stencil/commit/ddc200e)), closes [#1554](https://github.com/ionic-team/stencil/issues/1554)
* **lifecycle:** tag styles were not being generated for components without styles ([#1553](https://github.com/ionic-team/stencil/issues/1553)) ([279e33b](https://github.com/ionic-team/stencil/commit/279e33b))
* **loader:** load from external domain ([3a9e643](https://github.com/ionic-team/stencil/commit/3a9e643))
* **runtime:** fix getAssetPath() for external domain ([102d09b](https://github.com/ionic-team/stencil/commit/102d09b))
* **test:** esmLoader tests ([9fe054c](https://github.com/ionic-team/stencil/commit/9fe054c))
* **types:** move LocalJSX to declarations/jsx.ts ([39cc99b](https://github.com/ionic-team/stencil/commit/39cc99b))


### Features

* **dev-server:** HMR progress bar ([314b841](https://github.com/ionic-team/stencil/commit/314b841))
* **dev-server:** improve dev-server status/progress ([4960fbe](https://github.com/ionic-team/stencil/commit/4960fbe))



# 😃 [1.0.0-beta.3](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2019-05-21)


### Bug Fixes

* **build:** skip initIndexHtml if there is not devServer ([4841b6e](https://github.com/ionic-team/stencil/commit/4841b6e))
* **dev-server:** fix updating inline styles hmr ([896022d](https://github.com/ionic-team/stencil/commit/896022d))
* **hmr:** call all callbacks in build event subscribers ([#1552](https://github.com/ionic-team/stencil/issues/1552)) ([d5cfea5](https://github.com/ionic-team/stencil/commit/d5cfea5))
* **hydrate:** fix hydrating style elements ([0007acb](https://github.com/ionic-team/stencil/commit/0007acb))
* **hydrate:** pass nodeResolve and commonjs config ([#1556](https://github.com/ionic-team/stencil/issues/1556)) ([ddc200e](https://github.com/ionic-team/stencil/commit/ddc200e)), closes [#1554](https://github.com/ionic-team/stencil/issues/1554)
* **lifecycle:** tag styles were not being generated for components without styles ([#1553](https://github.com/ionic-team/stencil/issues/1553)) ([279e33b](https://github.com/ionic-team/stencil/commit/279e33b))
* **loader:** load from external domain ([3a9e643](https://github.com/ionic-team/stencil/commit/3a9e643))
* **test:** esmLoader tests ([9fe054c](https://github.com/ionic-team/stencil/commit/9fe054c))
* **types:** move LocalJSX to declarations/jsx.ts ([39cc99b](https://github.com/ionic-team/stencil/commit/39cc99b))


### Features

* **dev-server:** HMR progress bar ([314b841](https://github.com/ionic-team/stencil/commit/314b841))
* **dev-server:** improve dev-server status/progress ([4960fbe](https://github.com/ionic-team/stencil/commit/4960fbe))



# 🐉 [1.0.0-beta.2](https://github.com/ionic-team/stencil/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2019-05-20)

Check out the [blog post](https://blog.ionicframework.com/announcing-stencil-one-beta/) to know everything coming in Stencil One!
Also, it might be interesting to take a quick look at the [breaking change files](https://github.com/ionic-team/stencil/blob/master/BREAKING_CHANGES.md), to know what changes you might need to apply to you components.


### Bug Fixes

* **bundle:** use data-namespace to match the correct collection ([c01c049](https://github.com/ionic-team/stencil/commit/c01c049))
* **copy:**  improve error msg with effective config attributes name ([b574b86](https://github.com/ionic-team/stencil/commit/b574b86))
* **dev-server:** fix handling css parse errors ([06333d7](https://github.com/ionic-team/stencil/commit/06333d7))
* **dev-server:** progress bar uses transform ([d52a39b](https://github.com/ionic-team/stencil/commit/d52a39b))
* **docs:** use buildDocs instead of devMode ([e68f56c](https://github.com/ionic-team/stencil/commit/e68f56c))
* **hydrate:** shadow-dom needs shim ([d253d9b](https://github.com/ionic-team/stencil/commit/d253d9b))
* **lifecycle:** using css-in-js with no styles causes FOUC ([#1550](https://github.com/ionic-team/stencil/issues/1550)) ([e7cf323](https://github.com/ionic-team/stencil/commit/e7cf323))
* **test:** add hydrated class to tests ([93023df](https://github.com/ionic-team/stencil/commit/93023df))
* **test:** Make jest-preset to use setupFilesAfterEnv ([#1545](https://github.com/ionic-team/stencil/issues/1545)) ([9f7041a](https://github.com/ionic-team/stencil/commit/9f7041a))
* **testing:** do not emit annotations by default ([929e563](https://github.com/ionic-team/stencil/commit/929e563))
* **types:** export JSX in stencil.core ([3decbdf](https://github.com/ionic-team/stencil/commit/3decbdf))


### Features

* expose custom-docs apis ([bd20c11](https://github.com/ionic-team/stencil/commit/bd20c11))
* **compiler:**  watch  *.html files ([#1531](https://github.com/ionic-team/stencil/issues/1531)) ([a032c0c](https://github.com/ionic-team/stencil/commit/a032c0c))
* **dev-server:** initializing proress bar ([05a8030](https://github.com/ionic-team/stencil/commit/05a8030))
* **jsx:** add close event to Dialog ([#1348](https://github.com/ionic-team/stencil/issues/1348)) ([f722975](https://github.com/ionic-team/stencil/commit/f722975))
* **test:** add supportsShadowDom ([207e837](https://github.com/ionic-team/stencil/commit/207e837))
* **test:** add toEqualLightHtml() ([e4391f2](https://github.com/ionic-team/stencil/commit/e4391f2))
* **types:** add media event-handler properties ([#1376](https://github.com/ionic-team/stencil/issues/1376)) ([5ab62b8](https://github.com/ionic-team/stencil/commit/5ab62b8))
* expose PluginCtx and PrintLine ([db5fbb5](https://github.com/ionic-team/stencil/commit/db5fbb5))



# 💛 [1.0.0-beta.1](https://github.com/ionic-team/stencil/compare/v1.0.0-alpha.35...v1.0.0-beta.1) (2019-05-17)

Check out the [blog post](https://blog.ionicframework.com/announcing-stencil-one-beta/) to know everything coming in Stencil One!
Also, it might be interesting to take a quick look at the [breaking change files](https://github.com/ionic-team/stencil/blob/master/BREAKING_CHANGES.md), to know what changes you might need to apply to you components.

### Bug Fixes

* it's not Console, but console ([d50a242](https://github.com/ionic-team/stencil/commit/d50a242))
* **context:** resolve publicPath ([#1536](https://github.com/ionic-team/stencil/issues/1536)) ([15bf6e5](https://github.com/ionic-team/stencil/commit/15bf6e5))
* **context:** return values for isPrerender and isClient ([#1537](https://github.com/ionic-team/stencil/issues/1537)) ([0eba453](https://github.com/ionic-team/stencil/commit/0eba453))
* **dev-server:** fix error logging when build aborted ([69ef3b5](https://github.com/ionic-team/stencil/commit/69ef3b5))
* **dev-server:** fix initial load w/ errors ([4b86575](https://github.com/ionic-team/stencil/commit/4b86575))
* **dev-server:** fix reloading same error on start ([a987928](https://github.com/ionic-team/stencil/commit/a987928))
* **dev-server:** fix updating favicon ([6ec2cf9](https://github.com/ionic-team/stencil/commit/6ec2cf9))
* **hydrate:** resourcesUrl is an actual URL ([3cf39fd](https://github.com/ionic-team/stencil/commit/3cf39fd))
* **minify:** drop console.log / debug in prod mode ([e676e40](https://github.com/ionic-team/stencil/commit/e676e40))
* **runtime:** old versions of stencil reset ['s-rc'] ([4a88565](https://github.com/ionic-team/stencil/commit/4a88565))
* **types:** only fix imports, not mod augmentations ([4b1bdbd](https://github.com/ionic-team/stencil/commit/4b1bdbd))


### Features

* **config:** config.rollupConfig ([6d738e0](https://github.com/ionic-team/stencil/commit/6d738e0))
* **mock-doc:** add dataset to element ([509697e](https://github.com/ionic-team/stencil/commit/509697e))


### Performance Improvements

* **www:** hash app.esm.js ([b9325de](https://github.com/ionic-team/stencil/commit/b9325de)), closes [#1522](https://github.com/ionic-team/stencil/issues/1522)



<a name="0.18.1"></a>
## 😎 [0.18.1](https://github.com/ionic-team/stencil/compare/v0.18.0...v0.18.1) (2019-03-15)


### Features

* **package:** require node >= 8.9.0 and npm >= 6.0.0 ([d9325a3](https://github.com/ionic-team/stencil/commit/d9325a3))
* **server:** serve openBrowser configurable with open flag ([#1407](https://github.com/ionic-team/stencil/issues/1407)) ([cb4d916](https://github.com/ionic-team/stencil/commit/cb4d916))


### Bug Fixes

* **copy:** use fs.copyFile and reduce concurrent copy tasks ([e51c0a4](https://github.com/ionic-team/stencil/commit/e51c0a4))
* **dev-server:** serve command launch root url ([#1410](https://github.com/ionic-team/stencil/issues/1410)) ([7abdc39](https://github.com/ionic-team/stencil/commit/7abdc39))
* **dev-server:** start server w/out dev websocket, suppress startup logs config ([ca96c58](https://github.com/ionic-team/stencil/commit/ca96c58))
* **dist:** add dist/cjs directory ([24f5416](https://github.com/ionic-team/stencil/commit/24f5416))


<a name="0.18.0"></a>
# 🏐 [0.18.0](https://github.com/ionic-team/stencil/compare/v0.17.2...v0.18.0) (2019-02-12)


### Features

* **typescript:** update to typescript 3.3.3 ([35d8d25](https://github.com/ionic-team/stencil/commit/35d8d25))
* **compiler:** add check for potential custom element name issue[#947](https://github.com/ionic-team/stencil/issues/947) ([#1368](https://github.com/ionic-team/stencil/issues/1368)) ([9dfffa0](https://github.com/ionic-team/stencil/commit/9dfffa0))


### Bug Fixes

* **docs:** generate docs for slots ([#1363](https://github.com/ionic-team/stencil/issues/1363)) ([a08acac](https://github.com/ionic-team/stencil/commit/a08acac)), closes [#1362](https://github.com/ionic-team/stencil/issues/1362)
* **e2e:** expose page.url() method ([#1221](https://github.com/ionic-team/stencil/issues/1221)) ([c2df47e](https://github.com/ionic-team/stencil/commit/c2df47e)), closes [#1220](https://github.com/ionic-team/stencil/issues/1220)
* **prerender:** export DEFAULT_MODE for platform-server ([#1366](https://github.com/ionic-team/stencil/issues/1366)) ([678b19d](https://github.com/ionic-team/stencil/commit/678b19d))



<a name="0.17.2"></a>
## 🐋 [0.17.2](https://github.com/ionic-team/stencil/compare/v0.17.1...v0.17.2) (2019-02-05)


### Bug Fixes

* **log:** remove config console.log ([29c9e8b](https://github.com/ionic-team/stencil/commit/29c9e8b))



<a name="0.17.1"></a>
## 🚛 [0.17.1](https://github.com/ionic-team/stencil/compare/v0.17.0...v0.17.1) (2019-02-01)


### Bug Fixes

* **attribute:** don't null boolean properties ([647a47d](https://github.com/ionic-team/stencil/commit/647a47d))
* **config:** load .ts dependencies ([#1339](https://github.com/ionic-team/stencil/issues/1339)) ([e7de19f](https://github.com/ionic-team/stencil/commit/e7de19f))
* **prerender:** fix prerender error handling ([918e9ed](https://github.com/ionic-team/stencil/commit/918e9ed))
* **prerender:** ensure meta charset is first element in document.head ([590ddbf](https://github.com/ionic-team/stencil/commit/590ddbf))


### Features

* **prerender:** add "no-prerender" attribute to skip prerendering elements ([9c11415](https://github.com/ionic-team/stencil/commit/9c11415))



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
