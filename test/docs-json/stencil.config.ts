import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'json-docs-testbed',
  outputTargets: [
    {
      type: 'docs-json',
      file: 'docs.json',
      supplementalPublicTypes: 'src/components/interfaces.ts',
    },
  ],
};
