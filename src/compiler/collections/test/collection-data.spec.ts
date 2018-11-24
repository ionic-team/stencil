import * as d from '../../../declarations';
import { excludeFromCollection, parseComponentDataToModuleFile,
  parseDidChangeDeprecated, parseGlobal, parseWillChangeDeprecated,
  serializeAppCollection, serializeAppGlobal, serializeStyle } from '../collection-data';
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
    expect(outManifest).toEqual({
      'components': [
        {
          'dependencies': [],
          'componentPath': 'components/cmp-a.js'
        }
      ],
      'collections': [
        {
          'name': 'ionicons',
          'tags': [
            'ion-icon'
          ]
        }
      ],
      'compiler': {
        name: config.sys.compiler.name,
        version: config.sys.compiler.version,
        typescriptVersion: config.sys.compiler.typescriptVersion
      },
      'bundles': [
        {
          'components': [
            'cmp-a',
            'cmp-b'
          ]
        },
        {
          'components': [
            'cmp-c'
          ]
        }
      ]
    });
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

  it('always expect css stylesheets', () => {

    const stylesMeta = {
      externalStyles: [
        {
          cmpRelativePath: 'component.scssOrOther'
        }
      ]
    };

    const styleData = serializeStyle(config, 'some-path', stylesMeta );
    expect(styleData).toEqual({
      stylePaths:['some-path/component.css']
    });
  })
});
