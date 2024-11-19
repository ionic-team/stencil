'use strict';

function output (msg, id = 'lifecycle-loads') {
  const listEntry = document.createElement('li');
  listEntry.innerText = msg;
  document.getElementById(id).appendChild(listEntry);
}

exports.output = output;
