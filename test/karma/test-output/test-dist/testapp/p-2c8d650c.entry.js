import { r as t, h as e } from "./p-55339060.js";

const r = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};

var n = [], i = [], f = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = !1;

function init() {
  o = !0;
  for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", e = 0, r = t.length; e < r; ++e) n[e] = t[e], 
  i[t.charCodeAt(e)] = e;
  i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
}

function encodeChunk(t, e, r) {
  for (var i, f, o = [], u = e; u < r; u += 3) i = (t[u] << 16) + (t[u + 1] << 8) + t[u + 2], 
  o.push(n[(f = i) >> 18 & 63] + n[f >> 12 & 63] + n[f >> 6 & 63] + n[63 & f]);
  return o.join("");
}

function fromByteArray(t) {
  var e;
  o || init();
  // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var r = t.length, i = r % 3, f = "", u = [], s = 16383, a = 0, h = r - i; a < h; a += s) u.push(encodeChunk(t, a, a + s > h ? h : a + s));
  // pad the end with zeros, but make sure to not forget the extra bytes
    return 1 === i ? (e = t[r - 1], f += n[e >> 2], f += n[e << 4 & 63], f += "==") : 2 === i && (e = (t[r - 2] << 8) + t[r - 1], 
  f += n[e >> 10], f += n[e >> 4 & 63], f += n[e << 2 & 63], f += "="), u.push(f), 
  u.join("");
}

function read(t, e, r, n, i) {
  var f, o, u = 8 * i - n - 1, s = (1 << u) - 1, a = s >> 1, h = -7, c = r ? i - 1 : 0, l = r ? -1 : 1, p = t[e + c];
  for (c += l, f = p & (1 << -h) - 1, p >>= -h, h += u; h > 0; f = 256 * f + t[e + c], 
  c += l, h -= 8) ;
  for (o = f & (1 << -h) - 1, f >>= -h, h += n; h > 0; o = 256 * o + t[e + c], c += l, 
  h -= 8) ;
  if (0 === f) f = 1 - a; else {
    if (f === s) return o ? NaN : 1 / 0 * (p ? -1 : 1);
    o += Math.pow(2, n), f -= a;
  }
  return (p ? -1 : 1) * o * Math.pow(2, f - n);
}

function write(t, e, r, n, i, f) {
  var o, u, s, a = 8 * f - i - 1, h = (1 << a) - 1, c = h >> 1, l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : f - 1, g = n ? 1 : -1, d = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = h) : (o = Math.floor(Math.log(e) / Math.LN2), 
  e * (s = Math.pow(2, -o)) < 1 && (o--, s *= 2), (e += o + c >= 1 ? l / s : l * Math.pow(2, 1 - c)) * s >= 2 && (o++, 
  s /= 2), o + c >= h ? (u = 0, o = h) : o + c >= 1 ? (u = (e * s - 1) * Math.pow(2, i), 
  o += c) : (u = e * Math.pow(2, c - 1) * Math.pow(2, i), o = 0)); i >= 8; t[r + p] = 255 & u, 
  p += g, u /= 256, i -= 8) ;
  for (o = o << i | u, a += i; a > 0; t[r + p] = 255 & o, p += g, o /= 256, a -= 8) ;
  t[r + p - g] |= 128 * d;
}

var u = {}.toString, s = Array.isArray || function(t) {
  return "[object Array]" == u.call(t);
};

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}

