var __awaiter = this && this.__awaiter || function(t, e, n, o) {
  return new (n || (n = Promise))((function(r, i) {
    function fulfilled(t) {
      try {
        step(o.next(t));
      } catch (e) {
        i(e);
      }
    }
    function rejected(t) {
      try {
        step(o.throw(t));
      } catch (e) {
        i(e);
      }
    }
    function step(t) {
      var e;
      t.done ? r(t.value) : (e = t.value, e instanceof n ? e : new n((function(t) {
        t(e);
      }))).then(fulfilled, rejected);
    }
    step((o = o.apply(t, e || [])).next());
  }));
}, __generator = this && this.__generator || function(t, e) {
  var n, o, r, i, s = {
    label: 0,
    sent: function() {
      if (1 & r[0]) throw r[1];
      return r[1];
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
  function verb(l) {
    return function(a) {
      return function(l) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;i && (i = 0, l[0] && (s = 0)), s; ) try {
          if (n = 1, o && (r = 2 & l[0] ? o.return : l[0] ? o.throw || ((r = o.return) && r.call(o), 
          0) : o.next) && !(r = r.call(o, l[1])).done) return r;
          switch (o = 0, r && (l = [ 2 & l[0], r.value ]), l[0]) {
           case 0:
           case 1:
            r = l;
            break;

           case 4:
            return s.label++, {
              value: l[1],
              done: !1
            };

           case 5:
            s.label++, o = l[1], l = [ 0 ];
            continue;

           case 7:
            l = s.ops.pop(), s.trys.pop();
            continue;

           default:
            if (!(r = s.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== l[0] && 2 !== l[0])) {
              s = 0;
              continue;
            }
            if (3 === l[0] && (!r || l[1] > r[0] && l[1] < r[3])) {
              s.label = l[1];
              break;
            }
            if (6 === l[0] && s.label < r[1]) {
              s.label = r[1], r = l;
              break;
            }
            if (r && s.label < r[2]) {
              s.label = r[2], s.ops.push(l);
              break;
            }
            r[2] && s.ops.pop(), s.trys.pop();
            continue;
          }
          l = e.call(t, s);
        } catch (a) {
          l = [ 6, a ], o = 0;
        } finally {
          n = r = 0;
        }
        if (5 & l[0]) throw l[1];
        return {
          value: l[0] ? l[1] : void 0,
          done: !0
        };
      }([ l, a ]);
    };
  }
};

System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n, o, r;
  return {
    setters: [ function(t) {
      e = t.r, n = t.f, o = t.h, r = t.g;
    } ],
    execute: function() {
      t("esm_import", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.someEvent = n(this, "someEvent", 7), this.propVal = 0, this.isReady = "false", 
          this.stateVal = void 0, this.listenVal = 0, this.someEventInc = 0;
        }
        return class_1.prototype.testClick = function() {
          this.listenVal++;
        }, class_1.prototype.someMethod = function() {
          return __awaiter(this, void 0, void 0, (function() {
            return __generator(this, (function(t) {
              return this.someEvent.emit(), [ 2 /*return*/ ];
            }));
          }));
        }, class_1.prototype.testMethod = function() {
          this.el.someMethod();
        }, class_1.prototype.componentWillLoad = function() {
          var t = this;
          this.stateVal = "mph", this.el.componentOnReady().then((function() {
            t.isReady = "true";
          }));
        }, class_1.prototype.componentDidLoad = function() {
          var t = this;
          this.el.parentElement.addEventListener("someEvent", (function() {
            t.el.propVal++;
          }));
        }, class_1.prototype.render = function() {
          return o("div", null, o("h1", null, "esm-import"), o("p", {
            id: "propVal"
          }, "propVal: ", this.propVal), o("p", {
            id: "stateVal"
          }, "stateVal: ", this.stateVal), o("p", {
            id: "listenVal"
          }, "listenVal: ", this.listenVal), o("p", null, o("button", {
            onClick: this.testMethod.bind(this)
          }, "Test")), o("p", {
            id: "isReady"
          }, "componentOnReady: ", this.isReady));
        }, Object.defineProperty(class_1.prototype, "el", {
          get: function() {
            return r(this);
          },
          enumerable: !1,
          configurable: !0
        }), class_1;
      }()).style = ":host{display:block;padding:20px;border:10px solid rgb(0, 0, 255);color:rgb(128, 0, 128);--color:rgb(0, 128, 0)}p{color:var(--color)}";
    }
  };
}));