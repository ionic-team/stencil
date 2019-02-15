import * as d from '@declarations';
import { sys } from '@sys';
import { isOutputTargetDist } from '../output-targets/output-utils';


export function updateStencilTypesImports(typesDir: string, dtsFilePath: string, dtsContent: string) {
  const dir = sys.path.dirname(dtsFilePath);
  const relPath = sys.path.relative(dir, typesDir);

  let coreDtsPath = sys.path.join(relPath, CORE_FILENAME);
  if (!coreDtsPath.startsWith('.')) {
    coreDtsPath = `./${coreDtsPath}`;
  }

  if (dtsContent.includes('JSX')) {
    dtsContent = `import '${coreDtsPath}';\n${dtsContent}`;
  }

  if (dtsContent.includes('@stencil/core')) {
    dtsContent = dtsContent.replace(/\@stencil\/core/g, coreDtsPath);
  }

  return dtsContent;
}


export async function copyStencilCoreDts(config: d.Config, compilerCtx: d.CompilerCtx) {
  const typesOutputTargets = config.outputTargets
    .filter(isOutputTargetDist)
    .filter(o => o.typesDir);

  const srcStencilCoreDts = await sys.getClientCoreFile({
    staticName: 'declarations/stencil.core.d.ts'
   });

  return Promise.all(typesOutputTargets.map(outputTarget => {
    const coreDtsFilePath = sys.path.join(outputTarget.typesDir, CORE_DTS);
    return compilerCtx.fs.writeFile(coreDtsFilePath, srcStencilCoreDts);
  }));
}


const CORE_FILENAME = `stencil.core`;
const CORE_DTS = `${CORE_FILENAME}.d.ts`;
