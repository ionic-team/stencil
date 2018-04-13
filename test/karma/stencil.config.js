
exports.config = {
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
