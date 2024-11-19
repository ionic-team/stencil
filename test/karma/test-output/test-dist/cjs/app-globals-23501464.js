'use strict';

const index = require('./index-b8958464.js');

const globalScript = () => {
  index.setMode((elm) => {
    return elm.colormode || elm.getAttribute('colormode') || window.KarmaMode;
  });
};

const globalScripts = () => {
  globalScript();
};

exports.globalScripts = globalScripts;
