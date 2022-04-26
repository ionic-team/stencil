import { NodeLazyRequire } from '../node-lazy-require';
import { buildError } from '@utils';
import { NodeResolveModule } from '../node-resolve-module';
import fs from 'graceful-fs';

const mockPackageJson = (version: string) =>
  JSON.stringify({
    version,
  });

describe('node-lazy-require', () => {
  describe('NodeLazyRequire', () => {
    describe('ensure', () => {
      let readFSMock: jest.SpyInstance;

      beforeEach(() => {
        readFSMock = jest.spyOn(fs, 'readFileSync').mockReturnValue(mockPackageJson('10.10.10'));
      });

      afterEach(() => {
        readFSMock.mockClear();
      });

      function setup() {
        const resolveModule = new NodeResolveModule();
        const nodeLazyRequire = new NodeLazyRequire(resolveModule, {
          jest: ['2.0.7', '38.0.1'],
        });
        return nodeLazyRequire;
      }

      it.each(['2.0.7', '10.10.10', '38.0.1'])(
        'should not error if a package of suitable version (%p) is installed',
        async (testVersion) => {
          const nodeLazyRequire = setup();
          readFSMock.mockReturnValue(mockPackageJson(testVersion));
          let diagnostics = await nodeLazyRequire.ensure('.', ['jest']);
          expect(diagnostics.length).toBe(0);
        }
      );

      it('should error if the installed version of a package is too low', async () => {
        const nodeLazyRequire = setup();
        readFSMock.mockReturnValue(mockPackageJson('1.1.1'));
        let [error] = await nodeLazyRequire.ensure('.', ['jest']);
        expect(error).toEqual({
          ...buildError([]),
          header: 'Please install supported versions of dev dependencies with either npm or yarn.',
          messageText: 'npm install --save-dev jest@38.0.1',
        });
      });

      it('should error if the installed version of a package is too high', async () => {
        const nodeLazyRequire = setup();
        readFSMock.mockReturnValue(mockPackageJson('100.1.1'));
        let [error] = await nodeLazyRequire.ensure('.', ['jest']);
        expect(error).toEqual({
          ...buildError([]),
          header: 'Please install supported versions of dev dependencies with either npm or yarn.',
          messageText: 'npm install --save-dev jest@38.0.1',
        });
      });
    });
  });
});
