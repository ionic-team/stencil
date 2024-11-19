import { r as registerInstance, h } from "./index-a2c0d171.js";

var LifecycleUpdateB = /** @class */ function() {
  function LifecycleUpdateB(e) {
    registerInstance(this, e), this.value = 0;
  }
  return LifecycleUpdateB.prototype.componentWillLoad = function() {
    this.start = Date.now();
    var e = document.createElement("li");
    return e.innerHTML = '<span style="color:red">lifecycle-update-b</span> <span style="color:blue">componentWillLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e), new Promise((function(e) {
      setTimeout(e, 20);
    }));
  }, LifecycleUpdateB.prototype.componentDidLoad = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:red">lifecycle-update-b</span> <span style="color:green">componentDidLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateB.prototype.render = function() {
    return h("section", null, "lifecycle-update-b: ", this.value, h("lifecycle-update-c", {
      value: this.value
    }));
  }, LifecycleUpdateB;
}();

export { LifecycleUpdateB as lifecycle_update_b };