<a name="0.5.1"></a>
## [0.5.1](https://github.com/ionic-team/stencil/compare/v0.5.0...v0.5.1) (2018-02-14)


### Bug Fixes

* **bundling:** add json resolution plugin for rollup to stencil. ([39dcfc6](https://github.com/ionic-team/stencil/commit/39dcfc6))
* **entries:** limit component references to call expressions and html ([7991017](https://github.com/ionic-team/stencil/commit/7991017)), closes [#532](https://github.com/ionic-team/stencil/issues/532)
* **node-dom:** fix errors when dom.window already closed ([065ed4e](https://github.com/ionic-team/stencil/commit/065ed4e))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/ionic-team/stencil/compare/v0.4.3...v0.5.0) (2018-02-13)


### Bug Fixes

* **entries:** ensure dependency data from collections remains ([f9fb09a](https://github.com/ionic-team/stencil/commit/f9fb09a))
* **entries:** use all strings for component reference graph ([6629aa1](https://github.com/ionic-team/stencil/commit/6629aa1))
* **publicPath:** allow for custom public path ([19095e7](https://github.com/ionic-team/stencil/commit/19095e7)), closes [#464](https://github.com/ionic-team/stencil/issues/464)
* **transpile:** remove unneded remove-imports transform because it is causing issues with wildcard imports. fixes [#526](https://github.com/ionic-team/stencil/issues/526) ([256e70a](https://github.com/ionic-team/stencil/commit/256e70a))


### Features

* **plugins:** add rollup plugins through config ([b8abbce](https://github.com/ionic-team/stencil/commit/b8abbce)), closes [#472](https://github.com/ionic-team/stencil/issues/472)



<a name="0.4.3"></a>
## [0.4.3](https://github.com/ionic-team/stencil/compare/v0.4.2...v0.4.3) (2018-02-12)


### Bug Fixes

* **entries:** handle circular imports ([3f306ac](https://github.com/ionic-team/stencil/commit/3f306ac)), closes [#513](https://github.com/ionic-team/stencil/issues/513)
* **minify:** revert uglify to v3.3.9 ([0391259](https://github.com/ionic-team/stencil/commit/0391259))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/ionic-team/stencil/compare/v0.4.1...v0.4.2) (2018-02-12)


### Bug Fixes

* **entries:** component dependencies from module imports ([3eac82a](https://github.com/ionic-team/stencil/commit/3eac82a)), closes [#513](https://github.com/ionic-team/stencil/issues/513)
* **events:** ensure old events are removed ([ae68f98](https://github.com/ionic-team/stencil/commit/ae68f98)), closes [#500](https://github.com/ionic-team/stencil/issues/500)
* **minify:** minify chunks ([897f29b](https://github.com/ionic-team/stencil/commit/897f29b)), closes [#518](https://github.com/ionic-team/stencil/issues/518)
* **platform-client:** observedAttributes ([38c9201]

### Features

* **config:** do not require config file ([c8cc144](https://github.com/ionic-team/stencil/commit/c8cc144))



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


### Bug Fixes

* **config:** fixes absolutizing of wwwIndexHtml ([#470](https://github.com/ionic-team/stencil/issues/470)) ([81dde18](https://github.com/ionic-team/stencil/commit/81dde18))
* **styles:** always place component styles below prerender/visibility styles ([8ed47b9](https://github.com/ionic-team/stencil/commit/8ed47b9))
* **sw:** build service worker after built fs commit ([9ea7235](https://github.com/ionic-team/stencil/commit/9ea7235))


### Features

* **ES Modules:** load modules through native ES Modules ([#162](https://github.com/ionic-team/stencil/issues/162)) ([c3524a94](https://github.com/ionic-team/stencil/commit/c3524a94c2402ce47fdfdda7012854f3b0081817))
* **watch:** add pcss to recognized web dev extensions ([#477](https://github.com/ionic-team/stencil/issues/477)) ([f783273](https://github.com/ionic-team/stencil/commit/f783273))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/ionic-team/stencil/compare/v0.2.2...v0.2.3) (2018-01-24)


### Bug Fixes

* **attribute:** attr name from toDashCase of property name ([28740be](https://github.com/ionic-team/stencil/commit/28740be))
* **build:** update uglify-es to 3.3.8 ([690759d](https://github.com/ionic-team/stencil/commit/690759d))
* **compiler:** avoid global JSX namespace collisions ([9c1e721](https://github.com/ionic-team/stencil/commit/9c1e721))
* **test:** fix unit test hydration ([122b1cd](https://github.com/ionic-team/stencil/commit/122b1cd)), closes [#441](https://github.com/ionic-team/stencil/issues/441)
* **watcher:** ensure duplicate builds are not started ([b3d6cf2](https://github.com/ionic-team/stencil/commit/b3d6cf2))
* **watcher:** ensure duplicate paths are not added to queue ([767b879](https://github.com/ionic-team/stencil/commit/767b879))


### Features

* **test:** add test transpile fn interface ([d68fffb](https://github.com/ionic-team/stencil/commit/d68fffb))



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


### Features

* **fs:** in-memory filesystem and caching updates ([7ad25bd](https://github.com/ionic-team/stencil/commit/7ad25bd)
* **plugins:** init plugins ([55827cc](https://github.com/ionic-team/stencil/commit/55827cc))
* **watch:** add member name as 3rd arg ([5bc261c](https://github.com/ionic-team/stencil/commit/5bc261c))



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


### Bug Fixes

* **events:** Event() options ([e1662a5](https://github.com/ionic-team/stencil/commit/e1662a5)), closes [#406](https://github.com/ionic-team/stencil/issues/406)
* **listeners:** addListenerEvent() options check ([1275327](https://github.com/ionic-team/stencil/commit/1275327))


### Features

* **listeners:** enableListener accepts passive option ([1275327](https://github.com/ionic-team/stencil/commit/1275327))


### Performance Improvements

* **sw:** serviceWorker script is minified ([76bcc52](https://github.com/ionic-team/stencil/commit/76bcc52))



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



<a name="0.0.9-4"></a>
## [0.0.9-4](https://github.com/ionic-team/stencil/compare/v0.0.9-3...v0.0.9-4) (2017-12-18)


### Features

* **publicPath:** add publicPath to Context ([d8fc3c2](https://github.com/ionic-team/stencil/commit/d8fc3c2))
* **render:** inject h function into render() ([c2c4d6e](https://github.com/ionic-team/stencil/commit/c2c4d6e))



<a name="0.0.9-3"></a>
## [0.0.9-3](https://github.com/ionic-team/stencil/compare/v0.0.9-2...v0.0.9-3) (2017-12-17)


### Features

* **build:** build dist/types/ directory ([050ca66](https://github.com/ionic-team/stencil/commit/050ca66))
* **loader:** improve loader publicPath and testing ([28b5638](https://github.com/ionic-team/stencil/commit/28b5638))



<a name="0.0.9-2"></a>
## [0.0.9-2](https://github.com/ionic-team/stencil/compare/v0.0.9-1...v0.0.9-2) (2017-12-15)


### Bug Fixes

* correct issue where testing was not getting metadata from components. ([68dcc84](https://github.com/ionic-team/stencil/commit/68dcc84))
* **build:** inlined loader script should go at the bottom ([5bfd3c5](https://github.com/ionic-team/stencil/commit/5bfd3c5))
* **build:** sort members within components.d.ts build ([1864cdc](https://github.com/ionic-team/stencil/commit/1864cdc))


### Features

* **docs:** add jsdocs to readme.md docs ([05cc8c4](https://github.com/ionic-team/stencil/commit/05cc8c4))
* **validation:** user code checks for render fns ([290c221](https://github.com/ionic-team/stencil/commit/290c221)), closes [#227](https://github.com/ionic-team/stencil/issues/227)



<a name="0.0.9-1"></a>
## [0.0.9-1](https://github.com/ionic-team/stencil/compare/v0.0.9-0...v0.0.9-1) (2017-12-14)


### Bug Fixes

* **prop:** fix willChange and didChange builds ([eedad6b](https://github.com/ionic-team/stencil/commit/eedad6b))
* **prop:** method with multiple PropChange decorators ([39c1239](https://github.com/ionic-team/stencil/commit/39c1239))


### Features

* **globalStyle:** add globalStyle config ([b65528c](https://github.com/ionic-team/stencil/commit/b65528c))
* **prerender:** generate host.config.json during prerender ([836fc8f](https://github.com/ionic-team/stencil/commit/836fc8f))



<a name="0.0.9-0"></a>
## [0.0.9-0](https://github.com/ionic-team/stencil/compare/v0.0.8...v0.0.9-0) (2017-12-11)


### Bug Fixes

* **listener:** remove listeners from attachTo option ([da8d649](https://github.com/ionic-team/stencil/commit/da8d649))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/ionic-team/stencil/compare/v0.0.8-12...v0.0.8) (2017-12-07)



<a name="0.0.8-12"></a>
## [0.0.8-12](https://github.com/ionic-team/stencil/compare/v0.0.8-11...v0.0.8-12) (2017-12-07)


### Bug Fixes

* **styles:** fix windows new lines ([5b801e5](https://github.com/ionic-team/stencil/commit/5b801e5)), closes [#346](https://github.com/ionic-team/stencil/issues/346)



<a name="0.0.8-11"></a>
## [0.0.8-11](https://github.com/ionic-team/stencil/compare/v0.0.8-10...v0.0.8-11) (2017-12-07)


### Bug Fixes

* **build:** remove import statement if no named bindings ([77c1a90](https://github.com/ionic-team/stencil/commit/77c1a90))
* **cli:** process.exit(1) on build errors ([f8cffaf](https://github.com/ionic-team/stencil/commit/f8cffaf)), closes [#351](https://github.com/ionic-team/stencil/issues/351)
* **supports:** correct css support test ([9bf7dce](https://github.com/ionic-team/stencil/commit/9bf7dce))
* **supports:** update css support test for safari ([beefbf8](https://github.com/ionic-team/stencil/commit/beefbf8))
* **transpile:** remove decorators ([c0ef510](https://github.com/ionic-team/stencil/commit/c0ef510))
* **transpiler:** support for multiple listeners ([bcb61e0](https://github.com/ionic-team/stencil/commit/bcb61e0))
* **watch:** re-copy assets on watch changes ([653a91a](https://github.com/ionic-team/stencil/commit/653a91a)), closes [#178](https://github.com/ionic-team/stencil/issues/178)



<a name="0.0.8-10"></a>
## [0.0.8-10](https://github.com/ionic-team/stencil/compare/v0.0.8-9...v0.0.8-10) (2017-12-05)


### Bug Fixes

* empty files should not throw an error for cache tests. ([681f5e2](https://github.com/ionic-team/stencil/commit/681f5e2))
* exclude components.d.ts file from typechecker info gathering. ([1a6d28a](https://github.com/ionic-team/stencil/commit/1a6d28a))
* **build:** fix dist build write location ([835f5c0](https://github.com/ionic-team/stencil/commit/835f5c0))
* **transpile:** moduleFiles crash ([9aded3c](https://github.com/ionic-team/stencil/commit/9aded3c))
* **transpile:** use correct path on windows ([5a09bff](https://github.com/ionic-team/stencil/commit/5a09bff))


### Features

* **css:** add css variable support ([6f27283](https://github.com/ionic-team/stencil/commit/6f27283))



<a name="0.0.8-9"></a>
## [0.0.8-9](https://github.com/ionic-team/stencil/compare/v0.0.8-8...v0.0.8-9) (2017-12-01)


### Bug Fixes

* **polyfills:** move template above doc-register ([7447639](https://github.com/ionic-team/stencil/commit/7447639)), closes [#337](https://github.com/ionic-team/stencil/issues/337)
* correct tshost cache so that imported node files no longer throw an error. ([a7dfc41](https://github.com/ionic-team/stencil/commit/a7dfc41))
* move metadata collection into a seperate process to allow for components.d.ts file generation ([3919da9](https://github.com/ionic-team/stencil/commit/3919da9))


### Features

* add forceUpdate to components to allow for a fallback to rerendering. ([79ffef1](https://github.com/ionic-team/stencil/commit/79ffef1))
* **config:** src include/exclude globs ([253bb0d](https://github.com/ionic-team/stencil/commit/253bb0d))
* **docs:** docs flag to generate component readme.md docs ([37135c8](https://github.com/ionic-team/stencil/commit/37135c8))



<a name="0.0.8-8"></a>
## [0.0.8-8](https://github.com/ionic-team/stencil/compare/v0.0.8-7...v0.0.8-8) (2017-11-28)


### Bug Fixes

* **config:** fix emptyWWW and emptyDist config ([cc372c5](https://github.com/ionic-team/stencil/commit/cc372c5))
* **styles:** create style modes for all modes in bundle ([4ea003b](https://github.com/ionic-team/stencil/commit/4ea003b))


### Performance Improvements

* **build:** cache core builds for rebuilds w/out changes ([c0b75f7](https://github.com/ionic-team/stencil/commit/c0b75f7))



<a name="0.0.8-7"></a>
## [0.0.8-7](https://github.com/ionic-team/stencil/compare/v0.0.8-6...v0.0.8-7) (2017-11-25)


### Bug Fixes

* **build:** es5 builds when TS injects __generator ([01f7820](https://github.com/ionic-team/stencil/commit/01f7820))
* **prop:** ensure elm exists during setComponentProp ([237a793](https://github.com/ionic-team/stencil/commit/237a793))
* **ref:** do not property rename "ref" for prod builds ([8646d29](https://github.com/ionic-team/stencil/commit/8646d29))


### Features

* **docs:** stencil docs auto-generation cmd ([fee5fa9](https://github.com/ionic-team/stencil/commit/fee5fa9))


### Performance Improvements

* **html:** inlined loader is minified ([f5c9928](https://github.com/ionic-team/stencil/commit/f5c9928))



<a name="0.0.8-6"></a>
## [0.0.8-6](https://github.com/ionic-team/stencil/compare/v0.0.8-5...v0.0.8-6) (2017-11-21)


### Bug Fixes

* **core:** fix loading polyfilled core ([f113478](https://github.com/ionic-team/stencil/commit/f113478)), closes [#320](https://github.com/ionic-team/stencil/issues/320)
* **doc:** change mayor to major ([#317](https://github.com/ionic-team/stencil/issues/317)) ([de3f815](https://github.com/ionic-team/stencil/commit/de3f815))
* **ref:** run ref() before componentDidLoad ([899f7ff](https://github.com/ionic-team/stencil/commit/899f7ff))
* **serviceworker:** service worker should not be injected when config is false ([f88e0d8](https://github.com/ionic-team/stencil/commit/f88e0d8))
* **test:** imports ([#310](https://github.com/ionic-team/stencil/issues/310)) ([4758397](https://github.com/ionic-team/stencil/commit/4758397))



<a name="0.0.8-5"></a>
## [0.0.8-5](https://github.com/ionic-team/stencil/compare/v0.0.8-4...v0.0.8-5) (2017-11-16)



<a name="0.0.8-4"></a>
## [0.0.8-4](https://github.com/ionic-team/stencil/compare/v0.0.8-3...v0.0.8-4) (2017-11-15)


### Bug Fixes

* **polyfill:** add template.js polyfill for ie11 ([4379715](https://github.com/ionic-team/stencil/commit/4379715)), closes [#302](https://github.com/ionic-team/stencil/issues/302)
* **test:** non @Component classes ([4cc7e63](https://github.com/ionic-team/stencil/commit/4cc7e63))



<a name="0.0.8-3"></a>
## [0.0.8-3](https://github.com/ionic-team/stencil/compare/v0.0.8-2...v0.0.8-3) (2017-11-15)


### Bug Fixes

* **manifest:** emit manifest.bundles ([a197f31](https://github.com/ionic-team/stencil/commit/a197f31))
* **namespace:** allow $ in the namespace ([bf0f23a](https://github.com/ionic-team/stencil/commit/bf0f23a))
* **namespace:** allow for dash in namespace ([0e403fe](https://github.com/ionic-team/stencil/commit/0e403fe)), closes [#263](https://github.com/ionic-team/stencil/issues/263)
* **transpile:** warns should not stop transpilation ([5ffc381](https://github.com/ionic-team/stencil/commit/5ffc381))


### Features

* **core:** dynamically load client-side ssr parser if needed ([651eb48](https://github.com/ionic-team/stencil/commit/651eb48))



<a name="0.0.8-2"></a>
## [0.0.8-2](https://github.com/ionic-team/stencil/compare/v0.0.8-1...v0.0.8-2) (2017-11-14)


### Bug Fixes

* **build:** propDidChange, propWillChange ([fbdc6f1](https://github.com/ionic-team/stencil/commit/fbdc6f1))



<a name="0.0.8-1"></a>
## [0.0.8-1](https://github.com/ionic-team/stencil/compare/v0.0.8-0...v0.0.8-1) (2017-11-14)


### Bug Fixes

* **core:** fix es5 core builds to not transpile arrow fns ([1b24a34](https://github.com/ionic-team/stencil/commit/1b24a34))
* Add code to prevent type collisions in components.d.ts. ([1c24738](https://github.com/ionic-team/stencil/commit/1c24738))
* color and mode should be allowed as valid types of components. ([40d48e8](https://github.com/ionic-team/stencil/commit/40d48e8))
* find all type references in type definitions for Props. ([1246d95](https://github.com/ionic-team/stencil/commit/1246d95))
* move component element interfaces into global scope. ([1904e75](https://github.com/ionic-team/stencil/commit/1904e75))
* Remove console.log ([b7f394c](https://github.com/ionic-team/stencil/commit/b7f394c))
* **platform-client:** using arrow in raf to be safe ([39d7e41](https://github.com/ionic-team/stencil/commit/39d7e41))
* **render:** render is always called ([1fa9bf8](https://github.com/ionic-team/stencil/commit/1fa9bf8))
* **render:** styles are applied if no render() ([04833db](https://github.com/ionic-team/stencil/commit/04833db)), closes [#298](https://github.com/ionic-team/stencil/issues/298)
* **scoped:** ensure scope css checks for shadow dom fallback ([82bb787](https://github.com/ionic-team/stencil/commit/82bb787))



<a name="0.0.8-0"></a>
## [0.0.8-0](https://github.com/ionic-team/stencil/compare/v0.0.7...v0.0.8-0) (2017-11-11)


### Bug Fixes

* **index:** remove arrow fns from serviceWorker registration ([a513b69](https://github.com/ionic-team/stencil/commit/a513b69))
* correctly identify connect props and do not add types for them. ([e71c702](https://github.com/ionic-team/stencil/commit/e71c702))
* if no type is defined for @Prop assume any with warning. ([654d6ee](https://github.com/ionic-team/stencil/commit/654d6ee))
* **logger:** only output errors once ([1a93ad7](https://github.com/ionic-team/stencil/commit/1a93ad7))
* **shadow:** include scoped css check w/ shadow dom builds ([e1253f3](https://github.com/ionic-team/stencil/commit/e1253f3))
* **test:** fix crash when expect is not found ([2e36a5d](https://github.com/ionic-team/stencil/commit/2e36a5d))


### Features

* add support for more advanced type definition of @Prop component properties ([e17a485](https://github.com/ionic-team/stencil/commit/e17a485))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/ionic-team/stencil/compare/v0.0.7-3...v0.0.7) (2017-11-08)



<a name="0.0.7-3"></a>
## [0.0.7-3](https://github.com/ionic-team/stencil/compare/v0.0.7-2...v0.0.7-3) (2017-11-08)


### Bug Fixes

* **watch:** ensure core ids are in rebuilds ([49952bd](https://github.com/ionic-team/stencil/commit/49952bd))



<a name="0.0.7-2"></a>
## [0.0.7-2](https://github.com/ionic-team/stencil/compare/v0.0.7-1...v0.0.7-2) (2017-11-07)


### Bug Fixes

* **build:** fix index.d.ts collection copy ([277cd9e](https://github.com/ionic-team/stencil/commit/277cd9e))



<a name="0.0.7-1"></a>
## [0.0.7-1](https://github.com/ionic-team/stencil/compare/v0.0.7-0...v0.0.7-1) (2017-11-07)


### Bug Fixes

* ensure duplicate classes are preserved in DOM ([#250](https://github.com/ionic-team/stencil/issues/250)) ([b7d9f56](https://github.com/ionic-team/stencil/commit/b7d9f56))
* index files of folders resolve correctly. fixes [#235](https://github.com/ionic-team/stencil/issues/235) ([25591e4](https://github.com/ionic-team/stencil/commit/25591e4))
* **listener:** always include listeners in setAccessor ([d3e514f](https://github.com/ionic-team/stencil/commit/d3e514f))
* **scoped:** ensure ssr adds scoped css attrs ([03efa11](https://github.com/ionic-team/stencil/commit/03efa11))
* **styles:** escape \@ css selector ([2f8f44a](https://github.com/ionic-team/stencil/commit/2f8f44a)), closes [#267](https://github.com/ionic-team/stencil/issues/267)
* **vdom:** only use host when document fragment ([8cb0d02](https://github.com/ionic-team/stencil/commit/8cb0d02))


### Features

* provide ability for devs to create functional components as building blocks ([#273](https://github.com/ionic-team/stencil/issues/273)) ([b2ae377](https://github.com/ionic-team/stencil/commit/b2ae377))
* **compiler:** enable es2015 and es5 builds ([87b1d3b](https://github.com/ionic-team/stencil/commit/87b1d3b))
* **core:** enable es2015 and es5 builds, reduce client runtime ([bc3e148](https://github.com/ionic-team/stencil/commit/bc3e148))
* **slotted:** add ::slotted css scoping ([f8d43db](https://github.com/ionic-team/stencil/commit/f8d43db)), closes [#282](https://github.com/ionic-team/stencil/issues/282)
* **test:** extend jest-expect ([#266](https://github.com/ionic-team/stencil/issues/266)) ([a8c1804](https://github.com/ionic-team/stencil/commit/a8c1804))



<a name="0.0.7-0"></a>
## [0.0.7-0](https://github.com/ionic-team/stencil/compare/v0.0.6...v0.0.7-0) (2017-10-26)


### Bug Fixes

* **encapsulation:** check boolean true values ([650b14d](https://github.com/ionic-team/stencil/commit/650b14d))
* **render:** prevent render loop from internal state change ([fe3946e](https://github.com/ionic-team/stencil/commit/fe3946e))
* **shadow:** apply styles/classes to host element ([9fcf86a](https://github.com/ionic-team/stencil/commit/9fcf86a))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/ionic-team/stencil/compare/v0.0.6-23...v0.0.6) (2017-10-25)


### Features

* **polyfill:** add template element polyfill ([#261](https://github.com/ionic-team/stencil/issues/261)) ([0195c62](https://github.com/ionic-team/stencil/commit/0195c62)), closes [#260](https://github.com/ionic-team/stencil/issues/260)



<a name="0.0.6-23"></a>
## [0.0.6-23](https://github.com/ionic-team/stencil/compare/v0.0.6-22...v0.0.6-23) (2017-10-25)


### Bug Fixes

* **config:** hash all filenames when hashFileNames set ([019d005](https://github.com/ionic-team/stencil/commit/019d005)), closes [#218](https://github.com/ionic-team/stencil/issues/218)
* **prop:** fix define property ([d8b5ca9](https://github.com/ionic-team/stencil/commit/d8b5ca9))
* **props:** assign all props in loader ([70cfd47](https://github.com/ionic-team/stencil/commit/70cfd47))
* **render:** correct isInitialLoad arg ([7ab90d6](https://github.com/ionic-team/stencil/commit/7ab90d6))
* **ssr:** do not delete elm member within proxy ([1b29200](https://github.com/ionic-team/stencil/commit/1b29200))
* **styles:** add mode to styleId and templates ([01ad227](https://github.com/ionic-team/stencil/commit/01ad227))
* **sys:** fix clean-css reference ([3199e81](https://github.com/ionic-team/stencil/commit/3199e81))
* change class to be referenced as ['class'] ([6d702b0](https://github.com/ionic-team/stencil/commit/6d702b0))
* setAccessor should remove null, undefined, or false properties. ([0ce5f95](https://github.com/ionic-team/stencil/commit/0ce5f95))


### Features

* **config:** add sassConfig option ([#255](https://github.com/ionic-team/stencil/issues/255)) ([d0db160](https://github.com/ionic-team/stencil/commit/d0db160)), closes [#248](https://github.com/ionic-team/stencil/issues/248)
* **listeners:** enableListener attachTo can be an element ([ffbd155](https://github.com/ionic-team/stencil/commit/ffbd155))
* **ref:** add jsx ref attr ([2c11c7d](https://github.com/ionic-team/stencil/commit/2c11c7d)), closes [#226](https://github.com/ionic-team/stencil/issues/226)
* **styles:** add data-visibility attr to loader css ([ed01a52](https://github.com/ionic-team/stencil/commit/ed01a52))


### Performance Improvements

* **listener:** remove queueUpdate from listeners ([e92c79c](https://github.com/ionic-team/stencil/commit/e92c79c))
* **test:** revert npm test performance ([352b9e4](https://github.com/ionic-team/stencil/commit/352b9e4))



<a name="0.0.6-22"></a>
## [0.0.6-22](https://github.com/ionic-team/stencil/compare/v0.0.6-21...v0.0.6-22) (2017-10-19)


### Bug Fixes

* **namespace:** allow dashes inside of namespace ([71c479c](https://github.com/ionic-team/stencil/commit/71c479c)), closes [#249](https://github.com/ionic-team/stencil/issues/249)
* **prop:** delete child prop when parent undefined value ([a122cef](https://github.com/ionic-team/stencil/commit/a122cef))
* **prop:** update for null/undefined ([72c26d1](https://github.com/ionic-team/stencil/commit/72c26d1))
* **render:** skip ssr for sd components ([6d424f2](https://github.com/ionic-team/stencil/commit/6d424f2))



<a name="0.0.6-21"></a>
## [0.0.6-21](https://github.com/ionic-team/stencil/compare/v0.0.6-20...v0.0.6-21) (2017-10-18)


### Bug Fixes

* **build:** ensure www directory ([320e2c8](https://github.com/ionic-team/stencil/commit/320e2c8))
* **chalk:** lock in version cuz chalk pushed broken types ([f90ef7c](https://github.com/ionic-team/stencil/commit/f90ef7c))
* **cli:** print build diagnostics ([9c847b4](https://github.com/ionic-team/stencil/commit/9c847b4))
* **patch:** set isUpdate boolean ([102c6eb](https://github.com/ionic-team/stencil/commit/102c6eb))



<a name="0.0.6-20"></a>
## [0.0.6-20](https://github.com/ionic-team/stencil/compare/v0.0.6-19...v0.0.6-20) (2017-10-17)


### Bug Fixes

* copy index.d.ts file to collection if it exists. ([9f3f347](https://github.com/ionic-team/stencil/commit/9f3f347))
* **patch:** check that element exists ([2134195](https://github.com/ionic-team/stencil/commit/2134195))



<a name="0.0.6-19"></a>
## [0.0.6-19](https://github.com/ionic-team/stencil/compare/v0.0.6-18...v0.0.6-19) (2017-10-17)


### Bug Fixes

* **hydrated:** do not include undefined styles ([69c0575](https://github.com/ionic-team/stencil/commit/69c0575))
* always generate d.ts files if distrution is true. ([6fe1b17](https://github.com/ionic-team/stencil/commit/6fe1b17))



<a name="0.0.6-18"></a>
## [0.0.6-18](https://github.com/ionic-team/stencil/compare/v0.0.6-17...v0.0.6-18) (2017-10-17)


### Bug Fixes

* correct type definition of mode and color. ([b040593](https://github.com/ionic-team/stencil/commit/b040593))



<a name="0.0.6-17"></a>
## [0.0.6-17](https://github.com/ionic-team/stencil/compare/v0.0.6-16...v0.0.6-17) (2017-10-17)


### Bug Fixes

* update types so that booleans retain their type and added mode and color. ([cb35431](https://github.com/ionic-team/stencil/commit/cb35431))
* when class is empty string do not add it as a class. ([41c942e](https://github.com/ionic-team/stencil/commit/41c942e))



<a name="0.0.6-16"></a>
## [0.0.6-16](https://github.com/ionic-team/stencil/compare/v0.0.6-15...v0.0.6-16) (2017-10-17)


### Bug Fixes

* preserve dom node class list if updated outside of vdom. ([62c3b51](https://github.com/ionic-team/stencil/commit/62c3b51))



<a name="0.0.6-15"></a>
## [0.0.6-15](https://github.com/ionic-team/stencil/compare/v0.0.6-14...v0.0.6-15) (2017-10-16)


### Bug Fixes

* **externs:** add loadStyles to externs ([#241](https://github.com/ionic-team/stencil/issues/241)) ([fed7372](https://github.com/ionic-team/stencil/commit/fed7372))


### Features

* **bundle:** factor in encapsulation type when bundling ([866e74b](https://github.com/ionic-team/stencil/commit/866e74b))
* **encapsulation:** add shadow dom and scoped css ([2f20cd0](https://github.com/ionic-team/stencil/commit/2f20cd0))
* **encapsulation:** improve scoped css selectors ([316cc1d](https://github.com/ionic-team/stencil/commit/316cc1d))



<a name="0.0.6-14"></a>
## [0.0.6-14](https://github.com/ionic-team/stencil/compare/v0.0.6-13...v0.0.6-14) (2017-10-11)


### Bug Fixes

* account for issues with using props name as a property in upgrade scripts. ([a4b7527](https://github.com/ionic-team/stencil/commit/a4b7527))
* correct semver comparisions and add more tests for coverage ([e25277f](https://github.com/ionic-team/stencil/commit/e25277f))
* increment typescript to nightly to get fix for jsx upgrades. ([bc73194](https://github.com/ionic-team/stencil/commit/bc73194))
* update method signature usage. ([9957771](https://github.com/ionic-team/stencil/commit/9957771))



<a name="0.0.6-13"></a>
## [0.0.6-13](https://github.com/ionic-team/stencil/compare/v0.0.6-12...v0.0.6-13) (2017-10-10)


### Bug Fixes

* moved util.promisify to dependencies. ([045f6d3](https://github.com/ionic-team/stencil/commit/045f6d3))



<a name="0.0.6-12"></a>
## [0.0.6-12](https://github.com/ionic-team/stencil/compare/v0.0.6-11...v0.0.6-12) (2017-10-10)


### Bug Fixes

* **cli:** fix help output ([e988ace](https://github.com/ionic-team/stencil/commit/e988ace)), closes [#207](https://github.com/ionic-team/stencil/issues/207)
* **prop:** parse types from default literal values ([045eae7](https://github.com/ionic-team/stencil/commit/045eae7)), closes [#209](https://github.com/ionic-team/stencil/issues/209)
* **types:** improve type parsing and components.d.ts types ([f3f104b](https://github.com/ionic-team/stencil/commit/f3f104b)), closes [#211](https://github.com/ionic-team/stencil/issues/211)
* allow for class strings to be kept as is when passed in jsx. ([87a8b0b](https://github.com/ionic-team/stencil/commit/87a8b0b))
* use util.promisify as a shim for compatibility. ([a724f21](https://github.com/ionic-team/stencil/commit/a724f21))


### Features

* **compiler:** add typescript version to collection manifest ([df62198](https://github.com/ionic-team/stencil/commit/df62198))
* **compiler:** create upgrade transform ([#214](https://github.com/ionic-team/stencil/issues/214)) ([#215](https://github.com/ionic-team/stencil/issues/215)) ([4964b2f](https://github.com/ionic-team/stencil/commit/4964b2f))
* **compiler:** test for required compiler upgrades ([#214](https://github.com/ionic-team/stencil/issues/214)) ([b0de1b9](https://github.com/ionic-team/stencil/commit/b0de1b9))
* **config:** update hydrated css and config ([868cfd2](https://github.com/ionic-team/stencil/commit/868cfd2)), closes [#205](https://github.com/ionic-team/stencil/issues/205)
* **interfaces:** adding life cycle interfaces ([#216](https://github.com/ionic-team/stencil/issues/216)) ([469d5c9](https://github.com/ionic-team/stencil/commit/469d5c9))
* **interfaces:** make EventEmitter generic for better type checking ([#224](https://github.com/ionic-team/stencil/issues/224)) ([a2ec336](https://github.com/ionic-team/stencil/commit/a2ec336)), closes [#210](https://github.com/ionic-team/stencil/issues/210)
* **interop:** improve interop between compiler version ([38bc007](https://github.com/ionic-team/stencil/commit/38bc007)), closes [#199](https://github.com/ionic-team/stencil/issues/199)
* upgrade collection components through a transform if they are out of date from current compiler. ([a3f021f](https://github.com/ionic-team/stencil/commit/a3f021f))



<a name="0.0.6-11"></a>
## [0.0.6-11](https://github.com/ionic-team/stencil/compare/v0.0.6-10...v0.0.6-11) (2017-10-04)



<a name="0.0.6-10"></a>
## [0.0.6-10](https://github.com/ionic-team/stencil/compare/v0.0.6-9...v0.0.6-10) (2017-10-04)



<a name="0.0.6-9"></a>
## [0.0.6-9](https://github.com/ionic-team/stencil/compare/v0.0.6-8...v0.0.6-9) (2017-10-04)



<a name="0.0.6-8"></a>
## [0.0.6-8](https://github.com/ionic-team/stencil/compare/v0.0.6-7...v0.0.6-8) (2017-10-04)



<a name="0.0.6-7"></a>
## [0.0.6-7](https://github.com/ionic-team/stencil/compare/v0.0.6-5...v0.0.6-7) (2017-10-04)



<a name="0.0.6-5"></a>
## [0.0.6-5](https://github.com/ionic-team/stencil/compare/v0.0.6-3...v0.0.6-5) (2017-10-03)


### Bug Fixes

* **build:** only write component.d.ts file with changes ([96ca340](https://github.com/ionic-team/stencil/commit/96ca340))
* **types:** fix windows paths in components.d.ts ([4854131](https://github.com/ionic-team/stencil/commit/4854131)), closes [#196](https://github.com/ionic-team/stencil/issues/196)


### Features

* **ssr:** ssr express middleware ([eef5d0f](https://github.com/ionic-team/stencil/commit/eef5d0f))



<a name="0.0.6-3"></a>
## [0.0.6-3](https://github.com/ionic-team/stencil/compare/v0.0.6-2...v0.0.6-3) (2017-09-29)


### Bug Fixes

* **build:** ignore spec files in build ([e101c59](https://github.com/ionic-team/stencil/commit/e101c59))
* **slot:** fix conditional nested slot content ([6193e74](https://github.com/ionic-team/stencil/commit/6193e74))
* **ssr:** chalk already bundled in logger ([f3b5d61](https://github.com/ionic-team/stencil/commit/f3b5d61))
* **ssr:** console log bundle loading errors ([3995a1a](https://github.com/ionic-team/stencil/commit/3995a1a))
* **ssr:** load app global within createRenderer ([8027471](https://github.com/ionic-team/stencil/commit/8027471))


### Features

* add collection types from stencil.config.js to the generated components.d.ts file. ([46fca1a](https://github.com/ionic-team/stencil/commit/46fca1a))



<a name="0.0.6-2"></a>
## [0.0.6-2](https://github.com/ionic-team/stencil/compare/v0.0.6-1...v0.0.6-2) (2017-09-27)


### Bug Fixes

* **bundling:** update rollup bundle api ([aeecbaf](https://github.com/ionic-team/stencil/commit/aeecbaf))



<a name="0.0.6-1"></a>
## [0.0.6-1](https://github.com/ionic-team/stencil/compare/v0.0.6-0...v0.0.6-1) (2017-09-26)


### Features

* **tests:** init core test suite ([338d465](https://github.com/ionic-team/stencil/commit/338d465))



<a name="0.0.6-0"></a>
## [0.0.6-0](https://github.com/ionic-team/stencil/compare/v0.0.5...v0.0.6-0) (2017-09-21)


### Bug Fixes

* **collection:** ensure dependencies get into collection ([dbb5da8](https://github.com/ionic-team/stencil/commit/dbb5da8))
* **distribution:** improve files dist validation ([6639cf8](https://github.com/ionic-team/stencil/commit/6639cf8))
* **distribution:** normalize package.json property paths ([79bb7ee](https://github.com/ionic-team/stencil/commit/79bb7ee)), closes [#173](https://github.com/ionic-team/stencil/issues/173)


### Features

* **testing:** remove the need to pass the platform around ([#170](https://github.com/ionic-team/stencil/issues/170)) ([66e3817](https://github.com/ionic-team/stencil/commit/66e3817))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/ionic-team/stencil/compare/v0.0.5-25...v0.0.5) (2017-09-20)



<a name="0.0.5-25"></a>
## [0.0.5-25](https://github.com/ionic-team/stencil/compare/v0.0.5-24...v0.0.5-25) (2017-09-20)


### Bug Fixes

* **externs:** add context externs ([c7dbab7](https://github.com/ionic-team/stencil/commit/c7dbab7))



<a name="0.0.5-24"></a>
## [0.0.5-24](https://github.com/ionic-team/stencil/compare/v0.0.5-23...v0.0.5-24) (2017-09-19)


### Bug Fixes

* **distribution:** ensure package.json collection property exists ([66fa611](https://github.com/ionic-team/stencil/commit/66fa611))
* **logger:** fix path to util for logger ([#165](https://github.com/ionic-team/stencil/issues/165)) ([d1e129e](https://github.com/ionic-team/stencil/commit/d1e129e))
* **sw:** enable sw when not on file: protocol ([e4a44b5](https://github.com/ionic-team/stencil/commit/e4a44b5))


### Features

* **config:** add config.emptyDist and emptyWWW ([f3fb13c](https://github.com/ionic-team/stencil/commit/f3fb13c))
* **init:** stencil init to generate stencil.config.js ([8c12711](https://github.com/ionic-team/stencil/commit/8c12711))
* **testing:** move the testing utilities into their own module ([#161](https://github.com/ionic-team/stencil/issues/161)) ([91ad8b9](https://github.com/ionic-team/stencil/commit/91ad8b9))



<a name="0.0.5-23"></a>
## [0.0.5-23](https://github.com/ionic-team/stencil/compare/v0.0.5-22...v0.0.5-23) (2017-09-15)


### Bug Fixes

* **build:** do not minify componentOnReady() ([d308548](https://github.com/ionic-team/stencil/commit/d308548))



<a name="0.0.5-22"></a>
## [0.0.5-22](https://github.com/ionic-team/stencil/compare/v0.0.5-21...v0.0.5-22) (2017-09-15)


### Bug Fixes

* **proxy:** prevent CC to rename proxy methods ([2cb302f](https://github.com/ionic-team/stencil/commit/2cb302f))



<a name="0.0.5-21"></a>
## [0.0.5-21](https://github.com/ionic-team/stencil/compare/v0.0.5-20...v0.0.5-21) (2017-09-15)



<a name="0.0.5-20"></a>
## [0.0.5-20](https://github.com/ionic-team/stencil/compare/v0.0.5-19...v0.0.5-20) (2017-09-15)


### Bug Fixes

* add dist/testing to exported files ([e8d92e7](https://github.com/ionic-team/stencil/commit/e8d92e7))
* **package:** np's infinite loop ([23f2cb9](https://github.com/ionic-team/stencil/commit/23f2cb9))



<a name="0.0.5-19"></a>
## [0.0.5-19](https://github.com/ionic-team/stencil/compare/v0.0.5-18...v0.0.5-19) (2017-09-15)


### Bug Fixes

* **proxy:** proxy all method calls ([5a5e86e](https://github.com/ionic-team/stencil/commit/5a5e86e))
* **ssr:** fix default logger for ssr ([#159](https://github.com/ionic-team/stencil/issues/159)) ([0db27d2](https://github.com/ionic-team/stencil/commit/0db27d2))



<a name="0.0.5-18"></a>
## [0.0.5-18](https://github.com/ionic-team/stencil/compare/v0.0.5-17...v0.0.5-18) (2017-09-14)


### Bug Fixes

* **jsx-to-vnode:** contentEditable property/attribute and boolean/string works ([b59ba3c](https://github.com/ionic-team/stencil/commit/b59ba3c)), closes [#130](https://github.com/ionic-team/stencil/issues/130)
* corrected decorator transforms to ignore unknown Decorators and added tests to validate. ([18cdaf7](https://github.com/ionic-team/stencil/commit/18cdaf7))
* **slot:** change order of transpile transforms ([6db3078](https://github.com/ionic-team/stencil/commit/6db3078))
* **ssr:** patch raf on platform server ([47e9521](https://github.com/ionic-team/stencil/commit/47e9521))


### Features

* **distribution:** generateDistribution config option ([d43f7f9](https://github.com/ionic-team/stencil/commit/d43f7f9))
* **testing:** add a synchronous transpile for use in unit tests ([a1a08cc](https://github.com/ionic-team/stencil/commit/a1a08cc))
* **testing:** expose the testing utilities ([f2e719c](https://github.com/ionic-team/stencil/commit/f2e719c))



<a name="0.0.5-17"></a>
## [0.0.5-17](https://github.com/ionic-team/stencil/compare/v0.0.5-16...v0.0.5-17) (2017-09-09)


### Bug Fixes

* **init:** double check ancestor loaded ([0821d5b](https://github.com/ionic-team/stencil/commit/0821d5b))
* **prerendering:** do not overwrite prerendered www index ([1b7a885](https://github.com/ionic-team/stencil/commit/1b7a885))
* **service-worker:** remove navigateFallback as its not needed with prerendering ([54c61aa](https://github.com/ionic-team/stencil/commit/54c61aa))


### Features

* **componentOnReady:** run callback or return promise ([8acafbe](https://github.com/ionic-team/stencil/commit/8acafbe))



<a name="0.0.5-16"></a>
## [0.0.5-16](https://github.com/ionic-team/stencil/compare/v0.0.5-15...v0.0.5-16) (2017-09-06)


### Bug Fixes

* **package:** add files to npm publish ([f639a6b](https://github.com/ionic-team/stencil/commit/f639a6b))



<a name="0.0.5-15"></a>
## [0.0.5-15](https://github.com/ionic-team/stencil/compare/v0.0.5-14...v0.0.5-15) (2017-09-06)


### Bug Fixes

* **build:** ensure src index.html copied to www ([6af223e](https://github.com/ionic-team/stencil/commit/6af223e))


### Features

* **service-worker:** generate service worker ([c51d975](https://github.com/ionic-team/stencil/commit/c51d975))



<a name="0.0.5-14"></a>
## [0.0.5-14](https://github.com/ionic-team/stencil/compare/v0.0.5-13...v0.0.5-14) (2017-09-06)


### Features

* **location:** add window.location to prop context ([b6bcd32](https://github.com/ionic-team/stencil/commit/b6bcd32))



<a name="0.0.5-13"></a>
## [0.0.5-13](https://github.com/ionic-team/stencil/compare/v0.0.5-12...v0.0.5-13) (2017-09-05)


### Bug Fixes

* **attrs:** add autoComplete and autoFocus as known attributes ([6e2d10f](https://github.com/ionic-team/stencil/commit/6e2d10f))


### Features

* **copy:** add copy tasks and config to build ([248227a](https://github.com/ionic-team/stencil/commit/248227a))
* **env:** replace process.env.NODE_ENV at build time ([2b55142](https://github.com/ionic-team/stencil/commit/2b55142))
* **env:** set process.env.NODE_ENV on each build ([2e94956](https://github.com/ionic-team/stencil/commit/2e94956))



<a name="0.0.5-12"></a>
## [0.0.5-12](https://github.com/ionic-team/stencil/compare/v0.0.5-11...v0.0.5-12) (2017-09-03)


### Bug Fixes

* **ssr:** ensure whitespace between dynamic and static text nodes ([a208ca0](https://github.com/ionic-team/stencil/commit/a208ca0))


### Features

* **testing:** layout the basic testing API ([90a6f2b](https://github.com/ionic-team/stencil/commit/90a6f2b))



<a name="0.0.5-11"></a>
## [0.0.5-11](https://github.com/ionic-team/stencil/compare/v0.0.5-10...v0.0.5-11) (2017-09-03)


### Bug Fixes

* **listen:** detect when to use passive listeners ([9412d26](https://github.com/ionic-team/stencil/commit/9412d26))
* **ssr:** do not duplicate and re-render ssr elements ([13eb6d4](https://github.com/ionic-team/stencil/commit/13eb6d4))
* **ssr:** fix logger require ([15f7c25](https://github.com/ionic-team/stencil/commit/15f7c25)), closes [#111](https://github.com/ionic-team/stencil/issues/111)


### Features

* **ssr:** remove ssr attributes and comments at runtime ([9e00807](https://github.com/ionic-team/stencil/commit/9e00807))



<a name="0.0.5-10"></a>
## [0.0.5-10](https://github.com/ionic-team/stencil/compare/v0.0.5-9...v0.0.5-10) (2017-08-31)


### Bug Fixes

* **proxy:** check for falsy value ([94edf21](https://github.com/ionic-team/stencil/commit/94edf21))


### Features

* **prerender:** prerender app ([deb75b4](https://github.com/ionic-team/stencil/commit/deb75b4))



<a name="0.0.5-9"></a>
## [0.0.5-9](https://github.com/ionic-team/stencil/compare/v0.0.5-8...v0.0.5-9) (2017-08-31)


### Bug Fixes

* **event:** onDoubleClick -> onDblClick ([5b8c54a](https://github.com/ionic-team/stencil/commit/5b8c54a)), closes [#118](https://github.com/ionic-team/stencil/issues/118)
* **jsx:** fix string values for class attribute ([774d634](https://github.com/ionic-team/stencil/commit/774d634)), closes [#95](https://github.com/ionic-team/stencil/issues/95)
* **render:** remove child vnodes when render() returns null ([9839caf](https://github.com/ionic-team/stencil/commit/9839caf)), closes [#57](https://github.com/ionic-team/stencil/issues/57)


### Features

* **polyfill:** add object-assign polyfill ([0e1347f](https://github.com/ionic-team/stencil/commit/0e1347f)), closes [#119](https://github.com/ionic-team/stencil/issues/119)
* **utils:** add arrow key codes ([f9d10c8](https://github.com/ionic-team/stencil/commit/f9d10c8))



<a name="0.0.5-8"></a>
## [0.0.5-8](https://github.com/ionic-team/stencil/compare/v0.0.5-7...v0.0.5-8) (2017-08-30)


### Bug Fixes

* **lifecycle:** fix typo in life cycle events map ([30f5ff4](https://github.com/ionic-team/stencil/commit/30f5ff4))
* **prerender:** prerender with sass changes ([9c5a6b7](https://github.com/ionic-team/stencil/commit/9c5a6b7))


### Features

* **cli:** add --skip-node-check option ([a455050](https://github.com/ionic-team/stencil/commit/a455050)), closes [#106](https://github.com/ionic-team/stencil/issues/106)
* **config:** do not require config.bundles ([488ec46](https://github.com/ionic-team/stencil/commit/488ec46))
* **lifecycle:** resolve lifecycle promises before render ([6e84996](https://github.com/ionic-team/stencil/commit/6e84996))



<a name="0.0.5-7"></a>
## [0.0.5-7](https://github.com/ionic-team/stencil/compare/v0.0.5-4...v0.0.5-7) (2017-08-17)


### Bug Fixes

* **sys:** set rollup as dependency ([12fdc4f](https://github.com/ionic-team/stencil/commit/12fdc4f))


### Features

* **prerender:** add isPrerender to Context ([fbcd0b8](https://github.com/ionic-team/stencil/commit/fbcd0b8))



<a name="0.0.5-4"></a>
## [0.0.5-4](https://github.com/ionic-team/stencil/compare/v0.0.5-3...v0.0.5-4) (2017-08-14)


### Bug Fixes

* ensure closure does not change my attribute for observer. ([266f423](https://github.com/ionic-team/stencil/commit/266f423))



<a name="0.0.5-3"></a>
## [0.0.5-3](https://github.com/ionic-team/stencil/compare/v0.0.5-2...v0.0.5-3) (2017-08-14)



<a name="0.0.5-2"></a>
## [0.0.5-2](https://github.com/ionic-team/stencil/compare/v0.0.5-1...v0.0.5-2) (2017-08-14)


### Bug Fixes

* ensure that we ignore render modifications during an observation of an outside mutation. ([2b09e77](https://github.com/ionic-team/stencil/commit/2b09e77))



<a name="0.0.5-1"></a>
## [0.0.5-1](https://github.com/ionic-team/stencil/compare/v0.0.5-0...v0.0.5-1) (2017-08-14)


### Bug Fixes

* **build:** copy index when prerender skipped ([e161afa](https://github.com/ionic-team/stencil/commit/e161afa))
* **disconnect:** double check the element is disconnected ([e349976](https://github.com/ionic-team/stencil/commit/e349976))
* **disconnect:** ensure ancestor components load ([e9eb64e](https://github.com/ionic-team/stencil/commit/e9eb64e))


### Features

* added mutation observer to watch elements so that if an outside lib changes them we will revert. ([3a21813](https://github.com/ionic-team/stencil/commit/3a21813))



<a name="0.0.5-0"></a>
## [0.0.5-0](https://github.com/ionic-team/stencil/compare/v0.0.4...v0.0.5-0) (2017-08-13)


### Bug Fixes

* **build:** check for moduleFile existence ([64f1f8d](https://github.com/ionic-team/stencil/commit/64f1f8d))
* **externs:** do not property rename fetch ([3fdf09a](https://github.com/ionic-team/stencil/commit/3fdf09a))
* **index:** always show build msg on first build ([84d6245](https://github.com/ionic-team/stencil/commit/84d6245))
* **now:** remove getNowFunction fn ([023c9cc](https://github.com/ionic-team/stencil/commit/023c9cc))
* **rollup:** update rollup api ([2acb140](https://github.com/ionic-team/stencil/commit/2acb140))


### Features

* **polyfills:** generate core with polyfills file ([68549b4](https://github.com/ionic-team/stencil/commit/68549b4))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/ionic-team/stencil/compare/v0.0.4-14...v0.0.4) (2017-08-11)


### Bug Fixes

* **proxy:** ensure falsy values are still set on property ([e96b2bf](https://github.com/ionic-team/stencil/commit/e96b2bf))



<a name="0.0.4-14"></a>
## [0.0.4-14](https://github.com/ionic-team/stencil/compare/v0.0.4-13...v0.0.4-14) (2017-08-11)


### Bug Fixes

* **ssr:** default mode and color props on server ([2059420](https://github.com/ionic-team/stencil/commit/2059420))
* **ssr:** ensure inserted styles come after ssr styles ([8a73ab7](https://github.com/ionic-team/stencil/commit/8a73ab7))



<a name="0.0.4-13"></a>
## [0.0.4-13](https://github.com/ionic-team/stencil/compare/v0.0.4-12...v0.0.4-13) (2017-08-11)


### Bug Fixes

* **ssr:** test for css and root node both loaded ([df02862](https://github.com/ionic-team/stencil/commit/df02862))



<a name="0.0.4-12"></a>
## [0.0.4-12](https://github.com/ionic-team/stencil/compare/v0.0.4-11...v0.0.4-12) (2017-08-10)


### Bug Fixes

* **color:** observe color attr changes ([6bb804c](https://github.com/ionic-team/stencil/commit/6bb804c))
* **ssr:** fix inlined css ([1a89d0b](https://github.com/ionic-team/stencil/commit/1a89d0b))



<a name="0.0.4-11"></a>
## [0.0.4-11](https://github.com/ionic-team/stencil/compare/v0.0.4-10...v0.0.4-11) (2017-08-10)


### Bug Fixes

* **compiler:** check for invalid connect data ([78e3841](https://github.com/ionic-team/stencil/commit/78e3841))
* **ssr:** get Context object from platform ([2bee940](https://github.com/ionic-team/stencil/commit/2bee940))
* **ssr:** update Context w/ app globals ([d6d2a2d](https://github.com/ionic-team/stencil/commit/d6d2a2d))



<a name="0.0.4-10"></a>
## [0.0.4-10](https://github.com/ionic-team/stencil/compare/v0.0.4-9...v0.0.4-10) (2017-08-10)


### Bug Fixes

* **inlining:** ensure js inlining accounts for / ([59cefd2](https://github.com/ionic-team/stencil/commit/59cefd2))



<a name="0.0.4-9"></a>
## [0.0.4-9](https://github.com/ionic-team/stencil/compare/v0.0.4-8...v0.0.4-9) (2017-08-10)


### Bug Fixes

* **emit:** double check we've got an element to emit from ([6148ec3](https://github.com/ionic-team/stencil/commit/6148ec3))


### Features

* **cli:** force prod mode when using dev server ([63cd322](https://github.com/ionic-team/stencil/commit/63cd322))
* **connect:** connect and reuse global app components ([e65e18a](https://github.com/ionic-team/stencil/commit/e65e18a))



<a name="0.0.4-8"></a>
## [0.0.4-8](https://github.com/ionic-team/stencil/compare/v0.0.4-7...v0.0.4-8) (2017-08-09)


### Bug Fixes

* **attrs:** fix attribute name values ([458fa1f](https://github.com/ionic-team/stencil/commit/458fa1f))



<a name="0.0.4-7"></a>
## [0.0.4-7](https://github.com/ionic-team/stencil/compare/v0.0.4-6...v0.0.4-7) (2017-08-09)


### Bug Fixes

* no need to manually add the slash anymore ([9c57871](https://github.com/ionic-team/stencil/commit/9c57871))


### Features

* **context:** set props from context ([51c0942](https://github.com/ionic-team/stencil/commit/51c0942))



<a name="0.0.4-6"></a>
## [0.0.4-6](https://github.com/ionic-team/stencil/compare/v0.0.4-5...v0.0.4-6) (2017-08-03)


### Features

* **config:** watch config file for changes ([25bd0ae](https://github.com/ionic-team/stencil/commit/25bd0ae))



<a name="0.0.4-5"></a>
## [0.0.4-5](https://github.com/ionic-team/stencil/compare/v0.0.4-4...v0.0.4-5) (2017-08-03)


### Bug Fixes

* **errors:** fix false dup Component per file error ([7b7772d](https://github.com/ionic-team/stencil/commit/7b7772d))
* **errors:** improve dup component message ([b66a313](https://github.com/ionic-team/stencil/commit/b66a313))



<a name="0.0.4-4"></a>
## [0.0.4-4](https://github.com/ionic-team/stencil/compare/v0.0.4-3...v0.0.4-4) (2017-08-03)


### Bug Fixes

* **build:** skip build sections after errors ([b2ff454](https://github.com/ionic-team/stencil/commit/b2ff454))
* **bundle:** improve bundle errors ([049867c](https://github.com/ionic-team/stencil/commit/049867c))
* **command:** remove --prod flag ([e543348](https://github.com/ionic-team/stencil/commit/e543348))
* **errors:** catch ssr runtime errors ([24d3025](https://github.com/ionic-team/stencil/commit/24d3025))
* **errors:** dedup error messages ([d8f6331](https://github.com/ionic-team/stencil/commit/d8f6331))
* **errors:** fix bundling error output ([e83a671](https://github.com/ionic-team/stencil/commit/e83a671))
* **errors:** improve bundle errors ([b4977fa](https://github.com/ionic-team/stencil/commit/b4977fa))
* **errors:** print multiple errors ([e6bcd62](https://github.com/ionic-team/stencil/commit/e6bcd62))
* **global:** bundle dependent global imports ([2648cb1](https://github.com/ionic-team/stencil/commit/2648cb1))
* **interfaces:** set global interfaces with "var" ([f7da3d0](https://github.com/ionic-team/stencil/commit/f7da3d0))
* **warns:** do not warn for false top level message ([a327835](https://github.com/ionic-team/stencil/commit/a327835))


### Features

* **definitions:** write component .d.ts files ([66d3205](https://github.com/ionic-team/stencil/commit/66d3205))
* **errors:** improve runtime error reporting during builds ([51db132](https://github.com/ionic-team/stencil/commit/51db132))
* **global:** run global scripts during ssr ([84653d3](https://github.com/ionic-team/stencil/commit/84653d3))
* **jsx:** create global JSXElements namespace ([57099df](https://github.com/ionic-team/stencil/commit/57099df))
* **sys:** resolve collection location from package.json property ([052d7ab](https://github.com/ionic-team/stencil/commit/052d7ab))
* **version:** print version ([753f770](https://github.com/ionic-team/stencil/commit/753f770))



<a name="0.0.4-3"></a>
## [0.0.4-3](https://github.com/ionic-team/stencil/compare/v0.0.4-2...v0.0.4-3) (2017-07-28)


### Features

* **build:** show loading page on initial build ([9462ad8](https://github.com/ionic-team/stencil/commit/9462ad8))
* **prodMode:** default to prod mode ([e6dbdd2](https://github.com/ionic-team/stencil/commit/e6dbdd2))



<a name="0.0.4-2"></a>
## [0.0.4-2](https://github.com/ionic-team/stencil/compare/v0.0.4-0...v0.0.4-2) (2017-07-28)


### Bug Fixes

* **inline-loader:** add slash so url were building is correct ([7c5a5e7](https://github.com/ionic-team/stencil/commit/7c5a5e7))
* **prerender:** fix bug where prerendering wasn't happening ([ef59e69](https://github.com/ionic-team/stencil/commit/ef59e69))


### Features

* **listeners:** queue events before instance is ready ([9daf9c5](https://github.com/ionic-team/stencil/commit/9daf9c5))


### Performance Improvements

* **assets:** skip copying assets on rebuilds ([9907d0f](https://github.com/ionic-team/stencil/commit/9907d0f))



<a name="0.0.4-0"></a>
## [0.0.4-0](https://github.com/ionic-team/stencil/compare/v0.0.2...v0.0.4-0) (2017-07-26)


### Bug Fixes

* **compiler:** normalize all paths ([d222912](https://github.com/ionic-team/stencil/commit/d222912))
* **listener:** queue update from user listener ([aee8be9](https://github.com/ionic-team/stencil/commit/aee8be9))
* **uglify:** update to uglify-es ([b150ec0](https://github.com/ionic-team/stencil/commit/b150ec0))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/ionic-team/stencil/compare/v0.0.2-8...v0.0.2) (2017-07-25)



<a name="0.0.2-8"></a>
## [0.0.2-8](https://github.com/ionic-team/stencil/compare/v0.0.2-7...v0.0.2-8) (2017-07-25)


### Bug Fixes

* **jsdom:** destroy jsdom window ([763c9b9](https://github.com/ionic-team/stencil/commit/763c9b9))
* **jsdom:** pass all args to diagnostics ([3271b48](https://github.com/ionic-team/stencil/commit/3271b48))
* **minify:** fix minify error messages ([8757e14](https://github.com/ionic-team/stencil/commit/8757e14))
* **utils:** always use unix path seperator instead of the system path seperator ([8e33f42](https://github.com/ionic-team/stencil/commit/8e33f42))
* **vm:** use window for sandboxed vm context ([af3ab29](https://github.com/ionic-team/stencil/commit/af3ab29)), closes [#54](https://github.com/ionic-team/stencil/issues/54)


### Features

* **entry:** add entry option to config ([5e25a9e](https://github.com/ionic-team/stencil/commit/5e25a9e))
* **interface:** add h() to global interface ([224e723](https://github.com/ionic-team/stencil/commit/224e723))



<a name="0.0.2-7"></a>
## [0.0.2-7](https://github.com/ionic-team/stencil/compare/v0.0.2-6...v0.0.2-7) (2017-07-18)


### Bug Fixes

* **loader:** add hydrated css ([a0f85e0](https://github.com/ionic-team/stencil/commit/a0f85e0))
* **logger:** improve print diagnostics ([a37a94e](https://github.com/ionic-team/stencil/commit/a37a94e))


### Features

* **assets:** copy assetDirs to build and collection ([9330db5](https://github.com/ionic-team/stencil/commit/9330db5))
* **gem:** diamond in the rough ([96d991c](https://github.com/ionic-team/stencil/commit/96d991c))


### Performance Improvements

* **build:** skip build phases when error occurs ([72f7688](https://github.com/ionic-team/stencil/commit/72f7688))



<a name="0.0.2-6"></a>
## [0.0.2-6](https://github.com/ionic-team/stencil/compare/v0.0.2-1...v0.0.2-6) (2017-07-18)


### Bug Fixes

* add innerHTML attribute for snabbdom. ([982c1ba](https://github.com/ionic-team/stencil/commit/982c1ba))
* corrected class attribute value types. ([49c94b3](https://github.com/ionic-team/stencil/commit/49c94b3))
* **core:** fix publicPath on polyfilled core ([c6d808e](https://github.com/ionic-team/stencil/commit/c6d808e))
* **module:** fix dev async module loading ([515c701](https://github.com/ionic-team/stencil/commit/515c701))
* move copy process for assets later than file writes. ([3eabdbb](https://github.com/ionic-team/stencil/commit/3eabdbb))
* removed duplicate reference to publicPath. ([9ce0a7b](https://github.com/ionic-team/stencil/commit/9ce0a7b))


### Features

* **compiler:** pre-render index ([54cf1a1](https://github.com/ionic-team/stencil/commit/54cf1a1))
* add publicPath as an export of Stencil. ([a502bdb](https://github.com/ionic-team/stencil/commit/a502bdb))
* added some really simple cli help '--help' ([8a6faf0](https://github.com/ionic-team/stencil/commit/8a6faf0))
* **hydrated:** use unicode hydrated css for funzies ([4f48ad8](https://github.com/ionic-team/stencil/commit/4f48ad8))
* **loader:** inline loader js into index html by default ([95ec710](https://github.com/ionic-team/stencil/commit/95ec710))
* **loader:** inline loader script ([2c27e95](https://github.com/ionic-team/stencil/commit/2c27e95))
* **publicPath:** add publicPath as global within component closure ([3891764](https://github.com/ionic-team/stencil/commit/3891764))



<a name="0.0.2-1"></a>
## [0.0.2-1](https://github.com/ionic-team/stencil/compare/v0.0.2-0...v0.0.2-1) (2017-07-13)


### Bug Fixes

* add slot element jsx type. ([56497ac](https://github.com/ionic-team/stencil/commit/56497ac))
* **rmDir:** empty dest dir on builds ([9431461](https://github.com/ionic-team/stencil/commit/9431461))


### Features

* add all JSX HTML element types. ([15504f5](https://github.com/ionic-team/stencil/commit/15504f5))


### Performance Improvements

* **transpile:** skip transpile if not ts updates on watch ([faa13e5](https://github.com/ionic-team/stencil/commit/faa13e5))
* do not write project files if no updates ([dba8f87](https://github.com/ionic-team/stencil/commit/dba8f87))



<a name="0.0.2-0"></a>
## [0.0.2-0](https://github.com/ionic-team/stencil/compare/v0.0.1...v0.0.2-0) (2017-07-12)


### Bug Fixes

* **compiler:** normalize paths for windows ([4eb9db0](https://github.com/ionic-team/stencil/commit/4eb9db0))
* **html:** fix html error formatting ([b850b07](https://github.com/ionic-team/stencil/commit/b850b07))
* **paths:** manifest relative paths ([e843bbd](https://github.com/ionic-team/stencil/commit/e843bbd))
* **ts:** remove jsx hack ([d1df895](https://github.com/ionic-team/stencil/commit/d1df895))
* corrected path issues with sass files in included collections. ([0f9395f](https://github.com/ionic-team/stencil/commit/0f9395f))
* if there is no diagnostics file then do not throw on removal. ([2456260](https://github.com/ionic-team/stencil/commit/2456260))
* remove normalize from resolve-from. ([7acbd83](https://github.com/ionic-team/stencil/commit/7acbd83))
* validateUserBundles ([ea68092](https://github.com/ionic-team/stencil/commit/ea68092))


### Features

* **collection:** includeBundledOnly collection option ([be00ded](https://github.com/ionic-team/stencil/commit/be00ded))
* **config:** create hashFileNames config ([4984da1](https://github.com/ionic-team/stencil/commit/4984da1))
* **core:** forever cache core file ([0a03edc](https://github.com/ionic-team/stencil/commit/0a03edc))
* **logger:** improve typescript error logging ([7a6bd14](https://github.com/ionic-team/stencil/commit/7a6bd14))
* **polyfill:** polyfill custom elements ([a56730c](https://github.com/ionic-team/stencil/commit/a56730c))
* **validation:** create validation file ([753f18f](https://github.com/ionic-team/stencil/commit/753f18f))
* add copy and remove directory. ([ab253e8](https://github.com/ionic-team/stencil/commit/ab253e8))
* added jsx global types to stencil so that packages that depend on it do not need them. ([853fc6b](https://github.com/ionic-team/stencil/commit/853fc6b))
* added stencil config option for location of diagnostics file. ([8f6a3a2](https://github.com/ionic-team/stencil/commit/8f6a3a2))
* added support for assetsDir component metadata. ([482f113](https://github.com/ionic-team/stencil/commit/482f113))
* **watch:** add file watch/rebuild ([fa0816a](https://github.com/ionic-team/stencil/commit/fa0816a))


### Performance Improvements

* **compiler:** improved watch build perf ([a56a4f9](https://github.com/ionic-team/stencil/commit/a56a4f9))



<a name="0.0.1"></a>
## [0.0.1](https://github.com/ionic-team/stencil/compare/0be3c7b...v0.0.1) (2017-07-06)


### Bug Fixes

* **animations:** es5 this context ([b4a82de](https://github.com/ionic-team/stencil/commit/b4a82de))
* **animations:** keep it es5 yo ([fc8d0d8](https://github.com/ionic-team/stencil/commit/fc8d0d8))
* **animations:** set exactly when destroyed ([4339d5c](https://github.com/ionic-team/stencil/commit/4339d5c))
* **app:** remove the opacity for hovers on anchor buttons ([87b2830](https://github.com/ionic-team/stencil/commit/87b2830)), closes [#36](https://github.com/ionic-team/stencil/issues/36)
* **app:** update ion-app host css to work like all others ([2b4743c](https://github.com/ionic-team/stencil/commit/2b4743c))
* **attr:** correctly set data type from attribute strings ([64b7e4b](https://github.com/ionic-team/stencil/commit/64b7e4b))
* **attrs:** always lower case observed attrs, not camel ([7417484](https://github.com/ionic-team/stencil/commit/7417484))
* **badge:** use host and host-context mixins ([00d840b](https://github.com/ionic-team/stencil/commit/00d840b))
* **build:** put an any on it ([81922cb](https://github.com/ionic-team/stencil/commit/81922cb))
* **bundle:** use default mode when no specific mode available ([60b81e5](https://github.com/ionic-team/stencil/commit/60b81e5))
* **button:** add correct styling for color buttons in toolbar ([60ea371](https://github.com/ionic-team/stencil/commit/60ea371)), closes [#23](https://github.com/ionic-team/stencil/issues/23)
* **button:** add correct styling for color buttons in toolbar ([afc77cc](https://github.com/ionic-team/stencil/commit/afc77cc)), closes [#23](https://github.com/ionic-team/stencil/issues/23)
* **button:** add slot start/end for icons in buttons ([fc55128](https://github.com/ionic-team/stencil/commit/fc55128)), closes [#22](https://github.com/ionic-team/stencil/issues/22)
* **button:** add slots for icons in buttons, add item button class ([c5ff3ec](https://github.com/ionic-team/stencil/commit/c5ff3ec)), closes [#22](https://github.com/ionic-team/stencil/issues/22)
* **button:** add the class name for outline buttons ([a8c82ec](https://github.com/ionic-team/stencil/commit/a8c82ec)), closes [#37](https://github.com/ionic-team/stencil/issues/37)
* **button:** added disabled as a prop. ([0cf8912](https://github.com/ionic-team/stencil/commit/0cf8912))
* **button:** adds all style classes. ([7280ce0](https://github.com/ionic-team/stencil/commit/7280ce0))
* **button:** corrected button colors not appearing correctly. ([90e7e95](https://github.com/ionic-team/stencil/commit/90e7e95))
* **button:** corrected issue with colors required for styles. ([e25122a](https://github.com/ionic-team/stencil/commit/e25122a))
* **button:** pass the classes down from the host ([4c51497](https://github.com/ionic-team/stencil/commit/4c51497)), closes [#34](https://github.com/ionic-team/stencil/issues/34)
* **button:** set button-type from ion-buttons WillLoad ([f72198d](https://github.com/ionic-team/stencil/commit/f72198d))
* **buttons:** use ionViewDidLoad to add button type ([4ae9812](https://github.com/ionic-team/stencil/commit/4ae9812))
* **close:** use Ionic.emit ([df777c5](https://github.com/ionic-team/stencil/commit/df777c5))
* **compiler:** add svg namespace to svgs ([e9d59a1](https://github.com/ionic-team/stencil/commit/e9d59a1))
* **compiler:** derp ([6bc57f3](https://github.com/ionic-team/stencil/commit/6bc57f3))
* **compiler:** exclude unused components from registry ([3b411bf](https://github.com/ionic-team/stencil/commit/3b411bf))
* **compiler:** only allow one @Component per file ([179fe1a](https://github.com/ionic-team/stencil/commit/179fe1a))
* **compiler:** remove Ionic imports from all ts files ([12bd6cf](https://github.com/ionic-team/stencil/commit/12bd6cf))
* **config:** fix iOS mode config ([2a62bc2](https://github.com/ionic-team/stencil/commit/2a62bc2))
* **content:** readDimensions error ([8da0a79](https://github.com/ionic-team/stencil/commit/8da0a79)), closes [#6](https://github.com/ionic-team/stencil/issues/6)
* **core-hn:** fix icon causing toolbar to move once icon is loaded ([54c449e](https://github.com/ionic-team/stencil/commit/54c449e))
* **core-hn:** tab buttons now change opacity correctly ([97aaa65](https://github.com/ionic-team/stencil/commit/97aaa65))
* **core-hn:** tab-bar now looks correct on iOS ([e0f916b](https://github.com/ionic-team/stencil/commit/e0f916b))
* **core-hn:** use XMLHttpRequest instead of fetch ([9496e4a](https://github.com/ionic-team/stencil/commit/9496e4a))
* **css:** remove unused css ([2c9ea20](https://github.com/ionic-team/stencil/commit/2c9ea20))
* **disconnect:** check if parent is disconnected too ([ffe8f57](https://github.com/ionic-team/stencil/commit/ffe8f57))
* **disconnect:** ensure connect/disconnect isn't getting called too often ([dd50840](https://github.com/ionic-team/stencil/commit/dd50840))
* **disconnected:** while loops are hard ([0211130](https://github.com/ionic-team/stencil/commit/0211130))
* **dom:** dom fixes ([937ce4f](https://github.com/ionic-team/stencil/commit/937ce4f))
* **dom:** fix dom attributes ([26dbc4c](https://github.com/ionic-team/stencil/commit/26dbc4c))
* **emit:** default to bubbles true ([11b0926](https://github.com/ionic-team/stencil/commit/11b0926))
* **events:** default to always use passive event listeners ([25874cf](https://github.com/ionic-team/stencil/commit/25874cf))
* **events:** ensure elements exist ([c0b0bbd](https://github.com/ionic-team/stencil/commit/c0b0bbd))
* **externs:** add $instance to externs ([77ba85a](https://github.com/ionic-team/stencil/commit/77ba85a))
* **externs:** add QueueCtrl to externs ([4caf320](https://github.com/ionic-team/stencil/commit/4caf320))
* **fiber:** fix fiber demo ([ed32e30](https://github.com/ionic-team/stencil/commit/ed32e30))
* **host:** collect host content after async tick ([cd1cd5f](https://github.com/ionic-team/stencil/commit/cd1cd5f))
* **icon:** apply the proper styles to icons inside of buttons ([906a5ef](https://github.com/ionic-team/stencil/commit/906a5ef)), closes [#21](https://github.com/ionic-team/stencil/issues/21) [#22](https://github.com/ionic-team/stencil/issues/22)
* **icon:** change label and iconMode to State ([133b42f](https://github.com/ionic-team/stencil/commit/133b42f))
* **icon:** only add outline if isActive is false, fix iconMode ([27e3932](https://github.com/ionic-team/stencil/commit/27e3932))
* **jsx-transform:** change transform to follow through to all children ([54ce543](https://github.com/ionic-team/stencil/commit/54ce543))
* **loaded:** fix app has loaded ([f48db74](https://github.com/ionic-team/stencil/commit/f48db74))
* **loading:** change showSpinner and spinner to state ([32aaf4f](https://github.com/ionic-team/stencil/commit/32aaf4f))
* **loading:** fix duration ([becbd86](https://github.com/ionic-team/stencil/commit/becbd86))
* **loading:** use documentElement has root node ([ff0b043](https://github.com/ionic-team/stencil/commit/ff0b043))
* **location:** follow origin spec ([0b58568](https://github.com/ionic-team/stencil/commit/0b58568))
* **modal:** add correct classes for content and scroll ([5b94922](https://github.com/ionic-team/stencil/commit/5b94922))
* **modal:** add modals within app root ([d77a6ce](https://github.com/ionic-team/stencil/commit/d77a6ce))
* **modal:** fix animation ([55db7bd](https://github.com/ionic-team/stencil/commit/55db7bd))
* **modal:** handle loading for controllers ([7fe4903](https://github.com/ionic-team/stencil/commit/7fe4903))
* **modal:** modal updates ([7df9209](https://github.com/ionic-team/stencil/commit/7df9209))
* **overlay:** add overlay to externs ([a6b264c](https://github.com/ionic-team/stencil/commit/a6b264c))
* **overlays:** update to use Ionic.controller ([8eec2f8](https://github.com/ionic-team/stencil/commit/8eec2f8))
* **package:** update main script ([056e25e](https://github.com/ionic-team/stencil/commit/056e25e))
* **parse:** fix mode data parse ([8294d4b](https://github.com/ionic-team/stencil/commit/8294d4b))
* **parse:** fix parse css ([0b5caca](https://github.com/ionic-team/stencil/commit/0b5caca))
* **platform:** Correct loadComponents loop. ([03b9865](https://github.com/ionic-team/stencil/commit/03b9865))
* **platform:** do not check for innerHTML ([46e96c3](https://github.com/ionic-team/stencil/commit/46e96c3))
* **prod:** ensure HTML property does not get removed ([a1f8f64](https://github.com/ionic-team/stencil/commit/a1f8f64))
* **props:** do not delete getters/settings ([e27eb9d](https://github.com/ionic-team/stencil/commit/e27eb9d))
* **queue:** use raf based queue ([6062ad7](https://github.com/ionic-team/stencil/commit/6062ad7))
* **safari:** requestIdleCallback shim ([4b2de38](https://github.com/ionic-team/stencil/commit/4b2de38))
* **scroll:** create slot renderer for scroll ([a34e4d1](https://github.com/ionic-team/stencil/commit/a34e4d1))
* **shadow:** prepend to only one style element in shadow ([15e9b66](https://github.com/ionic-team/stencil/commit/15e9b66))
* **slides:** correct issue with paginationBulletRender. ([9268841](https://github.com/ionic-team/stencil/commit/9268841))
* **slides:** use ionViewWillUnload ([c01974d](https://github.com/ionic-team/stencil/commit/c01974d))
* **slot:** copy child node references ([4717ba2](https://github.com/ionic-team/stencil/commit/4717ba2))
* **slot:** fix nested default slots ([b419f57](https://github.com/ionic-team/stencil/commit/b419f57))
* **slot:** use slot so renderer knows not to remove nodes ([494e742](https://github.com/ionic-team/stencil/commit/494e742))
* **ssr:** add console to global context ([0ec10a5](https://github.com/ionic-team/stencil/commit/0ec10a5))
* **ssr:** dom fixes ([5a76600](https://github.com/ionic-team/stencil/commit/5a76600))
* **ssr:** fix load order ([e43a1f7](https://github.com/ionic-team/stencil/commit/e43a1f7))
* **styles:** attach styles to parent shadow root or document.head ([ea3368d](https://github.com/ionic-team/stencil/commit/ea3368d))
* **styles:** improve css concat ([8c5b8d3](https://github.com/ionic-team/stencil/commit/8c5b8d3))
* **styles:** prepend dynamically added styles ([07fe55a](https://github.com/ionic-team/stencil/commit/07fe55a))
* **svg:** add child element namespaces ([72ed82d](https://github.com/ionic-team/stencil/commit/72ed82d))
* **toggle:** add classes to the main toggle element ([8409187](https://github.com/ionic-team/stencil/commit/8409187))
* **toggle:** use slot for toggle styling and add demo in item ([88f97aa](https://github.com/ionic-team/stencil/commit/88f97aa))
* **toolbar:** add proper classes for title ([aba68de](https://github.com/ionic-team/stencil/commit/aba68de)), closes [#26](https://github.com/ionic-team/stencil/issues/26)
* **toolbar:** add proper classes to toolbar ([fa99b44](https://github.com/ionic-team/stencil/commit/fa99b44))
* **toolbar:** add slots for start, end, mode-start, mode-end ([c9a52d8](https://github.com/ionic-team/stencil/commit/c9a52d8))
* **toolbar:** corrected sass to use :host. ([41418c7](https://github.com/ionic-team/stencil/commit/41418c7))
* **toolbar:** fix the styling of buttons and icons in toolbars ([5cef4ea](https://github.com/ionic-team/stencil/commit/5cef4ea)), closes [#5](https://github.com/ionic-team/stencil/issues/5) [#20](https://github.com/ionic-team/stencil/issues/20)
* **toolbar:** remove host from ios toolbar background ([ac24fee](https://github.com/ionic-team/stencil/commit/ac24fee))
* **toolbar:** update ion-button from ionViewWillLoad ([ea6ffef](https://github.com/ionic-team/stencil/commit/ea6ffef))
* **ts:** pin typescript 2.4.0 ([1b1c709](https://github.com/ionic-team/stencil/commit/1b1c709))
* **util:** if prop value is null return it ([9760780](https://github.com/ionic-team/stencil/commit/9760780))
* **visibility:** fix how it find the top parent component ([395393b](https://github.com/ionic-team/stencil/commit/395393b))
* commented out ion-button and ion-icon for alpha testing. ([7bd761f](https://github.com/ionic-team/stencil/commit/7bd761f))
* **watchers:** wire up functions correctly ([35e1aba](https://github.com/ionic-team/stencil/commit/35e1aba))
* throw error when a bundle includes a tag that has no corresponding component. ([672f95d](https://github.com/ionic-team/stencil/commit/672f95d))
* **window:** add timeouts to server window ([7c035e1](https://github.com/ionic-team/stencil/commit/7c035e1))
* added hack for now so that utils do not throw errors on missing promise. ([784e95a](https://github.com/ionic-team/stencil/commit/784e95a))
* change button div to be an actual button. ([7ee5114](https://github.com/ionic-team/stencil/commit/7ee5114))
* copy vendor into the compiled directories during build. ([6ecb6f9](https://github.com/ionic-team/stencil/commit/6ecb6f9))
* correct location of index in slides. ([b2ec37c](https://github.com/ionic-team/stencil/commit/b2ec37c))
* corrected class name for swiper wrapper. ([5445078](https://github.com/ionic-team/stencil/commit/5445078))
* empty bundles dir on prod builds ([202a52b](https://github.com/ionic-team/stencil/commit/202a52b))
* ensure t is passed as an argument to components. ([90324a4](https://github.com/ionic-team/stencil/commit/90324a4))
* fs interface ([37cc9dc](https://github.com/ionic-team/stencil/commit/37cc9dc))
* ion-button can now take an href. ([6058e38](https://github.com/ionic-team/stencil/commit/6058e38))
* move swiper to be local and have a default export. ([76f13ba](https://github.com/ionic-team/stencil/commit/76f13ba))
* remove from copy angular for alpha instead of having a seperate whitelist. ([43db3e9](https://github.com/ionic-team/stencil/commit/43db3e9))
* Slider JS works, but not css. ([ee628e4](https://github.com/ionic-team/stencil/commit/ee628e4))
* ts errors ([ac7bdc1](https://github.com/ionic-team/stencil/commit/ac7bdc1))


### Features

* **animation:** animation interface ([47ca289](https://github.com/ionic-team/stencil/commit/47ca289))
* **animation:** build external ionic.animation.js file ([13f52a1](https://github.com/ionic-team/stencil/commit/13f52a1))
* **animation:** init animation ([a0205f8](https://github.com/ionic-team/stencil/commit/a0205f8))
* **animations:** lazy load animations after app load ([0095b93](https://github.com/ionic-team/stencil/commit/0095b93))
* **app:** fire ionLoad event when app has finished loading ([2b4f5f8](https://github.com/ionic-team/stencil/commit/2b4f5f8))
* **blocker:** auto gesture blocker prop ([7720cac](https://github.com/ionic-team/stencil/commit/7720cac))
* **button:** Add button styles. ([f60c1a6](https://github.com/ionic-team/stencil/commit/f60c1a6))
* **button:** added button component and some styles. ([b422244](https://github.com/ionic-team/stencil/commit/b422244))
* **buttons:** add ion-buttons component ([70c37c5](https://github.com/ionic-team/stencil/commit/70c37c5))
* **compiler:** add method Decorator ([d56c66e](https://github.com/ionic-team/stencil/commit/d56c66e))
* **compiler:** allow more than one event name on listener ([4df5791](https://github.com/ionic-team/stencil/commit/4df5791))
* **compiler:** collect method names from component class ([409d2b0](https://github.com/ionic-team/stencil/commit/409d2b0))
* **compiler:** default to shadow: false ([1308920](https://github.com/ionic-team/stencil/commit/1308920))
* **compiler:** good passive defaults when no provided ([62287df](https://github.com/ionic-team/stencil/commit/62287df))
* **compiler:** pretty print registry in dev mode ([6dfedbc](https://github.com/ionic-team/stencil/commit/6dfedbc))
* **compiler:** State() decorator ([371b4b0](https://github.com/ionic-team/stencil/commit/371b4b0))
* **content:** add height attr for SSR header sizing ([0cc09ce](https://github.com/ionic-team/stencil/commit/0cc09ce))
* **core-hn:** nested comments ([0160bb8](https://github.com/ionic-team/stencil/commit/0160bb8))
* **dom:** server dom ([ce466e3](https://github.com/ionic-team/stencil/commit/ce466e3))
* **grid:** add grid component ([90922fa](https://github.com/ionic-team/stencil/commit/90922fa))
* **header:** add header and footer component ([f12f901](https://github.com/ionic-team/stencil/commit/f12f901))
* **hydrated:** auto apply hydrated css ([bb13520](https://github.com/ionic-team/stencil/commit/bb13520))
* **icon:** add icon class and styles, build for web ([181210f](https://github.com/ionic-team/stencil/commit/181210f))
* **icon:** add icon to angular bundle, add icon test ([56a7658](https://github.com/ionic-team/stencil/commit/56a7658))
* **ion-card:** Added ionic cards ts and css. ([0be3c7b](https://github.com/ionic-team/stencil/commit/0be3c7b))
* **ionicons:** add ionicon files, css, and modify build ([313c26f](https://github.com/ionic-team/stencil/commit/313c26f))
* **item:** child item components emit style data ([9130e80](https://github.com/ionic-team/stencil/commit/9130e80))
* **item-divider:** add styling for item divider and get it rendering ([7853e9f](https://github.com/ionic-team/stencil/commit/7853e9f))
* **jsx:** allow use of jsx within our components. ([3897895](https://github.com/ionic-team/stencil/commit/3897895))
* **lifecycle:** add more lifecycle events, prefer ionViewWillLoad ([93c8d56](https://github.com/ionic-team/stencil/commit/93c8d56))
* **lifecycle:** rename lifecycle events to be generic ([59cb733](https://github.com/ionic-team/stencil/commit/59cb733))
* **loading:** bottom to top did load events ([cbf1968](https://github.com/ionic-team/stencil/commit/cbf1968))
* **loading:** loading overlay ([81b4ba2](https://github.com/ionic-team/stencil/commit/81b4ba2))
* **menu:** init menu port ([50a3b81](https://github.com/ionic-team/stencil/commit/50a3b81))
* **mixins:** add host and host-context mixins ([5adf17a](https://github.com/ionic-team/stencil/commit/5adf17a))
* **modal:** add user params to this context ([9682ef0](https://github.com/ionic-team/stencil/commit/9682ef0))
* **modal:** async inject user modal content ([4ae3173](https://github.com/ionic-team/stencil/commit/4ae3173))
* **modal:** async load modal controller ([764bc20](https://github.com/ionic-team/stencil/commit/764bc20))
* **modal:** enter modal animation ([617ec26](https://github.com/ionic-team/stencil/commit/617ec26))
* **modal:** init modal ([7f17263](https://github.com/ionic-team/stencil/commit/7f17263))
* **modal:** modal dismiss ([d49a897](https://github.com/ionic-team/stencil/commit/d49a897))
* **navbar:** init navbar ([aeb64c0](https://github.com/ionic-team/stencil/commit/aeb64c0))
* **note:** add note component ([0fe6a79](https://github.com/ionic-team/stencil/commit/0fe6a79))
* **overlay:** Ionic.overlay ([f302275](https://github.com/ionic-team/stencil/commit/f302275))
* **page:** add ion-page ([36f98a8](https://github.com/ionic-team/stencil/commit/36f98a8))
* **prop:** two-way binding option ([4f13759](https://github.com/ionic-team/stencil/commit/4f13759))
* **props:** print warning when modifying props ([8f495d9](https://github.com/ionic-team/stencil/commit/8f495d9))
* **proxy:** whenReady fn ([feb731b](https://github.com/ionic-team/stencil/commit/feb731b))
* **queue:** ability to set queue priorities ([99eb1b8](https://github.com/ionic-team/stencil/commit/99eb1b8))
* **queue:** auto add events to the queue ([e29ba28](https://github.com/ionic-team/stencil/commit/e29ba28))
* **queue:** init queue priorities ([2c71a42](https://github.com/ionic-team/stencil/commit/2c71a42))
* **render:** $tmpDisconnected flag ([27b6c26](https://github.com/ionic-team/stencil/commit/27b6c26))
* **render:** manual named slot content projection ([871f9c8](https://github.com/ionic-team/stencil/commit/871f9c8))
* **renderer:** ref callback ([8276cbc](https://github.com/ionic-team/stencil/commit/8276cbc))
* **skeleton:** add ion-skeleton-text ([8742d67](https://github.com/ionic-team/stencil/commit/8742d67))
* **slides:** began adding swiper. ([e9e5229](https://github.com/ionic-team/stencil/commit/e9e5229))
* **slides:** rewrite slides component ([cf9b872](https://github.com/ionic-team/stencil/commit/cf9b872))
* **spinners:** svg spinners ([3a2dbd6](https://github.com/ionic-team/stencil/commit/3a2dbd6))
* **ssr:** add ssr support ([5ee2c3b](https://github.com/ionic-team/stencil/commit/5ee2c3b))
* **ssr:** allow SSR to bypass certain elements ([b7c9388](https://github.com/ionic-team/stencil/commit/b7c9388))
* **ssr:** remove unused css ([b1e369a](https://github.com/ionic-team/stencil/commit/b1e369a))
* **ssr:** server side rendering ([b9d62fc](https://github.com/ionic-team/stencil/commit/b9d62fc))
* **ssr:** update window.location api ([4bacb10](https://github.com/ionic-team/stencil/commit/4bacb10))
* **ssr:** wait on possible user promise ([f08320a](https://github.com/ionic-team/stencil/commit/f08320a))
* **state:** queue render on state changes ([b3c8ff3](https://github.com/ionic-team/stencil/commit/b3c8ff3))
* **state:** re-render on state changes ([8f47af4](https://github.com/ionic-team/stencil/commit/8f47af4))
* **styles:** allow string to act as the default mode ([a75f696](https://github.com/ionic-team/stencil/commit/a75f696))
* **styles:** append all initial styles on app load ([3e8afaa](https://github.com/ionic-team/stencil/commit/3e8afaa))
* **styleUrl:** have both styleUrl and styleUrls ([f5c6383](https://github.com/ionic-team/stencil/commit/f5c6383))
* **upgraded:** apply visibility from "upgraded" css on host ([69eac99](https://github.com/ionic-team/stencil/commit/69eac99))
* **watch:** improve watch compile speed ([25ad2ea](https://github.com/ionic-team/stencil/commit/25ad2ea))
* all children that are text based will now be called by 't' rather than 'h'. ([7b09553](https://github.com/ionic-team/stencil/commit/7b09553))
* booleans, null, string, numbers all get converted to be a string for jsx conversion. ([9f565a5](https://github.com/ionic-team/stencil/commit/9f565a5))
* implemented all event emitters from swiper callbacks. ([6fd5ce8](https://github.com/ionic-team/stencil/commit/6fd5ce8))
* ionic to stencil lifecycle map ([5d4b0d0](https://github.com/ionic-team/stencil/commit/5d4b0d0))


### Performance Improvements

* **demos:** add height attributes to header ([b70f25a](https://github.com/ionic-team/stencil/commit/b70f25a))
* reduce css parser code ([12ee8aa](https://github.com/ionic-team/stencil/commit/12ee8aa))
