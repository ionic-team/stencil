import { updateImportPaths } from '../inline-esm-import';

describe('updateImportPaths', () => {
  const newAbsDir = '/build/';

  it(`import{p as e,b as o}from"./p-f6a9428b.js"`, () => {
    const input = `import{p as e,b as o}from"./p-f6a9428b.js"`;
    const o = updateImportPaths(input, newAbsDir);
    expect(o.code).toBe('import{p as e,b as o}from"/build/p-f6a9428b.js"');
  });

  it(`import"./p-f86dea13.js";`, () => {
    const input = `import"./p-f86dea13.js";`;
    const o = updateImportPaths(input, newAbsDir);
    expect(o.code).toBe(`import"/build/p-f86dea13.js";`);
  });

  it(`import'./a.js';import'./b.js';import'./c.js';`, () => {
    const input = `import'./a.js';import'./b.js';import'./c.js';`;
    const o = updateImportPaths(input, newAbsDir);
    expect(o.code).toBe(`import'/build/a.js';import'/build/b.js';import'/build/c.js';`);
  });

  it(`import './p-f86dea13.js';`, () => {
    const input = `import './p-f86dea13.js';`;
    const o = updateImportPaths(input, newAbsDir);
    expect(o.code).toBe(`import '/build/p-f86dea13.js';`);
  });

  it(`import './no-touch.xml';`, () => {
    const input = `import './no-touch.xml';`;
    const o = updateImportPaths(input, newAbsDir);
    expect(o.code).toBe(`import './no-touch.xml';`);
  });

  it(`import '/no-touch.js';`, () => {
    const input = `import '/no-touch.js';`;
    const o = updateImportPaths(input, newAbsDir);
    expect(o.code).toBe(`import '/no-touch.js';`);
  });

  it(`import 'leave-me-be';`, () => {
    const input = `import 'leave-me-be';`;
    const o = updateImportPaths(input, newAbsDir);
    expect(o.code).toBe(`import 'leave-me-be';`);
  });
});
