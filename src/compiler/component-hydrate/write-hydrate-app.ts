import * as d from '@declarations';
import { sys } from '@sys';


export async function writeHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTarget[], code: string) {
  const distDir = getRendererDistDir(config, outputTargets);
  const rendererDistFilePath = sys.path.join(distDir, SERVER_DIR, SERVER_INDEX);

  await compilerCtx.fs.writeFile(rendererDistFilePath, code);

  const distOutputTargets = (outputTargets as d.OutputTargetDist[]).filter(o => {
    return (o.type === 'dist');
  });

  return Promise.all(distOutputTargets.map(distOutputTarget => {
    const filePath = sys.path.join(distOutputTarget.buildDir, SERVER_DIR, SERVER_INDEX);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}


function getRendererDistDir(config: d.Config, outputTargets: d.OutputTarget[]) {
  const distOutputTarget = (outputTargets as d.OutputTargetDist[]).find(o => {
    return (o.type === 'dist');
  });

  if (distOutputTarget != null) {
    return distOutputTarget.buildDir;
  }

  return sys.path.join(config.rootDir, 'dist');
}


const SERVER_DIR = `server`;
const SERVER_INDEX = `index.js`;
