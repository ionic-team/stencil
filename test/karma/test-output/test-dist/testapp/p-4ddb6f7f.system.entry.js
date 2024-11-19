System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, n;
  return {
    setters: [ function(e) {
      t = e.r, n = e.h;
    } ],
    execute: function() {
      e("lifecycle_update_a", /** @class */ function() {
        function class_1(e) {
          t(this, e), this.values = [];
        }
        return class_1.prototype.testClick = function() {
          this.values.push(this.values.length + 1), this.values = this.values.slice();
          var e = document.createElement("li");
          e.innerHTML = '<span style="color:gray">async add child components to lifecycle-update-a</span> '.concat(this.values[this.values.length - 1]), 
          document.getElementById("output").appendChild(e);
        }, class_1.prototype.componentWillLoad = function() {
          var e = document.createElement("li");
          return e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:blue">componentWillLoad</span>', 
          document.getElementById("output").appendChild(e), new Promise((function(e) {
            setTimeout(e, 10);
          }));
        }, class_1.prototype.componentDidLoad = function() {
          var e = document.createElement("li");
          e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:green">componentDidLoad</span>', 
          document.getElementById("output").appendChild(e);
        }, class_1.prototype.componentWillUpdate = function() {
          var e = document.createElement("li");
          e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:cyan">componentWillUpdate</span> '.concat(this.values[this.values.length - 1]), 
          document.getElementById("output").appendChild(e);
        }, class_1.prototype.componentDidUpdate = function() {
          var e = document.createElement("li");
          e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:limegreen">componentDidUpdate</span> '.concat(this.values[this.values.length - 1]), 
          document.getElementById("output").appendChild(e);
        }, class_1.prototype.render = function() {
          return n("div", null, n("button", {
            onClick: this.testClick.bind(this),
            class: "test"
          }, "Add Child Components"), n("hr", null), this.values.map((function(e) {
            return n("lifecycle-update-b", {
              value: e
            });
          })));
        }, class_1;
      }());
    }
  };
}));