function createBuffer(t, e) {
  if (kMaxLength() < e) throw new RangeError("Invalid typed array length");
  return Buffer.TYPED_ARRAY_SUPPORT ? (
  // Return an augmented `Uint8Array` instance, for best performance
  t = new Uint8Array(e)).__proto__ = Buffer.prototype : (
  // Fallback: Return an object instance of the Buffer class
  null === t && (t = new Buffer(e)), t.length = e), t;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */ function Buffer(t, e, r) {
  if (!(Buffer.TYPED_ARRAY_SUPPORT || this instanceof Buffer)) return new Buffer(t, e, r);
  // Common case.
    if ("number" == typeof t) {
    if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
    return allocUnsafe(this, t);
  }
  return from(this, t, e, r);
}

function from(t, e, r, n) {
  if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
  return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? function(t, e, r, n) {
    if (r < 0 || e.byteLength < r) throw new RangeError("'offset' is out of bounds");
    if (e.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
    e = void 0 === r && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, r) : new Uint8Array(e, r, n);
    Buffer.TYPED_ARRAY_SUPPORT ? (
    // Return an augmented `Uint8Array` instance, for best performance
    t = e).__proto__ = Buffer.prototype : 
    // Fallback: Return an object instance of the Buffer class
    t = fromArrayLike(t, e);
    return t;
  }(t, e, r, n) : "string" == typeof e ? function(t, e, r) {
    "string" == typeof r && "" !== r || (r = "utf8");
    if (!Buffer.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
    var n = 0 | byteLength(e, r);
    t = createBuffer(t, n);
    var i = t.write(e, r);
    i !== n && (
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    t = t.slice(0, i));
    return t;
  }(t, e, r) : function(t, e) {
    if (internalIsBuffer(e)) {
      var r = 0 | checked(e.length);
      return 0 === (t = createBuffer(t, r)).length || e.copy(t, 0, 0, r), t;
    }
    if (e) {
      if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) return "number" != typeof e.length || (n = e.length) != n ? createBuffer(t, 0) : fromArrayLike(t, e);
      if ("Buffer" === e.type && s(e.data)) return fromArrayLike(t, e.data);
    }
    var n;
    // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
    // The _isBuffer check is for Safari 5-7 support, because it's missing
    // Object.prototype.constructor. Remove this eventually
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
  }(t, e);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/ function assertSize(t) {
  if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
  if (t < 0) throw new RangeError('"size" argument must not be negative');
}

function allocUnsafe(t, e) {
  if (assertSize(e), t = createBuffer(t, e < 0 ? 0 : 0 | checked(e)), !Buffer.TYPED_ARRAY_SUPPORT) for (var r = 0; r < e; ++r) t[r] = 0;
  return t;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */ function fromArrayLike(t, e) {
  var r = e.length < 0 ? 0 : 0 | checked(e.length);
  t = createBuffer(t, r);
  for (var n = 0; n < r; n += 1) t[n] = 255 & e[n];
  return t;
}

function checked(t) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (t >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
  return 0 | t;
}

function internalIsBuffer(t) {
  return !(null == t || !t._isBuffer);
}

function byteLength(t, e) {
  if (internalIsBuffer(t)) return t.length;
  if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
  "string" != typeof t && (t = "" + t);
  var r = t.length;
  if (0 === r) return 0;
  // Use a for loop to avoid recursion
    for (var n = !1; ;) switch (e) {
   case "ascii":
   case "latin1":
   case "binary":
    return r;

   case "utf8":
   case "utf-8":
   case void 0:
    return utf8ToBytes(t).length;

   case "ucs2":
   case "ucs-2":
   case "utf16le":
   case "utf-16le":
    return 2 * r;

   case "hex":
    return r >>> 1;

   case "base64":
    return base64ToBytes(t).length;

   default:
    if (n) return utf8ToBytes(t).length;
 // assume utf8
        e = ("" + e).toLowerCase(), n = !0;
  }
}

function slowToString(t, e, r) {
  var n = !1;
  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.
  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
  if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
    if ((r >>>= 0) <= (e >>>= 0)) return "";
  for (t || (t = "utf8"); ;) switch (t) {
   case "hex":
    return hexSlice(this, e, r);

   case "utf8":
   case "utf-8":
    return utf8Slice(this, e, r);

   case "ascii":
    return asciiSlice(this, e, r);

   case "latin1":
   case "binary":
    return latin1Slice(this, e, r);

   case "base64":
    return base64Slice(this, e, r);

   case "ucs2":
   case "ucs-2":
   case "utf16le":
   case "utf-16le":
    return utf16leSlice(this, e, r);

   default:
    if (n) throw new TypeError("Unknown encoding: " + t);
    t = (t + "").toLowerCase(), n = !0;
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
function swap(t, e, r) {
  var n = t[e];
  t[e] = t[r], t[r] = n;
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(t, e, r, n, i) {
  // Empty buffer means no match
  if (0 === t.length) return -1;
  // Normalize byteOffset
    if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), 
  r = +r, // Coerce to Number.
  isNaN(r) && (
  // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
  r = i ? 0 : t.length - 1), 
  // Normalize byteOffset: negative offsets start from the end of the buffer
  r < 0 && (r = t.length + r), r >= t.length) {
    if (i) return -1;
    r = t.length - 1;
  } else if (r < 0) {
    if (!i) return -1;
    r = 0;
  }
  // Normalize val
    // Finally, search either indexOf (if dir is true) or lastIndexOf
  if ("string" == typeof e && (e = Buffer.from(e, n)), internalIsBuffer(e)) 
  // Special case: looking for empty string/buffer always fails
  return 0 === e.length ? -1 : arrayIndexOf(t, e, r, n, i);
  if ("number" == typeof e) // Search for a byte value [0-255]
  return e &= 255, Buffer.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : arrayIndexOf(t, [ e ], r, n, i);
  throw new TypeError("val must be string, number or Buffer");
}

function arrayIndexOf(t, e, r, n, i) {
  var f, o = 1, u = t.length, s = e.length;
  if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
    if (t.length < 2 || e.length < 2) return -1;
    o = 2, u /= 2, s /= 2, r /= 2;
  }
  function read(t, e) {
    return 1 === o ? t[e] : t.readUInt16BE(e * o);
  }
  if (i) {
    var a = -1;
    for (f = r; f < u; f++) if (read(t, f) === read(e, -1 === a ? 0 : f - a)) {
      if (-1 === a && (a = f), f - a + 1 === s) return a * o;
    } else -1 !== a && (f -= f - a), a = -1;
  } else for (r + s > u && (r = u - s), f = r; f >= 0; f--) {
    for (var h = !0, c = 0; c < s; c++) if (read(t, f + c) !== read(e, c)) {
      h = !1;
      break;
    }
    if (h) return f;
  }
  return -1;
}

function hexWrite(t, e, r, n) {
  r = Number(r) || 0;
  var i = t.length - r;
  n ? (n = Number(n)) > i && (n = i) : n = i;
  // must be an even number of digits
    var f = e.length;
  if (f % 2 != 0) throw new TypeError("Invalid hex string");
  n > f / 2 && (n = f / 2);
  for (var o = 0; o < n; ++o) {
    var u = parseInt(e.substr(2 * o, 2), 16);
    if (isNaN(u)) return o;
    t[r + o] = u;
  }
  return o;
}

function utf8Write(t, e, r, n) {
  return blitBuffer(utf8ToBytes(e, t.length - r), t, r, n);
}

function asciiWrite(t, e, r, n) {
  return blitBuffer(function(t) {
    for (var e = [], r = 0; r < t.length; ++r) 
    // Node's code seems to be doing this and not & 0x7F..
    e.push(255 & t.charCodeAt(r));
    return e;
  }(e), t, r, n);
}

function latin1Write(t, e, r, n) {
  return asciiWrite(t, e, r, n);
}

function base64Write(t, e, r, n) {
  return blitBuffer(base64ToBytes(e), t, r, n);
}

function ucs2Write(t, e, r, n) {
  return blitBuffer(function(t, e) {
    for (var r, n, i, f = [], o = 0; o < t.length && !((e -= 2) < 0); ++o) n = (r = t.charCodeAt(o)) >> 8, 
    i = r % 256, f.push(i), f.push(n);
    return f;
  }(e, t.length - r), t, r, n);
}

function base64Slice(t, e, r) {
  return 0 === e && r === t.length ? fromByteArray(t) : fromByteArray(t.slice(e, r));
}

function utf8Slice(t, e, r) {
  r = Math.min(t.length, r);
  for (var n = [], i = e; i < r; ) {
    var f, o, u, s, h = t[i], c = null, l = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
    if (i + l <= r) switch (l) {
     case 1:
      h < 128 && (c = h);
      break;

     case 2:
      128 == (192 & (f = t[i + 1])) && (s = (31 & h) << 6 | 63 & f) > 127 && (c = s);
      break;

     case 3:
      f = t[i + 1], o = t[i + 2], 128 == (192 & f) && 128 == (192 & o) && (s = (15 & h) << 12 | (63 & f) << 6 | 63 & o) > 2047 && (s < 55296 || s > 57343) && (c = s);
      break;

     case 4:
      f = t[i + 1], o = t[i + 2], u = t[i + 3], 128 == (192 & f) && 128 == (192 & o) && 128 == (192 & u) && (s = (15 & h) << 18 | (63 & f) << 12 | (63 & o) << 6 | 63 & u) > 65535 && s < 1114112 && (c = s);
    }
    null === c ? (
    // we did not generate a valid codePoint so insert a
    // replacement char (U+FFFD) and advance only 1 byte
    c = 65533, l = 1) : c > 65535 && (
    // encode to utf16 (surrogate pair dance)
    c -= 65536, n.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), n.push(c), i += l;
  }
  return function(t) {
    var e = t.length;
    if (e <= a) return String.fromCharCode.apply(String, t); // avoid extra slice()
    // Decode in chunks to avoid "call stack size exceeded".
        var r = "", n = 0;
    for (;n < e; ) r += String.fromCharCode.apply(String, t.slice(n, n += a));
    return r;
  }(n);
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
Buffer.TYPED_ARRAY_SUPPORT = void 0 === r.TYPED_ARRAY_SUPPORT || r.TYPED_ARRAY_SUPPORT, 
Buffer.poolSize = 8192, // not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function(t) {
  return t.__proto__ = Buffer.prototype, t;
}, Buffer.from = function(t, e, r) {
  return from(null, t, e, r);
}, Buffer.TYPED_ARRAY_SUPPORT && (Buffer.prototype.__proto__ = Uint8Array.prototype, 
Buffer.__proto__ = Uint8Array), 
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function(t, e, r) {
  return function(t, e, r, n) {
    return assertSize(e), e <= 0 ? createBuffer(t, e) : void 0 !== r ? "string" == typeof n ? createBuffer(t, e).fill(r, n) : createBuffer(t, e).fill(r) : createBuffer(t, e);
  }(null, t, e, r);
}, Buffer.allocUnsafe = function(t) {
  return allocUnsafe(null, t);
}, 
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function(t) {
  return allocUnsafe(null, t);
}, Buffer.isBuffer = function(t) {
  return null != t && (!!t._isBuffer || isFastBuffer(t) || 
  // For Node v0.10 support. Remove this eventually.
  function(t) {
    return "function" == typeof t.readFloatLE && "function" == typeof t.slice && isFastBuffer(t.slice(0, 0));
  }
  // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js
  (t));
}, Buffer.compare = function(t, e) {
  if (!internalIsBuffer(t) || !internalIsBuffer(e)) throw new TypeError("Arguments must be Buffers");
  if (t === e) return 0;
  for (var r = t.length, n = e.length, i = 0, f = Math.min(r, n); i < f; ++i) if (t[i] !== e[i]) {
    r = t[i], n = e[i];
    break;
  }
  return r < n ? -1 : n < r ? 1 : 0;
}, Buffer.isEncoding = function(t) {
  switch (String(t).toLowerCase()) {
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
}, Buffer.concat = function(t, e) {
  if (!s(t)) throw new TypeError('"list" argument must be an Array of Buffers');
  if (0 === t.length) return Buffer.alloc(0);
  var r;
  if (void 0 === e) for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
  var n = Buffer.allocUnsafe(e), i = 0;
  for (r = 0; r < t.length; ++r) {
    var f = t[r];
    if (!internalIsBuffer(f)) throw new TypeError('"list" argument must be an Array of Buffers');
    f.copy(n, i), i += f.length;
  }
  return n;
}, Buffer.byteLength = byteLength, Buffer.prototype._isBuffer = !0, Buffer.prototype.swap16 = function() {
  var t = this.length;
  if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var e = 0; e < t; e += 2) swap(this, e, e + 1);
  return this;
}, Buffer.prototype.swap32 = function() {
  var t = this.length;
  if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var e = 0; e < t; e += 4) swap(this, e, e + 3), swap(this, e + 1, e + 2);
  return this;
}, Buffer.prototype.swap64 = function() {
  var t = this.length;
  if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var e = 0; e < t; e += 8) swap(this, e, e + 7), swap(this, e + 1, e + 6), swap(this, e + 2, e + 5), 
  swap(this, e + 3, e + 4);
  return this;
}, Buffer.prototype.toString = function() {
  var t = 0 | this.length;
  return 0 === t ? "" : 0 === arguments.length ? utf8Slice(this, 0, t) : slowToString.apply(this, arguments);
}, Buffer.prototype.equals = function(t) {
  if (!internalIsBuffer(t)) throw new TypeError("Argument must be a Buffer");
  return this === t || 0 === Buffer.compare(this, t);
}, Buffer.prototype.inspect = function() {
  var t = "";
  return this.length > 0 && (t = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), 
  this.length > 50 && (t += " ... ")), "<Buffer " + t + ">";
}, Buffer.prototype.compare = function(t, e, r, n, i) {
  if (!internalIsBuffer(t)) throw new TypeError("Argument must be a Buffer");
  if (void 0 === e && (e = 0), void 0 === r && (r = t ? t.length : 0), void 0 === n && (n = 0), 
  void 0 === i && (i = this.length), e < 0 || r > t.length || n < 0 || i > this.length) throw new RangeError("out of range index");
  if (n >= i && e >= r) return 0;
  if (n >= i) return -1;
  if (e >= r) return 1;
  if (this === t) return 0;
  for (var f = (i >>>= 0) - (n >>>= 0), o = (r >>>= 0) - (e >>>= 0), u = Math.min(f, o), s = this.slice(n, i), a = t.slice(e, r), h = 0; h < u; ++h) if (s[h] !== a[h]) {
    f = s[h], o = a[h];
    break;
  }
  return f < o ? -1 : o < f ? 1 : 0;
}, Buffer.prototype.includes = function(t, e, r) {
  return -1 !== this.indexOf(t, e, r);
}, Buffer.prototype.indexOf = function(t, e, r) {
  return bidirectionalIndexOf(this, t, e, r, !0);
}, Buffer.prototype.lastIndexOf = function(t, e, r) {
  return bidirectionalIndexOf(this, t, e, r, !1);
}, Buffer.prototype.write = function(t, e, r, n) {
  // Buffer#write(string)
  if (void 0 === e) n = "utf8", r = this.length, e = 0; else if (void 0 === r && "string" == typeof e) n = e, 
  r = this.length, e = 0; else {
    if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    e |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
  }
  var i = this.length - e;
  if ((void 0 === r || r > i) && (r = i), t.length > 0 && (r < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
  n || (n = "utf8");
  for (var f = !1; ;) switch (n) {
   case "hex":
    return hexWrite(this, t, e, r);

   case "utf8":
   case "utf-8":
    return utf8Write(this, t, e, r);

   case "ascii":
    return asciiWrite(this, t, e, r);

   case "latin1":
   case "binary":
    return latin1Write(this, t, e, r);

   case "base64":
    // Warning: maxLength not taken into account in base64Write
    return base64Write(this, t, e, r);

   case "ucs2":
   case "ucs-2":
   case "utf16le":
   case "utf-16le":
    return ucs2Write(this, t, e, r);

   default:
    if (f) throw new TypeError("Unknown encoding: " + n);
    n = ("" + n).toLowerCase(), f = !0;
  }
}, Buffer.prototype.toJSON = function() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

var a = 4096;

function asciiSlice(t, e, r) {
  var n = "";
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i) n += String.fromCharCode(127 & t[i]);
  return n;
}

function latin1Slice(t, e, r) {
  var n = "";
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i) n += String.fromCharCode(t[i]);
  return n;
}

