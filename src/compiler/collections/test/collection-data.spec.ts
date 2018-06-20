import * as d from '../../../declarations';
import { excludeFromCollection, parseComponentDataToModuleFile,
  parseDidChangeDeprecated, parseGlobal, parseWillChangeDeprecated,
  serializeAppCollection, serializeAppGlobal } from '../collection-data';
import { mockConfig } from '../../../testing/mocks';
import { normalizePath } from '../../util';
import * as path from 'path';


describe('manifest-data serialize/parse', () => {

  let collection: d.Collection;
  let a: d.ComponentMeta;
  let moduleFile: d.ModuleFile;
  const ROOT = normalizePath(path.resolve('/'));
  const manifestDir = normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'dist', 'collection'));
  const config = mockConfig();

  beforeEach(() => {
    collection = {};
    config.srcDir = normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'src'));
    a = {};
    moduleFile = {
      sourceFilePath: normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'src', 'components', 'cmp-a.js')),
      jsFilePath: normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'src', 'components', 'cmp-a.js')),
      cmpMeta: a
    };
  });


  it('parseGlobal', () => {
    const collectionData: d.CollectionData = {
      global: 'global/my-global.js'
    };
    const manifest: d.Collection = {};
    parseGlobal(config, manifestDir, collectionData, manifest);
    expect(manifest.global.jsFilePath).toBe(normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'dist', 'collection', 'global', 'my-global.js')));
  });

  it('serializeAppCollection', () => {
    config.bundles = [
      { components: ['cmp-a', 'cmp-b'] },
      { components: ['cmp-c'] }
    ];
    const entryModules: d.EntryModule[] = [{
      moduleFiles: [moduleFile]
    }];
    const compilerCtx: d.CompilerCtx = {
      collections: [
        {
          collectionName: 'ionicons',
          moduleFiles: [
            {
              sourceFilePath: normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'src', 'components', 'cmp-a.js')),
              cmpMeta: {
                tagNameMeta: 'ion-icon'
              }
            }
          ]
        }
      ]
    };
    const outManifest = serializeAppCollection(config, compilerCtx, manifestDir, entryModules, collection.global);

    expect(outManifest.components).toHaveLength(1);
    expect(outManifest.collections).toHaveLength(1);
    expect(outManifest.collections[0].name).toBe('ionicons');
    expect(outManifest.collections[0].tags).toHaveLength(1);
    expect(outManifest.collections[0].tags[0]).toBe('ion-icon');
    expect(outManifest.compiler.name).toEqual('test');
  });

  it('serializeAppGlobal', () => {
    const collectionData: d.CollectionData = {};
    const collection: d.Collection = {
      global: {
        sourceFilePath: normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'src', 'global', 'my-global.js')),
        jsFilePath: normalizePath(path.join(ROOT, 'User', 'me', 'myapp', 'src', 'global', 'my-global.js'))
      }
    };

    serializeAppGlobal(config, manifestDir, collectionData, collection.global);
    expect(collectionData.global).toBe('global/my-global.js');
  });

  it('excludeFromCollection false if tag is in bundles', () => {
    const config: d.Config = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: d.ComponentData = {
      tag: 'cmp-b'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(false);
  });

  it('excludeFromCollection true if tag not in bundles', () => {
    const config: d.Config = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: d.ComponentData = {
      tag: 'cmp-c'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });

  it('excludeFromCollection defaults true', () => {
    const config: d.Config = {};
    const cmpData: d.ComponentData = {};
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });

});
