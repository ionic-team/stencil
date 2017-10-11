import * as util from 'util';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { transformSourceString } from '../../util';
import upgradeJsxProps from '../upgrade-jsx-props';

require('util.promisify').shim();

const readFileAsync = util.promisify(fs.readFile);
const fileList = fs.readdirSync(path.join(__dirname, './pre-update'));
const directory = __dirname;

describe('vnode-slot transform', () => {

  let i;
  for (i = fileList.length - 1; i >= 0; i -= 1) {
    const fileName = fileList[i];

    it(`should match the expected output for ${fileName}`, async () => {
      const [source, final] = await Promise.all([
        readFileAsync(path.join(__dirname, './pre-update', fileName), { encoding: 'utf8'}),
        readFileAsync(path.join(__dirname, './post-update', fileName), { encoding: 'utf8'})
      ]);

      const output = transformSourceString(fileName, source, [upgradeJsxProps]);
      expect(
        output
      ).toEqual(
        final
      );
    });

  }
});
