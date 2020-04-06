## 🌙 [1.12.3](https://github.com/ionic-team/stencil/compare/v1.12.2...v1.12.3) (2020-04-06)


### Bug Fixes

* **cli:** pass --esm flag to th compiler ([#2339](https://github.com/ionic-team/stencil/issues/2339)) ([939a493](https://github.com/ionic-team/stencil/commit/939a4931c15a30a75eabf07e6555e1de39e16849))


### Features

* **prerender:** improve prerender logging, disable crawlUrls options ([0683598](https://github.com/ionic-team/stencil/commit/06835987e33b552b5435b746f359705d0899c906))


### Performance Improvements

* don't emit webpack chunk names ([#2338](https://github.com/ionic-team/stencil/issues/2338)) ([bbadb54](https://github.com/ionic-team/stencil/commit/bbadb540278209e80c7de9ea059e74c699938d0b)), closes [#2337](https://github.com/ionic-team/stencil/issues/2337)



## 🐷 [1.12.2](https://github.com/ionic-team/stencil/compare/v1.12.0...v1.12.2) (2020-04-04)


### Bug Fixes

* **testing:** skip debug logs ([23b2566](https://github.com/ionic-team/stencil/commit/23b2566b5909f6807b3a9147de747e22cdb0c1cb))
* install correct lazy dependencies ([dd47dbe](https://github.com/ionic-team/stencil/commit/dd47dbe8fb61472ed47c5791de6ab8d883b23f49))
* **vdom:** reflect props need vdomAttribute ([2b1291c](https://github.com/ionic-team/stencil/commit/2b1291c139a49cca75761a21b81dade97a52c4cb))


### Features

* **prerender:** add more hooks to prerender config ([5d9165f](https://github.com/ionic-team/stencil/commit/5d9165fd4a8c3059ddd2ed4a943305c0e788d970))



## 🐓 [1.12.1](https://github.com/ionic-team/stencil/compare/v1.12.0...v1.12.1) (2020-04-02)

Added `taskQueue: 'immediate'` config setting.


# ⛸ [1.12.0](https://github.com/ionic-team/stencil/compare/v1.11.3...v1.12.0) (2020-04-01)


### Bug Fixes

* **types:** part can be used in svg ([45f02de](https://github.com/ionic-team/stencil/commit/45f02de4e784feaffb1ab5f81b66d3376bbbdfba))


### Features

* **runtime:** select the task queue ([#2318](https://github.com/ionic-team/stencil/issues/2318)) ([dd4647a](https://github.com/ionic-team/stencil/commit/dd4647a6607eec3d252c37acb89947ea8c5508c9)), closes [#2294](https://github.com/ionic-team/stencil/issues/2294) [#2058](https://github.com/ionic-team/stencil/issues/2058)
* **sys:** add sys.resolveModuleId for plugins ([d2b6fc0](https://github.com/ionic-team/stencil/commit/d2b6fc0ffcc37c0ed4db01d10e5034998da30a95)), closes [#2292](https://github.com/ionic-team/stencil/issues/2292)
* inline workers in custom-element-bundle ([2d716b3](https://github.com/ionic-team/stencil/commit/2d716b3afa184a4afe3da01f34e978910ff00558))



## 🦁 [1.11.3](https://github.com/ionic-team/stencil/compare/v1.11.2...v1.11.3) (2020-03-30)

### Features

* before and after rollup plugins ([#2306](https://github.com/ionic-team/stencil/issues/2306)) ([d04fb90](https://github.com/ionic-team/stencil/commit/d04fb902bfd3e0834e59677e15a5cd0710fc802c))


### Bug Fixes

* **compiler:** transpile to es5 ([#2316](https://github.com/ionic-team/stencil/issues/2316)) ([4f3986b](https://github.com/ionic-team/stencil/commit/4f3986b34828fb99c47a0c3048b0980c637e6a46)), closes [#2315](https://github.com/ionic-team/stencil/issues/2315) [#2314](https://github.com/ionic-team/stencil/issues/2314)
* **sys:** resolve to fs path when url ([3e591f1](https://github.com/ionic-team/stencil/commit/3e591f1d739f66370b50ecab69276069946702c9))
* **types:** svg types match spec ([#2317](https://github.com/ionic-team/stencil/issues/2317)) ([c91d8e4](https://github.com/ionic-team/stencil/commit/c91d8e4c94afb93344efb90024565056e8ee8a16)), closes [#2313](https://github.com/ionic-team/stencil/issues/2313)
* **bundle:** add browser main field back ([#2305](https://github.com/ionic-team/stencil/issues/2305)) ([8d7d49f](https://github.com/ionic-team/stencil/commit/8d7d49ffbcc41123fae93d5f8d4d4b10d3b249c7))
* **runtime:** slot fallback in IE11 ([#2308](https://github.com/ionic-team/stencil/issues/2308)) ([504619d](https://github.com/ionic-team/stencil/commit/504619d0cf30b0451bb30dd62b072f430a78e52b)), closes [#2307](https://github.com/ionic-team/stencil/issues/2307)
* **sys:** await writeFetchSuccessAsync ([bd6734d](https://github.com/ionic-team/stencil/commit/bd6734d3ce7f37b05d8d54ef4dc4d75639295064))

### Performance Improvements

* **compiler:** skip some output targets in dev mode ([281c274](https://github.com/ionic-team/stencil/commit/281c2745cab2536df2b66ada6a8804c94b2878fa))



## 🕹 [1.11.2](https://github.com/ionic-team/stencil/compare/v1.11.1...v1.11.2) (2020-03-23)


### Bug Fixes

* **angular:** validate angular outputTarget ([413c451](https://github.com/ionic-team/stencil/commit/413c45199d329cb03e4cee4dfe81235f60309ab0))



## 🐝 [1.11.1](https://github.com/ionic-team/stencil/compare/v1.11.0...v1.11.1) (2020-03-23)


### Features

* **compiler:** add minified stencil.min.js ([d2cb1f9](https://github.com/ionic-team/stencil/commit/d2cb1f93a1747f9e3603482402a6d64c7f0942af))
* **compiler:** expose path fns in compiler ([7e95038](https://github.com/ionic-team/stencil/commit/7e950389864ce107c426fafff42d1614486e8fc0))
* **sys:** add fetch to compiler system ([0977a44](https://github.com/ionic-team/stencil/commit/0977a44a67ec6c7b653ca4c02f8c97396e0a4916))


### Bug Fixes

* **runtime:** next tick initialize for angular ([#2299](https://github.com/ionic-team/stencil/issues/2299)) ([d771df5](https://github.com/ionic-team/stencil/commit/d771df526f798e5cfa81a183f04dc3639c34b10d))



# 🍿 [1.11.0](https://github.com/ionic-team/stencil/compare/v1.10.3...v1.11.0) (2020-03-20)


### Bug Fixes

* **compiler:** handle component styles with literals ([2bef0f3](https://github.com/ionic-team/stencil/commit/2bef0f3f56887f3dd977794734e4db19e0adf56b))
* **compiler:** rename @stencil/core imports in all d.ts files ([4c70fdd](https://github.com/ionic-team/stencil/commit/4c70fdd2c418a1419c8c30bd585d4a081100b28b))
* **test:** e2e tests without www output target ([7be5255](https://github.com/ionic-team/stencil/commit/7be5255d119dd691e223eedcd0445c0a2f78bfc0))



## 🏓 [1.10.3](https://github.com/ionic-team/stencil/compare/v1.10.2...v1.10.3) (2020-03-19)


### Bug Fixes

* **vdom:** functional components always get object as props ([0f71c6c](https://github.com/ionic-team/stencil/commit/0f71c6c590624bbfe64c6038166daa0c90f74123))



## 🤘 [1.10.2](https://github.com/ionic-team/stencil/compare/v1.10.1...v1.10.2) (2020-03-19)


### Bug Fixes

* **cli:** generate task emits in correct path ([704e13c](https://github.com/ionic-team/stencil/commit/704e13cd0a2110c13032decefd727ab605b187be)), closes [#2282](https://github.com/ionic-team/stencil/issues/2282)
* **runtime:** always emit appload event ([#2285](https://github.com/ionic-team/stencil/issues/2285)) ([b4e34df](https://github.com/ionic-team/stencil/commit/b4e34dfc7fefc04c80fef193e5a575f5809af1b7))
* **runtime:** emit appload eventon window ([83f2376](https://github.com/ionic-team/stencil/commit/83f23767e369e3f31cceda7caec25bd9d88a23c3))
* **testing:** support multiple modes ([#2286](https://github.com/ionic-team/stencil/issues/2286)) ([20a1559](https://github.com/ionic-team/stencil/commit/20a1559dab40143b0e6645bb53099a89c247a485))
* **types:** svg element only have attributes ([#2283](https://github.com/ionic-team/stencil/issues/2283)) ([667597d](https://github.com/ionic-team/stencil/commit/667597dd1aebf05aae171a4cfcba2baad59b50b8))
* **vdom:** pass undefined to functional cmp ([1ffd4a9](https://github.com/ionic-team/stencil/commit/1ffd4a9b6b928d4ca4ff17eb315347af88839503)), closes [#2254](https://github.com/ionic-team/stencil/issues/2254)
* remove typescript helpers workaround ([#2266](https://github.com/ionic-team/stencil/issues/2266)) ([3113af1](https://github.com/ionic-team/stencil/commit/3113af1ca0047bec7b67231a54f96591aad0570a))



## 🍋 [1.10.1](https://github.com/ionic-team/stencil/compare/v1.10.0...v1.10.1) (2020-03-17)


### Bug Fixes

* **bundler:** not resolve browser modules ([#2279](https://github.com/ionic-team/stencil/issues/2279)) ([93182e7](https://github.com/ionic-team/stencil/commit/93182e75cd25bcc4f25947c3b4265fd35d22a411))
* **docs:** validate vscode output docs ([2f48a8d](https://github.com/ionic-team/stencil/commit/2f48a8d6e9964c6bf3698e756b5e317f5e7abc4a))
* disable console colors in E2E testing ([27e1eda](https://github.com/ionic-team/stencil/commit/27e1edae8555c8c5cd44d54fb392e41176173088))
* **docs:** parse css variables docs ([#2273](https://github.com/ionic-team/stencil/issues/2273)) ([1370152](https://github.com/ionic-team/stencil/commit/137015252decda15cf75cea6b006faa3eedc13a2))



# 🎭 [1.10.0](https://github.com/ionic-team/stencil/compare/v1.9.2...v1.10.0) (2020-03-16)


### Bug Fixes

* **docs:** use pipe for union types ([d196971](https://github.com/ionic-team/stencil/commit/d19697164f25e01813430410581f517c149817d4))
* **build:** alias @stencil/core/internal imports to correct platform ([#2267](https://github.com/ionic-team/stencil/issues/2267)) ([d04a1ca](https://github.com/ionic-team/stencil/commit/d04a1ca82040f6e5e12d01243122b54ce3307af5))
* **fs:** clone cached fetch response text ([f19a3df](https://github.com/ionic-team/stencil/commit/f19a3dfdc0fe4b032567209ab9012eb1ed75d00f))


### Features

* **docs:** include listeners in docs-json ([#2272](https://github.com/ionic-team/stencil/issues/2272)) ([040111e](https://github.com/ionic-team/stencil/commit/040111eb5f69a667f3056d5611059beb869d4cfe))
* **mock-doc:** add Request, Response, Headers to mock-doc and testing ([31502ff](https://github.com/ionic-team/stencil/commit/31502ff98b45e34379a3293d6bdb098ee301131f))
* **logger:** disable log colors for ci builds ([88c76e6](https://github.com/ionic-team/stencil/commit/88c76e64ccde91906aaab72dea0b508ed451448f))



## 🚦 [1.9.2](https://github.com/ionic-team/stencil/compare/v1.9.1...v1.9.2) (2020-03-12)

Deprecate element.forceUpdate() and print console warnings during development to import `forceUpdate` from `@stencil/core` instead. The `forceUpdate()` method be removed from the host element in v2.


### Bug Fixes

* **build:** minify css-shim build ([7eaad18](https://github.com/ionic-team/stencil/commit/7eaad185e7248158d88369c5ff36cd46c7e6bbba))



## 🐧 [1.9.1](https://github.com/ionic-team/stencil/compare/v1.9.0...v1.9.1) (2020-03-10)


### Bug Fixes

* **watch:** only remove from module cache on delete ([1f4ff24](https://github.com/ionic-team/stencil/commit/1f4ff24e9b5e1417396c6c3482dd3a7a50637875))



# 🏔 [1.9.0](https://github.com/ionic-team/stencil/compare/v1.8.11...v1.9.0) (2020-03-09)

With the `1.9.0` release, the default compiler is the same as `1.8.x`. However, to opt-in to test the improved compiler use the `--next` flag. Once the "next" compiler is stable we'll then make it the default in the `1.10.0` release. Currently the next compiler is passing all tests, but we'd like to get more real-world testing before making it the default.

Some of main features with the `--next` compiler include:

- Faster incremental builds and TypeScript error feedback
- Easily bundle and interact with [Web Workers](https://stenciljs.com/docs/web-workers)
- `dist-custom-elements-bundle` Output Target (components without lazy loading)
- Internal compiler and runtime refactor in order to improve 3rd party tooling
- Import CSS files using traditional ESM imports
- Online REPL
- TypeScript 3.8.3
- Rollup 1.32.0


### Features

* **build:** web workers esm ([67a7fc2](https://github.com/ionic-team/stencil/commit/67a7fc2ea969f6b33dd4662c912f5218f6729a48))
* **compiler:** custom-elements-bundle ([228e382](https://github.com/ionic-team/stencil/commit/228e38201390327dbb4198cfb0e53d6218415068))
* **mock-dock:** support all css selectors ([a2c4667](https://github.com/ionic-team/stencil/commit/a2c46676abb3f10d58556345e0645408a7263860))
* **mock-doc:** add insertAdjacentHTML ([42921d2](https://github.com/ionic-team/stencil/commit/42921d2ede7ee9b2840ca851e8887682194f1ee8)), closes [#1980](https://github.com/ionic-team/stencil/issues/1980)
* **mock-doc:** get attributes by index ([d91b197](https://github.com/ionic-team/stencil/commit/d91b197f1ba57e15f336a1213fc29e4051e61906)), closes [#1211](https://github.com/ionic-team/stencil/issues/1211)
* **worker:** transfer any typedArray ([302ddb1](https://github.com/ionic-team/stencil/commit/302ddb1f3cb9ee2efd5430856eabe4672fb1a903))
* **docs:** Add documentation output for Shadow Parts ([#2122](https://github.com/ionic-team/stencil/issues/2122)) ([f7cd61a](https://github.com/ionic-team/stencil/commit/f7cd61a52f6d46bdabbc359fc9c86a6fa7e4c632))
* **mock-doc:** selector to handle child combinators ([#2037](https://github.com/ionic-team/stencil/issues/2037)) ([6fd43e7](https://github.com/ionic-team/stencil/commit/6fd43e75eb2828c188ef22c59504e3c211639cd5))
* **test:** Add two event detail jest matchers ([ebc518d](https://github.com/ionic-team/stencil/commit/ebc518dd258be44b9c5e74c440c5134086ab55f9)), closes [#2046](https://github.com/ionic-team/stencil/issues/2046)
* **compiler:** add config flag for preventing script inlining ([#2077](https://github.com/ionic-team/stencil/issues/2077)) ([f85cf42](https://github.com/ionic-team/stencil/commit/f85cf423fd4f3d3521da6c89839f450f3c4756cc))
* **compiler:** add Build.isTesting ([eac90bd](https://github.com/ionic-team/stencil/commit/eac90bd151a993b2387aa0bf7583d3e696a0e98f))
* **bundler:** txt plugin ([b0efb11](https://github.com/ionic-team/stencil/commit/b0efb11e6d10fb501e0ef35cdff8951983ffcdc4))
* **compiler:** add Build.isServer ([56d94f3](https://github.com/ionic-team/stencil/commit/56d94f33db5917e402692cf1740e0b62047e4e63))
* **config:** also load and validate tsconfig within loadConfig() ([cbff6e1](https://github.com/ionic-team/stencil/commit/cbff6e1535942e2f83681e63240556779a38cb35))
* **hydrate:** always build hydrate if it's an output ([92a6015](https://github.com/ionic-team/stencil/commit/92a6015a77aff622ec4c43578e6f4623136b9045))
* **cli:** update tests in task generator ([#2128](https://github.com/ionic-team/stencil/issues/2128)) ([e6af190](https://github.com/ionic-team/stencil/commit/e6af1902de066740082bc15df687d4aced211f26))
* **fetch:** export mock fetch testing apis ([c63a64f](https://github.com/ionic-team/stencil/commit/c63a64fa5bf545cd3965310399993e648f8261d9))
* **prerender:** add prerender task cmd for existing hydrate app scripts ([f4f3213](https://github.com/ionic-team/stencil/commit/f4f32139712f71f6c7d29248d9e0c030b3cdff29))
* **polyfills:** optionally exclude css vars shim ([b3b6993](https://github.com/ionic-team/stencil/commit/b3b69933528b7106ff69720797ecaabec74e4546))
* **bundling:** add webpack chunk name ([3ca7d82](https://github.com/ionic-team/stencil/commit/3ca7d82d8ef03f92b147892a6932c645b50d3aa7)), closes [#1345](https://github.com/ionic-team/stencil/issues/1345) [#1346](https://github.com/ionic-team/stencil/issues/1346)
* **dev-server:** experimental dev node modules ([104a819](https://github.com/ionic-team/stencil/commit/104a81920bbcf575346f0969459f3eb329edfe3c))
* **runtime:** dispatch namespace in lifecycleDOMEvents ([67cb2f3](https://github.com/ionic-team/stencil/commit/67cb2f3d1e03509e726fe284a0fcdc3601038634))
* add dynamicImportShim as extra ([#2177](https://github.com/ionic-team/stencil/issues/2177)) ([fd81489](https://github.com/ionic-team/stencil/commit/fd8148958a5fd300ff5d634d32106c20afdfb4d8))
* **e2e:** include global style in e2e html content ([b8e7a8f](https://github.com/ionic-team/stencil/commit/b8e7a8feca1da48ad6662a18a77c6e3a1eec25c7)), closes [#2192](https://github.com/ionic-team/stencil/issues/2192)
* **hydratedFlag:** ability to configure applied hydrated css class ([62e2168](https://github.com/ionic-team/stencil/commit/62e2168e1f49d3778b269fae10c8b77e30dc1c49))
* minify dist-custom-elements-bundle in prod mode ([7f90430](https://github.com/ionic-team/stencil/commit/7f904304263a6a9ce9e410f7902b37bd91d4534c))
* **build:** exclude setting vdom prop/attrs when not used ([381b66d](https://github.com/ionic-team/stencil/commit/381b66d15b4559fc1c9a603c681d22902d38f52d))
* **extras:** add ability to opt out of scriptDataOpts ([d622712](https://github.com/ionic-team/stencil/commit/d622712d5c84bf6554048d3ad6f508e555e6132b))
* **minify:** improve minifying core ([747fb7d](https://github.com/ionic-team/stencil/commit/747fb7d61b553d6f4c469dba63c12e6cd8f9cad4))
* **style:** set static style as property on cmp clss ([ba14fe6](https://github.com/ionic-team/stencil/commit/ba14fe61dd7cb398bd24a8bc7442bf28dfb4f5a6))
* **cli:** add ComponentInterface in component generator template ([#2147](https://github.com/ionic-team/stencil/issues/2147)) ([1688ff4](https://github.com/ionic-team/stencil/commit/1688ff499e75a727c3b636b8396f4b05fd280cbd))
* **docs:** disable the dependencies part of the markdown docs. ([#2145](https://github.com/ionic-team/stencil/issues/2145)) ([4e74f26](https://github.com/ionic-team/stencil/commit/4e74f26934741aa0ac1b143e79b48da7d9d6deed))
* **compiler:** export optimizeCss and optimizeJs ([d80a111](https://github.com/ionic-team/stencil/commit/d80a111de9a12f0a212b21bfb3a72ee65c50a7a8))
* **next:** transform css content to esm format w/ compile() ([a72c01d](https://github.com/ionic-team/stencil/commit/a72c01dca1d50fb65ba57348156cf650d1b23b11))
* **prerender:** optimizeCss and optimzeJs ([425ce38](https://github.com/ionic-team/stencil/commit/425ce380e4d75aeed2592565448160aec862887d))
* **styles:** use static get styles() with template literals ([ff79406](https://github.com/ionic-team/stencil/commit/ff79406843655a4a4117a31686e4eb98cc45e535)), closes [#2234](https://github.com/ionic-team/stencil/issues/2234)
* **compiler:** treeshake supportsShadow ([#2249](https://github.com/ionic-team/stencil/issues/2249)) ([da634da](https://github.com/ionic-team/stencil/commit/da634da1aa08a1afbb3dc0a25d5102079bea0eca))
* **runtime:** remove slot polyfill more aggressively ([#2244](https://github.com/ionic-team/stencil/issues/2244)) ([56da2e7](https://github.com/ionic-team/stencil/commit/56da2e71b45e1b60bcc4637b4a9e7e84524a6ce5))
* **sw:** do not register or unregister sw when config set to false ([565d353](https://github.com/ionic-team/stencil/commit/565d35307dd73009cd3f1e217278b8661dc25a95))


### Bug Fixes

* **config:** filter spec/e2e from tsconfig for stencil builds ([5dfa164](https://github.com/ionic-team/stencil/commit/5dfa16460549d9503cff0f09dbf4068cc3b1d621))
* **css:** improve css minify ([a7d7e3c](https://github.com/ionic-team/stencil/commit/a7d7e3ca844bb43001dbdae93283c116e01c47a0))
* **deps:** ensure deps unique ([21afacb](https://github.com/ionic-team/stencil/commit/21afacb64a55adb3c065704eb50195bd154ee174))
* **hmr:** fix style hmr ([c14fcc4](https://github.com/ionic-team/stencil/commit/c14fcc4c980c812d710f38cc6ed3358a53a4d617))
* **next:** fix web worker ts.sys patching ([fe0ab8a](https://github.com/ionic-team/stencil/commit/fe0ab8aa93645cda8002b0437eb4b323bd7bedd9))
* **testing:** add @stencil/core/testing to next compiler ([5efb2e5](https://github.com/ionic-team/stencil/commit/5efb2e50460512543c8fb65d26db46141e8dcb54))
* **watch:** exclude exts/dirs from watch ([8ab7478](https://github.com/ionic-team/stencil/commit/8ab74783c247af6bd9b7eec9f3d6c17518687ac7))
* **compiler:** add sw to next compiler ([afd2215](https://github.com/ionic-team/stencil/commit/afd22152022fc4a29a526ad57fc9acde083a56f1))
* **build:** skip d.ts cache file ([98b067b](https://github.com/ionic-team/stencil/commit/98b067b15ee2827fe9a933a79ac71c3c30442c77))
* **www:** respect allowInlineScripts ([1042a50](https://github.com/ionic-team/stencil/commit/1042a50ea7499020f2c273acb96fa4b49fa4238b))
* don't inline main script ([8c04fd1](https://github.com/ionic-team/stencil/commit/8c04fd1527c45c4027bb4198a5ae5c747dbfa19e))
* **compiler:** change props union type parsing ([#1779](https://github.com/ionic-team/stencil/issues/1779)) ([46b1090](https://github.com/ionic-team/stencil/commit/46b1090924da888f29c46d3041ebc927f6a2fc32))
* **dist:** allow globs in package.json files ([9777426](https://github.com/ionic-team/stencil/commit/9777426597bea6ed604c76b50ce26b950dca6990)), closes [#1792](https://github.com/ionic-team/stencil/issues/1792)
* **docs:** fix docs build ([d83e355](https://github.com/ionic-team/stencil/commit/d83e3555865b6889fab41c8dd0612ab8b013f09a)), closes [#2095](https://github.com/ionic-team/stencil/issues/2095)
* **screenshot:** set correct width/height ([14e8ffc](https://github.com/ionic-team/stencil/commit/14e8ffc63a1cb936ead52fa2476fe432aa4273aa)), closes [#1209](https://github.com/ionic-team/stencil/issues/1209)
* **www:** fix prod import paths for www output ([e66c9ea](https://github.com/ionic-team/stencil/commit/e66c9eae4b8f43ed90214f09440e7d478995a9ff))
* **compiler:** dead @Watch() are warnings in dev mode ([0dd169a](https://github.com/ionic-team/stencil/commit/0dd169a020d671674d5f0663dfe18133c8b9e018))
* **compiler:** fix circular dependency with [@app-globals](https://github.com/app-globals) ([ce4a6c8](https://github.com/ionic-team/stencil/commit/ce4a6c860f926fc85d52ecf824ca0573c5466ffd))
* **compiler:** resolve const enums ([86c0afe](https://github.com/ionic-team/stencil/commit/86c0afe32195269bd8e2feb1e9983e8f9ee16c26))
* **dev-server:** append dev server connector within <body> ([140fc7f](https://github.com/ionic-team/stencil/commit/140fc7f8edea8a03da608d27a10d3c19edf13658))
* **fs:** do not skip specs in ts.sys ([d753e38](https://github.com/ionic-team/stencil/commit/d753e38c9817a00dc4da5a7d81f6b6443d5973e9))
* **fs:** output targets in separate map ([e2b5318](https://github.com/ionic-team/stencil/commit/e2b5318f8c47dfefd38a7c873c13ef6c8b386b9d))
* **hydrate:** do not remove existing canonical links ([19da9ec](https://github.com/ionic-team/stencil/commit/19da9ec695c0ab89ec09b23144c8a1a3c8034f5d)), closes [#2097](https://github.com/ionic-team/stencil/issues/2097)
* **next:** fix dev server hmr ([f1af876](https://github.com/ionic-team/stencil/commit/f1af876e5f297ce46891b63d7b63250fcc62a8c1))
* **next:** fix file watch callbacks ([80cc68d](https://github.com/ionic-team/stencil/commit/80cc68d7a1fcf0ec7490dc191417bab3f0a29d1a))
* **next:** fix ts readDirectory, use fetch cache ([18360ca](https://github.com/ionic-team/stencil/commit/18360caa8c04bed3a7ad2415239e50474a254c2a))
* **prerender:** fix max concurrency ([a24f9d1](https://github.com/ionic-team/stencil/commit/a24f9d1575ace81ec60e718cd3a48233906494ef))
* **runtime:** better error for unknown mode ([d0eeec0](https://github.com/ionic-team/stencil/commit/d0eeec0fd4979f50b3d21e0ab9e5b21a856c2a3d))
* **worker:** check for web worker support ([09f8e18](https://github.com/ionic-team/stencil/commit/09f8e18e95e10001e1d73e94425b4093e5c3ad47))
* **worker:** ensure value undefined when error ([484dc6b](https://github.com/ionic-team/stencil/commit/484dc6b3a41c2bd65c7a6d60e7eaa19e8cf7a774))
* **worker:** improve error debuggin in dev mode ([d2b648d](https://github.com/ionic-team/stencil/commit/d2b648de5553007f10788d928ff58d9bf2e9681b))
* **worker:** dev error ([eeb8b3d](https://github.com/ionic-team/stencil/commit/eeb8b3d35347fb27863bc02142c6e0f156a12184))
* **compiler:** config.extras is always defined ([d5591d3](https://github.com/ionic-team/stencil/commit/d5591d370caaad5a788817b8bc26b06a74434c6d))
* **next:** don't minify css around + ([d38707d](https://github.com/ionic-team/stencil/commit/d38707d3d5e80de75090397278c245acbd3827cb))
* **next:** emit componentGraph data ([3d4eb4a](https://github.com/ionic-team/stencil/commit/3d4eb4af2dea4580da4f4b055eb557f8dd9940c3))
* **node:** semver break bundling ([58f9b4d](https://github.com/ionic-team/stencil/commit/58f9b4d17a378afb0d5bbf7d0507ac0a98df3e09)), closes [/github.com/npm/node-semver/blob/bb36c98d71d5760d730abba71c68bc324035dd36/index.js#L7-L21](https://github.com//github.com/npm/node-semver/blob/bb36c98d71d5760d730abba71c68bc324035dd36/index.js/issues/L7-L21)
* **vdom:** functional components can accept any children ([93081f5](https://github.com/ionic-team/stencil/commit/93081f5112a4216f1e67b37b4e1a65564abcb6fb)), closes [#2007](https://github.com/ionic-team/stencil/issues/2007) [#1969](https://github.com/ionic-team/stencil/issues/1969)
* **worker:** add dev error about non async exports ([e056a87](https://github.com/ionic-team/stencil/commit/e056a8788e3cb05b5928b95752ed7dfdaa194e13))
* **compiler:** add unused watch error ([f9c8078](https://github.com/ionic-team/stencil/commit/f9c80785f348f1d77fadad77cb0ad12200cc88d3))
* **compiler:** do not force disable incremental build ([f5a5daf](https://github.com/ionic-team/stencil/commit/f5a5dafc4fa984a9a6367b2ae33372fcb78ae77b))
* **compiler:** include dependency globals ([8de1667](https://github.com/ionic-team/stencil/commit/8de1667ece0fb3ac86ab9119ef24f1a7a4889c89))
* **compiler:** move worker file to the root ([71adb25](https://github.com/ionic-team/stencil/commit/71adb255f3800202b4282f4cb6d6c4aee481f9fb))
* **compiler:** unused variables becomes a warning in dev mode ([d55ade5](https://github.com/ionic-team/stencil/commit/d55ade5f6c42f291859695b59b34dc1b6b1cff74))
* **next:** validate tsconfig w/ ts parse config api ([10a6471](https://github.com/ionic-team/stencil/commit/10a6471367853b4b5872ef63ab4bc9ef34da5fcc))
* **runtime:** safari 10.0 does not implement the performance api [#2081](https://github.com/ionic-team/stencil/issues/2081) ([117e9a9](https://github.com/ionic-team/stencil/commit/117e9a9c0d560691eb9731c065fe5135e0eca7e3))
* **worker:** make them strongly typed and allow to pass callbacks ([89d5f40](https://github.com/ionic-team/stencil/commit/89d5f409ee106088d0bb3e8a1fe607210a8c534c))
* **worker:** minify worker in production ([3716040](https://github.com/ionic-team/stencil/commit/37160404c9a1d59fbcaeccef51a51478466463c6))
* **worker:** move main thread into a virtual module ([606fdbf](https://github.com/ionic-team/stencil/commit/606fdbf9931a6a2dd278c58b73d55ca95c441c92))
* **worker:** use event listeners and stencil prefix ([8b37fc5](https://github.com/ionic-team/stencil/commit/8b37fc51c8881438968e3d5711d10495d485b25b))
* **compiler:** don't inline scripts with crossorigin ([9cdcb28](https://github.com/ionic-team/stencil/commit/9cdcb28451a31a17074a7281798a84fdc384c103))
* **config:** add warning for stencil.config.ts in tsconfig ([b93b32b](https://github.com/ionic-team/stencil/commit/b93b32ba02d1ea6a5e04a5e07da063fea592c833))
* **next:** do not overide rootDir ([f1be974](https://github.com/ionic-team/stencil/commit/f1be974f5e4a8d8c075877a2f0443a420e06df02))
* **next:** fix JsonDocs dts ([93ff155](https://github.com/ionic-team/stencil/commit/93ff155f6c177875d78b35b228bc3262e9eb1d57))
* **next:** fix readPackageJson ([ae10174](https://github.com/ionic-team/stencil/commit/ae10174b552752e54466dc840e86127e7f38121e))
* **next:** prepend ext-modules.d.ts ref to internal index ([b2506fe](https://github.com/ionic-team/stencil/commit/b2506fe26b664201a5383f3e9898fb79d532e527))
* **next:** resolve remote internal dts urls ([2999885](https://github.com/ionic-team/stencil/commit/2999885a7888256b9512e5669535cfd00a563122))
* **next:** resolve remote url ts extensions ([5ae307d](https://github.com/ionic-team/stencil/commit/5ae307d4ba64bca15c1d966b8ab6ecb6e365f22b))
* **next:** warnings does not kill the process ([29ff45e](https://github.com/ionic-team/stencil/commit/29ff45e55c097219e56593849c04299a7fcb344e))
* **compiler:** fix prerendering in next compiler ([4669ad9](https://github.com/ionic-team/stencil/commit/4669ad934d1e41f532af30a51a2a293dd32ab7b9))
* **fs:** fix sys fs.readdirSync ([ec75495](https://github.com/ionic-team/stencil/commit/ec7549506a787e7599b22c7fbca82e47ded4242e))
* **next:** collection output target ([5fffda1](https://github.com/ionic-team/stencil/commit/5fffda1c990bc3464aae59cb4aa5e0ef0f677377))
* **next:** do not override target ([d1bd0e2](https://github.com/ionic-team/stencil/commit/d1bd0e2c95cc1ae9904fe63ed2016e254990abb6))
* **next:** typescript plugin runs first ([67e6565](https://github.com/ionic-team/stencil/commit/67e6565f7e19a5209c13e1f5e6a62a79e51ad688))
* **runtime:** cmpMeta is part of hostRef ([04f7dcd](https://github.com/ionic-team/stencil/commit/04f7dcd9937b1175b3f19983032debba249c1b3c))
* **www:** inline esm in place ([b99344f](https://github.com/ionic-team/stencil/commit/b99344fbcb975a9fef8d5995e7d1b5251da022cd))
* **next:** optimize dist-custom-elements bundle ([50b5a27](https://github.com/ionic-team/stencil/commit/50b5a27f84de84393f655a86e8f68015eec226cf))
* **next:** optimizes mode entries ([634e394](https://github.com/ionic-team/stencil/commit/634e39439a3ddcd93db8c15afd793ac95d338a7e))
* **next:** skip test files ([150d984](https://github.com/ionic-team/stencil/commit/150d98448dd1a50cd316048d775803f9889fa5be))
* **next:** www runs after lazy build ([96ae066](https://github.com/ionic-team/stencil/commit/96ae066de4c5eb6515c962aceeafc20063044b84))
* **compiler:** resolve dependencies package.json correctly ([0f029ae](https://github.com/ionic-team/stencil/commit/0f029ae5dd398af76eee795f505695fc73fb607c))
* **next:** ensure at least one output target ([751ada9](https://github.com/ionic-team/stencil/commit/751ada95a1dceaafe3e9596cff54e0733aad6c0f))
* **worker:** fix passing back worker error ([9304db7](https://github.com/ionic-team/stencil/commit/9304db74535e9eeb8fb62655c3537ac18f11bf40))
* **es5:** optionally do not include polyfills for dist builds ([4964f1e](https://github.com/ionic-team/stencil/commit/4964f1ebdf06ae77a6a39edb7c666f34a5afb23c)), closes [#2005](https://github.com/ionic-team/stencil/issues/2005)
* **namespace:** fix namespaces w/ dashes ([84ef0b2](https://github.com/ionic-team/stencil/commit/84ef0b2562f0d8776b28ae1da728e87e3884a29e)), closes [#2116](https://github.com/ionic-team/stencil/issues/2116)
* **next:** copy cmp assets to correct directory ([8887579](https://github.com/ionic-team/stencil/commit/88875797be0aa323578a193acb9e9d19fa6d46fb)), closes [#2120](https://github.com/ionic-team/stencil/issues/2120)
* **next:** normalize paths ([#2124](https://github.com/ionic-team/stencil/issues/2124)) ([f980954](https://github.com/ionic-team/stencil/commit/f980954c33f38ca156558e9a54223512cd0bea6f))
* **prerender:** add reflect to attributes while prerendering ([7974c41](https://github.com/ionic-team/stencil/commit/7974c41325889fc09491feea2ca21172ad86187c)), closes [#2119](https://github.com/ionic-team/stencil/issues/2119)
* **reflect:** reflect attrs when no vnode attr ([2b948b2](https://github.com/ionic-team/stencil/commit/2b948b241b12acf3b988ecb84d1d633238a227ff))
* **css:** add types to css parser/serializer and add more tests ([b9e4595](https://github.com/ionic-team/stencil/commit/b9e4595ca318bc88dc0938780567131ed4ea3692))
* **gatsby:** ensure window references are avoided ([b00bed6](https://github.com/ionic-team/stencil/commit/b00bed6ea133dcc6e56be18d8f0f7f716e241ae9))
* **hydrate:** fix const Context declaration ([d20f6ed](https://github.com/ionic-team/stencil/commit/d20f6edae3af4dfa13f88cc3b04bdc18f9ec617f))
* **jsx:** every JSX element should have a "key" ([#2113](https://github.com/ionic-team/stencil/issues/2113)) ([1243e8d](https://github.com/ionic-team/stencil/commit/1243e8d1862e456476225e205b5d26ec074e43db))
* **logger:** checking iterability of diag.next ([#2107](https://github.com/ionic-team/stencil/issues/2107)) ([fb5b11b](https://github.com/ionic-team/stencil/commit/fb5b11be03581efd943470c8e080f4f476cddae1))
* **next:** allow browser main thread compiler, fix ts imports ([64e3810](https://github.com/ionic-team/stencil/commit/64e38101dba8f138999947eb54f2991ccc9d85bf)), closes [#2130](https://github.com/ionic-team/stencil/issues/2130)
* **dev-server:** visibility hidden connector iframe ([b86e537](https://github.com/ionic-team/stencil/commit/b86e537a2df2f66c13831cf6ad1df9ad8a3133e0)), closes [#1683](https://github.com/ionic-team/stencil/issues/1683)
* **test:** lock in working version of fast-deep-equal ([8ad1540](https://github.com/ionic-team/stencil/commit/8ad15408e931f5263c1c2dbe221b20c712334572)), closes [#2133](https://github.com/ionic-team/stencil/issues/2133)
* **css:** fix media whitespace removal ([918ae5a](https://github.com/ionic-team/stencil/commit/918ae5a96ee9ef57986485a767bea3b83977f06e))
* **css-shim:** check for MutationObserver ([#2140](https://github.com/ionic-team/stencil/issues/2140)) ([f5140c4](https://github.com/ionic-team/stencil/commit/f5140c4df0762d2e2443338f9e90cdb916acbc94))
* **next:** create collection-manifest.json ([d9b236a](https://github.com/ionic-team/stencil/commit/d9b236a6b79e3995ca10b99942e0379075a6fff5)), closes [#2150](https://github.com/ionic-team/stencil/issues/2150)
* **next:** empty dist directories ([c4590ff](https://github.com/ionic-team/stencil/commit/c4590ff84149c1aaf5085b60827b7c5d815259c5))
* **next:** fix collection output paths ([7097a9d](https://github.com/ionic-team/stencil/commit/7097a9d6da84c789fff975431a690695e662c7b4)), closes [#2149](https://github.com/ionic-team/stencil/issues/2149)
* **next:** fix dist output ([aa57ebc](https://github.com/ionic-team/stencil/commit/aa57ebc66b295ea606dc2e967cb4e6d3505da186))
* **next:** fix output dts relative path ([9e2679e](https://github.com/ionic-team/stencil/commit/9e2679efa1a24ad8f684678bf0334f685b8563d9))
* **build:** fix global script and collection builds for distribution ([df83832](https://github.com/ionic-team/stencil/commit/df83832356b48e158d6535fd9ee8cc15d2b02593))
* **dev-server:** ensure utf-8 ([ca42fca](https://github.com/ionic-team/stencil/commit/ca42fca8b6a9151f1e15637e5bc3b730d98974a4)), closes [#2161](https://github.com/ionic-team/stencil/issues/2161)
* **next:** fix standalone compiler ([674019b](https://github.com/ionic-team/stencil/commit/674019b0d42ed95512fddc68764440fe7df56bbe)), closes [#2142](https://github.com/ionic-team/stencil/issues/2142)
* **normalizePath:** ensure non-ascii paths can be normalized ([a97c2f5](https://github.com/ionic-team/stencil/commit/a97c2f542fe7d5ea5498b0f30046cab89b866ef8)), closes [#2161](https://github.com/ionic-team/stencil/issues/2161)
* **normalizePath:** improve normalizePath ([addfdbc](https://github.com/ionic-team/stencil/commit/addfdbca71262cd8175c01e8b88c14bf6ca3e1f9))
* **resolve:** resolve also w/ typescript compiler option paths ([69efa87](https://github.com/ionic-team/stencil/commit/69efa872470a204a09e485c822bfa3aff4e2e287))
* **build:** always build esm for dist, both prod and dev mode ([06e90bf](https://github.com/ionic-team/stencil/commit/06e90bf530e4f95f6f4ba7f8d0139451aac49160))
* **next:** add tick before stencil_appload dom event ([a71b3af](https://github.com/ionic-team/stencil/commit/a71b3af9d0b4c6af2a81a6b873389ad7e7fd38f4))
* **next:** do not read collection of the same project ([76f46f2](https://github.com/ionic-team/stencil/commit/76f46f26486639708cf3bc1eafce5ae45110e7b4))
* **next:** fix hydrate build w/ global script, w/out Context ([d65b0cc](https://github.com/ionic-team/stencil/commit/d65b0cc93a20763cd5154715a4a5f4fbab9fa66f))
* **next:** improve createJsVarName ([d219327](https://github.com/ionic-team/stencil/commit/d2193271f4cbda03c51152e3e2767bf84a82eb20))
* **next:** copy styles to collection build ([baf5bcf](https://github.com/ionic-team/stencil/commit/baf5bcf5fc6ab57e9002bb77b17447d18de1cd5e))
* **next:** fix lerna collection ([24f59d3](https://github.com/ionic-team/stencil/commit/24f59d3a3ef519e63d9c67a3f9c27823433be0d0))
* **next:** unregister service worker during e2e tests ([a34b88b](https://github.com/ionic-team/stencil/commit/a34b88b1c6d082460165fb70e8db1fc5878ff673))
* **windows:** update puppeteer and jest, format components.d.ts ([558aa72](https://github.com/ionic-team/stencil/commit/558aa722428d39f0464721c1f6c2820a6c8d2319))
* **css:** fix node_module css imports ([cc79e39](https://github.com/ionic-team/stencil/commit/cc79e39d3f874bcb1db733a4f9b15b0f0c5ccb42))
* **hydrated:** fix hydrated config for legacy compiler ([1d1e900](https://github.com/ionic-team/stencil/commit/1d1e9006a3d287f2e782073d5172a9532d70c4ef))
* **next:** emit fsChange event ([09986b0](https://github.com/ionic-team/stencil/commit/09986b0ed5a7b08703f9e96cc7a1441e487d29d7))
* **compiler:** ignore irrelevant emitted files of ts transpiler ([#2212](https://github.com/ionic-team/stencil/issues/2212)) ([65d5f6e](https://github.com/ionic-team/stencil/commit/65d5f6e22fc66a17a16e783db14f71d8bf4f2461))
* **core:** disable booleans_as_integers minification option ([e62f212](https://github.com/ionic-team/stencil/commit/e62f2126a3a9f30d9475f707db1b466084d0c863))
* **css:** node_modules css imports ([cc7e154](https://github.com/ionic-team/stencil/commit/cc7e15494e267cdef96f5a066f18a6f75fc9bdb2))
* **dev:** don't show warning for inputs without `value` ([#2209](https://github.com/ionic-team/stencil/issues/2209)) ([4744070](https://github.com/ionic-team/stencil/commit/47440706eef65e1fc1bd0915dad60b4d2dc474ef))
* **listeners:** add host event listeners within constructor ([dc1ba91](https://github.com/ionic-team/stencil/commit/dc1ba915b829b3f9b3b945a0d9fc42b20c3d0cb1))
* **vdom:** do not reset $slotRefNode$ when relocating nodes ([#2208](https://github.com/ionic-team/stencil/issues/2208)) ([ff7807d](https://github.com/ionic-team/stencil/commit/ff7807dbe1c11b61530c111fb2547bda9537ef3f))
* **css:** do not remove /*! comments ([581be70](https://github.com/ionic-team/stencil/commit/581be704a3195f6ca0f1bff336aa7021fad67a5d))
* **hydrate:** check for valid element nodeName ([9994c5b](https://github.com/ionic-team/stencil/commit/9994c5b2824e8c7749e753411459bb9243210da4)), closes [#2157](https://github.com/ionic-team/stencil/issues/2157)
* **hydrate:** do not register cmps that should be excluded ([1ff1d79](https://github.com/ionic-team/stencil/commit/1ff1d798ee912516cc86b05b1e90c1649fdb93cf))
* **next:** comment shadow css for client hydrate ([2b69230](https://github.com/ionic-team/stencil/commit/2b69230d52466c34c68cefe832d4a5e5fe25d8fe))
* **next:** do not inject global style into e2e setContent unless set ([eb4c5d4](https://github.com/ionic-team/stencil/commit/eb4c5d4dac6c0f0331822130c62735140367607c)), closes [#2210](https://github.com/ionic-team/stencil/issues/2210)
* **next:** fix promisify.custom and node util bundling ([51a9a5e](https://github.com/ionic-team/stencil/commit/51a9a5e9f17a29d0d0a6cede9a05a80442c14b0e))
* **next:** fix styles hmr ([9a015e9](https://github.com/ionic-team/stencil/commit/9a015e90268be842bf640096ac87368d65c9ab31))
* **ts:** all unused imports is a warning ([a515d17](https://github.com/ionic-team/stencil/commit/a515d17b24dd9fe010fdfa5881c8d9d68b9bedc5))
* **worker:** use Blob for cross-origin web worker ([cbeec64](https://github.com/ionic-team/stencil/commit/cbeec6486b015ea7e9ef57c7892db12a3cb9eb07))
* **next:** update jest presets ([7c83111](https://github.com/ionic-team/stencil/commit/7c831118b65ff6f13511796d1d1b75701b4d1c40))
* **compile:** check for global ts before nodejs/webworker ts ([59cc59e](https://github.com/ionic-team/stencil/commit/59cc59eb98845914923e40fb6de414895d188ad9)), closes [#2239](https://github.com/ionic-team/stencil/issues/2239)
* **compile:** enable vdomPropOrAttr by default ([9881011](https://github.com/ionic-team/stencil/commit/9881011d13ea3c90e178b17aa0ade4762b210a05)), closes [#2238](https://github.com/ionic-team/stencil/issues/2238)
* **compiler:** prefix assets in prod mode ([#2236](https://github.com/ionic-team/stencil/issues/2236)) ([2c1a906](https://github.com/ionic-team/stencil/commit/2c1a9069f88c1f85f0ecaeecddc1d9fa1a478abe))
* **next:** run custom output targets ([a9c0715](https://github.com/ionic-team/stencil/commit/a9c0715e6a05592515190b428478a3f7ff103048))
* **prerender:** only comment original selectors for shadow css ([b5757df](https://github.com/ionic-team/stencil/commit/b5757df7c0737a3006668160da4d346047defd06))
* **slot:** patch childNodes/children getters for browsers w/out shadow support ([efca632](https://github.com/ionic-team/stencil/commit/efca6326333d4e7da0faf19c4e37aeeec984e805)), closes [#1280](https://github.com/ionic-team/stencil/issues/1280)
* **client:** default supportsShadow to when shadowDomShim false ([185f933](https://github.com/ionic-team/stencil/commit/185f933bab356b661d3c059b55c168439ed46842))
* **compiler:** do not polyfill import.meta when using native import() ([#2250](https://github.com/ionic-team/stencil/issues/2250)) ([a644004](https://github.com/ionic-team/stencil/commit/a6440040edfebefd68a4189e9761039afe16b8db))
* **compiler:** only rebuild after success ([#2248](https://github.com/ionic-team/stencil/issues/2248)) ([3a63c4f](https://github.com/ionic-team/stencil/commit/3a63c4fa038bbf593de05b9f5e851e54d1565221))
* **next:** always reset process cwd before each build ([91617f8](https://github.com/ionic-team/stencil/commit/91617f89df6356f0bdd8a7a3c40ad182a115bebf))
* **next:** clear module cache after updating/deleting module ([62971ea](https://github.com/ionic-team/stencil/commit/62971eab01483c38aa72a7f1b3633fa3d640406f))
* **next:** simulate nodejs fs errors ([d735787](https://github.com/ionic-team/stencil/commit/d73578746ffa012e47b6c4492f01236f071fc6b9))
* **listeners:** reattach host listeners ([8ea183e](https://github.com/ionic-team/stencil/commit/8ea183e0ed36fda81ca762a9fa96d13f48b27aba)), closes [#2253](https://github.com/ionic-team/stencil/issues/2253)
* **prerender:** validate prerender config w/ prerender task ([26cc015](https://github.com/ionic-team/stencil/commit/26cc01575c3fdbf739268b044902a45e201b60d9))



## 🏰 [1.8.11](https://github.com/ionic-team/stencil/compare/v1.8.10...v1.8.11) (2020-02-27)


### Features

* **hydrate:** excludeComponents option ([a75f76a](https://github.com/ionic-team/stencil/commit/a75f76a0ef915d3a75eb688a3cdda65bbfb0f676))



## 🎿 [1.8.10](https://github.com/ionic-team/stencil/compare/v1.8.9...v1.8.10) (2020-02-25)


### Bug Fixes

* **minify:** do not remove console.debug() ([acd7209](https://github.com/ionic-team/stencil/commit/acd72094ced9d6bcf14b2801ab5f307c8ff8dfe2)), closes [#2216](https://github.com/ionic-team/stencil/issues/2216)


### Features

* **input:** update JSX InputHTMLAttributes ([38ffc86](https://github.com/ionic-team/stencil/commit/38ffc865831f364a5b6bb54a2d7b99cc6a35df56)), closes [#2218](https://github.com/ionic-team/stencil/issues/2218)
* **mock-doc:** add global HTML constructors to node test global ([5036a59](https://github.com/ionic-team/stencil/commit/5036a5987ca3478ae9002aef2d67215af88fa616))
* **rollup:** update to rollup 1.31.1 ([a883b93](https://github.com/ionic-team/stencil/commit/a883b936e48fbcc9f36fa2218fa0048db3f9ca8c))
* **typescript:** update to typescript 3.8.2 ([aa4d189](https://github.com/ionic-team/stencil/commit/aa4d1898279ee01fb382a5bf94c336a939bc8025))



## ⛄️ [1.8.9](https://github.com/ionic-team/stencil/compare/v1.8.8...v1.8.9) (2020-02-18)

- Backported runtime improvements from 1.9.x builds



## 🏙 [1.8.8](https://github.com/ionic-team/stencil/compare/v1.8.7...v1.8.8) (2020-02-12)


### Bug Fixes

* **hydrate:** do not overwrite parent shadow style when multiple scoped ([a10a37f](https://github.com/ionic-team/stencil/commit/a10a37f327ad56b7dc4c0f52c9804000c38c20aa))
* **slotted:** fix applying polyfilled slotted css to nested slot ([e4229db](https://github.com/ionic-team/stencil/commit/e4229db51d7be1bc1a7e94f84ee8e0f2cea001fe)), closes [#2183](https://github.com/ionic-team/stencil/issues/2183)



## 🏎 [1.8.7](https://github.com/ionic-team/stencil/compare/v1.8.6...v1.8.7) (2020-02-04)


### Bug Fixes

* **runtime:** render svg #text nodes ([#2176](https://github.com/ionic-team/stencil/issues/2176)) ([f623bf7](https://github.com/ionic-team/stencil/commit/f623bf77ec6c3899a6795cf5e5139ece569f0d96))
* **slot:** correct order of nested slots ([800292f](https://github.com/ionic-team/stencil/commit/800292fdfeec2420cd0a85c041a3682f9dc5cf4d)), closes [#2159](https://github.com/ionic-team/stencil/issues/2159)
* **slot:** do not render light dom without unnamed slot ([8298659](https://github.com/ionic-team/stencil/commit/829865936a0448c6988f77d259734c93245e58f1)), closes [#2162](https://github.com/ionic-team/stencil/issues/2162)



## 🚚 [1.8.6](https://github.com/ionic-team/stencil/compare/v1.8.5...v1.8.6) (2020-01-24)

Updated:

- TypeScript 3.7.5
- Rollup 1.29.1
- Terser 4.6.3

### Bug Fixes

* **dist:** optionally provide defineCustomElements window ([dfca3ed](https://github.com/ionic-team/stencil/commit/dfca3edae2831652e84633eff4218535e41099d1))
* **ie11:** indexOf instead of includes ([2f16d2a](https://github.com/ionic-team/stencil/commit/2f16d2aa6372e8043cc36f61aa13c7bde40519bb)), closes [#2151](https://github.com/ionic-team/stencil/issues/2151)



## 🏕 [1.8.5](https://github.com/ionic-team/stencil/compare/v1.8.4...v1.8.5) (2020-01-09)


### Bug Fixes

* **shadowDom:** improve supports shadow dom check ([423eec3](https://github.com/ionic-team/stencil/commit/423eec3b7ba100ebfca2f9272810b62d8a020323)), closes [#2117](https://github.com/ionic-team/stencil/issues/2117)
* **polyfills:** apply SystemJS polyfill conditionally ([20af1bd](https://github.com/ionic-team/stencil/commit/20af1bdf83c6849a5bd7ab26cef5d29de8de35d1)), closes [#2005](https://github.com/ionic-team/stencil/issues/2005)



## ⭐️ [1.8.4](https://github.com/ionic-team/stencil/compare/v1.8.3...v1.8.4) (2020-01-06)


### Bug Fixes

* **css-shim:** apply css vars to global styles ([4070312](https://github.com/ionic-team/stencil/commit/4070312d1cfa39309fa6afb541332a456397ab21)), closes [#2076](https://github.com/ionic-team/stencil/issues/2076)
* **safari:** update safari 10 to use es5/system builds ([cc4c013](https://github.com/ionic-team/stencil/commit/cc4c013f8cdc9324280464eb4fb0f469fec0b5c8)), closes [#1900](https://github.com/ionic-team/stencil/issues/1900)
* **slot:** fix appendChild when using slot polyfill ([e8b4c59](https://github.com/ionic-team/stencil/commit/e8b4c59261b48295bd787ce10490a928c67ec02f)), closes [#1686](https://github.com/ionic-team/stencil/issues/1686)




## 🚍 [1.8.3](https://github.com/ionic-team/stencil/compare/v1.8.2...v1.8.3) (2019-12-30)


### Bug Fixes

* **crossOrigin:** fix crossOrigin error on edge ([965b4af](https://github.com/ionic-team/stencil/commit/965b4af2c24ce9387ce585b27ff46ccf423dfbe5))
* **hydrate:** fix scoped/ie11/edge clientside slot hydrate ([d4314f4](https://github.com/ionic-team/stencil/commit/d4314f4d432830408a963b8996a4f6eee6285699))
* **ie11:** ensure document.body ready for es5 msg ([763343e](https://github.com/ionic-team/stencil/commit/763343e6dbf9afa90e7a91e8e80c6feef4244e30))
* **mock-doc:** add CSSStyleSheet insertRule() to fix emotion-css SSR ([3aa702c](https://github.com/ionic-team/stencil/commit/3aa702c523831cf5a4653ec41b8115c23cb88af2))


### Features

* **e2e:** add togglesAttribute() and removeAttribute() to e2e elements ([ca27197](https://github.com/ionic-team/stencil/commit/ca27197c5e817878ab3ddad7ab19451c5c7d51c7)), closes [#1745](https://github.com/ionic-team/stencil/issues/1745)



## 🐍 [1.8.2](https://github.com/ionic-team/stencil/compare/v1.8.1...v1.8.2) (2019-12-18)


### Features

* **delegatesFocus:** ability to set delegatesFocus on shadow cmps ([f45c919](https://github.com/ionic-team/stencil/commit/f45c919a9675827a5006702218982022b3e0ec0d)), closes [#1623](https://github.com/ionic-team/stencil/issues/1623)
* **custom:** add copy tasks to custom outputTargets ([#2023](https://github.com/ionic-team/stencil/issues/2023)) ([65aeb8c](https://github.com/ionic-team/stencil/commit/65aeb8c4a818b200695946073b71f63bf4aa3634))
* **runtime:** experimental active render context ([#2040](https://github.com/ionic-team/stencil/issues/2040)) ([75ed488](https://github.com/ionic-team/stencil/commit/75ed488667020065eec908365a4595b8d2a32531))


### Bug Fixes

* **runtime:** cloneNode fix opt-in ([6de57f7](https://github.com/ionic-team/stencil/commit/6de57f715205d309e3502b2dd0063ca822bb1b06)), closes [#1070](https://github.com/ionic-team/stencil/issues/1070) [#1948](https://github.com/ionic-team/stencil/issues/1948)
* **mock-doc:** fix MockElement type ([d5a4243](https://github.com/ionic-team/stencil/commit/d5a4243a2973407cbb6deb3b90bd3071ce28fe7e))
* **ssr:** check window ref ([755ff0d](https://github.com/ionic-team/stencil/commit/755ff0d95369f66a2f2ae68f8af48fefbd1f2d7a))
* **mock-doc:** implement  getElementById() in document fragment ([#2032](https://github.com/ionic-team/stencil/issues/2032)) ([35021d8](https://github.com/ionic-team/stencil/commit/35021d818f0dd9eca9935f4737c25d5461525fe5)), closes [#2030](https://github.com/ionic-team/stencil/issues/2030)
* **event:** emit() returns the CustomElement ([#2017](https://github.com/ionic-team/stencil/issues/2017)) ([e675366](https://github.com/ionic-team/stencil/commit/e675366f59526b28bd4be0712f01a096ca8148e4)), closes [#1996](https://github.com/ionic-team/stencil/issues/1996)
* **polyfills:** update baseURI for base w/out href ([#1995](https://github.com/ionic-team/stencil/issues/1995)) ([8582c93](https://github.com/ionic-team/stencil/commit/8582c934b5aaccf3d7e8c14131f1af4eedcc07b8))
* **prerender:** prevent window timeout leaks ([b80feda](https://github.com/ionic-team/stencil/commit/b80feda7e8b57815f750cb9b2d608525b6f3b6a6))
* **testing:** fix single-process mode ([#2016](https://github.com/ionic-team/stencil/issues/2016)) ([72f0a05](https://github.com/ionic-team/stencil/commit/72f0a05f0a4403174afbbc52ae46820e6d53faa6))



## 🔋 [1.8.1](https://github.com/ionic-team/stencil/compare/v1.8.0...v1.8.1) (2019-11-15)


### Bug Fixes

* **dev:** add <input> value order warning ([4124720](https://github.com/ionic-team/stencil/commit/4124720f388c4df4e5a0a4e5dabf360b3289688f))
* **es5:** workaround around es5 helpers name conflict ([#2013](https://github.com/ionic-team/stencil/issues/2013)) ([b5353bd](https://github.com/ionic-team/stencil/commit/b5353bd1b008ecfafe98cd6f0c2b5812b3cce515)), closes [#1916](https://github.com/ionic-team/stencil/issues/1916)



# 🚀 [1.8.0](https://github.com/ionic-team/stencil/compare/v1.7.5...v1.8.0) (2019-11-13)


### Bug Fixes

* **jsx:** add referrerPolicy for iframe interface ([#2003](https://github.com/ionic-team/stencil/issues/2003)) ([c2be55e](https://github.com/ionic-team/stencil/commit/c2be55ecd323709a6948142ec4e509e79b128166))
* **slot:** fix non-shadow list inside of a shadow DOM component ([#1197](https://github.com/ionic-team/stencil/issues/1197)) ([b8f22da](https://github.com/ionic-team/stencil/commit/b8f22da36b1ce13f0c61ea112852f29a1fd6a128)), closes [#897](https://github.com/ionic-team/stencil/issues/897)


### Features

* **typescript:** update to typescript 3.7.2 ([#1991](https://github.com/ionic-team/stencil/issues/1991)) ([2d86954](https://github.com/ionic-team/stencil/commit/2d869541586f811152b1631cc67f67de4d7953b0))



## 🚎 [1.7.5](https://github.com/ionic-team/stencil/compare/v1.7.4...v1.7.5) (2019-10-29)


### Bug Fixes

* **jest:** bump jest versions to fix types ([68f5a02](https://github.com/ionic-team/stencil/commit/68f5a0286d6d7036b689bb46d3cfb2dbab350027))
* **jest:** improve lazy require install output ([264f0a7](https://github.com/ionic-team/stencil/commit/264f0a77ba21cbadc325ecfcce5e794f8e657eef))


### Features

* **jest:** bump jest ([567a6b7](https://github.com/ionic-team/stencil/commit/567a6b7a59f527d9cff6dac0397e43aa7ca02ca5))
* **jest:** optionally jest transform esm files to cjs ([7adf62f](https://github.com/ionic-team/stencil/commit/7adf62f58a639aa38f2e9a69f36787b6d93bfebb))



## 🎠 [1.7.4](https://github.com/ionic-team/stencil/compare/v1.7.3...v1.7.4) (2019-10-23)


### Bug Fixes

* **types:** use var for components.d.ts ([7e166e1](https://github.com/ionic-team/stencil/commit/7e166e1e1c0ca1cd66f87e401b60980f377e4d3e))



## 🌼 [1.7.3](https://github.com/ionic-team/stencil/compare/v1.7.2...v1.7.3) (2019-10-18)


### Bug Fixes

* **types:** always copy stencil.core.d.ts when pkg json types exist ([7832148](https://github.com/ionic-team/stencil/commit/783214823e62fdca9977c550951a5b10b3b1397a))



## ☕️ [1.7.2](https://github.com/ionic-team/stencil/compare/v1.7.1...v1.7.2) (2019-10-15)


### Bug Fixes

* **compiler:** disable eslint for components.d.ts ([09ee00c](https://github.com/ionic-team/stencil/commit/09ee00c4214691fa10f5de7f1a16eeaf26180c40))
* **event:** add warns for events that start with "on" ([1fa6636](https://github.com/ionic-team/stencil/commit/1fa66365d289cb3b119c8fa7011e41fae5e7124c))
* **vdom:** add dev check for unexpected vnode ([#1950](https://github.com/ionic-team/stencil/issues/1950)) ([358e925](https://github.com/ionic-team/stencil/commit/358e92587a331799b195c1ef5b4ba5775014a63f))



## 🚐 [1.7.1](https://github.com/ionic-team/stencil/compare/v1.7.0...v1.7.1) (2019-10-11)


### Bug Fixes

* **compiler:** respect hashFileNames for rollup chunks ([59d7a55](https://github.com/ionic-team/stencil/commit/59d7a55a2f34df50da6d913e94542e60b7cf3af9))
* **compiler:** warn about properties that look like events ([25f60fe](https://github.com/ionic-team/stencil/commit/25f60fe5a63abb122c0872d0bdddf613f5d2af71))
* **hydrate:** fix hydrate platform ([19f1614](https://github.com/ionic-team/stencil/commit/19f16147a56d14e5707d0aea9a4ea93a5f5c3497)), closes [#1940](https://github.com/ionic-team/stencil/issues/1940)
* **vdom:** render <input list> as attribute ([73ea50e](https://github.com/ionic-team/stencil/commit/73ea50e8007224f7f8bde9df29126dec39d3a943))
* add dev mode debug log ([28b50df](https://github.com/ionic-team/stencil/commit/28b50df4667af0ec1c9d0c65ef9142fbe9670388))


### Features

* **mock-doc:** try adding Node to mock-doc ([#1947](https://github.com/ionic-team/stencil/issues/1947)) ([3b6177b](https://github.com/ionic-team/stencil/commit/3b6177bfce06478eb459bbfbe3fa6a25cd119288))



# 🍜 [1.7.0](https://github.com/ionic-team/stencil/compare/v1.6.1...v1.7.0) (2019-10-10)


### Bug Fixes

* **profile:** improve profiling ([fdaa035](https://github.com/ionic-team/stencil/commit/fdaa0350b1dbbfa4f6fee2722cafb074ab587468))
* remove error ([e0cfdf2](https://github.com/ionic-team/stencil/commit/e0cfdf25e030f88075d28a17aa7d13a6f38f79e5))
* **lifecycles:** defer connectedCallback processing until all components are registered ([#1930](https://github.com/ionic-team/stencil/issues/1930)) ([0f302eb](https://github.com/ionic-team/stencil/commit/0f302ebac23dceb2fcbb1b07a427354cf84c9fc8))
* **profile:** add st:app:start mark ([fd6b508](https://github.com/ionic-team/stencil/commit/fd6b508487f853141c6f7fc8f4a94e6968aec0cc))
* **render:** adds warning about mutations inside render() ([0aca665](https://github.com/ionic-team/stencil/commit/0aca665aec72d5e672f40e60293d5ba01d83a6a9))


### Features

* **dev:** add basic devtools API ([c5ebbfe](https://github.com/ionic-team/stencil/commit/c5ebbfe44eda087b068f5f1470503a7c2d4d01f1))
* **runtime:** add performance profiling ([f5817a0](https://github.com/ionic-team/stencil/commit/f5817a068610f90c2a4bed42732b68cef4cff143))



## ☀️ [1.6.1](https://github.com/ionic-team/stencil/compare/v1.6.0...v1.6.1) (2019-10-08)


### Bug Fixes

* **testing:** more consistent screenshots ([ad42326](https://github.com/ionic-team/stencil/commit/ad42326))



# 🚖 [1.6.0](https://github.com/ionic-team/stencil/compare/v1.5.4...v1.6.0) (2019-10-08)


### Bug Fixes

* **docs:** json docs match JsonDocs types ([eaee62c](https://github.com/ionic-team/stencil/commit/eaee62c))
* **loader:** better resourceUrl resolution ([f56eeb4](https://github.com/ionic-team/stencil/commit/f56eeb4))
* fix chunk URL determination in IE11 ([#1918](https://github.com/ionic-team/stencil/issues/1918)) ([0c933a4](https://github.com/ionic-team/stencil/commit/0c933a4))
* **lazy:** async methods resolve on instance load ([#1919](https://github.com/ionic-team/stencil/issues/1919)) ([f1c5fd5](https://github.com/ionic-team/stencil/commit/f1c5fd5))
* **vdom:** fix onAnimationStart/End ([#1907](https://github.com/ionic-team/stencil/issues/1907)) ([34c77bd](https://github.com/ionic-team/stencil/commit/34c77bd)), closes [#1906](https://github.com/ionic-team/stencil/issues/1906)
* **vdom:** fix vdom static analysis ([#1920](https://github.com/ionic-team/stencil/issues/1920)) ([eee6336](https://github.com/ionic-team/stencil/commit/eee6336)), closes [#1917](https://github.com/ionic-team/stencil/issues/1917)
* update lifecycles respect hierarchy  ([#1924](https://github.com/ionic-team/stencil/issues/1924)) ([29bdd8f](https://github.com/ionic-team/stencil/commit/29bdd8f))
* **compiler:** fix static analysis for functional and vdom text ([0901698](https://github.com/ionic-team/stencil/commit/0901698)), closes [#1903](https://github.com/ionic-team/stencil/issues/1903)
* **compiler:** warn about deprecated `attr` option ([22eb531](https://github.com/ionic-team/stencil/commit/22eb531))
* **lifecycles:** async rendering in dist-module ([515df03](https://github.com/ionic-team/stencil/commit/515df03))
* **mock-doc:** add html collections to document ([0bf3877](https://github.com/ionic-team/stencil/commit/0bf3877)), closes [#1925](https://github.com/ionic-team/stencil/issues/1925)
* **runtime:** add warning for non-mutable props ([f960a3d](https://github.com/ionic-team/stencil/commit/f960a3d)), closes [#1927](https://github.com/ionic-team/stencil/issues/1927)
* **types:** Build properties are readonly ([5f16d81](https://github.com/ionic-team/stencil/commit/5f16d81))


### Features

* **docs:** expose type as array of values ([#1913](https://github.com/ionic-team/stencil/issues/1913)) ([59b9a83](https://github.com/ionic-team/stencil/commit/59b9a83))
* **docs:** typed json docs ([#1922](https://github.com/ionic-team/stencil/issues/1922)) ([fb0272e](https://github.com/ionic-team/stencil/commit/fb0272e))
* **api:** disable attribute by passing null ([3ac02f3](https://github.com/ionic-team/stencil/commit/3ac02f3))
* **mock-doc:** add append() and ([a5b5dfa](https://github.com/ionic-team/stencil/commit/a5b5dfa))

### Performance Improvements

* **vdom:** class shape optimizations for v8 ([#1910](https://github.com/ionic-team/stencil/issues/1910)) ([0a0d21e](https://github.com/ionic-team/stencil/commit/0a0d21e))
* **compiler:** better treeshake vdom features ([96eec74](https://github.com/ionic-team/stencil/commit/96eec74))
* **vdom:** misc perf improvements ([ee33d3d](https://github.com/ionic-team/stencil/commit/ee33d3d))



## 😜 [1.5.4](https://github.com/ionic-team/stencil/compare/v1.5.3...v1.5.4) (2019-10-01)


### Bug Fixes

* karma  waiting ([5bc76a7](https://github.com/ionic-team/stencil/commit/5bc76a7))
* sys.node ([68408f6](https://github.com/ionic-team/stencil/commit/68408f6))
* **compiler:** only treat unused diagnostics as warnings ([add1337](https://github.com/ionic-team/stencil/commit/add1337))
* **vdom:** boolean properties in native elements ([ccce46e](https://github.com/ionic-team/stencil/commit/ccce46e)), closes [#1899](https://github.com/ionic-team/stencil/issues/1899)



## 🐊 [1.5.3](https://github.com/ionic-team/stencil/compare/v1.5.2...v1.5.3) (2019-09-27)


### Bug Fixes

* **ie11:** improved css vars polyfill ([5e4a0f9](https://github.com/ionic-team/stencil/commit/5e4a0f9))
* **polyfill:** guard against undefined nodes in getRootNode ([#1898](https://github.com/ionic-team/stencil/issues/1898)) ([94cf5b2](https://github.com/ionic-team/stencil/commit/94cf5b2))
* **safari10:** fix safari 10 support ([35d61a4](https://github.com/ionic-team/stencil/commit/35d61a4))



## ⛹ [1.5.2](https://github.com/ionic-team/stencil/compare/v1.5.1...v1.5.2) (2019-09-26)


### Bug Fixes

* **css-shim:** replaced innerHTML with textContent ([#1892](https://github.com/ionic-team/stencil/issues/1892)) ([613c797](https://github.com/ionic-team/stencil/commit/613c797))
* **ie:** add isConnected polyfill ([6fbbcab](https://github.com/ionic-team/stencil/commit/6fbbcab))
* **ie:** DOMTokenList polyfill ([09ea5de](https://github.com/ionic-team/stencil/commit/09ea5de))
* **ie:** fixed isConnected polyfill ([ef2df7c](https://github.com/ionic-team/stencil/commit/ef2df7c))



## 🐽 [1.5.1](https://github.com/ionic-team/stencil/compare/v1.5.0...v1.5.1) (2019-09-25)


### Bug Fixes

* emit index on browser build ([eb259a9](https://github.com/ionic-team/stencil/commit/eb259a9))
* emit pure JSX namespace ([#1886](https://github.com/ionic-team/stencil/issues/1886)) ([5ef9a47](https://github.com/ionic-team/stencil/commit/5ef9a47))
* **vdom:** svg's xlink attributes ([#1890](https://github.com/ionic-team/stencil/issues/1890)) ([3f436e2](https://github.com/ionic-team/stencil/commit/3f436e2))


### Performance Improvements

* unknown globals are side effect free ([370636a](https://github.com/ionic-team/stencil/commit/370636a))



# 🍬 [1.5.0](https://github.com/ionic-team/stencil/compare/v1.4.0...v1.5.0) (2019-09-24)


### Bug Fixes

* **compiler:** component constructors can not have arguments ([8df8bf9](https://github.com/ionic-team/stencil/commit/8df8bf9)), closes [#1855](https://github.com/ionic-team/stencil/issues/1855)
* **screenshot:** works over file protocol ([440fd9d](https://github.com/ionic-team/stencil/commit/440fd9d))
* **system:** fix leaking variables ([#1788](https://github.com/ionic-team/stencil/issues/1788)) ([d9881d3](https://github.com/ionic-team/stencil/commit/d9881d3))
* loader uses data-stencil-namespace ([21552c8](https://github.com/ionic-team/stencil/commit/21552c8))
* **css-shim:** skip 'Data URLs' when fixing relative urls ([#1861](https://github.com/ionic-team/stencil/issues/1861)) ([40d8e1e](https://github.com/ionic-team/stencil/commit/40d8e1e))
* **docs:** CSS variables typo ([513012e](https://github.com/ionic-team/stencil/commit/513012e))
* **docs:** Minify CSS and JS config swapped ([1953c12](https://github.com/ionic-team/stencil/commit/1953c12))
* **mock-doc:** <button> type defaults to "submit" ([a865439](https://github.com/ionic-team/stencil/commit/a865439))
* **vdom:** initial render of <input> properties ([#1858](https://github.com/ionic-team/stencil/issues/1858)) ([e0085cc](https://github.com/ionic-team/stencil/commit/e0085cc))


### Features

* add componentShouldUpdate ([#1876](https://github.com/ionic-team/stencil/issues/1876)) ([457203f](https://github.com/ionic-team/stencil/commit/457203f))
* relax puppeteer semver range ([f7e08d2](https://github.com/ionic-team/stencil/commit/f7e08d2))
* support mixed case events ([#1856](https://github.com/ionic-team/stencil/issues/1856)) ([972ce3f](https://github.com/ionic-team/stencil/commit/972ce3f))


### Performance Improvements

* **e2e:** enable GPU for osx and linux ([d34d0f8](https://github.com/ionic-team/stencil/commit/d34d0f8))



# 💥 [1.4.0](https://github.com/ionic-team/stencil/compare/v1.3.2...v1.4.0) (2019-09-09)


### Bug Fixes

* **docs:** emit vscode custom html data ([1008ee7](https://github.com/ionic-team/stencil/commit/1008ee7))

### Features

* **typescript:** update to typescript 3.6.2 ([9983da0](https://github.com/ionic-team/stencil/commit/9983da0))



## 🍔 [1.3.3](https://github.com/ionic-team/stencil/compare/v1.3.2...v1.3.3) (2019-09-06)


### Bug Fixes

* **docs:** print dependencies paths in unix format ([22d9c93](https://github.com/ionic-team/stencil/commit/22d9c93))
* **types:** fix AsyncIterableIterator type error ([6065bab](https://github.com/ionic-team/stencil/commit/6065bab)), closes [#1839](https://github.com/ionic-team/stencil/issues/1839)


### Features

* **mock-doc:** add MouseEvent ([#1830](https://github.com/ionic-team/stencil/issues/1830)) ([ad871b8](https://github.com/ionic-team/stencil/commit/ad871b8))
* **testing:** add getDiagnostics() and failOnConsole option ([645b5f9](https://github.com/ionic-team/stencil/commit/645b5f9))
* **testing:** add template rendering ([#1838](https://github.com/ionic-team/stencil/issues/1838)) ([ae74a27](https://github.com/ionic-team/stencil/commit/ae74a27))



## 🐎 [1.3.2](https://github.com/ionic-team/stencil/compare/v1.3.1...v1.3.2) (2019-08-26)


### Bug Fixes

* **testing:** properly wait until stencil load ([897b659](https://github.com/ionic-team/stencil/commit/897b659))


### Features

* **testing:** spyOnEvent returns async iterator ([c9d543a](https://github.com/ionic-team/stencil/commit/c9d543a))



## 🐦 [1.3.1](https://github.com/ionic-team/stencil/compare/v1.3.0...v1.3.1) (2019-08-23)


### Bug Fixes

* dont error about exported function in global ([ab65ba6](https://github.com/ionic-team/stencil/commit/ab65ba6))

# 🌎 [1.3.0](https://github.com/ionic-team/stencil/compare/v1.2.5...v1.3.0) (2019-08-20)


### Bug Fixes

* **compiler:** stencil core runtime is side effects free ([3a44def](https://github.com/ionic-team/stencil/commit/3a44def))
* **dist-module:** apply plugins to dist-module imports ([1392b0c](https://github.com/ionic-team/stencil/commit/1392b0c))
* **e2e:** improve error reporting ([c53d91e](https://github.com/ionic-team/stencil/commit/c53d91e))
* **global:** fix global script output ([9d9ee20](https://github.com/ionic-team/stencil/commit/9d9ee20))
* **global:** require global scripts to be wrapped w/ default export fn ([bdae144](https://github.com/ionic-team/stencil/commit/bdae144))
* **jest:** ensure correct argv types ([766ab26](https://github.com/ionic-team/stencil/commit/766ab26))
* **mock-doc:** property append document fragments ([84400b3](https://github.com/ionic-team/stencil/commit/84400b3))
* **testing:** do not skip output targets in testing ([691b8ad](https://github.com/ionic-team/stencil/commit/691b8ad))
* **testing:** improve serialization of console logs ([d4d11f0](https://github.com/ionic-team/stencil/commit/d4d11f0))
* **testing:** skip e2e by default ([110d5e4](https://github.com/ionic-team/stencil/commit/110d5e4))
* **testing:** skip script and style in text search ([9d55304](https://github.com/ionic-team/stencil/commit/9d55304))
* **testing:** spec source maps works in node debugger ([225f488](https://github.com/ionic-team/stencil/commit/225f488))


### Features

* **cli:** add component generator ([#1814](https://github.com/ionic-team/stencil/issues/1814)) ([9ab0637](https://github.com/ionic-team/stencil/commit/9ab0637))
* **compiler:** support paths in compiler options ([#1584](https://github.com/ionic-team/stencil/issues/1584)) ([66bb0cd](https://github.com/ionic-team/stencil/commit/66bb0cd))
* **log:** do not error for semantic ts diagnostics when in dev mode ([9e64ddc](https://github.com/ionic-team/stencil/commit/9e64ddc))



## 🏸 [1.2.5](https://github.com/ionic-team/stencil/compare/v1.2.4...v1.2.5) (2019-08-13)


### Bug Fixes

* **file:** make es5 work using the file protocol ([a5c01c6](https://github.com/ionic-team/stencil/commit/a5c01c6))
* **legacy:** remove NodeList forEach usage + polyfill ([5b2f000](https://github.com/ionic-team/stencil/commit/5b2f000))
* keep console.log in prod mode ([a145c74](https://github.com/ionic-team/stencil/commit/a145c74)), closes [#1799](https://github.com/ionic-team/stencil/issues/1799)
* puppeteer types ([237e38a](https://github.com/ionic-team/stencil/commit/237e38a))


### Features

* **dist-module:** generate single file component module ([2ce6982](https://github.com/ionic-team/stencil/commit/2ce6982))


### Performance Improvements

* better optimize esm build ([66571d0](https://github.com/ionic-team/stencil/commit/66571d0))
* **bundler:** don't leak build conditionals ([4bcd107](https://github.com/ionic-team/stencil/commit/4bcd107))
* **prerender:** serialize modulepreload links when using mode ([4102cd3](https://github.com/ionic-team/stencil/commit/4102cd3))
* **www:** create modulepreload for main entry-point ([134ac50](https://github.com/ionic-team/stencil/commit/134ac50))
* optimize isComplexType ([a13f45d](https://github.com/ionic-team/stencil/commit/a13f45d))



## 🐗 [1.2.4](https://github.com/ionic-team/stencil/compare/v1.2.1...v1.2.4) (2019-08-08)


### Bug Fixes

* don't emit undocumented warning when deprecated ([2ef43d1](https://github.com/ionic-team/stencil/commit/2ef43d1))
* fix tests ([d6eded2](https://github.com/ionic-team/stencil/commit/d6eded2))
* node types ([35ab597](https://github.com/ionic-team/stencil/commit/35ab597))
* **compiler:** crash when printing warning ([64607d1](https://github.com/ionic-team/stencil/commit/64607d1))
* **dev-server:** ssl support ([#1653](https://github.com/ionic-team/stencil/issues/1653)) ([e6cc6da](https://github.com/ionic-team/stencil/commit/e6cc6da))
* **runtime:** always add .hydrated to <html> ([#1767](https://github.com/ionic-team/stencil/issues/1767)) ([143e07e](https://github.com/ionic-team/stencil/commit/143e07e))
* **script:** accept query parameter ([1bf34b0](https://github.com/ionic-team/stencil/commit/1bf34b0)), closes [#1775](https://github.com/ionic-team/stencil/issues/1775)
* **vdom:** render falsy attributes properly ([368aee7](https://github.com/ionic-team/stencil/commit/368aee7)), closes [#1780](https://github.com/ionic-team/stencil/issues/1780)
* workaround v8 caching issue ([#1768](https://github.com/ionic-team/stencil/issues/1768)) ([c3d0910](https://github.com/ionic-team/stencil/commit/c3d0910)), closes [#1759](https://github.com/ionic-team/stencil/issues/1759)


### Features

* **build:** export component classes as const variable ([3a948af](https://github.com/ionic-team/stencil/commit/3a948af))
* emit warning when emitting event while disconnected ([053a7df](https://github.com/ionic-team/stencil/commit/053a7df))
* **compiler:** add component compiler metadata to results ([b354444](https://github.com/ionic-team/stencil/commit/b354444))
* **compiler:** add import paths to compile results ([adca6d0](https://github.com/ionic-team/stencil/commit/adca6d0))


### Performance Improvements

* **vdom:** avoid creating an array in isComplexType ([fbcd405](https://github.com/ionic-team/stencil/commit/fbcd405))
* async queue for hydrated client ([fa7d29f](https://github.com/ionic-team/stencil/commit/fa7d29f))



## 🍏 [1.2.3](https://github.com/ionic-team/stencil/compare/v1.2.2...v1.2.3) (2019-07-30)


### Bug Fixes

* workaround v8 caching issue ([#1768](https://github.com/ionic-team/stencil/issues/1768)) ([c3d0910](https://github.com/ionic-team/stencil/commit/c3d0910)), closes [#1759](https://github.com/ionic-team/stencil/issues/1759)



## 🎁 [1.2.2](https://github.com/ionic-team/stencil/compare/v1.2.1...v1.2.2) (2019-07-26)


### Bug Fixes

* **runtime:** always add .hydrated to <html> ([#1767](https://github.com/ionic-team/stencil/issues/1767)) ([143e07e](https://github.com/ionic-team/stencil/commit/143e07e))


### Features

* **compiler:** add component compiler metadata to results ([b354444](https://github.com/ionic-team/stencil/commit/b354444))
* **compiler:** add import paths to compile results ([adca6d0](https://github.com/ionic-team/stencil/commit/adca6d0))
* **dev-server:** ssl support ([#1653](https://github.com/ionic-team/stencil/issues/1653)) ([e6cc6da](https://github.com/ionic-team/stencil/commit/e6cc6da))



## 🍅 [1.2.1](https://github.com/ionic-team/stencil/compare/v1.2.0...v1.2.1) (2019-07-25)


### Bug Fixes

* **transform:** fix addEsmImports ([#1764](https://github.com/ionic-team/stencil/issues/1764)) ([bf64e0f](https://github.com/ionic-team/stencil/commit/bf64e0f)), closes [#1761](https://github.com/ionic-team/stencil/issues/1761)
* **vdom:** support multiple spaces and line breaks in class ([#1762](https://github.com/ionic-team/stencil/issues/1762)) ([fb85af1](https://github.com/ionic-team/stencil/commit/fb85af1)), closes [#1757](https://github.com/ionic-team/stencil/issues/1757)
* webpackIncludes matches legacy files ([#1763](https://github.com/ionic-team/stencil/issues/1763)) ([467a966](https://github.com/ionic-team/stencil/commit/467a966))



# 🚙 [1.2.0](https://github.com/ionic-team/stencil/compare/v1.1.9...v1.2.0) (2019-07-24)


### Bug Fixes

* **bundler:** properly bundle all used components ([eda46f6](https://github.com/ionic-team/stencil/commit/eda46f6))
* **hydrate:** patch document.baseURI for domino dom implementation ([31ee8ad](https://github.com/ionic-team/stencil/commit/31ee8ad))
* **runtime:** simplify classlist.add/remove for IE11 ([#1760](https://github.com/ionic-team/stencil/issues/1760)) ([f51cb8f](https://github.com/ionic-team/stencil/commit/f51cb8f)), closes [#1757](https://github.com/ionic-team/stencil/issues/1757)
* **vdom:** foreignObject rendering ([08bf9e3](https://github.com/ionic-team/stencil/commit/08bf9e3)), closes [#1733](https://github.com/ionic-team/stencil/issues/1733)
* **vdom:** skip empty classes ([7004a59](https://github.com/ionic-team/stencil/commit/7004a59))


### Features

* **build:** add excludeUnusedDependencies ([368b72f](https://github.com/ionic-team/stencil/commit/368b72f))
* **compile:** browser compile ([33b11a4](https://github.com/ionic-team/stencil/commit/33b11a4))


### Performance Improvements

* **build:** speed up www dev build ([88d37a1](https://github.com/ionic-team/stencil/commit/88d37a1))



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
