import makeLegalIdentifier from './makeLegalIdentifier';
import { Config } from '../../../declarations';

export interface Options {
  indent?: string;
  preferConst?: boolean;
}
export interface ASTNode {
  type: string;
  sourceType?: string;
  start: number | null;
  end: number | null;
  body?: any[];
  declaration?: any;
}

export default function bundleJson(config: Config, options: Options = {}) {
  const path = config.sys.path;

  return {
    name: 'json',

    resolveId(importee: string, importer: string): any {
      if (importer && importer.startsWith(config.collectionDir) && importee.endsWith('.json')) {
        return path.resolve(
          path.dirname(importer).replace(config.collectionDir, config.srcDir),
          importee
        );
      }

      return null;
    },

    transform(json: string, id: string) {
      if (id.slice(-5) !== '.json') return null;

      const data = JSON.parse(json);
      let code = '';

      const ast: ASTNode = {
        type: 'Program',
        sourceType: 'module',
        start: 0,
        end: null,
        body: []
      };

      if (Object.prototype.toString.call(data) !== '[object Object]') {
        code = `export default ${json};`;

        ast.body.push({
          type: 'ExportDefaultDeclaration',
          start: 0,
          end: code.length,
          declaration: {
            type: 'Literal',
            start: 15,
            end: code.length - 1,
            value: null,
            raw: 'null'
          }
        });
      } else {
        const indent = 'indent' in options ? options.indent : '\t';

        const validKeys: string[] = [];
        const invalidKeys: string[] = [];

        Object.keys(data).forEach(key => {
          if (key === makeLegalIdentifier(key)) {
            validKeys.push(key);
          } else {
            invalidKeys.push(key);
          }
        });

        let char = 0;

        validKeys.forEach(key => {
          const declarationType = options.preferConst ? 'const' : 'var';
          const declaration = `export ${declarationType} ${key} = ${JSON.stringify(data[key])};`;

          const start = char;
          const end = start + declaration.length;

          // generate fake AST node while we're here
          ast.body.push({
            type: 'ExportNamedDeclaration',
            start: char,
            end: char + declaration.length,
            declaration: {
              type: 'VariableDeclaration',
              start: start + 7, // 'export '.length
              end,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: start + 7 + declarationType.length + 1, // `export ${declarationType} `.length
                  end: end - 1,
                  id: {
                    type: 'Identifier',
                    start: start + 7 + declarationType.length + 1, // `export ${declarationType} `.length
                    end: start + 7 + declarationType.length + 1 + key.length, // `export ${declarationType} ${key}`.length
                    name: key
                  },
                  init: {
                    type: 'Literal',
                    start: start +
                      7 +
                      declarationType.length +
                      1 +
                      key.length +
                      3, // `export ${declarationType} ${key} = `.length
                    end: end - 1,
                    value: null,
                    raw: 'null'
                  }
                }
              ],
              kind: declarationType
            },
            specifiers: [],
            source: null
          });

          char = end + 1;
          code += `${declaration}\n`;
        });

        const defaultExportNode: ASTNode = {
          type: 'ExportDefaultDeclaration',
          start: char,
          end: null,
          declaration: {
            type: 'ObjectExpression',
            start: char + 15,
            end: null,
            properties: []
          }
        };

        char += 17 + indent.length; // 'export default {\n\t'.length'

        const defaultExportRows = validKeys
          .map(key => {
            const row = `${key}: ${key}`;

            const start = char;
            const end = start + row.length;

            defaultExportNode.declaration.properties.push({
              type: 'Property',
              start,
              end,
              method: false,
              shorthand: false,
              computed: false,
              key: {
                type: 'Identifier',
                start,
                end: start + key.length,
                name: key
              },
              value: {
                type: 'Identifier',
                start: start + key.length + 2,
                end,
                name: key
              },
              kind: 'init'
            });

            char += row.length + (2 + indent.length); // ',\n\t'.length

            return row;
          })
          .concat(
            invalidKeys.map(key => `"${key}": ${JSON.stringify(data[key])}`)
          );

        code += `export default {\n${indent}${defaultExportRows.join(`,\n${indent}`)}\n};`;
        ast.body.push(defaultExportNode);

        const end = code.length;

        defaultExportNode.declaration.end = end - 1;
        defaultExportNode.end = end;
      }

      ast.end = code.length;

      return { ast, code, map: { mappings: '' } };
    }
  };
}
