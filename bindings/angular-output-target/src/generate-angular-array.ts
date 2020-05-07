import { OutputTargetAngular } from './types';
import { dashToPascalCase, relativeImport } from './utils';

import { CompilerCtx, ComponentCompilerMeta } from '@stencil/core/internal';

export default function generateAngularArray(compilerCtx: CompilerCtx, components: ComponentCompilerMeta[], outputTarget: OutputTargetAngular): Promise<any> {
  if (!outputTarget.directivesArrayFile) {
    return Promise.resolve();
  }

  const proxyPath = relativeImport(outputTarget.directivesArrayFile, outputTarget.directivesProxyFile, '.ts');
  const directives = components
    .map(cmpMeta => dashToPascalCase(cmpMeta.tagName))
    .map(className => `d.${className}`)
    .join(',\n  ');

  const c = `
import * as d from '${proxyPath}';

export const DIRECTIVES = [
${directives}
];
`;
  return compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, c);
}

export const GENERATED_DTS = 'components.d.ts';
