(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[134],{

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getResult", function() { return getResult; });
var __awaiter = undefined && undefined.__awaiter || function(e, t, r, n) {
  return new (r || (r = Promise))((function(o, a) {
    function fulfilled(e) {
      try {
        step(n.next(e));
      } catch (t) {
        a(t);
      }
    }
    function rejected(e) {
      try {
        step(n.throw(e));
      } catch (t) {
        a(t);
      }
    }
    function step(e) {
      var t;
      e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r((function(e) {
        e(t);
      }))).then(fulfilled, rejected);
    }
    step((n = n.apply(e, t || [])).next());
  }));
}, __generator = undefined && undefined.__generator || function(e, t) {
  var r, n, o, a, l = {
    label: 0,
    sent: function() {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return a = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
    return this;
  }), a;
  function verb(i) {
    return function(u) {
      return function(i) {
        if (r) throw new TypeError("Generator is already executing.");
        for (;a && (a = 0, i[0] && (l = 0)), l; ) try {
          if (r = 1, n && (o = 2 & i[0] ? n.return : i[0] ? n.throw || ((o = n.return) && o.call(n), 
          0) : n.next) && !(o = o.call(n, i[1])).done) return o;
          switch (n = 0, o && (i = [ 2 & i[0], o.value ]), i[0]) {
           case 0:
           case 1:
            o = i;
            break;

           case 4:
            return l.label++, {
              value: i[1],
              done: !1
            };

           case 5:
            l.label++, n = i[1], i = [ 0 ];
            continue;

           case 7:
            i = l.ops.pop(), l.trys.pop();
            continue;

           default:
            if (!(o = l.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
              l = 0;
              continue;
            }
            if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
              l.label = i[1];
              break;
            }
            if (6 === i[0] && l.label < o[1]) {
              l.label = o[1], o = i;
              break;
            }
            if (o && l.label < o[2]) {
              l.label = o[2], l.ops.push(i);
              break;
            }
            o[2] && l.ops.pop(), l.trys.pop();
            continue;
          }
          i = t.call(e, l);
        } catch (u) {
          i = [ 6, u ], n = 0;
        } finally {
          r = o = 0;
        }
        if (5 & i[0]) throw i[1];
        return {
          value: i[0] ? i[1] : void 0,
          done: !0
        };
      }([ i, u ]);
    };
  }
}, state$1 = 0;

function hello() {
  return _word();
}

function world() {
  return "world";
}

function _word() {
  return "hello" + ++state$1;
}

var state = 0;

function getResult() {
  return __awaiter(this, void 0, void 0, (function() {
    var e;
    return __generator(this, (function(t) {
      switch (t.label) {
       case 0:
        return [ 4 /*yield*/ , __webpack_require__.e(/* import() */ 135).then(__webpack_require__.bind(null, 140)) ];

       case 1:
        return e = t.sent().concat, state++, [ 2 /*return*/ , e(hello(), world()) + state ];
      }
    }));
  }));
}



/***/ })

}]);