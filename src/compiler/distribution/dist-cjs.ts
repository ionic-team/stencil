import * as d from '@declarations';
import { sys } from '@sys';


export async function generateCommonJsIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const cjs: string[] = [
    `// ${config.namespace}: CommonJS Main`
  ];

  const distIndexCjsPath = sys.path.join(outputTarget.buildDir, 'index.js');

  await compilerCtx.fs.writeFile(distIndexCjsPath, cjs.join('\n'));
}
