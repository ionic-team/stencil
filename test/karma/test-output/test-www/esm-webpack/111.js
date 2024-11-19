(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[111],{

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slot_list_light_root", function() { return SlotListLightRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
var __spreadArray = undefined && undefined.__spreadArray || function(t, i, o) {
  if (o || 2 === arguments.length) for (var e, r = 0, s = i.length; r < s; r++) !e && r in i || (e || (e = Array.prototype.slice.call(i, 0, r)), 
  e[r] = i[r]);
  return t.concat(e || Array.prototype.slice.call(i));
};



var SlotListLightRoot = /** @class */ function() {
  function SlotListLightRoot(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.items = [];
  }
  return SlotListLightRoot.prototype.needMore = function() {
    var t = [ "Item ".concat(this.items.length + 1), "Item ".concat(this.items.length + 2), "Item ".concat(this.items.length + 3), "Item ".concat(this.items.length + 4) ];
    this.items = __spreadArray(__spreadArray([], this.items, !0), t, !0);
  }, SlotListLightRoot.prototype.render = function() {
    var t = this;
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: function() {
        return t.needMore();
      }
    }, "More"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot-dynamic-shadow-list", {
      items: this.items
    }));
  }, SlotListLightRoot;
}();



/***/ })

}]);