import { r as registerInstance, h } from "./index-a2c0d171.js";

var LifecycleUpdateC = /** @class */ function() {
  function LifecycleUpdateC(e) {
    registerInstance(this, e), this.value = 0;
  }
  return LifecycleUpdateC.prototype.componentWillLoad = function() {
    this.start = Date.now();
    var e = document.createElement("li");
    return e.innerHTML = '<span style="color:orange">lifecycle-update-c</span> <span style="color:blue">componentWillLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e), new Promise((function(e) {
      setTimeout(e, 30);
    }));
  }, LifecycleUpdateC.prototype.componentDidLoad = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:orange">lifecycle-update-c</span> <span style="color:green">componentDidLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateC.prototype.render = function() {
    return h("span", null, " - lifecycle-update-c: ", this.value);
  }, LifecycleUpdateC;
}();

export { LifecycleUpdateC as lifecycle_update_c };