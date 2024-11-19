'use strict';

var state$1 = 0;
function hello() {
  return _word();
}
function world() {
  return `world`;
}
function _word() {
  state$1++;
  return 'hello' + state$1;
}

var state = 0;
async function getResult() {
  const concat = (await Promise.resolve().then(function () { return require('./module3-185f95c7.js'); })).concat;
  state++;
  return concat(hello(), world()) + state;
}

exports.getResult = getResult;