function hexSlice(t, e, r) {
  var n = t.length;
  (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
  for (var i = "", f = e; f < r; ++f) i += toHex(t[f]);
  return i;
}

function utf16leSlice(t, e, r) {
  for (var n = t.slice(e, r), i = "", f = 0; f < n.length; f += 2) i += String.fromCharCode(n[f] + 256 * n[f + 1]);
  return i;
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(t, e, r) {
  if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
  if (t + e > r) throw new RangeError("Trying to access beyond buffer length");
}

function checkInt(t, e, r, n, i, f) {
  if (!internalIsBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (e > i || e < f) throw new RangeError('"value" argument is out of bounds');
  if (r + n > t.length) throw new RangeError("Index out of range");
}

function objectWriteUInt16(t, e, r, n) {
  e < 0 && (e = 65535 + e + 1);
  for (var i = 0, f = Math.min(t.length - r, 2); i < f; ++i) t[r + i] = (e & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);
}

function objectWriteUInt32(t, e, r, n) {
  e < 0 && (e = 4294967295 + e + 1);
  for (var i = 0, f = Math.min(t.length - r, 4); i < f; ++i) t[r + i] = e >>> 8 * (n ? i : 3 - i) & 255;
}

function checkIEEE754(t, e, r, n, i, f) {
  if (r + n > t.length) throw new RangeError("Index out of range");
  if (r < 0) throw new RangeError("Index out of range");
}

function writeFloat(t, e, r, n, i) {
  return i || checkIEEE754(t, 0, r, 4), write(t, e, r, n, 23, 4), r + 4;
}

function writeDouble(t, e, r, n, i) {
  return i || checkIEEE754(t, 0, r, 8), write(t, e, r, n, 52, 8), r + 8;
}

Buffer.prototype.slice = function(t, e) {
  var r, n = this.length;
  if ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), 
  e < t && (e = t), Buffer.TYPED_ARRAY_SUPPORT) (r = this.subarray(t, e)).__proto__ = Buffer.prototype; else {
    var i = e - t;
    r = new Buffer(i, void 0);
    for (var f = 0; f < i; ++f) r[f] = this[f + t];
  }
  return r;
}, Buffer.prototype.readUIntLE = function(t, e, r) {
  t |= 0, e |= 0, r || checkOffset(t, e, this.length);
  for (var n = this[t], i = 1, f = 0; ++f < e && (i *= 256); ) n += this[t + f] * i;
  return n;
}, Buffer.prototype.readUIntBE = function(t, e, r) {
  t |= 0, e |= 0, r || checkOffset(t, e, this.length);
  for (var n = this[t + --e], i = 1; e > 0 && (i *= 256); ) n += this[t + --e] * i;
  return n;
}, Buffer.prototype.readUInt8 = function(t, e) {
  return e || checkOffset(t, 1, this.length), this[t];
}, Buffer.prototype.readUInt16LE = function(t, e) {
  return e || checkOffset(t, 2, this.length), this[t] | this[t + 1] << 8;
}, Buffer.prototype.readUInt16BE = function(t, e) {
  return e || checkOffset(t, 2, this.length), this[t] << 8 | this[t + 1];
}, Buffer.prototype.readUInt32LE = function(t, e) {
  return e || checkOffset(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
}, Buffer.prototype.readUInt32BE = function(t, e) {
  return e || checkOffset(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
}, Buffer.prototype.readIntLE = function(t, e, r) {
  t |= 0, e |= 0, r || checkOffset(t, e, this.length);
  for (var n = this[t], i = 1, f = 0; ++f < e && (i *= 256); ) n += this[t + f] * i;
  return n >= (i *= 128) && (n -= Math.pow(2, 8 * e)), n;
}, Buffer.prototype.readIntBE = function(t, e, r) {
  t |= 0, e |= 0, r || checkOffset(t, e, this.length);
  for (var n = e, i = 1, f = this[t + --n]; n > 0 && (i *= 256); ) f += this[t + --n] * i;
  return f >= (i *= 128) && (f -= Math.pow(2, 8 * e)), f;
}, Buffer.prototype.readInt8 = function(t, e) {
  return e || checkOffset(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
}, Buffer.prototype.readInt16LE = function(t, e) {
  e || checkOffset(t, 2, this.length);
  var r = this[t] | this[t + 1] << 8;
  return 32768 & r ? 4294901760 | r : r;
}, Buffer.prototype.readInt16BE = function(t, e) {
  e || checkOffset(t, 2, this.length);
  var r = this[t + 1] | this[t] << 8;
  return 32768 & r ? 4294901760 | r : r;
}, Buffer.prototype.readInt32LE = function(t, e) {
  return e || checkOffset(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
}, Buffer.prototype.readInt32BE = function(t, e) {
  return e || checkOffset(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
}, Buffer.prototype.readFloatLE = function(t, e) {
  return e || checkOffset(t, 4, this.length), read(this, t, !0, 23, 4);
}, Buffer.prototype.readFloatBE = function(t, e) {
  return e || checkOffset(t, 4, this.length), read(this, t, !1, 23, 4);
}, Buffer.prototype.readDoubleLE = function(t, e) {
  return e || checkOffset(t, 8, this.length), read(this, t, !0, 52, 8);
}, Buffer.prototype.readDoubleBE = function(t, e) {
  return e || checkOffset(t, 8, this.length), read(this, t, !1, 52, 8);
}, Buffer.prototype.writeUIntLE = function(t, e, r, n) {
  (t = +t, e |= 0, r |= 0, n) || checkInt(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
  var i = 1, f = 0;
  for (this[e] = 255 & t; ++f < r && (i *= 256); ) this[e + f] = t / i & 255;
  return e + r;
}, Buffer.prototype.writeUIntBE = function(t, e, r, n) {
  (t = +t, e |= 0, r |= 0, n) || checkInt(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
  var i = r - 1, f = 1;
  for (this[e + i] = 255 & t; --i >= 0 && (f *= 256); ) this[e + i] = t / f & 255;
  return e + r;
}, Buffer.prototype.writeUInt8 = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 1, 255, 0), Buffer.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), 
  this[e] = 255 & t, e + 1;
}, Buffer.prototype.writeUInt16LE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, 
  this[e + 1] = t >>> 8) : objectWriteUInt16(this, t, e, !0), e + 2;
}, Buffer.prototype.writeUInt16BE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, 
  this[e + 1] = 255 & t) : objectWriteUInt16(this, t, e, !1), e + 2;
}, Buffer.prototype.writeUInt32LE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24, 
  this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t) : objectWriteUInt32(this, t, e, !0), 
  e + 4;
}, Buffer.prototype.writeUInt32BE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, 
  this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : objectWriteUInt32(this, t, e, !1), 
  e + 4;
}, Buffer.prototype.writeIntLE = function(t, e, r, n) {
  if (t = +t, e |= 0, !n) {
    var i = Math.pow(2, 8 * r - 1);
    checkInt(this, t, e, r, i - 1, -i);
  }
  var f = 0, o = 1, u = 0;
  for (this[e] = 255 & t; ++f < r && (o *= 256); ) t < 0 && 0 === u && 0 !== this[e + f - 1] && (u = 1), 
  this[e + f] = (t / o >> 0) - u & 255;
  return e + r;
}, Buffer.prototype.writeIntBE = function(t, e, r, n) {
  if (t = +t, e |= 0, !n) {
    var i = Math.pow(2, 8 * r - 1);
    checkInt(this, t, e, r, i - 1, -i);
  }
  var f = r - 1, o = 1, u = 0;
  for (this[e + f] = 255 & t; --f >= 0 && (o *= 256); ) t < 0 && 0 === u && 0 !== this[e + f + 1] && (u = 1), 
  this[e + f] = (t / o >> 0) - u & 255;
  return e + r;
}, Buffer.prototype.writeInt8 = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 1, 127, -128), Buffer.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), 
  t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1;
}, Buffer.prototype.writeInt16LE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, 
  this[e + 1] = t >>> 8) : objectWriteUInt16(this, t, e, !0), e + 2;
}, Buffer.prototype.writeInt16BE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, 
  this[e + 1] = 255 & t) : objectWriteUInt16(this, t, e, !1), e + 2;
}, Buffer.prototype.writeInt32LE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 4, 2147483647, -2147483648), Buffer.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, 
  this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24) : objectWriteUInt32(this, t, e, !0), 
  e + 4;
}, Buffer.prototype.writeInt32BE = function(t, e, r) {
  return t = +t, e |= 0, r || checkInt(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), 
  Buffer.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, 
  this[e + 3] = 255 & t) : objectWriteUInt32(this, t, e, !1), e + 4;
}, Buffer.prototype.writeFloatLE = function(t, e, r) {
  return writeFloat(this, t, e, !0, r);
}, Buffer.prototype.writeFloatBE = function(t, e, r) {
  return writeFloat(this, t, e, !1, r);
}, Buffer.prototype.writeDoubleLE = function(t, e, r) {
  return writeDouble(this, t, e, !0, r);
}, Buffer.prototype.writeDoubleBE = function(t, e, r) {
  return writeDouble(this, t, e, !1, r);
}, 
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(t, e, r, n) {
  // Copy 0 bytes; we're done
  if (r || (r = 0), n || 0 === n || (n = this.length), e >= t.length && (e = t.length), 
  e || (e = 0), n > 0 && n < r && (n = r), n === r) return 0;
  if (0 === t.length || 0 === this.length) return 0;
  // Fatal error conditions
    if (e < 0) throw new RangeError("targetStart out of bounds");
  if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
  if (n < 0) throw new RangeError("sourceEnd out of bounds");
  // Are we oob?
    n > this.length && (n = this.length), t.length - e < n - r && (n = t.length - e + r);
  var i, f = n - r;
  if (this === t && r < e && e < n) 
  // descending copy from end
  for (i = f - 1; i >= 0; --i) t[i + e] = this[i + r]; else if (f < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) 
  // ascending copy from start
  for (i = 0; i < f; ++i) t[i + e] = this[i + r]; else Uint8Array.prototype.set.call(t, this.subarray(r, r + f), e);
  return f;
}, 
// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function(t, e, r, n) {
  // Handle string cases:
  if ("string" == typeof t) {
    if ("string" == typeof e ? (n = e, e = 0, r = this.length) : "string" == typeof r && (n = r, 
    r = this.length), 1 === t.length) {
      var i = t.charCodeAt(0);
      i < 256 && (t = i);
    }
    if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
    if ("string" == typeof n && !Buffer.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
  } else "number" == typeof t && (t &= 255);
  // Invalid ranges are not set to a default, so can range check early.
    if (e < 0 || this.length < e || this.length < r) throw new RangeError("Out of range index");
  if (r <= e) return this;
  var f;
  if (e >>>= 0, r = void 0 === r ? this.length : r >>> 0, t || (t = 0), "number" == typeof t) for (f = e; f < r; ++f) this[f] = t; else {
    var o = internalIsBuffer(t) ? t : utf8ToBytes(new Buffer(t, n).toString()), u = o.length;
    for (f = 0; f < r - e; ++f) this[f + e] = o[f % u];
  }
  return this;
};

