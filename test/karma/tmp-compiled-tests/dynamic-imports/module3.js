"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = void 0;
var state = 0;
function concat(a, b) {
    state++;
    return "".concat(state, " ").concat(a, " ").concat(b);
}
exports.concat = concat;
