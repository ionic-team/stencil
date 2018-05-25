
exports.config = {
  namespace: 'TestPrerender',
  srcDir: 'test-prerender',
  globalStyle: 'test-prerender/global/app.css',
  tsconfig: 'tsconfig-stencil.json',
  outputTargets: [
    {
      type: 'www',
      dir: 'www/prerender',
      baseUrl: '/prerender',
      serviceWorker: false
    }
  ],
  excludeSrc: []
};
