'use strict';

Object.defineProperties(module.exports, {

  register: {
    get: function() {
      var util = require('./dist/testing/index');
      return util.register;
    }
  },

  render: {
    get: function() {
      var util = require('./dist/testing/index');
      return util.render;
    }
  },

  transpile: {
    get: function() {
      var util = require('./dist/testing/index');
      return util.transpile;
    }
  }

});