// HELPER FUNCTIONS
// ================
var h = /[^+\/0-9A-Za-z-_]/g;

function toHex(t) {
  return t < 16 ? "0" + t.toString(16) : t.toString(16);
}

function utf8ToBytes(t, e) {
  var r;
  e = e || 1 / 0;
  for (var n = t.length, i = null, f = [], o = 0; o < n; ++o) {
    // is surrogate component
    if ((r = t.charCodeAt(o)) > 55295 && r < 57344) {
      // last char was a lead
      if (!i) {
        // no lead yet
        if (r > 56319) {
          // unexpected trail
          (e -= 3) > -1 && f.push(239, 191, 189);
          continue;
        }
        // valid lead
                if (o + 1 === n) {
          // unpaired lead
          (e -= 3) > -1 && f.push(239, 191, 189);
          continue;
        }
        i = r;
        continue;
      }
      // 2 leads in a row
            if (r < 56320) {
        (e -= 3) > -1 && f.push(239, 191, 189), i = r;
        continue;
      }
      // valid surrogate pair
            r = 65536 + (i - 55296 << 10 | r - 56320);
    } else i && (e -= 3) > -1 && f.push(239, 191, 189);
    // encode utf8
    if (i = null, r < 128) {
      if ((e -= 1) < 0) break;
      f.push(r);
    } else if (r < 2048) {
      if ((e -= 2) < 0) break;
      f.push(r >> 6 | 192, 63 & r | 128);
    } else if (r < 65536) {
      if ((e -= 3) < 0) break;
      f.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
    } else {
      if (!(r < 1114112)) throw new Error("Invalid code point");
      if ((e -= 4) < 0) break;
      f.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
    }
  }
  return f;
}

