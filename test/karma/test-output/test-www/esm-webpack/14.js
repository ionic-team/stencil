(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[14],{

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attribute_complex", function() { return AttributeComplex; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
var __awaiter = undefined && undefined.__awaiter || function(t, e, n, r) {
  return new (n || (n = Promise))((function(o, i) {
    function fulfilled(t) {
      try {
        step(r.next(t));
      } catch (e) {
        i(e);
      }
    }
    function rejected(t) {
      try {
        step(r.throw(t));
      } catch (e) {
        i(e);
      }
    }
    function step(t) {
      var e;
      t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n((function(t) {
        t(e);
      }))).then(fulfilled, rejected);
    }
    step((r = r.apply(t, e || [])).next());
  }));
}, __generator = undefined && undefined.__generator || function(t, e) {
  var n, r, o, i, s = {
    label: 0,
    sent: function() {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return i = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
    return this;
  }), i;
  function verb(a) {
    return function(u) {
      return function(a) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;i && (i = 0, a[0] && (s = 0)), s; ) try {
          if (n = 1, r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r), 
          0) : r.next) && !(o = o.call(r, a[1])).done) return o;
          switch (r = 0, o && (a = [ 2 & a[0], o.value ]), a[0]) {
           case 0:
           case 1:
            o = a;
            break;

           case 4:
            return s.label++, {
              value: a[1],
              done: !1
            };

           case 5:
            s.label++, r = a[1], a = [ 0 ];
            continue;

           case 7:
            a = s.ops.pop(), s.trys.pop();
            continue;

           default:
            if (!(o = s.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
              s = 0;
              continue;
            }
            if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
              s.label = a[1];
              break;
            }
            if (6 === a[0] && s.label < o[1]) {
              s.label = o[1], o = a;
              break;
            }
            if (o && s.label < o[2]) {
              s.label = o[2], s.ops.push(a);
              break;
            }
            o[2] && s.ops.pop(), s.trys.pop();
            continue;
          }
          a = e.call(t, s);
        } catch (u) {
          a = [ 6, u ], r = 0;
        } finally {
          n = o = 0;
        }
        if (5 & a[0]) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }([ a, u ]);
    };
  }
};



var AttributeComplex = /** @class */ function() {
  function class_1(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this._obj = {
      name: "James bond"
    }, this.nu0 = 1, this.nu1 = void 0, this.nu2 = void 0, this.bool0 = !0, this.bool1 = void 0, 
    this.bool2 = void 0, this.str0 = "hello", this.str1 = void 0, this.str2 = void 0;
  }
  return Object.defineProperty(class_1.prototype, "obj", {
    get: function() {
      return JSON.stringify(this._obj);
    },
    set: function(t) {
      "string" == typeof t && (this._obj = {
        name: t
      });
    },
    enumerable: !1,
    configurable: !0
  }), class_1.prototype.getInstance = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return [ 2 /*return*/ , this ];
      }));
    }));
  }, class_1;
}();



/***/ })

}]);