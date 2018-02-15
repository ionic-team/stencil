import { Collection, CollectionData, ComponentData, ComponentMeta, Config, EntryModule, ModuleFile } from '../../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PRIORITY, PROP_TYPE } from '../../../util/constants';
import { excludeFromCollection, parseComponentDataToModuleFile,
  parseDidChangeDeprecated, parseGlobal, parseWillChangeDeprecated,
  serializeAppCollection, serializeAppGlobal } from '../collection-data';
import { mockConfig } from '../../../testing/mocks';


describe('manifest-data serialize/parse', () => {

  let collection: Collection;
  let a: ComponentMeta;
  let moduleFile: ModuleFile;
  const manifestDir = '/User/me/myapp/dist/collection/';
  const config = mockConfig();

  beforeEach(() => {
    collection = {};
    a = {};
    moduleFile = {
      jsFilePath: '/User/me/myapp/dist/collection/components/cmp-a.js',
      cmpMeta: a
    };
  });


  it('parseGlobal', () => {
    const collectionData: CollectionData = {
      global: 'global/my-global.js'
    };
    const manifest: Collection = {};
    parseGlobal(config, manifestDir, collectionData, manifest);
    expect(manifest.global.jsFilePath).toBe('/User/me/myapp/dist/collection/global/my-global.js');
  });

  it('serializeAppCollection', () => {
    config.bundles = [
      { components: ['cmp-a', 'cmp-b'] },
      { components: ['cmp-c'] }
    ];
    const entryModules: EntryModule[] = [{
      moduleFiles: [moduleFile]
    }];
    const outManifest = serializeAppCollection(config, manifestDir, entryModules, collection.global);

    expect(outManifest.components).toHaveLength(1);
    expect(outManifest.compiler.name).toEqual('test');
  });

  it('serializeAppGlobal', () => {
    const collectionData: CollectionData = {};
    const collection: Collection = {
      global: {
        jsFilePath: '/User/me/myapp/dist/collection/global/my-global.js'
      }
    };

    serializeAppGlobal(config, manifestDir, collectionData, collection.global);
    expect(collectionData.global).toBe('global/my-global.js');
  });

  it('excludeFromCollection false if tag is in bundles', () => {
    const config: Config = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: ComponentData = {
      tag: 'cmp-b'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(false);
  });

  it('excludeFromCollection true if tag not in bundles', () => {
    const config: Config = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: ComponentData = {
      tag: 'cmp-c'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });

  it('excludeFromCollection defaults true', () => {
    const config: Config = {};
    const cmpData: ComponentData = {};
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });

});
