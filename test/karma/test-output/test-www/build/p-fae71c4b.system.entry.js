System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, o, i;
  return {
    setters: [ function(t) {
      n = t.r, o = t.h, i = t.e;
    } ],
    execute: function() {
      t("dom_reattach", /** @class */ function() {
        function class_1(t) {
          n(this, t), this.willLoad = 0, this.didLoad = 0, this.didUnload = 0;
        }
        return class_1.prototype.componentWillLoad = function() {
          this.willLoad++;
        }, class_1.prototype.componentDidLoad = function() {
          this.didLoad++;
        }, class_1.prototype.disconnectedCallback = function() {
          this.didUnload++;
        }, class_1.prototype.render = function() {
          return o(i, null, o("p", null, "componentWillLoad: ", this.willLoad), o("p", null, "componentDidLoad: ", this.didLoad), o("p", null, "disconnectedCallback: ", this.didUnload));
        }, class_1;
      }());
    }
  };
}));