var __awaiter = this && this.__awaiter || function(e, t, n, r) {
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
}, __generator = this && this.__generator || function(e, t) {
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

import { r as registerInstance, f as createEvent, h } from "./index-a2c0d171.js";

import { t as timeout } from "./util-1e0c6298.js";

var LifecycleAsyncC = /** @class */ function() {
  function class_1(e) {
    registerInstance(this, e), this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7), 
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7), this.rendered = 0, 
    this.value = "";
  }
  return class_1.prototype.componentWillLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(e) {
        return this.lifecycleLoad.emit("componentWillLoad-c"), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentDidLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(e) {
        return this.lifecycleLoad.emit("componentDidLoad-c"), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentWillUpdate = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(e) {
        switch (e.label) {
         case 0:
          return this.lifecycleUpdate.emit("componentWillUpdate-c"), [ 4 /*yield*/ , timeout(100) ];

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
          return this.lifecycleUpdate.emit("componentDidUpdate-c"), [ 4 /*yield*/ , timeout(100) ];

         case 1:
          return e.sent(), [ 2 /*return*/ ];
        }
      }));
    }));
  }, class_1.prototype.render = function() {
    return this.rendered++, h("div", null, h("hr", null), h("div", null, "LifecycleAsyncC ", this.value), h("div", {
      class: "rendered-c"
    }, "rendered c: ", this.rendered));
  }, class_1;
}();

export { LifecycleAsyncC as lifecycle_async_c };