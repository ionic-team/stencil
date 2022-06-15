import * as d from '@stencil/core/declarations';
import { createTestingSystem } from '../testing-sys';
import { createInMemoryFs } from '../../compiler/sys/in-memory-fs';
import { expectFiles } from '../testing-utils';
import path from 'path';

describe('testing-utils', () => {
  describe('expectFiles', () => {
    const MOCK_FILE_PATH = path.join('mock', 'file', 'path', 'to', 'file.ts');
    const MOCK_FILE_CONTENTS = "console.log('hello world!');";
    let fs: d.InMemoryFileSystem;

    beforeEach(() => {
      const sys = createTestingSystem();
      fs = createInMemoryFs(sys);
    });

    it('does not throw when no file paths are provided', async () => {
      await fs.writeFile(MOCK_FILE_PATH, MOCK_FILE_CONTENTS);

      expect(() => expectFiles(fs, [])).not.toThrow();
    });

    it('does not throw when a provided file path is found', async () => {
      await fs.writeFile(MOCK_FILE_PATH, MOCK_FILE_CONTENTS);

      expect(() => expectFiles(fs, [MOCK_FILE_PATH])).not.toThrow();
    });

    it('does not throw when the provided file paths are found', async () => {
      await fs.writeFile(MOCK_FILE_PATH, MOCK_FILE_CONTENTS);

      const anotherFilePath = path.join('another', 'mock', 'file', 'path', 'to', 'some-file.ts');
      await fs.writeFile(anotherFilePath, "console.log('hello world, again!');");

      expect(() => expectFiles(fs, [MOCK_FILE_PATH, anotherFilePath])).not.toThrow();
    });

    it('throws an error when an expected file cannot be found', () => {
      const expectedErrorMessage = `The following files were expected, but could not be found:
-${MOCK_FILE_PATH}`;

      expect(() => expectFiles(fs, [MOCK_FILE_PATH])).toThrow(expectedErrorMessage);
    });

    it('throws an error when multiple files cannot be found', () => {
      const anotherFilePath = path.join('another', 'mock', 'file', 'path', 'to', 'some-file.ts');

      const expectedErrorMessage = `The following files were expected, but could not be found:
-${MOCK_FILE_PATH}
-${anotherFilePath}`;

      expect(() => expectFiles(fs, [MOCK_FILE_PATH, anotherFilePath])).toThrow(expectedErrorMessage);
    });
  });
});
