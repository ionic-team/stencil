import { Config } from '../../internal';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://myapp.local/',
      copy: [
        {
          src: '../../../compiler/',
          dest: './@stencil/core/compiler/',
          warn: true
        },
        {
          src: '../../../internal/',
          dest: './@stencil/core/internal/',
          warn: true
        },
        {
          src: '../../../dist/index.d.ts',
          dest: './@stencil/core/dist/index.d.ts',
          warn: true
        },
        {
          src: '../../../dist/index.js',
          dest: './@stencil/core/dist/index.js',
          warn: true
        },
        {
          src: '../../../package.json',
          dest: './@stencil/core/package.json',
          warn: true
        },
      ]
    }
  ],
  enableCache: false
};
