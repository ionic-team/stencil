/**
 * This is a copy of https://github.com/calvinmetcalf/rollup-plugin-node-globals
 * With one change to allow the plugin to use a copy of acorn from rollup
 */

import { attachScopes, createFilter } from 'rollup-pluginutils';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { dirname, join, relative } from 'path';
import { randomBytes } from 'crypto';

const reservedWords = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public'.split(' ');
const builtins = 'Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl'.split(' ');

const blacklisted = Object.create(null);
reservedWords.concat(builtins).forEach(function (word) {
  return blacklisted[word] = true;
});

function makeLegalIdentifier(str: string) {
  str = str.replace(/-(\w)/g, function (_, letter) {
    return letter.toUpperCase();
  }).replace(/[^$_a-zA-Z0-9]/g, '_');

  if (/\d/.test(str[0]) || blacklisted[str]) str = '_' + str;

  return str;
}

function isReference(node: any, parent: any): boolean | void {
  if (node.type === 'MemberExpression') {
    return !node.computed && isReference(node.object, node);
  }

  if (node.type === 'Identifier') {
    // TODO is this right?
    if (parent.type === 'MemberExpression') return parent.computed || node === parent.object;

    // disregard the `bar` in { bar: foo }
    if (parent.type === 'Property' && node !== parent.value) return false;

    // disregard the `bar` in `class Foo { bar () {...} }`
    if (parent.type === 'MethodDefinition') return false;

    // disregard the `bar` in `export { foo as bar }`
    if (parent.type === 'ExportSpecifier' && node !== parent.local) return;

    return true;
  }
}

function flatten(node: any) {
  let name: any = void 0;
  const parts = [];

  while (node.type === 'MemberExpression') {
    parts.unshift(node.property.name);
    node = node.object;
  }

  name = node.name;
  parts.unshift(name);

  return {
    name: name,
    keypath: parts.join('.')
  };
}

function inject (code: string, id: string, mod1: any, mod2: any, sourceMap: any, parse: any) {
  var ast: any = void 0;

  try {
    ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    });
  } catch (err) {
    err.message += ' in ' + id;
    throw err;
  }
  // analyse scopes
  var scope = attachScopes(ast, 'scope');

  const imports: { [key: string]: any } = {};
  ast.body.forEach(function (node: any) {
    if (node.type === 'ImportDeclaration') {
      node.specifiers.forEach(function (specifier: any) {
        imports[specifier.local.name] = true;
      });
    }
  });

  const magicString = new MagicString(code);

  const newImports: { [key: string]: any } = {};

  function handleReference(node: any, name: string, keypath: string, parent?: any) {
    if ((mod1.has(keypath) || mod2.has(keypath)) && !scope.contains(name) && !imports[name]) {
      if (mod2.has(keypath) && parent.__handled) {
        return;
      }
      const module = mod1.has(keypath) ? mod1.get(keypath) : mod2.get(keypath);
      var moduleName: any = void 0,
          hash: any = void 0;
      if (typeof module === 'string') {
        moduleName = module;
        hash = keypath + ':' + moduleName + ':default';
      } else {
        moduleName = module[0];
        hash = keypath + ':' + moduleName + ':' + module[1];
      }
      // prevent module from importing itself
      if (moduleName === id) return;

      const importLocalName = name === keypath ? name : makeLegalIdentifier('$inject_' + keypath);

      if (!newImports[hash]) {
        newImports[hash] = 'import ' + (typeof module === 'string' ? importLocalName : '{ ' + module[1] + ' as ' + importLocalName + ' }') + ' from ' + JSON.stringify(moduleName) + ';';
      }

      if (name !== keypath) {
        magicString.overwrite(node.start, node.end, importLocalName, { storeName: true });
      }
      if (mod1.has(keypath)) {
        node.__handled = true;
      }
    }
  }

  walk(ast, {
    enter: function enter(node, parent) {
      if (sourceMap) {
        magicString.addSourcemapLocation(node.start);
        magicString.addSourcemapLocation(node.end);
      }

      if (node.scope) scope = node.scope;

      // special case – shorthand properties. because node.key === node.value,
      // we can't differentiate once we've descended into the node
      if (node.type === 'Property' && node.shorthand) {
        const name = node.key.name;
        handleReference(node, name, name);
        return this.skip();
      }

      if (isReference(node, parent)) {
        const _flatten = flatten(node),
            _name = _flatten.name,
            keypath = _flatten.keypath;

        handleReference(node, _name, keypath, parent);
      }
    },
    leave: function leave(node) {
      if (node.scope) scope = scope.parent;
    }
  });

  const keys = Object.keys(newImports);
  if (!keys.length) return null;

  const importBlock = keys.map(function (hash) {
    return newImports[hash];
  }).join('\n\n');

  magicString.prepend(importBlock + '\n\n');

  return {
    code: magicString.toString(),
    map: sourceMap ? magicString.generateMap() : null
  };
}

