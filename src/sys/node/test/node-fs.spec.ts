import { NodeFs } from '../node-fs';


describe('NodeFs', () => {

  it('supports mkdir recursive', () => {
    const process: any = {
      version: '10.12.0'
    };
    let nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(true);

    process.version = '10.12.1';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(true);

    process.version = '10.13.0';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(true);

    process.version = '11.0.0';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(true);

    process.version = '88.0.0';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(true);
  });

  it('does not support mkdir recursive', () => {
    const process: any = {
      version: '10.11.99'
    };
    let nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(false);

    process.version = '10.11.0';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(false);

    process.version = '10.0.0';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(false);

    process.version = '9.0.0';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(false);

    process.version = '0.10.0';
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(false);

    process.version = null;
    nodeFs = new NodeFs(process);
    expect(nodeFs.supportsMkdirRecursive).toBe(false);
  });

});
