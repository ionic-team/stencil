import * as d from '@declarations';
import { dashToPascalCase, normalizePath } from '@utils';
import { isOutputTargetAngular } from '../output-targets/output-utils';
import { sys } from '@sys';


export function writeAngularServerModule(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTarget[], hydrateAppFilePath: string) {
  const angularOutputTargets = outputTargets
    .filter(isOutputTargetAngular)
    .filter(o => o.serverModuleFile);

  return Promise.all(angularOutputTargets.map(outputTarget => {
    const ngCode = generateAngularServerModule(config, outputTarget.serverModuleFile, hydrateAppFilePath);
    return compilerCtx.fs.writeFile(outputTarget.serverModuleFile, ngCode);
  }));
}


function generateAngularServerModule(config: d.Config, serverModuleFilePath: string, hydrateAppFilePath: string) {
  const namespace = dashToPascalCase(config.namespace);
  const moduleName = `${namespace}ServerModule`;
  const factoryName = `hydrate${namespace}Components`;

  const serverModuleFileDir = sys.path.dirname(serverModuleFilePath);
  const hydrateAppFileDir = sys.path.dirname(hydrateAppFilePath);

  let hydrateDocumentSyncImportPath = normalizePath(sys.path.relative(serverModuleFileDir, hydrateAppFileDir));
  if (!hydrateDocumentSyncImportPath.startsWith('/') && !hydrateDocumentSyncImportPath.startsWith('.')) {
    hydrateDocumentSyncImportPath = './' + hydrateDocumentSyncImportPath;
  }

  return `
import { NgModule } from '@angular/core';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { DOCUMENT } from '@angular/platform-browser';
import { hydrateDocumentSync } from '${hydrateDocumentSyncImportPath}';

@NgModule({
  providers: [
    {
      provide: BEFORE_APP_SERIALIZED,
      useFactory: ${factoryName},
      multi: true,
      deps: [DOCUMENT]
    }
  ]
})
export class ${moduleName} {}

export function ${factoryName}(doc: any) {
  return () => {
    hydrateDocumentSync(doc, {
      collectAnchors: false,
      collectComponents: false,
      collectImgUrls: false,
      collectScriptUrls: false,
      collectStylesheetUrls: false
    });
  };
}
`;
}
