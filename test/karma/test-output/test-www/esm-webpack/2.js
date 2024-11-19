(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ 136:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "node_globals", function() { return NodeGlobals; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var global$1 = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, lookup = [], revLookup = [], Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array, inited = !1;

function init() {
  inited = !0;
  for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, r = e.length; t < r; ++t) lookup[t] = e[t], 
  revLookup[e.charCodeAt(t)] = t;
  revLookup["-".charCodeAt(0)] = 62, revLookup["_".charCodeAt(0)] = 63;
}

function toByteArray(e) {
  var t, r, n, i, o, f;
  inited || init();
  var u = e.length;
  if (u % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
    o = "=" === e[u - 2] ? 2 : "=" === e[u - 1] ? 1 : 0, 
  // base64 is 4/3 + up to two characters of the original data
  f = new Arr(3 * u / 4 - o), 
  // if there are placeholders, only get up to the last complete 4 chars
  n = o > 0 ? u - 4 : u;
  var a = 0;
  for (t = 0, r = 0; t < n; t += 4, r += 3) i = revLookup[e.charCodeAt(t)] << 18 | revLookup[e.charCodeAt(t + 1)] << 12 | revLookup[e.charCodeAt(t + 2)] << 6 | revLookup[e.charCodeAt(t + 3)], 
  f[a++] = i >> 16 & 255, f[a++] = i >> 8 & 255, f[a++] = 255 & i;
  return 2 === o ? (i = revLookup[e.charCodeAt(t)] << 2 | revLookup[e.charCodeAt(t + 1)] >> 4, 
  f[a++] = 255 & i) : 1 === o && (i = revLookup[e.charCodeAt(t)] << 10 | revLookup[e.charCodeAt(t + 1)] << 4 | revLookup[e.charCodeAt(t + 2)] >> 2, 
  f[a++] = i >> 8 & 255, f[a++] = 255 & i), f;
}

function tripletToBase64(e) {
  return lookup[e >> 18 & 63] + lookup[e >> 12 & 63] + lookup[e >> 6 & 63] + lookup[63 & e];
}

function encodeChunk(e, t, r) {
  for (var n, i = [], o = t; o < r; o += 3) n = (e[o] << 16) + (e[o + 1] << 8) + e[o + 2], 
  i.push(tripletToBase64(n));
  return i.join("");
}

function fromByteArray(e) {
  var t;
  inited || init();
  // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var r = e.length, n = r % 3, i = "", o = [], f = 16383, u = 0, a = r - n; u < a; u += f) o.push(encodeChunk(e, u, u + f > a ? a : u + f));
  // pad the end with zeros, but make sure to not forget the extra bytes
    return 1 === n ? (t = e[r - 1], i += lookup[t >> 2], i += lookup[t << 4 & 63], 
  i += "==") : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], i += lookup[t >> 10], i += lookup[t >> 4 & 63], 
  i += lookup[t << 2 & 63], i += "="), o.push(i), o.join("");
}

function read(e, t, r, n, i) {
  var o, f, u = 8 * i - n - 1, a = (1 << u) - 1, s = a >> 1, c = -7, l = r ? i - 1 : 0, p = r ? -1 : 1, g = e[t + l];
  for (l += p, o = g & (1 << -c) - 1, g >>= -c, c += u; c > 0; o = 256 * o + e[t + l], 
  l += p, c -= 8) ;
  for (f = o & (1 << -c) - 1, o >>= -c, c += n; c > 0; f = 256 * f + e[t + l], l += p, 
  c -= 8) ;
  if (0 === o) o = 1 - s; else {
    if (o === a) return f ? NaN : 1 / 0 * (g ? -1 : 1);
    f += Math.pow(2, n), o -= s;
  }
  return (g ? -1 : 1) * f * Math.pow(2, o - n);
}

function write(e, t, r, n, i, o) {
  var f, u, a, s = 8 * o - i - 1, c = (1 << s) - 1, l = c >> 1, p = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = n ? 0 : o - 1, d = n ? 1 : -1, y = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (u = isNaN(t) ? 1 : 0, f = c) : (f = Math.floor(Math.log(t) / Math.LN2), 
  t * (a = Math.pow(2, -f)) < 1 && (f--, a *= 2), (t += f + l >= 1 ? p / a : p * Math.pow(2, 1 - l)) * a >= 2 && (f++, 
  a /= 2), f + l >= c ? (u = 0, f = c) : f + l >= 1 ? (u = (t * a - 1) * Math.pow(2, i), 
  f += l) : (u = t * Math.pow(2, l - 1) * Math.pow(2, i), f = 0)); i >= 8; e[r + g] = 255 & u, 
  g += d, u /= 256, i -= 8) ;
  for (f = f << i | u, s += i; s > 0; e[r + g] = 255 & f, g += d, f /= 256, s -= 8) ;
  e[r + g - d] |= 128 * y;
}

