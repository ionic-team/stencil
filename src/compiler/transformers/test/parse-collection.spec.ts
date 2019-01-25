import * as d from '@declarations';
import { mockCompilerCtx, mockConfig, mockStencilSystem } from '@testing';
import { transpileModule } from './transpile';


describe('parse collection', () => {
  let config: d.Config;
  let compilerCtx: d.CompilerCtx;
  let sys: d.StencilSystem;

  beforeEach(async () => {
    config = mockConfig();
    compilerCtx = mockCompilerCtx();
    sys = mockStencilSystem();
    sys.resolveModule = (_from, moduleId) => {
      if (moduleId === 'ionicons') {
        return '/node_modules/@ionic/core/node_modules/ionicons/package.json';
      }
      return '/node_modules/@ionic/core/package.json';
    };

    await compilerCtx.fs.writeFiles({
      '/node_modules/@ionic/core/package.json': `
      {
        "name": "@ionic/core",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/types.d.ts"
      }`,

      '/node_modules/@ionic/core/dist/collection/collection-manifest.json': `
      {
        "entries": [
          "components/action-sheet/action-sheet.js"
        ],
        "collections": [
          {
            "name": "ionicons",
            "tags": [
              "ion-icon"
            ]
          }
        ],
        "compiler": {
          "name": "@stencil/core",
          "typescriptVersion": "8.8.8",
          "version": "9.9.9"
        }
      }
      `,

      '/node_modules/@ionic/core/dist/collection/components/action-sheet/action-sheet.js': `
      export class ActionSheet {
        static get is() { return "ion-action-sheet"; }
        static get encapsulation() { return "shadow"; }
      }
      `,

      '/node_modules/@ionic/core/node_modules/ionicons/package.json': `
      {
        "name": "ionicons",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/types.d.ts"
      }`,

      '/node_modules/@ionic/core/node_modules/ionicons/dist/collection/collection-manifest.json': `
      {
        "components": [
          {
            "tag": "ion-icon",
            "dependencies": [],
            "componentClass": "Icon",
            "componentPath": "icon/icon.js",
            "scoped": true
          }
        ],
        "compiler": {
          "name": "@stencil/core",
          "typescriptVersion": "8.8.8",
          "version": "9.9.9"
        }
      }
      `,

      '/node_modules/@ionic/core/ionicons/dist/dist/collection/components/icon/icon.js': `
      export class Icon {}`
    });
  });

  it('remove collection', () => {
    const t = transpileModule(`
      import '@ionic/core';
      @Component({tag: 'cmp-a'})
      export class CmpA {}
    `, config, compilerCtx, sys);

    expect(t.outputText).not.toContain(`@ionic/core`);

    expect(t.buildCtx.collections).toHaveLength(2);

    const ionicCollection = compilerCtx.collections[0];
    const ioniconsCollection = compilerCtx.collections[1];

    expect(ionicCollection.collectionName).toBe(`@ionic/core`);
    expect(ionicCollection.moduleDir).toBe(`/node_modules/@ionic/core`);
    expect(ionicCollection.compiler.name).toBe(`@stencil/core`);
    expect(ionicCollection.compiler.version).toBe(`9.9.9`);
    expect(ionicCollection.compiler.typescriptVersion).toBe(`8.8.8`);

    expect(ionicCollection.moduleFiles[0].cmps[0].tagName).toBe(`ion-action-sheet`);
    expect(ionicCollection.moduleFiles[0].cmps[0].encapsulation).toBe(`shadow`);
    expect(ionicCollection.moduleFiles[0].collectionName).toBe(`@ionic/core`);
    expect(ionicCollection.moduleFiles[0].isCollectionDependency).toBe(true);

    expect(ioniconsCollection.moduleFiles[0].cmps[0].tagName).toBe(`ion-icon`);
    expect(ioniconsCollection.moduleFiles[0].cmps[0].encapsulation).toBe(`scoped`);
    expect(ioniconsCollection.moduleFiles[0].collectionName).toBe(`ionicons`);
    expect(ioniconsCollection.moduleFiles[0].isCollectionDependency).toBe(true);

    expect(t.buildCtx.collections[0].collectionName).toBe(`@ionic/core`);
    expect(t.buildCtx.collections[1].collectionName).toBe(`ionicons`);
  });

});
