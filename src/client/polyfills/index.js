export function applyPolyfills() {
  var win = window;
  /*!
  es6-promise - a tiny implementation of Promises/A+.
  Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
  Licensed under MIT license
  See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
  v4.2.4+314e4831
  */
  (win.ES6Promise=function(){function t(){var t=setTimeout;return function(){return t(r,1)}}function r(){for(var t=0;t<y;t+=2)(0,C[t])(C[t+1]),C[t]=void 0,C[t+1]=void 0;y=0}function e(t,r){var e=this,n=new this.constructor(o);void 0===n[O]&&_(n);var i=e._state;if(i){var s=arguments[i-1];g(function(){return v(i,n,s,e._result)})}else l(e,n,t,r);return n}function n(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var r=new this(o);return u(r,t),r}function o(){}function i(t){try{return t.then}catch(t){return q.error=t,q}}function s(t,r,o){r.constructor===t.constructor&&o===e&&r.constructor.resolve===n?function(t,r){r._state===x?a(t,r._result):r._state===F?f(t,r._result):l(r,void 0,function(r){return u(t,r)},function(r){return f(t,r)})}(t,r):o===q?(f(t,q.error),q.error=null):void 0===o?a(t,r):"function"==typeof o?function(t,r,e){g(function(t){var n=!1,o=function(t,r,e,n){try{t.call(r,e,n)}catch(t){return t}}(e,r,function(e){n||(n=!0,r!==e?u(t,e):a(t,e))},function(r){n||(n=!0,f(t,r))},t._label);!n&&o&&(n=!0,f(t,o))},t)}(t,r,o):a(t,r)}function u(t,r){if(t===r)f(t,new TypeError("cannot resolve promise w/ itself"));else{var e=typeof r;null===r||"object"!==e&&"function"!==e?a(t,r):s(t,r,i(r))}}function c(t){t._onerror&&t._onerror(t._result),h(t)}function a(t,r){t._state===P&&(t._result=r,t._state=x,0!==t._subscribers.length&&g(h,t))}function f(t,r){t._state===P&&(t._state=F,t._result=r,g(c,t))}function l(t,r,e,n){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=r,o[i+x]=e,o[i+F]=n,0===i&&t._state&&g(h,t)}function h(t){var r=t._subscribers,e=t._state;if(0!==r.length){for(var n,o,i=t._result,s=0;s<r.length;s+=3)n=r[s],o=r[s+e],n?v(e,n,o,i):o(i);t._subscribers.length=0}}function v(t,r,e,n){var o="function"==typeof e,i=void 0,s=void 0,c=void 0,l=void 0;if(o){try{i=e(n)}catch(t){q.error=t,i=q}if(i===q?(l=!0,s=i.error,i.error=null):c=!0,r===i)return void f(r,new TypeError("Cannot return same promise"))}else i=n,c=!0;r._state===P&&(o&&c?u(r,i):l?f(r,s):t===x?a(r,i):t===F&&f(r,i))}function _(t){t[O]=U++,t._state=void 0,t._result=void 0,t._subscribers=[]}var p,d=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},y=0,w=void 0,m=void 0,g=function(t,e){C[y]=t,C[y+1]=e,2===(y+=2)&&(m?m(r):T())},b=(p="undefined"!=typeof window?window:void 0)||{},A=b.MutationObserver||b.WebKitMutationObserver;b="undefined"==typeof self;var E,S,M,j="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,C=Array(1e3),T=void 0;T=A?(E=0,S=new A(r),M=document.createTextNode(""),S.observe(M,{characterData:!0}),function(){M.data=E=++E%2}):j?function(){var t=new MessageChannel;return t.port1.onmessage=r,function(){return t.port2.postMessage(0)}}():void 0===p&&"function"==typeof require?function(){try{var e=Function("return this")().require("vertx");return void 0!==(w=e.runOnLoop||e.runOnContext)?function(){w(r)}:t()}catch(r){return t()}}():t();var O=Math.random().toString(36).substring(2),P=void 0,x=1,F=2,q={error:null},U=0,D=function(){function t(t,r){this._instanceConstructor=t,this.promise=new t(o),this.promise[O]||_(this.promise),d(r)?(this._remaining=this.length=r.length,this._result=Array(this.length),0===this.length?a(this.promise,this._result):(this.length=this.length||0,this._enumerate(r),0===this._remaining&&a(this.promise,this._result))):f(this.promise,Error("Array Methods must be provided an Array"))}return t.prototype._enumerate=function(t){for(var r=0;this._state===P&&r<t.length;r++)this._eachEntry(t[r],r)},t.prototype._eachEntry=function(t,r){var u=this._instanceConstructor,c=u.resolve;c===n?(c=i(t))===e&&t._state!==P?this._settledAt(t._state,r,t._result):"function"!=typeof c?(this._remaining--,this._result[r]=t):u===K?(s(u=new u(o),t,c),this._willSettleAt(u,r)):this._willSettleAt(new u(function(r){return r(t)}),r):this._willSettleAt(c(t),r)},t.prototype._settledAt=function(t,r,e){var n=this.promise;n._state===P&&(this._remaining--,t===F?f(n,e):this._result[r]=e),0===this._remaining&&a(n,this._result)},t.prototype._willSettleAt=function(t,r){var e=this;l(t,void 0,function(t){return e._settledAt(x,r,t)},function(t){return e._settledAt(F,r,t)})},t}(),K=function(){function t(r){if(this[O]=U++,this._result=this._state=void 0,this._subscribers=[],o!==r){if("function"!=typeof r)throw new TypeError("Must pass a resolver fn as 1st arg");if(!(this instanceof t))throw new TypeError("Failed to construct 'Promise': Use the 'new' operator.");!function(t,r){try{r(function(r){u(t,r)},function(r){f(t,r)})}catch(r){f(t,r)}}(this,r)}}return t.prototype.catch=function(t){return this.then(null,t)},t.prototype.finally=function(t){var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},t}();return K.prototype.then=e,K.all=function(t){return new D(this,t).promise},K.race=function(t){var r=this;return d(t)?new r(function(e,n){for(var o=t.length,i=0;i<o;i++)r.resolve(t[i]).then(e,n)}):new r(function(t,r){return r(new TypeError("Must pass array to race"))})},K.resolve=n,K.reject=function(t){var r=new this(o);return f(r,t),r},K._setScheduler=function(t){m=t},K._setAsap=function(t){g=t},K._asap=g,K.polyfill=function(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw Error("polyfill failed")}var r=t.Promise;if(r){var e=null;try{e=Object.prototype.toString.call(r.resolve())}catch(t){}if("[object Promise]"===e&&!r.cast)return}t.Promise=K},K.Promise=K,K.polyfill(),K}());

  var promises = [];

  if (!win.customElements || (win.Element && (!win.Element.prototype.closest || !win.Element.prototype.matches || !win.Element.prototype.remove))) {
    promises.push(import('./dom.js'));
  }

  function checkIfURLIsSupported() {
    try {
      var u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      return (u.href === 'http://a/c%20d') && u.searchParams;
    } catch(e) {
      return false;
    }
  }

  if (
    'function' !== typeof Object.assign || !Object.entries ||
    !Array.prototype.find || !Array.prototype.includes ||
    !String.prototype.startsWith || !String.prototype.endsWith ||
    !win.fetch ||
    !checkIfURLIsSupported() ||
    typeof WeakMap == 'undefined'
  ) {
    promises.push(import('./core-js.js'));
  }
  if (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) {
    promises.push(import('./css-shim.js'));
  }
  return Promise.all(promises);
}