var toString = {}.toString, isArray = Array.isArray || function(e) {
  return "[object Array]" == toString.call(e);
}, INSPECT_MAX_BYTES = 50;

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}

function createBuffer(e, t) {
  if (kMaxLength() < t) throw new RangeError("Invalid typed array length");
  return Buffer.TYPED_ARRAY_SUPPORT ? (
  // Return an augmented `Uint8Array` instance, for best performance
  e = new Uint8Array(t)).__proto__ = Buffer.prototype : (
  // Fallback: Return an object instance of the Buffer class
  null === e && (e = new Buffer(t)), e.length = t), e;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */ function Buffer(e, t, r) {
  if (!(Buffer.TYPED_ARRAY_SUPPORT || this instanceof Buffer)) return new Buffer(e, t, r);
  // Common case.
    if ("number" == typeof e) {
    if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
    return allocUnsafe(this, e);
  }
  return from(this, e, t, r);
}

function from(e, t, r, n) {
  if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
  return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? fromArrayBuffer(e, t, r, n) : "string" == typeof t ? fromString(e, t, r) : fromObject(e, t);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/ function assertSize(e) {
  if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
  if (e < 0) throw new RangeError('"size" argument must not be negative');
}

function alloc(e, t, r, n) {
  return assertSize(t), t <= 0 ? createBuffer(e, t) : void 0 !== r ? "string" == typeof n ? createBuffer(e, t).fill(r, n) : createBuffer(e, t).fill(r) : createBuffer(e, t);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/ function allocUnsafe(e, t) {
  if (assertSize(t), e = createBuffer(e, t < 0 ? 0 : 0 | checked(t)), !Buffer.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) e[r] = 0;
  return e;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */ function fromString(e, t, r) {
  if ("string" == typeof r && "" !== r || (r = "utf8"), !Buffer.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
  var n = 0 | byteLength(t, r), i = (e = createBuffer(e, n)).write(t, r);
  return i !== n && (
  // Writing a hex string, for example, that contains invalid characters will
  // cause everything after the first invalid character to be ignored. (e.g.
  // 'abxxcd' will be treated as 'ab')
  e = e.slice(0, i)), e;
}

function fromArrayLike(e, t) {
  var r = t.length < 0 ? 0 : 0 | checked(t.length);
  e = createBuffer(e, r);
  for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
  return e;
}

function fromArrayBuffer(e, t, r, n) {
  if (r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
  if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
  return t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n), 
  Buffer.TYPED_ARRAY_SUPPORT ? (
  // Return an augmented `Uint8Array` instance, for best performance
  e = t).__proto__ = Buffer.prototype : 
  // Fallback: Return an object instance of the Buffer class
  e = fromArrayLike(e, t), e;
}

function fromObject(e, t) {
  if (internalIsBuffer(t)) {
    var r = 0 | checked(t.length);
    return 0 === (e = createBuffer(e, r)).length || t.copy(e, 0, 0, r), e;
  }
  if (t) {
    if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || isnan(t.length) ? createBuffer(e, 0) : fromArrayLike(e, t);
    if ("Buffer" === t.type && isArray(t.data)) return fromArrayLike(e, t.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}

function checked(e) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (e >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
  return 0 | e;
}

function internalIsBuffer(e) {
  return !(null == e || !e._isBuffer);
}

function byteLength(e, t) {
  if (internalIsBuffer(e)) return e.length;
  if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
  "string" != typeof e && (e = "" + e);
  var r = e.length;
  if (0 === r) return 0;
  // Use a for loop to avoid recursion
    for (var n = !1; ;) switch (t) {
   case "ascii":
   case "latin1":
   case "binary":
    return r;

   case "utf8":
   case "utf-8":
   case void 0:
    return utf8ToBytes(e).length;

   case "ucs2":
   case "ucs-2":
   case "utf16le":
   case "utf-16le":
    return 2 * r;

   case "hex":
    return r >>> 1;

   case "base64":
    return base64ToBytes(e).length;

   default:
    if (n) return utf8ToBytes(e).length;
 // assume utf8
        t = ("" + t).toLowerCase(), n = !0;
  }
}

function slowToString(e, t, r) {
  var n = !1;
  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.
  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
  if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
    if ((r >>>= 0) <= (t >>>= 0)) return "";
  for (e || (e = "utf8"); ;) switch (e) {
   case "hex":
    return hexSlice(this, t, r);

   case "utf8":
   case "utf-8":
    return utf8Slice(this, t, r);

   case "ascii":
    return asciiSlice(this, t, r);

   case "latin1":
   case "binary":
    return latin1Slice(this, t, r);

   case "base64":
    return base64Slice(this, t, r);

   case "ucs2":
   case "ucs-2":
   case "utf16le":
   case "utf-16le":
    return utf16leSlice(this, t, r);

   default:
    if (n) throw new TypeError("Unknown encoding: " + e);
    e = (e + "").toLowerCase(), n = !0;
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
function swap(e, t, r) {
  var n = e[t];
  e[t] = e[r], e[r] = n;
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(e, t, r, n, i) {
  // Empty buffer means no match
  if (0 === e.length) return -1;
  // Normalize byteOffset
    if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), 
  r = +r, // Coerce to Number.
  isNaN(r) && (
  // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
  r = i ? 0 : e.length - 1), 
  // Normalize byteOffset: negative offsets start from the end of the buffer
  r < 0 && (r = e.length + r), r >= e.length) {
    if (i) return -1;
    r = e.length - 1;
  } else if (r < 0) {
    if (!i) return -1;
    r = 0;
  }
  // Normalize val
    // Finally, search either indexOf (if dir is true) or lastIndexOf
  if ("string" == typeof t && (t = Buffer.from(t, n)), internalIsBuffer(t)) 
  // Special case: looking for empty string/buffer always fails
  return 0 === t.length ? -1 : arrayIndexOf(e, t, r, n, i);
  if ("number" == typeof t) // Search for a byte value [0-255]
  return t &= 255, Buffer.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : arrayIndexOf(e, [ t ], r, n, i);
  throw new TypeError("val must be string, number or Buffer");
}

function arrayIndexOf(e, t, r, n, i) {
  var o, f = 1, u = e.length, a = t.length;
  if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
    if (e.length < 2 || t.length < 2) return -1;
    f = 2, u /= 2, a /= 2, r /= 2;
  }
  function read(e, t) {
    return 1 === f ? e[t] : e.readUInt16BE(t * f);
  }
  if (i) {
    var s = -1;
    for (o = r; o < u; o++) if (read(e, o) === read(t, -1 === s ? 0 : o - s)) {
      if (-1 === s && (s = o), o - s + 1 === a) return s * f;
    } else -1 !== s && (o -= o - s), s = -1;
  } else for (r + a > u && (r = u - a), o = r; o >= 0; o--) {
    for (var c = !0, l = 0; l < a; l++) if (read(e, o + l) !== read(t, l)) {
      c = !1;
      break;
    }
    if (c) return o;
  }
  return -1;
}

function hexWrite(e, t, r, n) {
  r = Number(r) || 0;
  var i = e.length - r;
  n ? (n = Number(n)) > i && (n = i) : n = i;
  // must be an even number of digits
    var o = t.length;
  if (o % 2 != 0) throw new TypeError("Invalid hex string");
  n > o / 2 && (n = o / 2);
  for (var f = 0; f < n; ++f) {
    var u = parseInt(t.substr(2 * f, 2), 16);
    if (isNaN(u)) return f;
    e[r + f] = u;
  }
  return f;
}

function utf8Write(e, t, r, n) {
  return blitBuffer(utf8ToBytes(t, e.length - r), e, r, n);
}

function asciiWrite(e, t, r, n) {
  return blitBuffer(asciiToBytes(t), e, r, n);
}

function latin1Write(e, t, r, n) {
  return asciiWrite(e, t, r, n);
}

function base64Write(e, t, r, n) {
  return blitBuffer(base64ToBytes(t), e, r, n);
}

function ucs2Write(e, t, r, n) {
  return blitBuffer(utf16leToBytes(t, e.length - r), e, r, n);
}

function base64Slice(e, t, r) {
  return 0 === t && r === e.length ? fromByteArray(e) : fromByteArray(e.slice(t, r));
}

function utf8Slice(e, t, r) {
  r = Math.min(e.length, r);
  for (var n = [], i = t; i < r; ) {
    var o, f, u, a, s = e[i], c = null, l = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
    if (i + l <= r) switch (l) {
     case 1:
      s < 128 && (c = s);
      break;

     case 2:
      128 == (192 & (o = e[i + 1])) && (a = (31 & s) << 6 | 63 & o) > 127 && (c = a);
      break;

     case 3:
      o = e[i + 1], f = e[i + 2], 128 == (192 & o) && 128 == (192 & f) && (a = (15 & s) << 12 | (63 & o) << 6 | 63 & f) > 2047 && (a < 55296 || a > 57343) && (c = a);
      break;

     case 4:
      o = e[i + 1], f = e[i + 2], u = e[i + 3], 128 == (192 & o) && 128 == (192 & f) && 128 == (192 & u) && (a = (15 & s) << 18 | (63 & o) << 12 | (63 & f) << 6 | 63 & u) > 65535 && a < 1114112 && (c = a);
    }
    null === c ? (
    // we did not generate a valid codePoint so insert a
    // replacement char (U+FFFD) and advance only 1 byte
    c = 65533, l = 1) : c > 65535 && (
    // encode to utf16 (surrogate pair dance)
    c -= 65536, n.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), n.push(c), i += l;
  }
  return decodeCodePointsArray(n);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = void 0 === global$1.TYPED_ARRAY_SUPPORT || global$1.TYPED_ARRAY_SUPPORT, 
Buffer.poolSize = 8192, // not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function(e) {
  return e.__proto__ = Buffer.prototype, e;
}, Buffer.from = function(e, t, r) {
  return from(null, e, t, r);
}, Buffer.TYPED_ARRAY_SUPPORT && (Buffer.prototype.__proto__ = Uint8Array.prototype, 
Buffer.__proto__ = Uint8Array), Buffer.alloc = function(e, t, r) {
  return alloc(null, e, t, r);
}, Buffer.allocUnsafe = function(e) {
  return allocUnsafe(null, e);
}, 
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function(e) {
  return allocUnsafe(null, e);
}, Buffer.isBuffer = isBuffer, Buffer.compare = function(e, t) {
  if (!internalIsBuffer(e) || !internalIsBuffer(t)) throw new TypeError("Arguments must be Buffers");
  if (e === t) return 0;
  for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i) if (e[i] !== t[i]) {
    r = e[i], n = t[i];
    break;
  }
  return r < n ? -1 : n < r ? 1 : 0;
}, Buffer.isEncoding = function(e) {
  switch (String(e).toLowerCase()) {
   case "hex":
   case "utf8":
   case "utf-8":
   case "ascii":
   case "latin1":
   case "binary":
   case "base64":
   case "ucs2":
   case "ucs-2":
   case "utf16le":
   case "utf-16le":
    return !0;

   default:
    return !1;
  }
}, Buffer.concat = function(e, t) {
  if (!isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
  if (0 === e.length) return Buffer.alloc(0);
  var r;
  if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
  var n = Buffer.allocUnsafe(t), i = 0;
  for (r = 0; r < e.length; ++r) {
    var o = e[r];
    if (!internalIsBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
    o.copy(n, i), i += o.length;
  }
  return n;
}, Buffer.byteLength = byteLength, Buffer.prototype._isBuffer = !0, Buffer.prototype.swap16 = function() {
  var e = this.length;
  if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var t = 0; t < e; t += 2) swap(this, t, t + 1);
  return this;
}, Buffer.prototype.swap32 = function() {
  var e = this.length;
  if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var t = 0; t < e; t += 4) swap(this, t, t + 3), swap(this, t + 1, t + 2);
  return this;
}, Buffer.prototype.swap64 = function() {
  var e = this.length;
  if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var t = 0; t < e; t += 8) swap(this, t, t + 7), swap(this, t + 1, t + 6), swap(this, t + 2, t + 5), 
  swap(this, t + 3, t + 4);
  return this;
}, Buffer.prototype.toString = function() {
  var e = 0 | this.length;
  return 0 === e ? "" : 0 === arguments.length ? utf8Slice(this, 0, e) : slowToString.apply(this, arguments);
}, Buffer.prototype.equals = function(e) {
  if (!internalIsBuffer(e)) throw new TypeError("Argument must be a Buffer");
  return this === e || 0 === Buffer.compare(this, e);
}, Buffer.prototype.inspect = function() {
  var e = "", t = INSPECT_MAX_BYTES;
  return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), 
  this.length > t && (e += " ... ")), "<Buffer " + e + ">";
}, Buffer.prototype.compare = function(e, t, r, n, i) {
  if (!internalIsBuffer(e)) throw new TypeError("Argument must be a Buffer");
  if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), 
  void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
  if (n >= i && t >= r) return 0;
  if (n >= i) return -1;
  if (t >= r) return 1;
  if (this === e) return 0;
  for (var o = (i >>>= 0) - (n >>>= 0), f = (r >>>= 0) - (t >>>= 0), u = Math.min(o, f), a = this.slice(n, i), s = e.slice(t, r), c = 0; c < u; ++c) if (a[c] !== s[c]) {
    o = a[c], f = s[c];
    break;
  }
  return o < f ? -1 : f < o ? 1 : 0;
}, Buffer.prototype.includes = function(e, t, r) {
  return -1 !== this.indexOf(e, t, r);
}, Buffer.prototype.indexOf = function(e, t, r) {
  return bidirectionalIndexOf(this, e, t, r, !0);
}, Buffer.prototype.lastIndexOf = function(e, t, r) {
  return bidirectionalIndexOf(this, e, t, r, !1);
}, Buffer.prototype.write = function(e, t, r, n) {
  // Buffer#write(string)
  if (void 0 === t) n = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) n = t, 
  r = this.length, t = 0; else {
    if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
  }
  var i = this.length - t;
  if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
  n || (n = "utf8");
  for (var o = !1; ;) switch (n) {
   case "hex":
    return hexWrite(this, e, t, r);

   case "utf8":
   case "utf-8":
    return utf8Write(this, e, t, r);

   case "ascii":
    return asciiWrite(this, e, t, r);

   case "latin1":
   case "binary":
    return latin1Write(this, e, t, r);

   case "base64":
    // Warning: maxLength not taken into account in base64Write
    return base64Write(this, e, t, r);

   case "ucs2":
   case "ucs-2":
   case "utf16le":
   case "utf-16le":
    return ucs2Write(this, e, t, r);

   default:
    if (o) throw new TypeError("Unknown encoding: " + n);
    n = ("" + n).toLowerCase(), o = !0;
  }
}, Buffer.prototype.toJSON = function() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

var MAX_ARGUMENTS_LENGTH = 4096;

function decodeCodePointsArray(e) {
  var t = e.length;
  if (t <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, e); // avoid extra slice()
  // Decode in chunks to avoid "call stack size exceeded".
    for (var r = "", n = 0; n < t; ) r += String.fromCharCode.apply(String, e.slice(n, n += MAX_ARGUMENTS_LENGTH));
  return r;
}

function asciiSlice(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
  return n;
}

function latin1Slice(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
  return n;
}

function hexSlice(e, t, r) {
  var n = e.length;
  (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
  for (var i = "", o = t; o < r; ++o) i += toHex(e[o]);
  return i;
}

function utf16leSlice(e, t, r) {
  for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
  return i;
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(e, t, r) {
  if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
  if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
}

function checkInt(e, t, r, n, i, o) {
  if (!internalIsBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
  if (r + n > e.length) throw new RangeError("Index out of range");
}

function objectWriteUInt16(e, t, r, n) {
  t < 0 && (t = 65535 + t + 1);
  for (var i = 0, o = Math.min(e.length - r, 2); i < o; ++i) e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);
}

function objectWriteUInt32(e, t, r, n) {
  t < 0 && (t = 4294967295 + t + 1);
  for (var i = 0, o = Math.min(e.length - r, 4); i < o; ++i) e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255;
}

function checkIEEE754(e, t, r, n, i, o) {
  if (r + n > e.length) throw new RangeError("Index out of range");
  if (r < 0) throw new RangeError("Index out of range");
}

function writeFloat(e, t, r, n, i) {
  return i || checkIEEE754(e, t, r, 4), write(e, t, r, n, 23, 4), r + 4;
}

function writeDouble(e, t, r, n, i) {
  return i || checkIEEE754(e, t, r, 8), write(e, t, r, n, 52, 8), r + 8;
}

Buffer.prototype.slice = function(e, t) {
  var r, n = this.length;
  if ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), 
  t < e && (t = e), Buffer.TYPED_ARRAY_SUPPORT) (r = this.subarray(e, t)).__proto__ = Buffer.prototype; else {
    var i = t - e;
    r = new Buffer(i, void 0);
    for (var o = 0; o < i; ++o) r[o] = this[o + e];
  }
  return r;
}, Buffer.prototype.readUIntLE = function(e, t, r) {
  e |= 0, t |= 0, r || checkOffset(e, t, this.length);
  for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); ) n += this[e + o] * i;
  return n;
}, Buffer.prototype.readUIntBE = function(e, t, r) {
  e |= 0, t |= 0, r || checkOffset(e, t, this.length);
  for (var n = this[e + --t], i = 1; t > 0 && (i *= 256); ) n += this[e + --t] * i;
  return n;
}, Buffer.prototype.readUInt8 = function(e, t) {
  return t || checkOffset(e, 1, this.length), this[e];
}, Buffer.prototype.readUInt16LE = function(e, t) {
  return t || checkOffset(e, 2, this.length), this[e] | this[e + 1] << 8;
}, Buffer.prototype.readUInt16BE = function(e, t) {
  return t || checkOffset(e, 2, this.length), this[e] << 8 | this[e + 1];
}, Buffer.prototype.readUInt32LE = function(e, t) {
  return t || checkOffset(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
}, Buffer.prototype.readUInt32BE = function(e, t) {
  return t || checkOffset(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
}, Buffer.prototype.readIntLE = function(e, t, r) {
  e |= 0, t |= 0, r || checkOffset(e, t, this.length);
  for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); ) n += this[e + o] * i;
  return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n;
}, Buffer.prototype.readIntBE = function(e, t, r) {
  e |= 0, t |= 0, r || checkOffset(e, t, this.length);
  for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256); ) o += this[e + --n] * i;
  return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;
}, Buffer.prototype.readInt8 = function(e, t) {
  return t || checkOffset(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
}, Buffer.prototype.readInt16LE = function(e, t) {
  t || checkOffset(e, 2, this.length);
  var r = this[e] | this[e + 1] << 8;
  return 32768 & r ? 4294901760 | r : r;
}, Buffer.prototype.readInt16BE = function(e, t) {
  t || checkOffset(e, 2, this.length);
  var r = this[e + 1] | this[e] << 8;
  return 32768 & r ? 4294901760 | r : r;
}, Buffer.prototype.readInt32LE = function(e, t) {
  return t || checkOffset(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
}, Buffer.prototype.readInt32BE = function(e, t) {
  return t || checkOffset(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
}, Buffer.prototype.readFloatLE = function(e, t) {
  return t || checkOffset(e, 4, this.length), read(this, e, !0, 23, 4);
}, Buffer.prototype.readFloatBE = function(e, t) {
  return t || checkOffset(e, 4, this.length), read(this, e, !1, 23, 4);
}, Buffer.prototype.readDoubleLE = function(e, t) {
  return t || checkOffset(e, 8, this.length), read(this, e, !0, 52, 8);
}, Buffer.prototype.readDoubleBE = function(e, t) {
  return t || checkOffset(e, 8, this.length), read(this, e, !1, 52, 8);
}, Buffer.prototype.writeUIntLE = function(e, t, r, n) {
  (e = +e, t |= 0, r |= 0, n) || checkInt(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
  var i = 1, o = 0;
  for (this[t] = 255 & e; ++o < r && (i *= 256); ) this[t + o] = e / i & 255;
  return t + r;
}, Buffer.prototype.writeUIntBE = function(e, t, r, n) {
  (e = +e, t |= 0, r |= 0, n) || checkInt(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
  var i = r - 1, o = 1;
  for (this[t + i] = 255 & e; --i >= 0 && (o *= 256); ) this[t + i] = e / o & 255;
  return t + r;
}, Buffer.prototype.writeUInt8 = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 1, 255, 0), Buffer.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 
  this[t] = 255 & e, t + 1;
}, Buffer.prototype.writeUInt16LE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
  this[t + 1] = e >>> 8) : objectWriteUInt16(this, e, t, !0), t + 2;
}, Buffer.prototype.writeUInt16BE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, 
  this[t + 1] = 255 & e) : objectWriteUInt16(this, e, t, !1), t + 2;
}, Buffer.prototype.writeUInt32LE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, 
  this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : objectWriteUInt32(this, e, t, !0), 
  t + 4;
}, Buffer.prototype.writeUInt32BE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, 
  this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : objectWriteUInt32(this, e, t, !1), 
  t + 4;
}, Buffer.prototype.writeIntLE = function(e, t, r, n) {
  if (e = +e, t |= 0, !n) {
    var i = Math.pow(2, 8 * r - 1);
    checkInt(this, e, t, r, i - 1, -i);
  }
  var o = 0, f = 1, u = 0;
  for (this[t] = 255 & e; ++o < r && (f *= 256); ) e < 0 && 0 === u && 0 !== this[t + o - 1] && (u = 1), 
  this[t + o] = (e / f >> 0) - u & 255;
  return t + r;
}, Buffer.prototype.writeIntBE = function(e, t, r, n) {
  if (e = +e, t |= 0, !n) {
    var i = Math.pow(2, 8 * r - 1);
    checkInt(this, e, t, r, i - 1, -i);
  }
  var o = r - 1, f = 1, u = 0;
  for (this[t + o] = 255 & e; --o >= 0 && (f *= 256); ) e < 0 && 0 === u && 0 !== this[t + o + 1] && (u = 1), 
  this[t + o] = (e / f >> 0) - u & 255;
  return t + r;
}, Buffer.prototype.writeInt8 = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 1, 127, -128), Buffer.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 
  e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
}, Buffer.prototype.writeInt16LE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
  this[t + 1] = e >>> 8) : objectWriteUInt16(this, e, t, !0), t + 2;
}, Buffer.prototype.writeInt16BE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, 
  this[t + 1] = 255 & e) : objectWriteUInt16(this, e, t, !1), t + 2;
}, Buffer.prototype.writeInt32LE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 4, 2147483647, -2147483648), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
  this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : objectWriteUInt32(this, e, t, !0), 
  t + 4;
}, Buffer.prototype.writeInt32BE = function(e, t, r) {
  return e = +e, t |= 0, r || checkInt(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), 
  Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, 
  this[t + 3] = 255 & e) : objectWriteUInt32(this, e, t, !1), t + 4;
}, Buffer.prototype.writeFloatLE = function(e, t, r) {
  return writeFloat(this, e, t, !0, r);
}, Buffer.prototype.writeFloatBE = function(e, t, r) {
  return writeFloat(this, e, t, !1, r);
}, Buffer.prototype.writeDoubleLE = function(e, t, r) {
  return writeDouble(this, e, t, !0, r);
}, Buffer.prototype.writeDoubleBE = function(e, t, r) {
  return writeDouble(this, e, t, !1, r);
}, 
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(e, t, r, n) {
  // Copy 0 bytes; we're done
  if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), 
  t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
  if (0 === e.length || 0 === this.length) return 0;
  // Fatal error conditions
    if (t < 0) throw new RangeError("targetStart out of bounds");
  if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
  if (n < 0) throw new RangeError("sourceEnd out of bounds");
  // Are we oob?
    n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
  var i, o = n - r;
  if (this === e && r < t && t < n) 
  // descending copy from end
  for (i = o - 1; i >= 0; --i) e[i + t] = this[i + r]; else if (o < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) 
  // ascending copy from start
  for (i = 0; i < o; ++i) e[i + t] = this[i + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);
  return o;
}, 
// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function(e, t, r, n) {
  // Handle string cases:
  if ("string" == typeof e) {
    if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, 
    r = this.length), 1 === e.length) {
      var i = e.charCodeAt(0);
      i < 256 && (e = i);
    }
    if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
    if ("string" == typeof n && !Buffer.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
  } else "number" == typeof e && (e &= 255);
  // Invalid ranges are not set to a default, so can range check early.
    if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
  if (r <= t) return this;
  var o;
  if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) this[o] = e; else {
    var f = internalIsBuffer(e) ? e : utf8ToBytes(new Buffer(e, n).toString()), u = f.length;
    for (o = 0; o < r - t; ++o) this[o + t] = f[o % u];
  }
  return this;
};

