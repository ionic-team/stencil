/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/favicon.ico",
    "revision": "e2e1f6fc1f378153ee90a9c9d6ad3be0"
  },
  {
    "url": "build/app.css",
    "revision": "e4d00c65b8ee5d0c90df012342ae2362"
  },
  {
    "url": "build/app.js",
    "revision": "80c514f1ea008970d966fb49bf70a63a"
  },
  {
    "url": "build/app/5ijyu34l.entry.js",
    "revision": "e488d8bb7e258a220d8283ade5531d19"
  },
  {
    "url": "build/app/5ijyu34l.es5.entry.js",
    "revision": "8392b0f8b9430bb770931c02acb3fd9c"
  },
  {
    "url": "build/app/5ijyu34l.sc.entry.js",
    "revision": "e6eb1f021a9562e8e847ac66fcead1fc"
  },
  {
    "url": "build/app/5ijyu34l.sc.es5.entry.js",
    "revision": "306f99695fc00ef8708e1543933c3ba3"
  },
  {
    "url": "build/app/7atdmzgw.entry.js",
    "revision": "ec04c39991b0c1de152495da57e2f62b"
  },
  {
    "url": "build/app/7atdmzgw.es5.entry.js",
    "revision": "691202416b7cec9a303550d67fdcafbb"
  },
  {
    "url": "build/app/7atdmzgw.sc.entry.js",
    "revision": "ec04c39991b0c1de152495da57e2f62b"
  },
  {
    "url": "build/app/7atdmzgw.sc.es5.entry.js",
    "revision": "691202416b7cec9a303550d67fdcafbb"
  },
  {
    "url": "build/app/app.5v1at3af.js",
    "revision": "e55d5ab776856ccb32f46155a24c6a61"
  },
  {
    "url": "build/app/app.jyhfn7vh.js",
    "revision": "8d88459fb54707acd1d3d395d7c26ae1"
  },
  {
    "url": "build/app/chunk-94cc5d10.es5.js",
    "revision": "0472dcc6ece2d2c90cd6eeab932c96d9"
  },
  {
    "url": "build/app/chunk-b59b7ee0.js",
    "revision": "4de9330b82768a6b9be58eaf481ad775"
  },
  {
    "url": "build/app/fgysnpd7.entry.js",
    "revision": "7e0c9236977b4dfbfc94bef187dcea22"
  },
  {
    "url": "build/app/fgysnpd7.es5.entry.js",
    "revision": "da5eb67bf07b003440ddcabebe2cc91c"
  },
  {
    "url": "build/app/fgysnpd7.sc.entry.js",
    "revision": "7e0c9236977b4dfbfc94bef187dcea22"
  },
  {
    "url": "build/app/fgysnpd7.sc.es5.entry.js",
    "revision": "da5eb67bf07b003440ddcabebe2cc91c"
  },
  {
    "url": "build/app/gesture.es5.js",
    "revision": "349e92e9808b3a900fecfc0f0ae9db05"
  },
  {
    "url": "build/app/gesture.js",
    "revision": "2ace070240e7024eeadca4c5f4896ece"
  },
  {
    "url": "build/app/hi8fqvrp.entry.js",
    "revision": "848f05415ae9661c40af07dcbbd7be89"
  },
  {
    "url": "build/app/hi8fqvrp.es5.entry.js",
    "revision": "8c9615eb9d06de07cf9fbf29c5f7db5b"
  },
  {
    "url": "build/app/hi8fqvrp.sc.entry.js",
    "revision": "e3c037ebda3e260c82db4b341a90c2c1"
  },
  {
    "url": "build/app/hi8fqvrp.sc.es5.entry.js",
    "revision": "daa8dec264f6f1b3a8a9f4a2d571bc79"
  },
  {
    "url": "build/app/input-shims.es5.js",
    "revision": "467e5159d3e406433a8841006615fabc"
  },
  {
    "url": "build/app/input-shims.js",
    "revision": "c1cc5ca07fac6688c63fb63ad878b99e"
  },
  {
    "url": "build/app/ios.transition.es5.js",
    "revision": "79f49b68c5c5ea6abcfc22383d0d0cb8"
  },
  {
    "url": "build/app/ios.transition.js",
    "revision": "5508b31b2fa4ffd945486bc60be38bde"
  },
  {
    "url": "build/app/md.transition.es5.js",
    "revision": "62789ce7c5d3cfb03be56f83dd508077"
  },
  {
    "url": "build/app/md.transition.js",
    "revision": "29809b19d113408d6bf226c25c19f079"
  },
  {
    "url": "build/app/n64ptboo.entry.js",
    "revision": "9fae29b41a284311ac52fc57ad4c7c12"
  },
  {
    "url": "build/app/n64ptboo.es5.entry.js",
    "revision": "eaab7d03957a5807fa59c2f8055a1616"
  },
  {
    "url": "build/app/n64ptboo.sc.entry.js",
    "revision": "10fbf53718fdaa609505289afccca1e5"
  },
  {
    "url": "build/app/n64ptboo.sc.es5.entry.js",
    "revision": "4fb93402781e2491c46e2928c466c725"
  },
  {
    "url": "build/app/status-tap.es5.js",
    "revision": "bc0ca89f55373b2273e4c5bf06010c8e"
  },
  {
    "url": "build/app/status-tap.js",
    "revision": "59600486cb6b367003728117c167954e"
  },
  {
    "url": "build/app/tap-click.es5.js",
    "revision": "923457fbeef17677e05aa1a8df54559a"
  },
  {
    "url": "build/app/tap-click.js",
    "revision": "8e06337c6fc0c476b74c664dfdc0dcbf"
  },
  {
    "url": "index.html",
    "revision": "c486099dfc2888836cf05436afd45c37"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
