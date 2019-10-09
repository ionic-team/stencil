const { createBuild } = require('./scripts/build/build.js');
const { getOptions } = require('./scripts/build/utils/options.js');

module.exports = function(args) {
  const opts = getOptions(__dirname, {
    isProd: !!args['config-prod'],
    isCI: !!args['config-ci'],
  });
  return createBuild(opts);
};