// HELPER FUNCTIONS
// ================
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(e) {
  // Node converts strings with length < 2 to ''
  if ((
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  e = stringtrim(e).replace(INVALID_BASE64_RE, "")).length < 2) return "";
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    for (;e.length % 4 != 0; ) e += "=";
  return e;
}

function stringtrim(e) {
  return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}

function toHex(e) {
  return e < 16 ? "0" + e.toString(16) : e.toString(16);
}

function utf8ToBytes(e, t) {
  var r;
  t = t || 1 / 0;
  for (var n = e.length, i = null, o = [], f = 0; f < n; ++f) {
    // is surrogate component
    if ((r = e.charCodeAt(f)) > 55295 && r < 57344) {
      // last char was a lead
      if (!i) {
        // no lead yet
        if (r > 56319) {
          // unexpected trail
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }
        // valid lead
                if (f + 1 === n) {
          // unpaired lead
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }
        i = r;
        continue;
      }
      // 2 leads in a row
            if (r < 56320) {
        (t -= 3) > -1 && o.push(239, 191, 189), i = r;
        continue;
      }
      // valid surrogate pair
            r = 65536 + (i - 55296 << 10 | r - 56320);
    } else i && (t -= 3) > -1 && o.push(239, 191, 189);
    // encode utf8
    if (i = null, r < 128) {
      if ((t -= 1) < 0) break;
      o.push(r);
    } else if (r < 2048) {
      if ((t -= 2) < 0) break;
      o.push(r >> 6 | 192, 63 & r | 128);
    } else if (r < 65536) {
      if ((t -= 3) < 0) break;
      o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
    } else {
      if (!(r < 1114112)) throw new Error("Invalid code point");
      if ((t -= 4) < 0) break;
      o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
    }
  }
  return o;
}

