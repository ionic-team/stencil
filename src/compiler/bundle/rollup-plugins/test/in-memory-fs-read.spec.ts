import * as d from '../../../../declarations';
import inMemoryFsRead from '../in-memory-fs-read';
import { mockCompilerCtx, mockConfig, mockPath, mockStencilSystem } from '../../../../testing/mocks';


describe('inMemoryFsRead', () => {

  const config = mockConfig();
  const path = config.sys.path;
  let compierCtx: d.CompilerCtx;
  let plugin = inMemoryFsRead(config,  compierCtx);

  beforeEach(() => {
    compierCtx = mockCompilerCtx();
  });


  it('absolute, append index.js', async () => {
    compierCtx.moduleFiles = {
      '/src/file.ts': {
        sourceFilePath: '/src/file.ts',
        jsFilePath: '/dist/file/index.js'
      }
    };
    plugin = inMemoryFsRead(config,  compierCtx);
    const importee = '/dist/file';
    const importer = null;
    const id = await plugin.resolveId(importee, importer);
    expect(id).toBe('/dist/file/index.js');
  });

  it('absolute, append .js', async () => {
    compierCtx.moduleFiles = {
      '/src/file.ts': {
        sourceFilePath: '/src/file.ts',
        jsFilePath: '/dist/file.js'
      }
    };
    plugin = inMemoryFsRead(config,  compierCtx);
    const importee = '/dist/file';
    const importer = null;
    const id = await plugin.resolveId(importee, importer);
    expect(id).toBe('/dist/file.js');
  });

  it('absolute, exact match', async () => {
    compierCtx.moduleFiles = {
      '/src/file.ts': {
        sourceFilePath: '/src/file.ts',
        jsFilePath: '/dist/file.js'
      }
    };
    plugin = inMemoryFsRead(config,  compierCtx);
    const importee = '/dist/file.js';
    const importer = null;
    const id = await plugin.resolveId(importee, importer);
    expect(id).toBe('/dist/file.js');
  });

  it('absolute, ts importee, null importer', async () => {
    compierCtx.moduleFiles = {
      '/src/file.ts': {
        sourceFilePath: '/src/file.ts',
        jsFilePath: '/dist/file.js'
      }
    };
    plugin = inMemoryFsRead(config,  compierCtx);
    const importee = '/src/file.ts';
    const importer = null;
    const id = await plugin.resolveId(importee, importer);
    expect(id).toBe('/dist/file.js');
  });

  it('absolute, ts importee, null importer', async () => {
    compierCtx.moduleFiles = {
      '/src/file.ts': {
        sourceFilePath: '/src/file.ts',
        jsFilePath: '/dist/file.js'
      }
    };
    plugin = inMemoryFsRead(config,  compierCtx);
    const importee = '/src/file.ts';
    const importer = null;
    const id = await plugin.resolveId(importee, importer);
    expect(id).toBe('/dist/file.js');
  });

  it('relative, null importer', async () => {
    const path = mockPath();
    const orgPathResolve = path.resolve;
    path.resolve = function() {
      if (!arguments.length) {
        return '/src';
      }
      return orgPathResolve.apply(path, arguments);
    };

    compierCtx.moduleFiles = {
      '/src/file.ts': {
        sourceFilePath: '/src/file.ts',
        jsFilePath: '/dist/file.js'
      }
    };

    plugin = inMemoryFsRead(config,  compierCtx);

    const importee = './file';
    const importer = null;
    const id = await plugin.resolveId(importee, importer);
    expect(id).toBe(null);
  });

});
