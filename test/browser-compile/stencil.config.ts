import { Config } from '../../internal';

export const config: Config = {
  namespace: 'BrowserCompile',

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        {
          src: '../../../compiler/',
          dest: './@stencil/core/compiler/',
          warn: true,
        },
        {
          src: '../../../internal/',
          dest: './@stencil/core/internal/',
          warn: true,
        },
        {
          src: 'preview.html',
          warn: true,
        },
      ],
    },
  ],
  enableCache: false,
};
