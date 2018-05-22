
exports.config = {
  namespace: 'TestSibling',
  srcDir: 'test-sibling',
  tsconfig: 'tsconfig-stencil.json',
  outputTargets: [
    {
      type: 'www',
      empty: false
    }
  ],
  excludeSrc: []
};
