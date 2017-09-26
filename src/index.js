'use strict';

Object.defineProperties(module.exports, {

  build: {
    get: function() {
      var compiler = require('./compiler/index');
      return compiler.build;
    }
  },

  createRenderer: {
    get: function() {
      var server = require('./server/index');
      return server.createRenderer;
    }
  }

});