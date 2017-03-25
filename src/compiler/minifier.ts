import * as babel from 'babel-core';


export function minify(code: string) {
  return babel.transform(code, {
    presets: [
      ['babili', {
        removeConsole: true,
        removeDebugger: true
      }],
    ]
  });
}