function base64ToBytes(t) {
  return function(t) {
    var e, r, n, u, s, a;
    o || init();
    var h = t.length;
    if (h % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice
        s = "=" === t[h - 2] ? 2 : "=" === t[h - 1] ? 1 : 0, 
    // base64 is 4/3 + up to two characters of the original data
    a = new f(3 * h / 4 - s), 
    // if there are placeholders, only get up to the last complete 4 chars
    n = s > 0 ? h - 4 : h;
    var c = 0;
    for (e = 0, r = 0; e < n; e += 4, r += 3) u = i[t.charCodeAt(e)] << 18 | i[t.charCodeAt(e + 1)] << 12 | i[t.charCodeAt(e + 2)] << 6 | i[t.charCodeAt(e + 3)], 
    a[c++] = u >> 16 & 255, a[c++] = u >> 8 & 255, a[c++] = 255 & u;
    return 2 === s ? (u = i[t.charCodeAt(e)] << 2 | i[t.charCodeAt(e + 1)] >> 4, a[c++] = 255 & u) : 1 === s && (u = i[t.charCodeAt(e)] << 10 | i[t.charCodeAt(e + 1)] << 4 | i[t.charCodeAt(e + 2)] >> 2, 
    a[c++] = u >> 8 & 255, a[c++] = 255 & u), a;
  }(function(t) {
    // Node converts strings with length < 2 to ''
    if ((
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    t = function(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }(t).replace(h, "")).length < 2) return "";
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
        for (;t.length % 4 != 0; ) t += "=";
    return t;
  }(t));
}

function blitBuffer(t, e, r, n) {
  for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i) e[i + r] = t[i];
  return i;
}

