(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[112],{

/***/ 113:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slot_list_light_scoped_root", function() { return SlotListLightScopedRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
var __spreadArray = undefined && undefined.__spreadArray || function(t, e, o) {
  if (o || 2 === arguments.length) for (var i, r = 0, s = e.length; r < s; r++) !i && r in e || (i || (i = Array.prototype.slice.call(e, 0, r)), 
  i[r] = e[r]);
  return t.concat(i || Array.prototype.slice.call(e));
};



var SlotListLightScopedRoot = /** @class */ function() {
  function SlotListLightScopedRoot(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.items = [];
  }
  return SlotListLightScopedRoot.prototype.needMore = function() {
    var t = [ "Item ".concat(this.items.length + 1), "Item ".concat(this.items.length + 2), "Item ".concat(this.items.length + 3), "Item ".concat(this.items.length + 4) ];
    this.items = __spreadArray(__spreadArray([], this.items, !0), t, !0);
  }, SlotListLightScopedRoot.prototype.render = function() {
    var t = this;
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: function() {
        return t.needMore();
      }
    }, "More"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot-dynamic-scoped-list", {
      items: this.items
    }));
  }, SlotListLightScopedRoot;
}();



/***/ })

}]);