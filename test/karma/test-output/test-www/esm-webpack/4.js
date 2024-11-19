(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return timeout; });
function timeout(t, e) {
  return new Promise((function(n) {
    setTimeout((function() {
      return n(e);
    }), t);
  }));
}



/***/ }),

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_async_b", function() { return LifecycleAsyncB; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _util_1e0c6298_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(138);
var __awaiter = undefined && undefined.__awaiter || function(e, t, n, r) {
  return new (n || (n = Promise))((function(i, o) {
    function fulfilled(e) {
      try {
        step(r.next(e));
      } catch (t) {
        o(t);
      }
    }
    function rejected(e) {
      try {
        step(r.throw(e));
      } catch (t) {
        o(t);
      }
    }
    function step(e) {
      var t;
      e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
        e(t);
      }))).then(fulfilled, rejected);
    }
    step((r = r.apply(e, t || [])).next());
  }));
}, __generator = undefined && undefined.__generator || function(e, t) {
  var n, r, i, o, c = {
    label: 0,
    sent: function() {
      if (1 & i[0]) throw i[1];
      return i[1];
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
  function verb(a) {
    return function(l) {
      return function(a) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;o && (o = 0, a[0] && (c = 0)), c; ) try {
          if (n = 1, r && (i = 2 & a[0] ? r.return : a[0] ? r.throw || ((i = r.return) && i.call(r), 
          0) : r.next) && !(i = i.call(r, a[1])).done) return i;
          switch (r = 0, i && (a = [ 2 & a[0], i.value ]), a[0]) {
           case 0:
           case 1:
            i = a;
            break;

           case 4:
            return c.label++, {
              value: a[1],
              done: !1
            };

           case 5:
            c.label++, r = a[1], a = [ 0 ];
            continue;

           case 7:
            a = c.ops.pop(), c.trys.pop();
            continue;

           default:
            if (!(i = c.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
              c = 0;
              continue;
            }
            if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
              c.label = a[1];
              break;
            }
            if (6 === a[0] && c.label < i[1]) {
              c.label = i[1], i = a;
              break;
            }
            if (i && c.label < i[2]) {
              c.label = i[2], c.ops.push(a);
              break;
            }
            i[2] && c.ops.pop(), c.trys.pop();
            continue;
          }
          a = t.call(e, c);
        } catch (l) {
          a = [ 6, l ], r = 0;
        } finally {
          n = i = 0;
        }
        if (5 & a[0]) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }([ a, l ]);
    };
  }
};





var LifecycleAsyncB = /** @class */ function() {
  function class_1(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.lifecycleLoad = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "lifecycleLoad", 7), 
    this.lifecycleUpdate = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "lifecycleUpdate", 7), this.rendered = 0, 
    this.value = "";
  }
  return class_1.prototype.componentWillLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(e) {
        return this.lifecycleLoad.emit("componentWillLoad-b"), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentDidLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(e) {
        return this.lifecycleLoad.emit("componentDidLoad-b"), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentWillUpdate = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(e) {
        switch (e.label) {
         case 0:
          return this.lifecycleUpdate.emit("componentWillUpdate-b"), [ 4 /*yield*/ , Object(_util_1e0c6298_js__WEBPACK_IMPORTED_MODULE_1__[/* t */ "a"])(100) ];

         case 1:
          return e.sent(), [ 2 /*return*/ ];
        }
      }));
    }));
  }, class_1.prototype.componentDidUpdate = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(e) {
        switch (e.label) {
         case 0:
          return this.lifecycleUpdate.emit("componentDidUpdate-b"), [ 4 /*yield*/ , Object(_util_1e0c6298_js__WEBPACK_IMPORTED_MODULE_1__[/* t */ "a"])(100) ];

         case 1:
          return e.sent(), [ 2 /*return*/ ];
        }
      }));
    }));
  }, class_1.prototype.render = function() {
    return this.rendered++, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("hr", null), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "LifecycleAsyncB ", this.value), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "rendered-b"
    }, "rendered b: ", this.rendered), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("lifecycle-async-c", {
      value: this.value
    }));
  }, class_1;
}();



/***/ })

}]);