function isFastBuffer(t) {
  return !!t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t);
}

function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}

function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}

var c = defaultSetTimout, l = defaultClearTimeout;

function runTimeout(t) {
  if (c === setTimeout) 
  //normal enviroments in sane situations
  return setTimeout(t, 0);
  // if setTimeout wasn't available but was latter defined
    if ((c === defaultSetTimout || !c) && setTimeout) return c = setTimeout, setTimeout(t, 0);
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return c(t, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return c.call(null, t, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return c.call(this, t, 0);
    }
  }
}

"function" == typeof r.setTimeout && (c = setTimeout), "function" == typeof r.clearTimeout && (l = clearTimeout);

var p, g = [], d = !1, y = -1;

function cleanUpNextTick() {
  d && p && (d = !1, p.length ? g = p.concat(g) : y = -1, g.length && drainQueue());
}

function drainQueue() {
  if (!d) {
    var t = runTimeout(cleanUpNextTick);
    d = !0;
    for (var e = g.length; e; ) {
      for (p = g, g = []; ++y < e; ) p && p[y].run();
      y = -1, e = g.length;
    }
    p = null, d = !1, function(t) {
      if (l === clearTimeout) 
      //normal enviroments in sane situations
      return clearTimeout(t);
      // if clearTimeout wasn't available but was latter defined
            if ((l === defaultClearTimeout || !l) && clearTimeout) return l = clearTimeout, 
      clearTimeout(t);
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        l(t);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return l.call(null, t);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return l.call(this, t);
        }
      }
    }(t);
  }
}

