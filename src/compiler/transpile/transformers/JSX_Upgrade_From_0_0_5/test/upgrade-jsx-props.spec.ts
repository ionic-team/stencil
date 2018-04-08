import * as d from '../../../../../declarations';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { mockCache } from '../../../../../testing/mocks';
import { transformSourceString } from '../../util';
import upgradeJsxProps from '../upgrade-jsx-props';


const fileList = fs.readdirSync(path.join(__dirname, './pre-update'));
const directory = __dirname;

describe('vnode-slot transform', async () => {
  const compilerCtx: d.CompilerCtx = { cache: mockCache() as any };

  let i;
  for (i = fileList.length - 1; i >= 0; i -= 1) {
    const fileName = fileList[i];

    it(`should match the expected output for ${fileName}`, async () => {
      const [source, final] = await Promise.all([
        fs.readFileSync(path.join(__dirname, './pre-update', fileName), { encoding: 'utf8'}),
        fs.readFileSync(path.join(__dirname, './post-update', fileName), { encoding: 'utf8'})
      ]);

      const output = await transformSourceString(fileName, source, [upgradeJsxProps]);
      expect(
        output
      ).toEqual(
        final
      );
    });

  }
});
