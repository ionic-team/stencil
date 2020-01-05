
exports.config = {
  namespace: 'TestPrerender',
  srcDir: 'test-prerender',
  globalStyle: 'test-prerender/global/app.css',
  tsconfig: 'tsconfig-stencil.json',
  outputTargets: [
    {
      type: 'www',
      baseUrl: 'https://karma.stenciljs.com/prerender',
      serviceWorker: null,
      empty: false,
      prerenderConfig: './test-prerender/prerender.config.js'
    }
  ],
  excludeSrc: []
};