// v8 likes predictible objects
function Item(t, e) {
  this.fun = t, this.array = e;
}

Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};

function noop() {}

var w = noop, B = noop, m = noop, v = noop, b = noop, E = noop, A = noop;

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var T = r.performance || {}, I = T.now || T.mozNow || T.msNow || T.oNow || T.webkitNow || function() {
  return (new Date).getTime();
};

var R = new Date;

var _, U = {
  nextTick: function(t) {
    var e = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
    g.push(new Item(t, e)), 1 !== g.length || d || runTimeout(drainQueue);
  },
  title: "browser",
  browser: !0,
  env: {},
  argv: [],
  version: "",
  versions: {},
  on: w,
  addListener: B,
  once: m,
  off: v,
  removeListener: b,
  removeAllListeners: E,
  emit: A,
  binding: function(t) {
    throw new Error("process.binding is not supported");
  },
  cwd: function() {
    return "/";
  },
  chdir: function(t) {
    throw new Error("process.chdir is not supported");
  },
  umask: function() {
    return 0;
  },
  hrtime: 
  // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime
  function(t) {
    var e = .001 * I.call(T), r = Math.floor(e), n = Math.floor(e % 1 * 1e9);
    return t && (r -= t[0], (n -= t[1]) < 0 && (r--, n += 1e9)), [ r, n ];
  },
  platform: "browser",
  release: {},
  config: {},
  uptime: function() {
    return (new Date - R) / 1e3;
  }
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

*/ function tmpDir() {
  return "/tmp";
}

const k = {
  EOL: "\n",
  tmpdir: tmpDir,
  tmpDir,
  networkInterfaces: function() {},
  getNetworkInterfaces: function() {},
  release: function() {
    return void 0 !== r.navigator ? r.navigator.appVersion : "";
  },
  type: function() {
    return "Browser";
  },
  cpus: function() {
    return [];
  },
  totalmem: function() {
    return Number.MAX_VALUE;
  },
  freemem: function() {
    return Number.MAX_VALUE;
  },
  uptime: function() {
    return 0;
  },
  loadavg: function() {
    return [];
  },
  hostname: function() {
    return void 0 !== r.location ? r.location.hostname : "";
  },
  endianness: function() {
    if (void 0 === _) {
      var t = new ArrayBuffer(2), e = new Uint8Array(t), r = new Uint16Array(t);
      if (e[0] = 1, e[1] = 2, 258 === r[0]) _ = "BE"; else {
        if (513 !== r[0]) throw new Error("unable to figure out endianess");
        _ = "LE";
      }
    }
    return _;
  }
}, S = {}, P = class {
  constructor(e) {
    t(this, e), this.tmpdir = "", this.fileSystem = !1, this.glbl = !1, this.buf = !1, 
    this.prcs = !1;
  }
  componentWillLoad() {
    this.tmpdir = k.tmpdir(), this.fileSystem = !!S, this.glbl = !!r, this.buf = !!Buffer, 
    this.prcs = !!U;
  }
  render() {
    return e("section", null, e("div", null, "NODE_ENV: ", e("span", {
      id: "node_env"
    }, "production")), e("div", null, "os.tmpdir(): ", e("span", {
      id: "tmpdir"
    }, this.tmpdir)), e("div", null, "fs: ", e("span", {
      id: "fs"
    }, this.fileSystem.toString())), e("div", null, "global: ", e("span", {
      id: "global"
    }, this.glbl.toString())), e("div", null, "Buffer: ", e("span", {
      id: "Buffer"
    }, this.buf.toString())), e("div", null, "process: ", e("span", {
      id: "process"
    }, this.prcs.toString())));
  }
};

export { P as node_globals }