const PROCESS_PATH = require.resolve('process-es6');
const BUFFER_PATH = require.resolve('buffer-es6');
const GLOBAL_PATH = join(__dirname, '..', 'sys', 'node', 'rollup-node-globals-global.js');
const BROWSER_PATH = join(__dirname, '..', 'sys', 'node', 'rollup-node-globals-browser.js');
const DIRNAME = '\0node-globals:dirname';
const FILENAME = '\0node-globals:filename';

function clone(obj: { [key: string]: any }) {
  const out: { [key: string]: any } = {};
  Object.keys(obj).forEach(function (key) {
    if (Array.isArray(obj[key])) {
      out[key] = obj[key].slice();
    } else {
      out[key] = obj[key];
    }
  });
  return out;
}
const _mods1: { [key: string]: any } = {
  'process.nextTick': [PROCESS_PATH, 'nextTick'],
  'process.browser': [BROWSER_PATH, 'browser'],
  'Buffer.isBuffer': [BUFFER_PATH, 'isBuffer']
};
const _mods2: { [key: string]: any } = {
  process: PROCESS_PATH,
  Buffer: [BUFFER_PATH, 'Buffer'],
  global: GLOBAL_PATH,
  __filename: FILENAME,
  __dirname: DIRNAME
};
const mods1 = new Map();
const mods2 = new Map();
const buf = new Map();
buf.set('global', GLOBAL_PATH);
Object.keys(_mods1).forEach(function (key) {
  mods1.set(key, _mods1[key]);
});
Object.keys(_mods2).forEach(function (key) {
  mods2.set(key, _mods2[key]);
});
const mods = Object.keys(_mods1).concat(Object.keys(_mods2));
function escape(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
const firstpass = new RegExp('(?:' + mods.map(escape).join('|') + ')', 'g');

const index = (function (options: Options = {}) {
  const basedir = options.baseDir || '/';
  const dirs = new Map();
  const opts: Options = clone(options);
  const exclude = (opts.exclude || []).concat(GLOBAL_PATH);
  const filter = createFilter(options.include, exclude);
  const sourceMap = options.sourceMap !== false;
  return {
    load: function load(id: string): string | void {
      if (dirs.has(id)) {
        return 'export default \'' + dirs.get(id) + '\'';
      }
    },
    resolveId: function resolveId(importee: string, importer: string): string | void {
      if (importee === DIRNAME) {
        const id = randomBytes(15).toString('hex');
        dirs.set(id, dirname('/' + relative(basedir, importer)));
        return id;
      }
      if (importee === FILENAME) {
        const _id = randomBytes(15).toString('hex');
        dirs.set(_id, '/' + relative(basedir, importer));
        return _id;
      }
    },
    transform: function transform(code: any, id: string) {
      if (id === BUFFER_PATH) {
        return inject(code, id, buf, new Map(), sourceMap, this.parse);
      }
      if (!filter(id)) return null;
      if (code.search(firstpass) === -1) return null;
      if (id.slice(-3) !== '.js') return null;

      const out = inject(code, id, mods1, mods2, sourceMap, this.parse);
      return out;
    }
  };
});

export interface Options {
  baseDir?: string;
  exclude?: any;
  include?: any;
  sourceMap?: any;
}

export default index;
