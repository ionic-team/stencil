var __awaiter = this && this.__awaiter || function(t, e, n, r) {
  return new (n || (n = Promise))((function(o, s) {
    function fulfilled(t) {
      try {
        step(r.next(t));
      } catch (e) {
        s(e);
      }
    }
    function rejected(t) {
      try {
        step(r.throw(t));
      } catch (e) {
        s(e);
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
}, __generator = this && this.__generator || function(t, e) {
  var n, r, o, s, i = {
    label: 0,
    sent: function() {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return s = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function verb(a) {
    return function(l) {
      return function(a) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;s && (s = 0, a[0] && (i = 0)), i; ) try {
          if (n = 1, r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r), 
          0) : r.next) && !(o = o.call(r, a[1])).done) return o;
          switch (r = 0, o && (a = [ 2 & a[0], o.value ]), a[0]) {
           case 0:
           case 1:
            o = a;
            break;

           case 4:
            return i.label++, {
              value: a[1],
              done: !1
            };

           case 5:
            i.label++, r = a[1], a = [ 0 ];
            continue;

           case 7:
            a = i.ops.pop(), i.trys.pop();
            continue;

           default:
            if (!(o = i.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
              i = 0;
              continue;
            }
            if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
              i.label = a[1];
              break;
            }
            if (6 === a[0] && i.label < o[1]) {
              i.label = o[1], o = a;
              break;
            }
            if (o && i.label < o[2]) {
              i.label = o[2], i.ops.push(a);
              break;
            }
            o[2] && i.ops.pop(), i.trys.pop();
            continue;
          }
          a = e.call(t, i);
        } catch (l) {
          a = [ 6, l ], r = 0;
        } finally {
          n = o = 0;
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

import { r as registerInstance, f as createEvent, h, g as getElement } from "./index-a2c0d171.js";

var esmImportCss = ":host{display:block;padding:20px;border:10px solid rgb(0, 0, 255);color:rgb(128, 0, 128);--color:rgb(0, 128, 0)}p{color:var(--color)}", EsmImport = /** @class */ function() {
  function class_1(t) {
    registerInstance(this, t), this.someEvent = createEvent(this, "someEvent", 7), this.propVal = 0, 
    this.isReady = "false", this.stateVal = void 0, this.listenVal = 0, this.someEventInc = 0;
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
    return h("div", null, h("h1", null, "esm-import"), h("p", {
      id: "propVal"
    }, "propVal: ", this.propVal), h("p", {
      id: "stateVal"
    }, "stateVal: ", this.stateVal), h("p", {
      id: "listenVal"
    }, "listenVal: ", this.listenVal), h("p", null, h("button", {
      onClick: this.testMethod.bind(this)
    }, "Test")), h("p", {
      id: "isReady"
    }, "componentOnReady: ", this.isReady));
  }, Object.defineProperty(class_1.prototype, "el", {
    get: function() {
      return getElement(this);
    },
    enumerable: !1,
    configurable: !0
  }), class_1;
}();

EsmImport.style = esmImportCss;

export { EsmImport as esm_import };