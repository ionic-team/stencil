import MagicString from 'magic-string';

function escape(str: string) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function ensureFunction(functionOrValue: any) {
  if (typeof functionOrValue === 'function') return functionOrValue;
  return () => functionOrValue;
}

function longest(a: string, b: string) {
  return b.length - a.length;
}

interface Options {
  delimiters?: [string, string];
  values: {
    [key: string]: any
  };
}

interface Results {
  code: string;
}

function getReplacements (options: Options) {
  return { ...options.values };
}

function mapToFunctions(object: {[key: string]: any}) {
  const functions: { [key: string]: any } = {};
  Object.keys(object).forEach(key => {
    functions[key] = ensureFunction(object[key]);
  });
  return functions;
}

export default function replace(options: Options) {
  const { delimiters } = options;
  const functionValues = mapToFunctions(getReplacements(options));
  const keys = Object.keys(functionValues)
    .sort(longest)
    .map(escape);

  const pattern = delimiters
    ? new RegExp(`${escape(delimiters[0])}(${keys.join('|')})${escape(delimiters[1])}`, 'g')
    : new RegExp(`\\b(${keys.join('|')})\\b`, 'g');

  return {
    name: 'replace',

    transform(code: string, id: string): Results {
      const magicString = new MagicString(code);

      let hasReplacements = false;
      let match;
      let start;
      let end;
      let replacement;

      while ((match = pattern.exec(code))) {
        hasReplacements = true;

        start = match.index;
        end = start + match[0].length;
        replacement = String(functionValues[match[1]](id));

        magicString.overwrite(start, end, replacement);
      }

      if (!hasReplacements) return null;

      return { code: magicString.toString() };
    }
  };
}