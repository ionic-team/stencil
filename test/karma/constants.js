const path = require('path');

global.TEST_ROOT_OUT_DIR = 'test-output';

module.exports = {
  TEST_OUTPUT_DIR: TEST_ROOT_OUT_DIR,
  CUSTOM_ELEMENTS_OUT_DIR: path.join(TEST_ROOT_OUT_DIR, 'test-custom-elements'),
  DIST_OUT_DIR: path.join(TEST_ROOT_OUT_DIR, 'test-dist'),
  WWW_OUT_DIR: path.join(TEST_ROOT_OUT_DIR, 'test-www'),
};