function asciiToBytes(e) {
  for (var t = [], r = 0; r < e.length; ++r) 
  // Node's code seems to be doing this and not & 0x7F..
  t.push(255 & e.charCodeAt(r));
  return t;
}

function utf16leToBytes(e, t) {
  for (var r, n, i, o = [], f = 0; f < e.length && !((t -= 2) < 0); ++f) n = (r = e.charCodeAt(f)) >> 8, 
  i = r % 256, o.push(i), o.push(n);
  return o;
}

function base64ToBytes(e) {
  return toByteArray(base64clean(e));
}

function blitBuffer(e, t, r, n) {
  for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
  return i;
}

function isnan(e) {
  return e != e;
 // eslint-disable-line no-self-compare
}

// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(e) {
  return null != e && (!!e._isBuffer || isFastBuffer(e) || isSlowBuffer(e));
}

function isFastBuffer(e) {
  return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(e) {
  return "function" == typeof e.readFloatLE && "function" == typeof e.slice && isFastBuffer(e.slice(0, 0));
}

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}

function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}

var cachedSetTimeout = defaultSetTimout, cachedClearTimeout = defaultClearTimeout;

function runTimeout(e) {
  if (cachedSetTimeout === setTimeout) 
  //normal enviroments in sane situations
  return setTimeout(e, 0);
  // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
  setTimeout(e, 0);
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(e, 0);
  } catch (t) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, e, 0);
    } catch (t) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, e, 0);
    }
  }
}

