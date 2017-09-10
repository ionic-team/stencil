const fs = require('fs');
const path = require('path');

const ts = require('typescript');
const tsConfig = parseTsConfig(path.resolve(__dirname, '../src/tsconfig.json'));

// force the output to use commonjs modules required by jest
tsConfig.options.module = 'commonjs';

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts')) {
      return ts.transpile(
        src,
        tsConfig.options,
        path,
        []
      );
    }
    return src;
  },
};

function parseTsConfig(configPath) {
  const jsonText = fs.readFileSync(configPath, "utf-8");
  const result = ts.parseConfigFileTextToJson(configPath, jsonText);
  if (result.error) {
      throw new Error("JSON parse error");
  }

  const host = {
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
    readDirectory: ts.sys.readDirectory,
    fileExists: path => fs.existsSync(path),
    readFile: path => fs.readFileSync(path, "utf-8"),
  };
  const parsed = ts.parseJsonConfigFileContent(result.config, host, path.dirname(configPath));
  if (parsed.errors && parsed.errors.length !== 0) {
      throw new Error(parsed.errors.map(e => e.messageText).join("\n"));
  }

  return parsed;
}
