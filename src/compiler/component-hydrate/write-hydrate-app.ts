import * as d from '@declarations';
import { isOutputTargetDist } from '../output-targets/output-utils';
import { sys } from '@sys';
import { writeAngularServerModule } from './write-angular-server-module';


export function writeHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTarget[], code: string) {
  // no matter what, we need to write this file to disk
  // so it can be used later for prerendering
  // find at least one good place to save to disk
  const hydrateAppFilePath = getHydrateAppFilePath(config, outputTargets);
  const hydrateAppDtsFilePath = sys.path.join(sys.path.dirname(hydrateAppFilePath), SERVER_DTS);

  return Promise.all([
    compilerCtx.fs.writeFile(hydrateAppFilePath, code),
    compilerCtx.fs.writeFile(hydrateAppDtsFilePath, DTS),
    writeHydrateAppDist(compilerCtx, outputTargets, code),
    writeAngularServerModule(config, compilerCtx, outputTargets, hydrateAppFilePath)
  ]);
}


function writeHydrateAppDist(compilerCtx: d.CompilerCtx, outputTargets: d.OutputTarget[], code: string) {
  const distOutputTargets = outputTargets.filter(isOutputTargetDist);

  return Promise.all(distOutputTargets.map(outputTarget => {
    const indexPath = sys.path.join(outputTarget.buildDir, SERVER_DIR, SERVER_INDEX);
    const indexDtsPath = sys.path.join(outputTarget.buildDir, SERVER_DIR, SERVER_DTS);

    return Promise.all([
      compilerCtx.fs.writeFile(indexPath, code),
      compilerCtx.fs.writeFile(indexDtsPath, DTS),
    ]);
  }));
}


function getHydrateAppFilePath(config: d.Config, outputTargets: d.OutputTarget[]) {
  // first try a dist build
  const distOutputTarget = outputTargets.find(isOutputTargetDist);
  if (distOutputTarget != null) {
    return sys.path.join(distOutputTarget.buildDir, SERVER_DIR, SERVER_INDEX);
  }

  // default to a dist dir
  // more than likey this one is from a www prerender, but without a dist build
  return sys.path.join(config.rootDir, 'dist', SERVER_DIR, SERVER_INDEX);
}


const SERVER_DIR = `server`;
const SERVER_INDEX = `index.js`;
const SERVER_DTS = `index.d.ts`;

const DTS = `
export declare function renderToStringSync(html: string, opts?: any): any;
export declare function hydrateDocumentSync(doc: any, opts?: any): any;
`;
