System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, n;
  return {
    setters: [ function(e) {
      t = e.r, n = e.h;
    } ],
    execute: function() {
      e("lifecycle_update_b", /** @class */ function() {
        function class_1(e) {
          t(this, e), this.value = 0;
        }
        return class_1.prototype.componentWillLoad = function() {
          this.start = Date.now();
          var e = document.createElement("li");
          return e.innerHTML = '<span style="color:red">lifecycle-update-b</span> <span style="color:blue">componentWillLoad</span> '.concat(this.value), 
          document.getElementById("output").appendChild(e), new Promise((function(e) {
            setTimeout(e, 20);
          }));
        }, class_1.prototype.componentDidLoad = function() {
          var e = document.createElement("li");
          e.innerHTML = '<span style="color:red">lifecycle-update-b</span> <span style="color:green">componentDidLoad</span> '.concat(this.value), 
          document.getElementById("output").appendChild(e);
        }, class_1.prototype.render = function() {
          return n("section", null, "lifecycle-update-b: ", this.value, n("lifecycle-update-c", {
            value: this.value
          }));
        }, class_1;
      }());
    }
  };
}));