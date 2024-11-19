'use strict';

function timeout(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

exports.timeout = timeout;