function runClearTimeout(e) {
  if (cachedClearTimeout === clearTimeout) 
  //normal enviroments in sane situations
  return clearTimeout(e);
  // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
  clearTimeout(e);
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(e);
  } catch (t) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, e);
    } catch (t) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, e);
    }
  }
}

"function" == typeof global$1.setTimeout && (cachedSetTimeout = setTimeout), "function" == typeof global$1.clearTimeout && (cachedClearTimeout = clearTimeout);

var currentQueue, queue = [], draining = !1, queueIndex = -1;

function cleanUpNextTick() {
  draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
  queue.length && drainQueue());
}

function drainQueue() {
  if (!draining) {
    var e = runTimeout(cleanUpNextTick);
    draining = !0;
    for (var t = queue.length; t; ) {
      for (currentQueue = queue, queue = []; ++queueIndex < t; ) currentQueue && currentQueue[queueIndex].run();
      queueIndex = -1, t = queue.length;
    }
    currentQueue = null, draining = !1, runClearTimeout(e);
  }
}

function nextTick(e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
  queue.push(new Item(e, t)), 1 !== queue.length || draining || runTimeout(drainQueue);
}

// v8 likes predictible objects
function Item(e, t) {
  this.fun = e, this.array = t;
}

Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};

var title = "browser", platform = "browser", browser = !0, env = {}, argv = [], version = "", versions = {}, release$1 = {}, config = {};

