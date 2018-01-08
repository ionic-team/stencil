import graphIt from '../graph-it';
import { rollup } from 'rollup';
import * as path from 'path';

describe('chunk-plugin', () => {
  it('if a common module is included in 2 entry points them make it a new module', async () => {
    // start the bundler on our temporary file
    const entryFiles = [
      path.resolve(__dirname, './graph-fixtures/a.js'),
      path.resolve(__dirname, './graph-fixtures/b.js'),
      path.resolve(__dirname, './graph-fixtures/c.js')
    ];
    let graphData = new Map<string, string[]>();

    await Promise.all(
      entryFiles.map(async (entryKey) => {
        let rollupBundle = await rollup({
          input: entryKey,
          plugins: [
            graphIt({}, graphData),
          ],
        });
      })
    );

    expect([...graphData]).toEqual([
      [
        path.resolve(__dirname, './graph-fixtures/a.js'),
        [
          path.resolve(__dirname, './graph-fixtures/1'),
        ]
      ],
      [
        path.resolve(__dirname, './graph-fixtures/b.js'),
        [
          path.resolve(__dirname, './graph-fixtures/2'),
          path.resolve(__dirname, './graph-fixtures/3')
        ]
      ],
      [
        path.resolve(__dirname, './graph-fixtures/c.js'),
        [
          path.resolve(__dirname, './graph-fixtures/2'),
          path.resolve(__dirname, './graph-fixtures/3'),
          path.resolve(__dirname, './graph-fixtures/4')
        ]
      ],
      [
        path.resolve(__dirname, './graph-fixtures/1.js'),
        [
          path.resolve(__dirname, './graph-fixtures/4'),
        ]
      ]
    ]);
  });
});
