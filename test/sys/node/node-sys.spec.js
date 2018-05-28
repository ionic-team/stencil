const nodeSys = require('../../../sys/node/index.js');


describe('test/sys/node', () => {
  let sys;

  beforeEach(() => {
    sys = new nodeSys.NodeSystemMain();
  });

  afterEach(() => {
    sys.destroy();
  });

  describe('gzipSize', () => {

    it('gets gzip size', async () => {
      let size = await sys.gzipSize('88888888888888888888888888888888888888888888888888');
      expect(size).toBe(24);

      size = await sys.gzipSize('888888888888888888');
      expect(size).toBe(23);
    });

  });

});
