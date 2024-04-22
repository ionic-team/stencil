import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'docs-readme-testbed',
  outputTargets: [
    {
      type: 'docs-readme',
    },
    {
      type: 'dist',
    },
    {
      type: 'docs-readme',
      dir: 'custom-readme-output',
    },
  ],
};
