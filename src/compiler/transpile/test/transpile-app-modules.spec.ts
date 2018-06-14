import { Config } from '../../../declarations';
import { isFileIncludePath } from '../transpile-service';
import { mockConfig } from '../../../testing/mocks';


describe('compile', () => {

  describe('includeTsFile', () => {

    it('include tsx file', () => {
      config.includeSrc = ['/path/to/**/*.tsx'];
      config.excludeSrc = ['**/test/**', '**/*.spec.*'];

      const readPath = '/path/to/test/some/module/file.tsx';

      expect(isFileIncludePath(config, readPath)).toBe(false);
    });

    it('exclude spec file', () => {
      config.includeSrc = ['/path/to/**/*.tsx'];
      config.excludeSrc = ['**/test/**', '**/*.spec.*'];

      const readPath = '/path/to/some/module/file.spec.tsx';

      expect(isFileIncludePath(config, readPath)).toBe(false);
    });

    it('exclude test dir files', () => {
      config.includeSrc = ['/path/to/**/*.tsx'];
      config.excludeSrc = ['**/test/**', '**/*.spec.*'];

      const readPath = '/path/to/test/some/module/file.tsx';

      expect(isFileIncludePath(config, readPath)).toBe(false);
    });

    it('exclude all', () => {
      config.includeSrc = [];
      config.excludeSrc = [];
      const readPath = '/path/to/app/src/components/checkbox/checkbox.tsx';

      expect(isFileIncludePath(config, readPath)).toBe(false);
    });

  });

  var config: Config;

  beforeEach(() => {
    config = mockConfig();
  });

});
