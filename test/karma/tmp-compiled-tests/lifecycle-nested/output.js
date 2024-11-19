"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(msg, id) {
    if (id === void 0) { id = 'lifecycle-loads'; }
    var listEntry = document.createElement('li');
    listEntry.innerText = msg;
    document.getElementById(id).appendChild(listEntry);
}
exports.default = default_1;
