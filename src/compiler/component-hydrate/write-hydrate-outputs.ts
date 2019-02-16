import * as d from '@declarations';
import { isOutputTargetDist } from '../output-targets/output-utils';
import { sys } from '@sys';
import { writeAngularOutputs } from './write-hydrate-angular-module';
import { writeDistOutputs } from './write-hydrate-dist';


export async function writeHydrateOutputs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTarget[], code: string) {
  // no matter what, we need to write this file to disk
  // so it can be used later for prerendering
  // find at least one good place to save to disk
  const hydrateAppFilePath = getHydrateAppFilePath(config, outputTargets);
  const hydrateAppDtsFilePath = sys.path.join(sys.path.dirname(hydrateAppFilePath), HYDRATE_DTS);

  await Promise.all([
    compilerCtx.fs.writeFile(hydrateAppFilePath, code),
    compilerCtx.fs.writeFile(hydrateAppDtsFilePath, DTS),
    writeDistOutputs(config, compilerCtx, outputTargets, hydrateAppFilePath)
  ]);

  await writeAngularOutputs(config, compilerCtx, outputTargets, hydrateAppFilePath);

  buildCtx.hydrateAppFilePath = hydrateAppFilePath;
}


function getHydrateAppFilePath(config: d.Config, outputTargets: d.OutputTarget[]) {
  // first try a dist build
  const distOutputTarget = outputTargets.find(isOutputTargetDist);
  if (distOutputTarget != null) {
    return sys.path.join(distOutputTarget.buildDir, SERVER_DIR, SERVER_HYDRATE);
  }

  // default to a dist dir
  // more than likey this one is from a www prerender, but without a dist build
  return sys.path.join(config.rootDir, 'dist', SERVER_DIR, SERVER_HYDRATE);
}


const SERVER_DIR = `server`;
const SERVER_HYDRATE = `hydrate.js`;
const HYDRATE_DTS = `hydrate.d.ts`;

const DTS = `
export declare function renderToStringSync(html: string, opts?: any): any;
export declare function hydrateDocumentSync(doc: any, opts?: any): any;
`;
