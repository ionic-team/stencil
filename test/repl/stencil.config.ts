import { Config } from '../../internal';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
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
          src: '../../../package.json',
          dest: './@stencil/core/package.json',
          warn: true
        },
        {
          src: '../../../node_modules/typescript',
          dest: './@stencil/core/typescript',
          warn: true,
        },
      ]
    }
  ]
};
