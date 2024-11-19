import { r as registerInstance, h } from "./index-a2c0d171.js";

var LifecycleUpdateA = /** @class */ function() {
  function LifecycleUpdateA(e) {
    registerInstance(this, e), this.values = [];
  }
  return LifecycleUpdateA.prototype.testClick = function() {
    this.values.push(this.values.length + 1), this.values = this.values.slice();
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:gray">async add child components to lifecycle-update-a</span> '.concat(this.values[this.values.length - 1]), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.componentWillLoad = function() {
    var e = document.createElement("li");
    return e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:blue">componentWillLoad</span>', 
    document.getElementById("output").appendChild(e), new Promise((function(e) {
      setTimeout(e, 10);
    }));
  }, LifecycleUpdateA.prototype.componentDidLoad = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:green">componentDidLoad</span>', 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.componentWillUpdate = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:cyan">componentWillUpdate</span> '.concat(this.values[this.values.length - 1]), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.componentDidUpdate = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:limegreen">componentDidUpdate</span> '.concat(this.values[this.values.length - 1]), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.render = function() {
    return h("div", null, h("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Add Child Components"), h("hr", null), this.values.map((function(e) {
      return h("lifecycle-update-b", {
        value: e
      });
    })));
  }, LifecycleUpdateA;
}();

export { LifecycleUpdateA as lifecycle_update_a };