
exports.config = {
  tsconfig: 'tsconfig-stencil.json',
  outputTargets: [
    {
      type: 'www',
      empty: false
    }
  ],
  copy: [
    { src: '**/*.html' }
  ],
  excludeSrc: []
};
