import { wordWrap } from '../node-logger';


describe('node-logger', () => {

  describe('wordWrap', () => {

    it('should wrap line longer than columns, with solid word at break that cant break', () => {
      const columns = 40;
      const msg = [
        `abcd abcd abcd z123456789012345678901234567890z abcd abcd abcd `
      ];
      const lines = wordWrap(msg, columns);

      expect(lines[0]).toBe('           abcd abcd abcd');
      expect(lines[0].length).toBeLessThanOrEqual(columns);

      expect(lines[1]).toBe('           z123456789012345678901234567890z');

      expect(lines[2]).toBe('           abcd abcd abcd');
      expect(lines[2].length).toBeLessThanOrEqual(columns);
    });

    it('should wrap line longer than columns, with solid word at break that can break', () => {
      const columns = 40;
      const msg = [
        `abcd abcd abcd abcd z12345678901234567890z abcd abcd abcd `
      ];
      const lines = wordWrap(msg, columns);

      expect(lines[0]).toBe('           abcd abcd abcd abcd');
      expect(lines[0].length).toBeLessThanOrEqual(columns);

      expect(lines[1]).toBe('           z12345678901234567890z abcd');
      expect(lines[2].length).toBeLessThanOrEqual(columns);

      expect(lines[2]).toBe('           abcd abcd');
      expect(lines[2].length).toBeLessThanOrEqual(columns);
    });

    it('should wrap line longer than columns', () => {
      const columns = 40;
      const msg = [
        `1234 1234 1234 1234 abcd wxyz 1234 1234 1234 1234 1234 1234 `
      ];
      const lines = wordWrap(msg, columns);

      expect(lines[0]).toBe('           1234 1234 1234 1234 abcd');
      expect(lines[0].length).toBeLessThanOrEqual(columns);

      expect(lines[1]).toBe('           wxyz 1234 1234 1234 1234');
      expect(lines[1].length).toBeLessThanOrEqual(columns);
    });

    it('should print one line thats less than max', () => {
      const columns = 40;
      const msg = [
        `This is one line message`
      ];
      const lines = wordWrap(msg, columns);

      expect(lines).toHaveLength(1);
      expect(lines[0]).toBe('           This is one line message');
      expect(lines[0].length).toBeLessThanOrEqual(columns);
    });

  });

});
