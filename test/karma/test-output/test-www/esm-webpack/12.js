(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[12],{

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attribute_boolean_root", function() { return AttributeBooleanRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
var __awaiter = undefined && undefined.__awaiter || function(t, e, n, r) {
  return new (n || (n = Promise))((function(a, o) {
    function fulfilled(t) {
      try {
        step(r.next(t));
      } catch (e) {
        o(e);
      }
    }
    function rejected(t) {
      try {
        step(r.throw(t));
      } catch (e) {
        o(e);
      }
    }
    function step(t) {
      var e;
      t.done ? a(t.value) : (e = t.value, e instanceof n ? e : new n((function(t) {
        t(e);
      }))).then(fulfilled, rejected);
    }
    step((r = r.apply(t, e || [])).next());
  }));
}, __generator = undefined && undefined.__generator || function(t, e) {
  var n, r, a, o, i = {
    label: 0,
    sent: function() {
      if (1 & a[0]) throw a[1];
      return a[1];
    },
    trys: [],
    ops: []
  };
  return o = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function verb(s) {
    return function(l) {
      return function(s) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;o && (o = 0, s[0] && (i = 0)), i; ) try {
          if (n = 1, r && (a = 2 & s[0] ? r.return : s[0] ? r.throw || ((a = r.return) && a.call(r), 
          0) : r.next) && !(a = a.call(r, s[1])).done) return a;
          switch (r = 0, a && (s = [ 2 & s[0], a.value ]), s[0]) {
           case 0:
           case 1:
            a = s;
            break;

           case 4:
            return i.label++, {
              value: s[1],
              done: !1
            };

           case 5:
            i.label++, r = s[1], s = [ 0 ];
            continue;

           case 7:
            s = i.ops.pop(), i.trys.pop();
            continue;

           default:
            if (!(a = i.trys, (a = a.length > 0 && a[a.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
              i = 0;
              continue;
            }
            if (3 === s[0] && (!a || s[1] > a[0] && s[1] < a[3])) {
              i.label = s[1];
              break;
            }
            if (6 === s[0] && i.label < a[1]) {
              i.label = a[1], a = s;
              break;
            }
            if (a && i.label < a[2]) {
              i.label = a[2], i.ops.push(s);
              break;
            }
            a[2] && i.ops.pop(), i.trys.pop();
            continue;
          }
          s = e.call(t, i);
        } catch (l) {
          s = [ 6, l ], r = 0;
        } finally {
          n = a = 0;
        }
        if (5 & s[0]) throw s[1];
        return {
          value: s[0] ? s[1] : void 0,
          done: !0
        };
      }([ s, l ]);
    };
  }
};



var AttributeBooleanRoot = /** @class */ function() {
  function class_1(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.state = !1;
  }
  return class_1.prototype.toggleState = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return this.state = !this.state, [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.hostData = function() {
    return {
      readonly: this.state,
      tappable: this.state,
      str: this.state ? "hello" : null,
      "aria-hidden": "".concat(this.state),
      fixedtrue: "true",
      fixedfalse: "false",
      "no-appear": void 0,
      "no-appear2": !1
    };
  }, class_1.prototype.__stencil_render = function() {
    return [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.toggleState.bind(this)
    }, "Toggle attributes"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("attribute-boolean", {
      boolState: this.state,
      strState: this.state,
      noreflect: this.state,
      tappable: this.state,
      "aria-hidden": "".concat(this.state)
    }) ];
  }, Object.defineProperty(class_1.prototype, "el", {
    get: function() {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* g */ "h"])(this);
    },
    enumerable: !1,
    configurable: !0
  }), class_1.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], this.hostData(), this.__stencil_render());
  }, class_1;
}();



/***/ })

}]);