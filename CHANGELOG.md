## 🛥 [2.5.2](https://github.com/ionic-team/stencil/compare/v2.5.1...v2.5.2) (2021-03-30)

### Bug Fixes

- worker support for safari ([#2869](https://github.com/ionic-team/stencil/issues/2869)) ([f91548f](https://github.com/ionic-team/stencil/commit/f91548fa90da39937a8f7b7320134a2ca8db71e0))

## 🐭 [2.5.1](https://github.com/ionic-team/stencil/compare/v2.5.0...v2.5.1) (2021-03-25)

### Bug Fixes

- worker transferable work both ways ([#2866](https://github.com/ionic-team/stencil/issues/2866)) ([46ee1a2](https://github.com/ionic-team/stencil/commit/46ee1a2520b31636e2f58ea37ced71c852a5d2e8))
- **worker-plugin:** transfer OffscreenCanvas ([#2849](https://github.com/ionic-team/stencil/issues/2849)) ([969da47](https://github.com/ionic-team/stencil/commit/969da47ef752cfb74a84f0bb7cea017854205071))

# 🎠 [2.5.0](https://github.com/ionic-team/stencil/compare/v2.4.0...v2.5.0) (2021-03-22)

### Features

- **dev-server:** provide custom request listener ([eec7651](https://github.com/ionic-team/stencil/commit/eec7651fa723658c2c8d853dc44b6316709b2317))
- **typescript:** update to typescript 4.2.3 ([50d4afb](https://github.com/ionic-team/stencil/commit/50d4afbb78a0d1aa50f948031906fd636f0b2e6a))
- **rollup:** update to rollup 2.42.3 ([0af5d6a](https://github.com/ionic-team/stencil/commit/0af5d6a679432ff9e530098b12ca2341f4c1391a))
- **terser:** update to terser 5.6.1 ([3a480f5](https://github.com/ionic-team/stencil/commit/3a480f541dbfde6751753cbf0954c62116c4a8ce))
- **autoprefixer:** update to autoprefixer 10.2.5 and postcss 8.2.8 ([9c6f8d5](https://github.com/ionic-team/stencil/commit/9c6f8d57a024faa258cc188bbba3c74a4d760b91))
- **sizzle:** update to sizzle 2.3.6 ([4f94a13](https://github.com/ionic-team/stencil/commit/4f94a13cc2b0e6c3cf42de429874773e3481e007))
- **graceful-fs:** update to graceful-fs 4.2.6 ([c15ba1c](https://github.com/ionic-team/stencil/commit/c15ba1c9267a88abb4b020e8e880f39c5c6d3372))
- **mime-db:** update to mime-db 1.46.0 ([27db7ae](https://github.com/ionic-team/stencil/commit/27db7ae8f8facc5abc5c92f6868c45bb4b068cc1))
- **open:** update to open 8.0.4 ([0208698](https://github.com/ionic-team/stencil/commit/0208698cf994a5ed611a2d950faa4e268e5de137))

### Bug Fixes

- **mock-doc:** set document.dir property from document.documentElement ([9a65494](https://github.com/ionic-team/stencil/commit/9a6549471e4bc48edfb483565505bc6cc15eddc9))

# 📷 [2.4.0](https://github.com/ionic-team/stencil/compare/v2.3.0...v2.4.0) (2021-01-28)

### Features

- **custom-elements:** enable dist-custom-elements output ([fc70564](https://github.com/ionic-team/stencil/commit/fc70564b8ab551f19b76b4fc034557d17b86643c))
- **output:** includeGlobalScripts option for custom elements ([e7fa9c8](https://github.com/ionic-team/stencil/commit/e7fa9c8d175dc1b721c449cdf0efd7b326e91b59))
- **setPlatformOptions:** add setPlatformOptions for ce builds ([12fec21](https://github.com/ionic-team/stencil/commit/12fec21b2eb270cf2a8c30fa9deb09e8a49da5fd))
- **typescript:** update to typescript 4.1.3 ([adf9c93](https://github.com/ionic-team/stencil/commit/adf9c93dfed04a91dc4cf29ac5a09eebd523e96c))

* TypeScript 4.1.3
* Rollup 2.35.1
* Terser 5.5.1
* Puppeteer 5.4.2

### Bug Fixes

- **events:** map onFocusIn/Out to correct events ([#2745](https://github.com/ionic-team/stencil/issues/2745)) ([2dc930f](https://github.com/ionic-team/stencil/commit/2dc930fdc6b6a64ca99e15edf0fe3b26d129d2e2))
- **vdom:** prevent error for parentless nodes ([#2761](https://github.com/ionic-team/stencil/issues/2761)) ([a08f3a8](https://github.com/ionic-team/stencil/commit/a08f3a82b5b472ec605aa07a8df53d976336da44))
- **devserver:** expose startupTimeout ([0046051](https://github.com/ionic-team/stencil/commit/004605114d7996d1829348d81ee1fef7afcffc0c))
- **runtime:** don't render when crashing ([#2746](https://github.com/ionic-team/stencil/issues/2746)) ([c91e0c8](https://github.com/ionic-team/stencil/commit/c91e0c8fd16b4709533c8023b90bd68c43f31b2d))
- **vdom:** hide fallback slot when content present in scoped/non-shadow components ([#2650](https://github.com/ionic-team/stencil/issues/2650)) ([2ae6f5f](https://github.com/ionic-team/stencil/commit/2ae6f5f2a2b0950b8d7890e1a3b3b59212dc7540))
- **worker:** update \*?worker declaration ([#2754](https://github.com/ionic-team/stencil/issues/2754)) ([7b96ada](https://github.com/ionic-team/stencil/commit/7b96ada03e1cd7bd620f7cde6f36777cd2a5d514))
- **mock-doc:** make MockAttributeMap iterable ([#2788](https://github.com/ionic-team/stencil/issues/2788)) ([1aa9cae](https://github.com/ionic-team/stencil/commit/1aa9cae288288f84a85b9e636c09502544431458))
- show warning when immutable props change ([9c18fa0](https://github.com/ionic-team/stencil/commit/9c18fa0da217be0bd9e28672f2a0b3c9599de2db)), closes [#2433](https://github.com/ionic-team/stencil/issues/2433)
- **client:** test for presence of replace method of CSSStyleSheet ([#2773](https://github.com/ionic-team/stencil/issues/2773)) ([67e0ea8](https://github.com/ionic-team/stencil/commit/67e0ea841985cdc506edd03aef7c5678fe5a0fae))
- **bundles:** add sideEffects false to package ([d3bc9e6](https://github.com/ionic-team/stencil/commit/d3bc9e67fb806d97aa5b9d57c725fbb0b45a7d85))
- **autoprefixer:** update autoprefixer ([75acfca](https://github.com/ionic-team/stencil/commit/75acfcab0c3ee767a3f75d17b224f866d0c0e1f9))
- **hydrate:** check for fetch patch ([16a3330](https://github.com/ionic-team/stencil/commit/16a333014e6f453c5383d7c9e0bcce4ca0aa7362))
- **polyfill:** convert checkIfURLIsSupported to function expression ([#2799](https://github.com/ionic-team/stencil/issues/2799)) ([f8618d6](https://github.com/ionic-team/stencil/commit/f8618d6d2db00c3735fbb585843bf8cd7e8eb288))

# ⛵️ [2.3.0](https://github.com/ionic-team/stencil/compare/v2.2.0...v2.3.0) (2020-11-06)

### Features

- **config:** env ([#2732](https://github.com/ionic-team/stencil/issues/2732)) ([ab6dff1](https://github.com/ionic-team/stencil/commit/ab6dff1a55bd746335f3f3cbc33af9a94788c10a))
- **devserver:** dev server startup timeout configurable ([#2719](https://github.com/ionic-team/stencil/issues/2719)) ([455adb3](https://github.com/ionic-team/stencil/commit/455adb32662edb2e40dac543842e3896dcb3a08a))
- **jest:** update to jest 26.6.3 ([b6ca680](https://github.com/ionic-team/stencil/commit/b6ca680428b2b4b776a163f001963424a7b69bc2))
- **rollup:** update to rollup 2.33.1 ([bb1f55e](https://github.com/ionic-team/stencil/commit/bb1f55e587d965ec7c81cc951b068cb5829f50e3))

### Bug Fixes

- **path:** export win32 ([a536654](https://github.com/ionic-team/stencil/commit/a536654c58851a59ce07fd32896df24b0d4e96ce))

# 🍉 [2.2.0](https://github.com/ionic-team/stencil/compare/v2.1.2...v2.2.0) (2020-10-27)

### Bug Fixes

- **prerender:** cache writing hashed assets ([96c44f8](https://github.com/ionic-team/stencil/commit/96c44f8edf8605c9b474e89a012b462bf1d9de47))
- **prerender:** fix component graph tmp file ([bb9b6a8](https://github.com/ionic-team/stencil/commit/bb9b6a8f157dd9978b0793a03869490d3cf009ea))

### Features

- **jest:** update to jest 26.6.1 ([aafb1a3](https://github.com/ionic-team/stencil/commit/aafb1a3f3be6d860b968bcbe9efcf28da9328d79))
- **prerender:** do not inline external styles by default ([044aa96](https://github.com/ionic-team/stencil/commit/044aa963347aa68be1e5af60fee9c1c9c1f208d7))
- **puppeteer:** update to puppeteer 5.4.1 ([cf8847b](https://github.com/ionic-team/stencil/commit/cf8847b4da78ed8c1f026a850b9a9e7bf5ee0521))
- **rollup:** update to rollup 2.32.1 ([83236f9](https://github.com/ionic-team/stencil/commit/83236f9bc3185772c301f0ddbc2cc0663e578d7e))
- **terser:** update to terser 5.3.8 ([46a0207](https://github.com/ionic-team/stencil/commit/46a0207bac586bc17c3f8e7a7a04c9aa7fd8613b))
- **typescript:** update to typescript 4.0.5 ([0ca07a1](https://github.com/ionic-team/stencil/commit/0ca07a19e5ea87a14b40b2d592cdef74a350bfae))

## 🍗 [2.1.2](https://github.com/ionic-team/stencil/compare/v2.1.1...v2.1.2) (2020-10-26)

### Bug Fixes

- **devserver:** fix dev server static data with trailing slash ([d70423d](https://github.com/ionic-team/stencil/commit/d70423d9c0eac832128adb94adea886988747315))
- **hydrate:** do not add html comments inside inline scripts ([3c16737](https://github.com/ionic-team/stencil/commit/3c167374f15571e990eb8ff66321a7019ea2c6fe))

## 🎂 [2.1.1](https://github.com/ionic-team/stencil/compare/v2.1.0...v2.1.1) (2020-10-23)

### Bug Fixes

- **prerender:** fix slot relocation and inline styles ([2af380f](https://github.com/ionic-team/stencil/commit/2af380f7e5f403ff71998ba6a34ac386e4468cf7))
- **worker:** capture worker errors ([#2709](https://github.com/ionic-team/stencil/issues/2709)) ([dcd49c0](https://github.com/ionic-team/stencil/commit/dcd49c0fedad464bd9e482db8fd98ed28f6ebd69))

# 🖍 [2.1.0](https://github.com/ionic-team/stencil/compare/v2.0.3...v2.1.0) (2020-10-20)

### Features

- TypeScript 4.0.3
- Rollup 2.32.0
- Terser 5.3.7
- Jest 26.6.0
- Puppeteer 5.3.1
- Open 7.3.0
- Node Fetch 2.6.1

* **prerender:** hash assets and add version querystring ([e20c284](https://github.com/ionic-team/stencil/commit/e20c284d74a3366f8b5c31c11037334e4a138316))
* **prerender:** hash assets in page.state static content ([baeb842](https://github.com/ionic-team/stencil/commit/baeb842a805972b81ff662e3bb48e7582501c643))
* **prerender:** add buildId, hydrate externals, DOMContentLoaded ([4d49c63](https://github.com/ionic-team/stencil/commit/4d49c636bb7764c500bc4c87f07a161ea20630a2))
* **prerender:** server-side only bundle modules w/ .server directory ([d8fcb60](https://github.com/ionic-team/stencil/commit/d8fcb60caedff6ac4a8b166e51f14143abe0c73a))
* **prerender:** write page.state.json data from hydrat
* add setErrorHandler() ([#2704](https://github.com/ionic-team/stencil/issues/2704)) ([5d2780a](https://github.com/ionic-team/stencil/commit/5d2780ac98cc046a71f8b766e4ffd4e750c3a903))
* **docs-custom:** add config argument ([#2696](https://github.com/ionic-team/stencil/issues/2696)) ([d285879](https://github.com/ionic-team/stencil/commit/d285879ec596f42d1542152d42afa1619e27ff62))
* **sys:** add encoding option to readFile ([99ef518](https://github.com/ionic-team/stencil/commit/99ef5184e86101ed6695bfc0af3c4e8ee54ecd51))
* **sys:** add sys.generateFileHash() for more efficient file hashing ([d762c6d](https://github.com/ionic-team/stencil/commit/d762c6d082d6e794eab7697c228c1456a4417f41))
* **dev-server:** add ssr option for dev server for prerending dev ([2574094](https://github.com/ionic-team/stencil/commit/2574094df12a22fc699c53242cbfbd84ab712801))
* **e2e:** e2e timeout configurable ([8b69731](https://github.com/ionic-team/stencil/commit/8b69731080efd5febab83620e6624870e4f45dc5)), closes [#2662](https://github.com/ionic-team/stencil/issues/2662)
* **nodeRequire:** export nodeRequire utility from compiler ([10ea2fb](https://github.com/ionic-team/stencil/commit/10ea2fbbf291409a16a6a8fe43d54534d0a94878))e builds ([a2c93f6](https://github.com/ionic-team/stencil/commit/a2c93f6a989bfcc44e07e0a15aa4f8ba284e3f6b))

### Bug Fixes

- **hmr:** reload from changed css import in global styles ([4f8934d](https://github.com/ionic-team/stencil/commit/4f8934d7f5432c2c06fbd0d6f1a0b3c5ae880a73))
- **runtime:** do regular clone of normal slotting ([#2694](https://github.com/ionic-team/stencil/issues/2694)) ([602c1e2](https://github.com/ionic-team/stencil/commit/602c1e2b70dc9980bcd90f726c0045307a8cb942))
- **mock-doc:** set hostname when location is updated ([#2689](https://github.com/ionic-team/stencil/issues/2689)) ([9598a05](https://github.com/ionic-team/stencil/commit/9598a05e778538656a233cf02f276084b59d4098))
- **worker:** Build.isDev in worker ([#2702](https://github.com/ionic-team/stencil/issues/2702)) ([e8ced45](https://github.com/ionic-team/stencil/commit/e8ced45654b0de41170541d193c0a3bdff77ffcb))
- **dev-server:** clear module cache on ssr reload ([cfd5d39](https://github.com/ionic-team/stencil/commit/cfd5d39bad4ce2cab431595ae8c8f11d1fabb192))
- **mock-doc:** no indentation w/in whitespace sensitive elements ([46ff715](https://github.com/ionic-team/stencil/commit/46ff71588e20cd7f0bdc3173e6cdca9b126d05d5))
- **dev-server:** improve exiting dev server process ([eb02517](https://github.com/ionic-team/stencil/commit/eb025171f327a28de002fa6b73ffffc03ae0f905))
- **e2e:** update to use page.waitForTimeout() ([e48d306](https://github.com/ionic-team/stencil/commit/e48d30682565c08acd72f791e73319453234b0fb))
- **hydrate:** improve dev server console error ([9cb31a5](https://github.com/ionic-team/stencil/commit/9cb31a5ee4d24fbbb29e7d78061ce4d47350150a))
- **mock-doc:** do not pretty print whitespace senstive elements ([de0dc65](https://github.com/ionic-team/stencil/commit/de0dc651f51adefe0a189c4ccb5ba60b1dff456a))
- **mock-doc:** provide mocked global fetch() fn ([8fbc694](https://github.com/ionic-team/stencil/commit/8fbc694eb46dd8f88b1c65a81091880bcd729f21))
- **types:** do not require @types/node because of puppeteer types ([1a907f7](https://github.com/ionic-team/stencil/commit/1a907f784f58463cfe52f87518f1a1d38a2908e5))
- **types:** export h() function types ([be20372](https://github.com/ionic-team/stencil/commit/be2037290f55ac4ac49c128e62fc2468b58082cf))

## 🍮 [2.0.3](https://github.com/ionic-team/stencil/compare/v2.0.2...v2.0.3) (2020-09-03)

### Bug Fixes

- **watch:** do not rebuild on docs output target file changes ([4529de7](https://github.com/ionic-team/stencil/commit/4529de75171f6702f3c277208bdb5b85298e9417))

### Features

- **worker:** can import Build from @stencil/core ([3058143](https://github.com/ionic-team/stencil/commit/30581437481f1375ee267c0e4387f40c66eefa7b))

## 🐡 [2.0.2](https://github.com/ionic-team/stencil/compare/v2.0.1...v2.0.2) (2020-09-02)

### Bug Fixes

- **prerender:** export Fragment for prerender builds ([142adc8](https://github.com/ionic-team/stencil/commit/142adc852dc080a3c936d263ba645b6a31c6ad7a))
- **test:** do not build docs from test command ([557b371](https://github.com/ionic-team/stencil/commit/557b3712f047d789122caf398aed46199c7b41e2))
- **watch:** fix config.watchIgnoredRegex and update w/ RegExp array ([981e0ae](https://github.com/ionic-team/stencil/commit/981e0aebc5cf2e5fc42b33226dba8c9c2f1c7351))

## 👽 [2.0.1](https://github.com/ionic-team/stencil/compare/v2.0.0...v2.0.1) (2020-08-31)

### Bug Fixes

- **custom-elements:** update package json module recommendation ([9f29dbd](https://github.com/ionic-team/stencil/commit/9f29dbda9ab53d892ebf1713856d022103729b78))
- **jest:** update to jest 26.4.2 ([6aeb2f7](https://github.com/ionic-team/stencil/commit/6aeb2f7a49df1ee96d405f1b0ef004df28791547))
- **rollup:** update to rollup 2.26.8 ([cac6482](https://github.com/ionic-team/stencil/commit/cac648264a47dc6f014eaa3241df778a4264471a))
- **testing:** use default jest maxConcurrency ([c5d216f](https://github.com/ionic-team/stencil/commit/c5d216fdf5b0f9e9f6a6f07cca71a4ab9db3d4ff))

### Features

- **cli:** add changlog link to stencil version update message ([5fa5991](https://github.com/ionic-team/stencil/commit/5fa59915ef7aed7a79f138dbc8d8e2090fdaf6be))

# 🚗 [2.0.0](https://github.com/ionic-team/stencil/compare/v1.17.3...v2.0.0) (2020-08-31)

In keeping with [Semver](https://semver.org/), Stencil `2.0.0` was released due to changes in the API (mainly from some updates to the config API). But even though this is a new major version, there are few breaking changes, and any changes will be flagged and described by the compiler during development. For the most part, most of the changes are removal of deprecated APIs that have been printing out warning logs for quite some time now.

### Opt-in for IE11, Edge 16-18 and Safari 10 Builds

- **config:** update config extra defaults to not build IE11, Edge 16-18 and Safari 10 by default ([363bf59](https://github.com/ionic-team/stencil/commit/363bf59fc9212a771a766c21909263d6c4ccdf18))

A change in Stencil 2 is that the IE11, Edge 16-18 and Safari 10 builds will not be enabled by default. However, the ability to opt-in is still available, and can be enabled by setting each `extras` config flag to `true`. An advantage of this is less runtime within your builds. See the [config.extras docs](https://stenciljs.com/docs/config-extras) for more info.

### Opt-in for ES5 and SystemJS Builds

- **config:** do not build es5 by default ([fa67d97](https://github.com/ionic-team/stencil/commit/fa67d97d043d12e0a3af0d868fa1746eb9e3badf))

Just like having to opt-in for IE11, the same goes for opting-in for ES5 and SystemJS builds. For a production build in Stencil 1, it would build both ES2017/ESM files, and ES5/SystemJS files. As of Stencil 2, both dev and prod builds do not create ES5/SystemJS builds. An advantage of this is having faster production builds by not having to also downlevel to es5. See the [buildEs5](https://stenciljs.com/docs/config#buildes5) for more info.

### Use `disconnectedCallback()` instead of `componentDidUnload()`

- **componentDidUnload:** use disconnectedCallback instead of componentDidUnload ([4e45862](https://github.com/ionic-team/stencil/commit/4e45862f73609599a7195fcf5c93d9fb39492154))

When Stencil is used within other frameworks, DOM elements may be reused, making it impossible for `componentDidUnload()` to be accurate 100% of the time if it is disconnected, then re-connected, and disconnected again. Instead, `disconnectedCallback()` is the preferred way to always know if a component was disconnected from the DOM.

_Note that the runtime still works for any collections that have been built with componentDidUnload(). However, updates to Stencil 2 will require it's changed to disconnectedCallback()._

### Default to `async` task queue

- **taskQueue:** set "async" taskQueue as default ([f3bb121](https://github.com/ionic-team/stencil/commit/f3bb121b8130e0c4e0c344eca7078ce572ad34a5))

Update taskQueue default to "async". Stencil 1 default was "congestionAsync". See [config.taskQueue](https://stenciljs.com/docs/config#taskqueue) for more info.

### Restore Stencil 1 defaults

```ts
export const config: Config = {
  buildEs5: 'prod',
  extras: {
    cssVarsShim: true,
    dynamicImportShim: true,
    safari10: true,
    shadowDomShim: true,
  },
};
```

### dist package.json

To ensure the extensions are built for the future and work with today's bundlers, we've found it best to use `.cjs.js` extension for CommonJS files, and `.js` for ESM files, with the idea that cjs files will no longer be needed some day, and the ESM files are the standard. _(We were using `.mjs` files, but not all of today's tooling and bundlers work well with that extension)._

If you're using the `dist` output target, update the `package.json` in the root of your project, like this:

```diff
  {
-    "main": "dist/index.js",
+    "main": "dist/index.cjs.js",

-    "module": "dist/index.mjs",
+    "module": "dist/index.js",

-    "es2015": "dist/esm/index.mjs",
+    "es2015": "dist/esm/index.js",

-    "es2017": "dist/esm/index.mjs",
+    "es2017": "dist/esm/index.js",

-    "jsnext:main": "dist/esm/index.mjs",
+    "jsnext:main": "dist/esm/index.js",
  }
```

Additionally the `dist/loader` output directory has renamed its extensions too, but since its `dist/loader/package.json` file is auto-generated, the entries were renamed too. So unless you were referencing the loader files directly you will not have to do external updates.

See the [Output Folder Structure Defaults](https://github.com/ionic-team/stencil/blob/master/src/compiler/output-targets/readme.md) for more info.

### NodeJS Update

- **node:** minimum of Node 12.10.0, recommend 14.5.0 or greater ([55331be](https://github.com/ionic-team/stencil/commit/55331be42f311a6e2a4e4f8ac13c01d28dc31613))

With the major release, now's a good time to update the minimum and recommended version of NodeJS.

- [Node Releases](https://nodejs.org/en/about/releases/)
- [node.green](https://node.green/)

### TypeScript 4

- **typescript:** bundle typescript ([1973032](https://github.com/ionic-team/stencil/commit/197303210e76f048b470d3cf91237b015ce3f116))
- **typescript:** update to typescript 4.0.0-beta ([a274e11](https://github.com/ionic-team/stencil/commit/a274e1149c2da53b224bfba69e0a798c47920417))
- **typescript:** update to typescript 4.0.1-rc ([def2e6b](https://github.com/ionic-team/stencil/commit/def2e6b8c926c6b4d79ffcfd9bcb4300f82312fa))
- **typescript:** update to typescript 4.0.2 ([f55f0bf](https://github.com/ionic-team/stencil/commit/f55f0bf7e331d043dbee990b8bd5b7934cbac92b))

The other change is the update to [TypeScript 4](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/). With Stencil 2, TypeScript will no longer be a `dependency`, but instead included within the Stencil compiler. There are a few advantages to this we'll be experimenting with:

- Faster compiler startup times and overall smaller install size.
- The custom elements build should have a `dependency` of `@stencil/core`, so not having TypeScript as a dependency of `@stencil/core` simplifies the dependency graph for end-users and libraries.
- Drastically simplifies the Stencil compiler by not having to dynamically import TypeScript, which quickly gets complicated since the compiler can work within Node, Deno, web workers and the browser's main thread. By bundling internally many of the complexities are no longer an issue.
- Stencil compiler guaranteed to run with the exact version of TypeScript it was designed with.
- Easier to adjust to breaking changes. For example, TypeScript 4 introduced a few breaking changes, but with this update it made it easier for the compiler to adjust internally.

### Removal of Deprecated APIs

- **assetsDir:** remove deprecated component assetsDir ([b5cba6a](https://github.com/ionic-team/stencil/commit/b5cba6a2c4f2cd9bc162289bab498355f61f9e10))
- **attr:** remove deprecated prop attr/reflectToAttr ([133dd49](https://github.com/ionic-team/stencil/commit/133dd49e9fdf3d4cf9bf0de72ce787fddf196a0a))
- **collection:** remove deprecated collection parsing ([1a94d1e](https://github.com/ionic-team/stencil/commit/1a94d1e19aa58bd3ea9a2fd8b98325101badd4eb))
- **compiler:** remove deprecated compile/compileSync ([58a27d2](https://github.com/ionic-team/stencil/commit/58a27d2c546f6517aa3a4fd6a6045ce475688cb0))
- **config:** remove deprecated includeSrc/excludeSrc ([c18cb1f](https://github.com/ionic-team/stencil/commit/c18cb1f608c7c4668b081b94f292d1f8af721641))
- **context:** remove deprecated prop context/connect ([a87b738](https://github.com/ionic-team/stencil/commit/a87b738782b12e0110cd217bb2d522aa468c4d05))
- **copy:** remove deprecated copy config ([6cf3134](https://github.com/ionic-team/stencil/commit/6cf313442b4a93a9da5265075223eede8aff4711))
- **docs:** remove deprecated 'docs' type ([043e2d8](https://github.com/ionic-team/stencil/commit/043e2d8d2f1553926e4051db574a7ddb2437bb2d))
- **experimental-dist-module:** remove deprecated experimental-dist-module ([41189a6](https://github.com/ionic-team/stencil/commit/41189a6ab0c8e6e65fca86ac16fe843acb22e22b))
- **forceUpdate:** remove deprecated elm.forceUpdate() ([dfc1e59](https://github.com/ionic-team/stencil/commit/dfc1e593f19e32d37cc9bd2f869512d1b51e0fc0))
- **legacyLoader:** remove deprecated legacy loader ([7480f92](https://github.com/ionic-team/stencil/commit/7480f9258f6aff17a3035c1531aacc0751d086d8))
- **listen:** remove Listen target: 'parent' option ([ed63707](https://github.com/ionic-team/stencil/commit/ed6370743a99e0965b62fa3b118215fb26383747))
- **listen:** remove deprecated listen target ([1a3b519](https://github.com/ionic-team/stencil/commit/1a3b5197103d9f4fbfbfb1972b65743bad936a92))
- **reflectToAttr:** remove deprecated prop reflectToAttr ([6eae6f8](https://github.com/ionic-team/stencil/commit/6eae6f83085ff084f672e27cdafb8be4483b5eac))
- **prerender:** use internal typescript ([8f0bb51](https://github.com/ionic-team/stencil/commit/8f0bb516dbe2b143375dc6397d0852543600daa1))
- **test:** do not require typescript for tests ([43c5d98](https://github.com/ionic-team/stencil/commit/43c5d98dc6bcb495b048de7d8435ff04fc2dad3e))
- **test:** remove deprecated testing configs ([fb8a02b](https://github.com/ionic-team/stencil/commit/fb8a02b4be0f7214d131e7c228964ca8423c3be0))
- **transpile:** remove deprecated "script" option ([75dfebb](https://github.com/ionic-team/stencil/commit/75dfebb68659e09a5d2139e4cd16616448ebd122))
- **watch:** remove deprecated PropWillChange/PropDidChange ([fa2b400](https://github.com/ionic-team/stencil/commit/fa2b400cf36696365487b7c2445ab096ee354e50))

### Removal of `Context`

The `Context` object was originally added in the `0.x.x` versions of Stencil, before ES Modules were widely adopted. Since then we've deprecated it in Stencil 1, and have ported any external libraries off of it. The remaining one was `@stencil/redux`, and we've released `0.2.0` to be used with Stencil 2 (and can also work with Stencil 1). Additionally, now might be a good time to look into using [@stencil/store](https://stenciljs.com/docs/stencil-store) instead.

### Bug Fixes

- **assetsDirs:** allow same destination asset dir copy task ([b6379b3](https://github.com/ionic-team/stencil/commit/b6379b31da4fe40bf6251d307368d43e7ceee091)), closes [#2615](https://github.com/ionic-team/stencil/issues/2615)
- **compiler:** normalizePath result from fs.realpathSync ([#2625](https://github.com/ionic-team/stencil/issues/2625)) ([df83c83](https://github.com/ionic-team/stencil/commit/df83c8341e4690aee54efaae5e8c527e1b6323b6))
- **dist:** ensure src dts files not emitted still get shipped in dist ([dea56be](https://github.com/ionic-team/stencil/commit/dea56be32d17d208c5d9456c6de61d93a1606b0d)), closes [#1797](https://github.com/ionic-team/stencil/issues/1797)
- **dist:** export Components, JSX types from custom-elements build ([abae5d1](https://github.com/ionic-team/stencil/commit/abae5d1f695647ea04bac66ff4b9ee2b933a102b))
- **Fragment:** fix tsconfig Fragment ([ba0ea8d](https://github.com/ionic-team/stencil/commit/ba0ea8d3c324c5a8589a1a3c674a369c8f926aa8))
- **exit:** ensure all node processes are destroyed on exit ([73a04c2](https://github.com/ionic-team/stencil/commit/73a04c2a9d8c7c224b9ca95ea856665c41f3f410))
- **exit:** sys.exit() returns a promise ([208ef8c](https://github.com/ionic-team/stencil/commit/208ef8c90dd2e65b46823c0420f7c5811bfa3c86))
- **export:** export client runtime from @stencil/core ([4c6cb60](https://github.com/ionic-team/stencil/commit/4c6cb6099581843fd00a3eb7dddda77c9675f0de))
- **hmr:** fix dev server hmr ([fa480b6](https://github.com/ionic-team/stencil/commit/fa480b60d1d0867a741506c9aff953c3534c63dc))
- **hydrate:** ensure all timers are cleared ([db1d747](https://github.com/ionic-team/stencil/commit/db1d7475f81dfb575365c75636eb26c9f7835fed))
- **monorepos:** do not lazy require missing dependencies ([7f739a0](https://github.com/ionic-team/stencil/commit/7f739a0cac7423e91ac8614206b71894796965d8))
- **parse:** parse decorator shorthand property assignment ([6b9e035](https://github.com/ionic-team/stencil/commit/6b9e0357c43e155c03d450d5209e87dbe3a92d60))
- **plugin:** ensure external plugin css do not require physical file ([b5a2536](https://github.com/ionic-team/stencil/commit/b5a2536d0ac40a6ad940c55fcc52c8cdfcfa8b15)), closes [#2622](https://github.com/ionic-team/stencil/issues/2622)
- **prerender:** flatten hAsync children to resolve promises ([363d258](https://github.com/ionic-team/stencil/commit/363d2585faa1f0a365f86b564a14440e5777e0cc))
- **prerender:** hAsync only returns promise if it has to ([25a547a](https://github.com/ionic-team/stencil/commit/25a547a359a4cdb9fde83723497b75c99c11a5cc))
- **safari:** fix safari10 builds ([63f02f8](https://github.com/ionic-team/stencil/commit/63f02f8fc125a21c0338850ef9060f27a9ebb87b))
- **sys:** set ts.getExecutingFilePath() from stencil sys ([2b21f2d](https://github.com/ionic-team/stencil/commit/2b21f2d01af313be32310de29f297172a1318b56))
- **taskQueue:** fix "immediate" rendering ([#2630](https://github.com/ionic-team/stencil/issues/2630)) ([62ea511](https://github.com/ionic-team/stencil/commit/62ea51121b8b77b9e9122e37657ce4c911538a5d))
- **testing:** add collectCoverageFrom jest parameter ([#2613](https://github.com/ionic-team/stencil/issues/2613)) ([370a701](https://github.com/ionic-team/stencil/commit/370a70122789570f80290e6b3ef7683cf00d9b5a))
- **treeshaking:** move environment helpers out of utils ([c9306b9](https://github.com/ionic-team/stencil/commit/c9306b9f3d359620f10b5a756bd717b1a210a576))
- **ts:** update ts lib default local module path ([16f30bc](https://github.com/ionic-team/stencil/commit/16f30bcd1db5dec163dbaa7d719a01110b471a32))
- **watch:** fix rebuild components on e2e w/ watch ([7cd28ca](https://github.com/ionic-team/stencil/commit/7cd28ca3f59d0b13b746bee43597b8255f4d6160)), closes [#2642](https://github.com/ionic-team/stencil/issues/2642)
- **watch:** hmr scss \_partial reload on file change ([4ffbe4a](https://github.com/ionic-team/stencil/commit/4ffbe4a23bb971a5878544db1a8b0cc81b896909)), closes [#2205](https://github.com/ionic-team/stencil/issues/2205)
- **worker:** error passing ([03864f2](https://github.com/ionic-team/stencil/commit/03864f2ce258df293c4a3ba69fd4f954a9c917a2))

### Features

- **buildEs5:** add "prod" as an option for config.buildEs5 ([1af30a2](https://github.com/ionic-team/stencil/commit/1af30a2177e6cc920c88c30a6c0c939a73918c1b))
- **dev-server:** single-threaded dev-server for debugging ([cf335e3](https://github.com/ionic-team/stencil/commit/cf335e312a25335fd3c2cec55278ff74dcdb82e1))
- **runtime:** add jsx Fragment ([#2647](https://github.com/ionic-team/stencil/issues/2647)) ([f3abee7](https://github.com/ionic-team/stencil/commit/f3abee768df833308c69e4693a5d2a84af9b6d2e))
- **jest:** update to jest 26.4.0 ([9e3a6a8](https://github.com/ionic-team/stencil/commit/9e3a6a85cf40ad61bdc687fa047beda30b47f8a4))
- **prerendering:** async h() function ([d6eabb9](https://github.com/ionic-team/stencil/commit/d6eabb9359ef0f271817426137eb5cacb1b54aac))
- **rollup:** update to rollup 2.26.6 ([6424254](https://github.com/ionic-team/stencil/commit/6424254e2914c26dfcd06aa8bbcd0f2a2174d9f2))
- **terser:** update to terser 5.1.0 and use its esm build ([4b67c5a](https://github.com/ionic-team/stencil/commit/4b67c5a229541fcf3ab3d943c4fb2b650a11e80a))
- **terser:** update to terser 5.2.1 ([7582974](https://github.com/ionic-team/stencil/commit/758297447e512a8d5753ab2c5be950bd6cdc2045))

## ⛱ [1.17.3](https://github.com/ionic-team/stencil/compare/v1.17.2...v1.17.3) (2020-08-04)

### Bug Fixes

- **build:** dist-custom-elements-bundle types ([#2597](https://github.com/ionic-team/stencil/issues/2597)) ([7f2f5ad](https://github.com/ionic-team/stencil/commit/7f2f5ad7ca2ea6f1259721ca853cf029ebc34176)), closes [#2596](https://github.com/ionic-team/stencil/issues/2596)
- **test:** update module ext order ([79ba207](https://github.com/ionic-team/stencil/commit/79ba207b595dc43d8740ba26c2a208b7ec1ca232)), closes [#2608](https://github.com/ionic-team/stencil/issues/2608)

## ☎️ [1.17.2](https://github.com/ionic-team/stencil/compare/v1.17.1...v1.17.2) (2020-07-28)

### Bug Fixes

- **dev-server:** fix dev client requesting build results ([91564f4](https://github.com/ionic-team/stencil/commit/91564f4dd954575843273d4437165cb408c735ef))
- **env:** add os.plaform() polyfill ([93b53e2](https://github.com/ionic-team/stencil/commit/93b53e2119a5d4b4cac28e655c97041106a40048))
- **resolve:** fix ts resolve module for transpile sync ([7e538f4](https://github.com/ionic-team/stencil/commit/7e538f438b55e52104f0b5398a07e51c6699f589))
- **sys:** node sys prerender applyPrerenderGlobalPatch ([517891d](https://github.com/ionic-team/stencil/commit/517891d3aabcddf456321a52b9a7d477663da47e))
- **worker:** mock worker instance for hydrate builds ([207ce44](https://github.com/ionic-team/stencil/commit/207ce44ef319cd4406b8018e53df26fca5b92016))

## 🐚 [1.17.1](https://github.com/ionic-team/stencil/compare/v1.17.0...v1.17.1) (2020-07-26)

### Bug Fixes

- **bundling:** downgrade `@rollup/plugin-commonjs` ([#2589](https://github.com/ionic-team/stencil/issues/2589)) ([be1bdd1](https://github.com/ionic-team/stencil/commit/be1bdd1b06b8512b55f8d29e62627d41859ff7a0))
- Parse5 6.0.1

# 🍩 [1.17.0](https://github.com/ionic-team/stencil/compare/v1.16.5...v1.17.0) (2020-07-24)

### Features

- **runtime:** ability to hook into creating CustomEvent, so vue binding can lowercase event names ([a2ce019](https://github.com/ionic-team/stencil/commit/a2ce019d1731c5cee42534fa5c8652e91f6f6cd9))
- **setAssetPath:** customize path of asset base urls ([a06a941](https://github.com/ionic-team/stencil/commit/a06a9419b23f0f2624226162744d63bd6a8cfcce))
- **dev-server:** pick up scheme and host from forwarding proxy. ([#2492](https://github.com/ionic-team/stencil/issues/2492)) ([3be1d72](https://github.com/ionic-team/stencil/commit/3be1d72d2c0e3d9bb1554abde14a03a57efe6ff2))
- Rollup 2.23.0

### Bug Fixes

- **polyfill:** use core-js promise and iife fetch polyfill ([#2443](https://github.com/ionic-team/stencil/issues/2443)) ([7b7ed0b](https://github.com/ionic-team/stencil/commit/7b7ed0b94d56f71a218a568e976ed2de1099c350))
- **render:** allow mapping of childNode to functional component ([#2548](https://github.com/ionic-team/stencil/issues/2548)) ([d0176c9](https://github.com/ionic-team/stencil/commit/d0176c93b52436289857f4413c1e3685a068af57))
- **resolve:** fix typescript resolve patch ([1ef8097](https://github.com/ionic-team/stencil/commit/1ef8097ebab16a1475958ab3580c690f767036de))
- **screenshot:** update compare.html in e2e screenshot ([#2585](https://github.com/ionic-team/stencil/issues/2585)) ([85f6504](https://github.com/ionic-team/stencil/commit/85f6504bf89a05321a1990f6b4e1244044244fb4))
- **sys:** ensure in-memory sys checks file data ([f7c03c2](https://github.com/ionic-team/stencil/commit/f7c03c2708aab1953a4536fbd9c3b927ebfb6fcd))
