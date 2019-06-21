
module.exports = {
  sep: '/'
};

try {
  module.exports = require('path');
} catch (e) {}
