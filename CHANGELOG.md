## ⛱ [1.17.3](https://github.com/ionic-team/stencil/compare/v1.17.2...v1.17.3) (2020-08-04)


### Bug Fixes

* **build:** dist-custom-elements-bundle types ([#2597](https://github.com/ionic-team/stencil/issues/2597)) ([7f2f5ad](https://github.com/ionic-team/stencil/commit/7f2f5ad7ca2ea6f1259721ca853cf029ebc34176)), closes [#2596](https://github.com/ionic-team/stencil/issues/2596)
* **test:** update module ext order ([79ba207](https://github.com/ionic-team/stencil/commit/79ba207b595dc43d8740ba26c2a208b7ec1ca232)), closes [#2608](https://github.com/ionic-team/stencil/issues/2608)



## ☎️ [1.17.2](https://github.com/ionic-team/stencil/compare/v1.17.1...v1.17.2) (2020-07-28)


### Bug Fixes

* **dev-server:** fix dev client requesting build results ([91564f4](https://github.com/ionic-team/stencil/commit/91564f4dd954575843273d4437165cb408c735ef))
* **env:** add os.plaform() polyfill ([93b53e2](https://github.com/ionic-team/stencil/commit/93b53e2119a5d4b4cac28e655c97041106a40048))
* **resolve:** fix ts resolve module for transpile sync ([7e538f4](https://github.com/ionic-team/stencil/commit/7e538f438b55e52104f0b5398a07e51c6699f589))
* **sys:** node sys prerender applyPrerenderGlobalPatch ([517891d](https://github.com/ionic-team/stencil/commit/517891d3aabcddf456321a52b9a7d477663da47e))
* **worker:** mock worker instance for hydrate builds ([207ce44](https://github.com/ionic-team/stencil/commit/207ce44ef319cd4406b8018e53df26fca5b92016))



## 🐚 [1.17.1](https://github.com/ionic-team/stencil/compare/v1.17.0...v1.17.1) (2020-07-26)


### Bug Fixes

* **bundling:** downgrade `@rollup/plugin-commonjs` ([#2589](https://github.com/ionic-team/stencil/issues/2589)) ([be1bdd1](https://github.com/ionic-team/stencil/commit/be1bdd1b06b8512b55f8d29e62627d41859ff7a0))
* Parse5 6.0.1


# 🍩 [1.17.0](https://github.com/ionic-team/stencil/compare/v1.16.5...v1.17.0) (2020-07-24)


### Features

* **runtime:** ability to hook into creating CustomEvent, so vue binding can lowercase event names ([a2ce019](https://github.com/ionic-team/stencil/commit/a2ce019d1731c5cee42534fa5c8652e91f6f6cd9))
* **setAssetPath:** customize path of asset base urls ([a06a941](https://github.com/ionic-team/stencil/commit/a06a9419b23f0f2624226162744d63bd6a8cfcce))
* **dev-server:** pick up scheme and host from forwarding proxy. ([#2492](https://github.com/ionic-team/stencil/issues/2492)) ([3be1d72](https://github.com/ionic-team/stencil/commit/3be1d72d2c0e3d9bb1554abde14a03a57efe6ff2))
* Rollup 2.23.0


### Bug Fixes

* **polyfill:** use core-js promise and iife fetch polyfill ([#2443](https://github.com/ionic-team/stencil/issues/2443)) ([7b7ed0b](https://github.com/ionic-team/stencil/commit/7b7ed0b94d56f71a218a568e976ed2de1099c350))
* **render:** allow mapping of childNode to functional component ([#2548](https://github.com/ionic-team/stencil/issues/2548)) ([d0176c9](https://github.com/ionic-team/stencil/commit/d0176c93b52436289857f4413c1e3685a068af57))
* **resolve:** fix typescript resolve patch ([1ef8097](https://github.com/ionic-team/stencil/commit/1ef8097ebab16a1475958ab3580c690f767036de))
* **screenshot:** update compare.html in e2e screenshot ([#2585](https://github.com/ionic-team/stencil/issues/2585)) ([85f6504](https://github.com/ionic-team/stencil/commit/85f6504bf89a05321a1990f6b4e1244044244fb4))
* **sys:** ensure in-memory sys checks file data ([f7c03c2](https://github.com/ionic-team/stencil/commit/f7c03c2708aab1953a4536fbd9c3b927ebfb6fcd))



## 🐬 [1.16.5](https://github.com/ionic-team/stencil/compare/v1.16.4...v1.16.5) (2020-07-22)


### Bug Fixes

* **watch:** close all processes on sigint ([2f923e0](https://github.com/ionic-team/stencil/commit/2f923e0d053c29a389faf0a6242344aef2e57aa7))



## 🏜 [1.16.4](https://github.com/ionic-team/stencil/compare/v1.16.3...v1.16.4) (2020-07-18)

* TypeScript 3.9.7
* @rollup/plugin-node-resolve 8.4.0


### Bug Fixes

* **resolve:** fix rollup node resolve realpath checks ([d3f4c4f](https://github.com/ionic-team/stencil/commit/d3f4c4f03cb54c7ef2a0e89273161f731db9bcba))



## 🚁 [1.16.3](https://github.com/ionic-team/stencil/compare/v1.16.2...v1.16.3) (2020-07-15)


### Bug Fixes

* **cli:** export parseFlags api ([3bd1904](https://github.com/ionic-team/stencil/commit/3bd190460120cde9d5def74a7cb9e928d1fb5546))
* **commonjs:** bump commonjs plugin to 14.0.0 ([7eee192](https://github.com/ionic-team/stencil/commit/7eee19286c8878cee498c61418db502ede17b33c))
* **compiler:** check reference type text ([fdc271c](https://github.com/ionic-team/stencil/commit/fdc271c47b8d0e540469077ff495b35c0633e7e0)), closes [#2569](https://github.com/ionic-team/stencil/issues/2569)
* **hydrated:** fix custom hydratedFlag config ([013ca8c](https://github.com/ionic-team/stencil/commit/013ca8c8ae79ea76ae8fe78daf4d856c96cb6454)), closes [#2574](https://github.com/ionic-team/stencil/issues/2574)
* **prerender:** await hashed template html ([f4b1799](https://github.com/ionic-team/stencil/commit/f4b17994d43106f3e6e54b5db1bca3244692794d))
* **sys-node:** improve os.cpu() checks to read model ([05ea6df](https://github.com/ionic-team/stencil/commit/05ea6dfb61be3cd64dad1abc86e4d88a338ee961)), closes [#2565](https://github.com/ionic-team/stencil/issues/2565)
* **test:** fix testing.testEnvironment setting ([645f3a0](https://github.com/ionic-team/stencil/commit/645f3a0ba98ec322b1f2f21feb68caa813ab30e5)), closes [#2425](https://github.com/ionic-team/stencil/issues/2425)
* **type definition:** add abbr to ThHTMLAttributes ([#2568](https://github.com/ionic-team/stencil/issues/2568)) ([d0f7ff1](https://github.com/ionic-team/stencil/commit/d0f7ff145973bbb397eb9801b3c13faff683eda3))


### Features

* **prerendering:** pass results to afterHydrate ([#2567](https://github.com/ionic-team/stencil/issues/2567)) ([135d49e](https://github.com/ionic-team/stencil/commit/135d49e6d0621fa9f0143f0b67cf2e0bc2ea6ddc))
* **transpile:** add styleImportData option to not include style import queryparams ([38d5821](https://github.com/ionic-team/stencil/commit/38d582139ba06951a2e0509ca1153bf980291c87))



## 🍷 [1.16.2](https://github.com/ionic-team/stencil/compare/v1.16.1...v1.16.2) (2020-07-10)


### Bug Fixes

* **checker:** fix how often to check for stencil updates ([eb0da10](https://github.com/ionic-team/stencil/commit/eb0da107b531287b5fcce712f49b6198b52781c6))



## 🎱 [1.16.1](https://github.com/ionic-team/stencil/compare/v1.16.0...v1.16.1) (2020-07-09)


### Bug Fixes

* **cli:** export cli types and runTask, move checkVersion to sys, add tests ([02c62b5](https://github.com/ionic-team/stencil/commit/02c62b5e23322c3e46d92514d1abceed870727b6))
* **sys:** ensure typescript sys patched for initial load ([90913df](https://github.com/ionic-team/stencil/commit/90913df7fee5ccf1b17cbebda2c5e9edaaaa5648))
* **typescript:** correctly patch typescript import ([b24933d](https://github.com/ionic-team/stencil/commit/b24933dfe9b285578d90e15846ea4f5991254415)), closes [#2561](https://github.com/ionic-team/stencil/issues/2561)

* Rollup 2.21.0


# 🏊 [1.16.0](https://github.com/ionic-team/stencil/compare/v1.15.0...v1.16.0) (2020-07-06)


### Features

* TypeScript 3.9.6
* Rollup 2.19.0
* **deno:** create deno system to run cli and compiler from [Deno](https://deno.land/) _Experimental!!_ ([b3d79c6](https://github.com/ionic-team/stencil/commit/b3d79c681d22d6c9aac51f70215e909f82b89048))


### Bug Fixes

* **compiler:** fix transitive module dependencies in unit tests ([#2178](https://github.com/ionic-team/stencil/issues/2178)) ([#2549](https://github.com/ionic-team/stencil/issues/2549)) ([6585dd1](https://github.com/ionic-team/stencil/commit/6585dd1f9b0d4c2ad122cc4c8d568365de0a2873))
* **e2e:** readiness flag on slow or overloaded computers ([#2525](https://github.com/ionic-team/stencil/issues/2525)) ([a19ac90](https://github.com/ionic-team/stencil/commit/a19ac9085af62b831ff78d515b92d5789f015c60))
* **jest:** correctly set coverageThreshold ([#2529](https://github.com/ionic-team/stencil/issues/2529)) ([915bfce](https://github.com/ionic-team/stencil/commit/915bfce417630b71806c4a1a1d90ad5e86ed0093))
* **jsx:** add autocomplete to `<select>` ([69ccbf1](https://github.com/ionic-team/stencil/commit/69ccbf1fcffed429257349ea269da90fbd9acc73))
* **worker:** use importScript() to load cross-origin worker ([d6b73b1](https://github.com/ionic-team/stencil/commit/d6b73b1bbf0024ab93baa8577193408db9801f85))
* **compiler:** ensure event emitters defined before user statements ([1b52d43](https://github.com/ionic-team/stencil/commit/1b52d435f204a3241b69e37973c56741d2050e22))
* **runtime:** correctly set isWatchReady flag for custom elements build ([36b4978](https://github.com/ionic-team/stencil/commit/36b4978e467383d8ea4181c7104fd46654c06698))
* **treeshaking:** update build conditional treeskaking optimization ([2ba24b1](https://github.com/ionic-team/stencil/commit/2ba24b1e109b27daa69a8e9a4571a3a6d0577e70))


# 🎙 [1.15.0](https://github.com/ionic-team/stencil/compare/v1.14.0...v1.15.0) (2020-06-25)


### Features

* **compiler:** auto detect css parts ([#2510](https://github.com/ionic-team/stencil/issues/2510)) ([bce12b9](https://github.com/ionic-team/stencil/commit/bce12b92c560d3d90335ad43125969e913ea6e8d))
* **types:** add `componentShouldUpdate` docs ([#2505](https://github.com/ionic-team/stencil/issues/2505)) ([0425a78](https://github.com/ionic-team/stencil/commit/0425a78ecec6c6f2fe047b9c9ba6f77b46cc554a)), closes [#2489](https://github.com/ionic-team/stencil/issues/2489)
* **typescript:** update to typescript 3.9.5 ([2a8cd7d](https://github.com/ionic-team/stencil/commit/2a8cd7d9a27b1f14f0da8b95ac03307f384cd65d))
- Rollup 2.18.0


### Bug Fixes

* **css:** fix compilation of multiple styleURLs ([#2493](https://github.com/ionic-team/stencil/issues/2493)) ([d91819c](https://github.com/ionic-team/stencil/commit/d91819ccf8a4d91af2e9a1a01bb5cbb7160a9236)), closes [#2432](https://github.com/ionic-team/stencil/issues/2432)
* **jsx:** fix refX / refY types ([6cec36e](https://github.com/ionic-team/stencil/commit/6cec36eb792b9af9d1d3367916273b3a320c327d)), closes [#2503](https://github.com/ionic-team/stencil/issues/2503)
* change autocapitalize types to any to avoid conflicts ([#2509](https://github.com/ionic-team/stencil/issues/2509)) ([19746d6](https://github.com/ionic-team/stencil/commit/19746d6ab99b26ccb1b7b13ca5af2b7d2d362220))
* **cli:** correct import in generated spec tests ([#2486](https://github.com/ionic-team/stencil/issues/2486)) ([9a80c41](https://github.com/ionic-team/stencil/commit/9a80c4158a488b57bfdd1244d1ba126dc4a586ff))
* **client:** import client platform from patch ([dbacafc](https://github.com/ionic-team/stencil/commit/dbacafc443f3819ba05f3bd4f79c75965b5de0bd))
* **compiler:** types should not be based on package.json ([65cdfbd](https://github.com/ionic-team/stencil/commit/65cdfbd10f28299465dab8897849cd6e1a6a823e)), closes [#2460](https://github.com/ionic-team/stencil/issues/2460)
* **dist:** copy assets to the dist folder ([2a8b1f1](https://github.com/ionic-team/stencil/commit/2a8b1f1381a8cd7f6008dd9873ebe6784a47ba48))
* **worker:** inline worker if there is a dist output target ([#2450](https://github.com/ionic-team/stencil/issues/2450)) ([a96b346](https://github.com/ionic-team/stencil/commit/a96b346d55c560e9990b6b4628f1aca34730918e)), closes [#2438](https://github.com/ionic-team/stencil/issues/2438)
* do not emit nomodule script of es5 is disabled ([39c51db](https://github.com/ionic-team/stencil/commit/39c51db66886846b0d224f8c02affd6933dd096b))
* **runtime:** enumerated boolean attributes ([0d72aee](https://github.com/ionic-team/stencil/commit/0d72aeea51cb754615fed74020b035b1853ad740))
* **watch:** fix watch callbacks in custom elements build ([d052fe4](https://github.com/ionic-team/stencil/commit/d052fe40a1007e39d636455d1dbbb3eb171cea16)), closes [#2478](https://github.com/ionic-team/stencil/issues/2478)
* **#2366:** rehydrate slot child ([e152773](https://github.com/ionic-team/stencil/commit/e1527738bcbac87d9cfbdcf492a681a72f56d699)), closes [#2366](https://github.com/ionic-team/stencil/issues/2366)
* **dev-server:** fix dev-server on ie11 ([db19ba7](https://github.com/ionic-team/stencil/commit/db19ba7420729051b0ad277703097175a93e74a8))
* **hydrate:** fix hydrate attach styles ([d891537](https://github.com/ionic-team/stencil/commit/d891537fcb7fab309f3c2ba5d15f22e68d7d1c87))
* **polyfill:** add proper url base to import shim ([#2410](https://github.com/ionic-team/stencil/issues/2410)) ([96dd746](https://github.com/ionic-team/stencil/commit/96dd746798895a6200981d253c358bee90d4c6cc))
* **resolve:** fix rollup and commonjs resolve ([0ea9c71](https://github.com/ionic-team/stencil/commit/0ea9c714ed9bb4cfb85492c0d9afbb92cf3c2985)), closes [#2461](https://github.com/ionic-team/stencil/issues/2461)
* **sass:** fix sass imports for scoped packages ([e551be2](https://github.com/ionic-team/stencil/commit/e551be263150c34a9c339db18416677085b2e4fe)), closes [#2521](https://github.com/ionic-team/stencil/issues/2521)


### Performance Improvements

* reenable const class optimization ([438c6b3](https://github.com/ionic-team/stencil/commit/438c6b310f24d93dc82aba1614e0f9d91dbccd7a))


### Internal Changes

- Move browser patch fns out of `@stencil/core/internal/client`
- Created `@stencil/core/internal/client/patch` to be used for lazy load builds
- Internal packages now use `index.cjs.js` for CommonJS builds, and `index.js` for ESM builds
- Updated internal package.json's `main` property to `index.cjs.js`
- Removed `require('url')` from Node builds now that `URL` is global since Node v10
- Custom Elements output target will default to build to `index.js` instead of `index.mjs`



# 🏒 [1.14.0](https://github.com/ionic-team/stencil/compare/v1.13.0...v1.14.0) (2020-05-29)


### Features

* `dist-custom-elements-bundle` output target improvements/fixes
* TypeScript 3.9.3
* Rollup 2.10.9
* Requires NodeJS >= 10.13.0
* **import-format:** text and url format import param ([4f1f39a](https://github.com/ionic-team/stencil/commit/4f1f39a4e4d76d55952df1724448164aa3730f3f))
* add focusin and focusout event declarations ([#2436](https://github.com/ionic-team/stencil/issues/2436)) ([0d730d6](https://github.com/ionic-team/stencil/commit/0d730d672ef477266b12b31cf93bc98fc86ba8f0)), closes [#2435](https://github.com/ionic-team/stencil/issues/2435)


### Performance Improvements

* **compiler:** do not build hydrated in dev mode ([#2448](https://github.com/ionic-team/stencil/issues/2448)) ([8e65201](https://github.com/ionic-team/stencil/commit/8e6520175e48eee729a372ca9304ffbf586518f0))
* **transpile:** skip component.d.ts formatting ([#2304](https://github.com/ionic-team/stencil/issues/2304)) ([e3f2700](https://github.com/ionic-team/stencil/commit/e3f270037dc39c9026d28803ed35c2c1c4117c31))


### Bug Fixes

* **runtime:** schedule update when value change in ref() ([54ee75f](https://github.com/ionic-team/stencil/commit/54ee75f6cb8130276a00af6fff479ea8e0741833))
* emit private types in local component.d.ts ([#2447](https://github.com/ionic-team/stencil/issues/2447)) ([9d444ff](https://github.com/ionic-team/stencil/commit/9d444ff9dfa13f961c95fc067f280972a75599b5)), closes [#2440](https://github.com/ionic-team/stencil/issues/2440)
* **cli:** fix --version and --help flags ([40baa54](https://github.com/ionic-team/stencil/commit/40baa54a5f02233afaf559d6163754463d2d9dfb))
* **compiler:** components without mode should never get mode suffix ([#2445](https://github.com/ionic-team/stencil/issues/2445)) ([11e1ccb](https://github.com/ionic-team/stencil/commit/11e1ccb73034f09e625d2bef2e5e4886bb900199))
* **compiler:** use transformed css to check changed imports of globalStyle ([#2422](https://github.com/ionic-team/stencil/issues/2422)) ([7742a87](https://github.com/ionic-team/stencil/commit/7742a87be0b204fb7e59e2185188efef157a51fe))
* **dev-server:** allow no trailing slash for custom base url ([0fae632](https://github.com/ionic-team/stencil/commit/0fae632c703604a53a76a488a8905e270baf4f38))
* **compiler:** disable const class optimization ([eac02cb](https://github.com/ionic-team/stencil/commit/eac02cb06cb7b3507aa5fc89c0bc3c804ac66936)), closes [#2462](https://github.com/ionic-team/stencil/issues/2462)
* **custom-elements:** generate types for ce build, fix import paths ([22f3f23](https://github.com/ionic-team/stencil/commit/22f3f23783e5bd0790c13c0e7f3720c0d7be28c0))
* **transform:** always update lazy class declaration ([6dd59b3](https://github.com/ionic-team/stencil/commit/6dd59b3b1fa922518e96335efe42f75f311583e0))
* **ts:** ts resolve failedLookupLocations fix ([30203b8](https://github.com/ionic-team/stencil/commit/30203b86b0bb2f43706d55ba6d07f6867f81ce38))
* **spellcheck:** put an any on it ([#2476](https://github.com/ionic-team/stencil/issues/2476)) ([1418c04](https://github.com/ionic-team/stencil/commit/1418c04ec88df877c8f7539a9e5103bc6f9ed0ba))
* **custom-elements:** fix copy tasks ([d810649](https://github.com/ionic-team/stencil/commit/d810649a70b133776ee07cd41e4f9150487e8586))


# 🚂 [1.13.0](https://github.com/ionic-team/stencil/compare/v1.12.7...v1.13.0) (2020-05-11)


### Features

* **ssg:** static site generation ([2a38293](https://github.com/ionic-team/stencil/commit/2a382933f6cef826084e91610833165fb6e8e7fa))
* **prerender:** parse typed prerender config ([7b6aaf7](https://github.com/ionic-team/stencil/commit/7b6aaf7b0c6ec7e7050f7494fc7d475fe0db5bf8))

- Add `staticSite` to `prerender.config.ts`
- Add `staticDocument` to `PrerenderHydrateOptions`
- Add `staticComponents` to `HydrateDocumentOptions`
- Assume a static site build when `index.html` does not include scripts
- Do not define custom element for static only components
- Do not add link rel=modulepreload for static only components
- Do not minify inline script/styles if already minified within template
- Ensure valid "src" URL within mock-doc


### Bug Fixes

* **docs:** include parts in top level docs json ([#2412](https://github.com/ionic-team/stencil/issues/2412)) ([131904f](https://github.com/ionic-team/stencil/commit/131904f33e8a57c2219b6d4e17f5193a781c2139))
* **gatsby:** prevent clientside for ssr/ssg node env ([6bec727](https://github.com/ionic-team/stencil/commit/6bec7275fb8870f552f682a3b26814984a6641fe)), closes [#2411](https://github.com/ionic-team/stencil/issues/2411)
* **jest:** change package used to import runCli ([#2387](https://github.com/ionic-team/stencil/issues/2387)) ([620d350](https://github.com/ionic-team/stencil/commit/620d35008323312f5e8898beb295dc527a7b4bdf))
* **jest:** jest testing updates ([6d69f53](https://github.com/ionic-team/stencil/commit/6d69f53b84e087217fd49a5914d6799ebc366e70))
* **jest:** ensure jest-cli, set presets ([0d3ed7d](https://github.com/ionic-team/stencil/commit/0d3ed7d4cb7983f1e949d3a9d31c7b5ecfe58f1a))
* **polyfill:** slot child fix ([#2375](https://github.com/ionic-team/stencil/issues/2375)) ([654d753](https://github.com/ionic-team/stencil/commit/654d75353cf13e511f54d10208c03f7a6d8a2e89)), closes [#2373](https://github.com/ionic-team/stencil/issues/2373)
* **runtime:** fix lifecycle state values ([#2414](https://github.com/ionic-team/stencil/issues/2414)) ([8302fed](https://github.com/ionic-team/stencil/commit/8302fed01b13b18436dc1a8d6bde231643f8f448))
* **dev-mode:** always add dist-types ([#2402](https://github.com/ionic-team/stencil/issues/2402)) ([f523461](https://github.com/ionic-team/stencil/commit/f523461c325aacc28aa6141097ff94b8fbd8550f))
* **e2e:** fix puppeteer types ([4b38e7d](https://github.com/ionic-team/stencil/commit/4b38e7dc40078a2f8ffb2cda65114dbea9b062d7))
* **hydrate:** set shadowRoot property on host element ([28128df](https://github.com/ionic-team/stencil/commit/28128dfb3c1edbb7d7b1acf9fae132b9dfe2ac8f)), closes [#2301](https://github.com/ionic-team/stencil/issues/2301)
* **jsx:** add missing 'as' attribute to LinkHTMLAttributes ([#2404](https://github.com/ionic-team/stencil/issues/2404)) ([28f6cc5](https://github.com/ionic-team/stencil/commit/28f6cc5ec47443516be54e3c3594dfeb32fad647))
* **jsx:** expose exportparts ([180e890](https://github.com/ionic-team/stencil/commit/180e890d0b86f0156dd57759ddb7ab60f472ed34)), closes [#2383](https://github.com/ionic-team/stencil/issues/2383)
* **prerender:** fix prerender.config.ts transpiling ([763c0be](https://github.com/ionic-team/stencil/commit/763c0bea7b636b2387b3efa0c1c0513ec0fdbf4c))
* **types:** spellcheck is an string attribute ([caf03fa](https://github.com/ionic-team/stencil/commit/caf03faca3fc1bab6cfb5df0fea2675ea37f4807)), closes [#2186](https://github.com/ionic-team/stencil/issues/2186) [#2181](https://github.com/ionic-team/stencil/issues/2181)
* add types for toggle event of html5 details ([#2421](https://github.com/ionic-team/stencil/issues/2421)) ([ebf42cf](https://github.com/ionic-team/stencil/commit/ebf42cfc238a77b8c224a95fcdedfe0a56a006eb)), closes [#2398](https://github.com/ionic-team/stencil/issues/2398)
* **test:** allow setRequestInterception to ba called from user tests ([#2330](https://github.com/ionic-team/stencil/issues/2330)) ([ff7fb41](https://github.com/ionic-team/stencil/commit/ff7fb41185bac5510b429551a2808249f4547c23))
* **testing:** MockResponse404 is not ok ([#2420](https://github.com/ionic-team/stencil/issues/2420)) ([43d30dc](https://github.com/ionic-team/stencil/commit/43d30dc5bb25caef747ec6e6398371888b6034e6))
* add warning for missing include of the srcDir ([c6b954c](https://github.com/ionic-team/stencil/commit/c6b954ca6ddb25f90123a841726c4f8f8daf9c9b)), closes [#2380](https://github.com/ionic-team/stencil/issues/2380)
* **output:** fix custom elements build for plain cmps ([1a5095a](https://github.com/ionic-team/stencil/commit/1a5095ac36fbcff8566f77dff551a776a2e0dce1))
* **testing:** don't remove request interceptor ([8a18112](https://github.com/ionic-team/stencil/commit/8a18112de392dfdd70529dcefdd8436cec29402a))


## 🗻 [1.12.7](https://github.com/ionic-team/stencil/compare/v1.12.5...v1.12.7) (2020-04-29)


* **chore(deps):** bump dependencies ([e29dd21])(https://github.com/ionic-team/stencil/commit/e29dd2105f920c5a24aa56ba30879c289c6db6ff)
* **refactor(sys):** add rename, add rmdir opts, data/error results ([f436b43])(https://github.com/ionic-team/stencil/commit/f436b4301525a5b1a9ebfabe4270ec157a0072f9)



## 🚩 [1.12.6](https://github.com/ionic-team/stencil/compare/v1.12.5...v1.12.6) (2020-04-24)


### Bug Fixes

* **buildevents:** ensure all events are emitted after one is removed ([48f18f2](https://github.com/ionic-team/stencil/commit/48f18f234ba1cc336bc7b51b59d38afbe1c8ef33))
* **hydrate:** console.debug diagnostic fix ([6c1f058](https://github.com/ionic-team/stencil/commit/6c1f0588a0489d81199abd74e67f28c3e43792f7))


### Features

* **prerender:** prerender app while in dev/watch mode ([6641c12](https://github.com/ionic-team/stencil/commit/6641c1227f8b4ee7203b79d51429a8544aad3be5))



## 🍦 [1.12.5](https://github.com/ionic-team/stencil/compare/v1.12.4...v1.12.5) (2020-04-18)


### Bug Fixes

* **polyfills:** check for `getRootNode` on Element when applying dom.js polyfill ([#2370](https://github.com/ionic-team/stencil/issues/2370)) ([4b74027](https://github.com/ionic-team/stencil/commit/4b74027aee8c9051265f54e969406bbd108a4dd3)), closes [#2369](https://github.com/ionic-team/stencil/issues/2369)
* support .css imports ([d1edb0d](https://github.com/ionic-team/stencil/commit/d1edb0db90442e2a0a738172d46e997b7b4a8994))


## 🚞 [1.12.4](https://github.com/ionic-team/stencil/compare/v1.12.2...v1.12.4) (2020-04-15)


### Bug Fixes

* **cli:** add g shortcut for generate ([035972c](https://github.com/ionic-team/stencil/commit/035972ce740e00c82b62961415fa02c103f9564b)), closes [#2346](https://github.com/ionic-team/stencil/issues/2346)
* **cli:** pass --esm flag to th compiler ([#2339](https://github.com/ionic-team/stencil/issues/2339)) ([939a493](https://github.com/ionic-team/stencil/commit/939a4931c15a30a75eabf07e6555e1de39e16849))
* **compiler:** initializeNextTick=true by default ([cb71057](https://github.com/ionic-team/stencil/commit/cb71057b7fc4123738f83d03713a06d8f0a50d64))
* **types:** add href SVG attribute ([#2359](https://github.com/ionic-team/stencil/issues/2359)) ([0c0a3d0](https://github.com/ionic-team/stencil/commit/0c0a3d0b3014356602aa9c65f08030f508af1a41)), closes [#2358](https://github.com/ionic-team/stencil/issues/2358)
* **types:** add onSlotchange to slot element attribute ([#2357](https://github.com/ionic-team/stencil/issues/2357)) ([5b9b89e](https://github.com/ionic-team/stencil/commit/5b9b89e699195b5261007c2366bacd264c0933cf)), closes [#2356](https://github.com/ionic-team/stencil/issues/2356)
* **watch:** rebuild on css import file changes ([b7ca6e1](https://github.com/ionic-team/stencil/commit/b7ca6e17f828656f0294a624922049dbb54c8aa8))
* **workers:** wrap code around iife ([c4479cc](https://github.com/ionic-team/stencil/commit/c4479cc6d76195311d24f0a6a6062cf14f5b12e6))


### Features

* **compiler:** add extra for transformTagName ([#2343](https://github.com/ionic-team/stencil/issues/2343)) ([253894d](https://github.com/ionic-team/stencil/commit/253894d3ea154c0471e1345ad79fea3e708121d5))
* **devserver:** dynamic dev server / socket url config ([acecc68](https://github.com/ionic-team/stencil/commit/acecc6825446119e0fc9d512c56a61930aa196d5))
* **prerender:** improve prerender logging, disable crawlUrls options ([0683598](https://github.com/ionic-team/stencil/commit/06835987e33b552b5435b746f359705d0899c906))
* **types:** add enterkeyhint HTMLAttribute ([#2367](https://github.com/ionic-team/stencil/issues/2367)) ([5adcdd3](https://github.com/ionic-team/stencil/commit/5adcdd3d601525232247a9471ae8e459ce2fbc07))


### Performance Improvements

* don't emit webpack chunk names ([#2338](https://github.com/ionic-team/stencil/issues/2338)) ([bbadb54](https://github.com/ionic-team/stencil/commit/bbadb540278209e80c7de9ea059e74c699938d0b)), closes [#2337](https://github.com/ionic-team/stencil/issues/2337)



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
