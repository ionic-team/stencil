/*!
Array.prototype.fill
*/
Array.prototype.fill||Object.defineProperty(Array.prototype,"fill",{value:function(t){var r,e,i,n,o,a,l;if(null==this)throw new TypeError("this is null or not defined");for(e=(r=Object(this)).length>>>0,n=(i=arguments[1]>>0)<0?Math.max(e+i,0):Math.min(i,e),l=(a=void 0===(o=arguments[2])?e:o>>0)<0?Math.max(e+a,0):Math.min(a,e);n<l;)r[n]=t,n++;return r}});

/*!
Array.prototype.find
*/
Array.prototype.find||Object.defineProperty(Array.prototype,"find",{writable:!0,configurable:!0,value:function(c,e){if(null==this)throw new TypeError('"this" is null or not defined');var b=Object(this),f=b.length>>>0;if("function"!==typeof c)throw new TypeError("predicate must be a function");for(var a=0;a<f;){var d=b[a];if(c.call(e,d,a,b))return d;a++}}});
/*!
Array.prototype.findIndex
*/
Array.prototype.findIndex||Object.defineProperty(Array.prototype,"findIndex",{value:function(c,d){if(null==this)throw new TypeError('"this" is null or not defined');var b=Object(this),e=b.length>>>0;if("function"!==typeof c)throw new TypeError("predicate must be a function");for(var a=0;a<e;){if(c.call(d,b[a],a,b))return a;a++}return-1},configurable:!0,writable:!0});
/*!
Array.from
*/
Array.from||(Array.from=function(){var l=Object.prototype.toString,h=function(c){return"function"===typeof c||"[object Function]"===l.call(c)},m=Math.pow(2,53)-1;return function(c){var k=Object(c);if(null==c)throw new TypeError("Array.from requires an array-like object - not null or undefined");var d=1<arguments.length?arguments[1]:void 0,f;if("undefined"!==typeof d){if(!h(d))throw new TypeError("Array.from: when provided, the second argument must be a function");2<arguments.length&&(f=arguments[2])}var a=
Number(k.length);a=isNaN(a)?0:0!==a&&isFinite(a)?(0<a?1:-1)*Math.floor(Math.abs(a)):a;a=Math.min(Math.max(a,0),m);for(var g=h(this)?Object(new this(a)):Array(a),b=0,e;b<a;)e=k[b],g[b]=d?"undefined"===typeof f?d(e,b):d.call(f,e,b):e,b+=1;g.length=a;return g}}());
/*!
Array.prototype.includes
*/
Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{writable:!0,configurable:!0,value:function(r,e){if(null==this)throw new TypeError('"this" is null or not defined');var t=Object(this),n=t.length>>>0;if(0===n)return!1;var i,o,a=0|e,u=Math.max(0<=a?a:n-Math.abs(a),0);for(;u<n;){if((i=t[u])===(o=r)||"number"==typeof i&&"number"==typeof o&&isNaN(i)&&isNaN(o))return!0;u++}return!1}});
