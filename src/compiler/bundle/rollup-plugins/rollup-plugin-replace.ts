import MagicString, { SourceMap } from 'magic-string';

function escape(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function functor(thing: any) {
  if (typeof thing === 'function') return thing;
  return () => thing;
}

function longest(a: string, b: string) {
  return b.length - a.length;
}

interface Options {
  delimiters?: [string, string];
  values?: {
    [key: string]: any
  };
  sourcemap?: boolean;
}

interface Results {
  code: string;
  map?: SourceMap;
}

export default function replace(options: Options = {}) {
  const { delimiters } = options;

  let values: { [key: string]: any };

  if (options.values) {
    values = options.values;
  } else {
    values = Object.assign({}, options);
    delete values.delimiters;
    delete values.include;
    delete values.exclude;
  }

  const keys = Object.keys(values).sort(longest).map(escape);

  const pattern = delimiters ?
    new RegExp(
      `${escape(delimiters[0])}(${keys.join('|')})${escape(delimiters[1])}`,
      'g'
    ) :
    new RegExp(
      `\\b(${keys.join('|')})\\b`,
      'g'
    );

  // convert all values to functions
  Object.keys(values).forEach(key => {
    values[key] = functor(values[key]);
  });

  return {
    name: 'replace',

    transform(code: string, id: string) {
      const magicString = new MagicString(code);

      let hasReplacements = false;
      let match;
      let start, end, replacement;

      while ((match = pattern.exec(code))) {
        hasReplacements = true;

        start = match.index;
        end = start + match[0].length;
        replacement = String(values[match[1]](id));

        magicString.overwrite(start, end, replacement);
      }

      if (!hasReplacements) return null;

      const result: Results = { code: magicString.toString() };
      if (options.sourcemap !== false) {
        result.map = magicString.generateMap({ hires: true });
      }

      return result;
    }
  };
}
