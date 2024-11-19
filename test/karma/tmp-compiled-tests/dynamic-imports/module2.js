"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.world = exports.hello = void 0;
var state = 0;
function hello() {
    return _word();
}
exports.hello = hello;
function world() {
    return "world";
}
exports.world = world;
function _word() {
    state++;
    return 'hello' + state;
}