function noop() {}

var on = noop, addListener = noop, once = noop, off = noop, removeListener = noop, removeAllListeners = noop, emit = noop;

function binding(e) {
  throw new Error("process.binding is not supported");
}

function cwd() {
  return "/";
}

function chdir(e) {
  throw new Error("process.chdir is not supported");
}

function umask() {
  return 0;
}

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {}, performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
  return (new Date).getTime();
};

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(e) {
  var t = .001 * performanceNow.call(performance), r = Math.floor(t), n = Math.floor(t % 1 * 1e9);
  return e && (r -= e[0], (n -= e[1]) < 0 && (r--, n += 1e9)), [ r, n ];
}

var startTime = new Date;

function uptime$1() {
  return (new Date - startTime) / 1e3;
}

var _endianness, browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release$1,
  config: config,
  uptime: uptime$1
};

/*
The MIT License (MIT)

Copyright (c) 2016 CoderPuppy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/ function endianness() {
  if (void 0 === _endianness) {
    var e = new ArrayBuffer(2), t = new Uint8Array(e), r = new Uint16Array(e);
    if (t[0] = 1, t[1] = 2, 258 === r[0]) _endianness = "BE"; else {
      if (513 !== r[0]) throw new Error("unable to figure out endianess");
      _endianness = "LE";
    }
  }
  return _endianness;
}

function hostname() {
  return void 0 !== global$1.location ? global$1.location.hostname : "";
}

function loadavg() {
  return [];
}

function uptime() {
  return 0;
}

function freemem() {
  return Number.MAX_VALUE;
}

function totalmem() {
  return Number.MAX_VALUE;
}

function cpus() {
  return [];
}

function type() {
  return "Browser";
}

function release() {
  return void 0 !== global$1.navigator ? global$1.navigator.appVersion : "";
}

function networkInterfaces() {}

function getNetworkInterfaces() {}

function tmpDir() {
  return "/tmp";
}

var tmpdir = tmpDir, EOL = "\n", os = {
  EOL: EOL,
  tmpdir: tmpdir,
  tmpDir: tmpDir,
  networkInterfaces: networkInterfaces,
  getNetworkInterfaces: getNetworkInterfaces,
  release: release,
  type: type,
  cpus: cpus,
  totalmem: totalmem,
  freemem: freemem,
  uptime: uptime,
  loadavg: loadavg,
  hostname: hostname,
  endianness: endianness
}, fs = {}, NodeGlobals = /** @class */ function() {
  function NodeGlobals(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.tmpdir = "", this.fileSystem = !1, this.glbl = !1, 
    this.buf = !1, this.prcs = !1;
  }
  return NodeGlobals.prototype.componentWillLoad = function() {
    this.tmpdir = os.tmpdir(), this.fileSystem = !!fs, this.glbl = !!global$1, this.buf = !!Buffer, 
    this.prcs = !!browser$1;
  }, NodeGlobals.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("section", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "NODE_ENV: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "node_env"
    }, "production")), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "os.tmpdir(): ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "tmpdir"
    }, this.tmpdir)), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "fs: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "fs"
    }, this.fileSystem.toString())), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "global: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "global"
    }, this.glbl.toString())), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "Buffer: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "Buffer"
    }, this.buf.toString())), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "process: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "process"
    }, this.prcs.toString())));
  }, NodeGlobals;
}();


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(136)))

/***/ })

}]);