import MagicString from 'magic-string';

export function replaceBuildString(code: string, values: { [key: string]: any}) {
  function escape(str: string) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  function longest(a: string, b: string) {
    return b.length - a.length;
  }

  const keys = Object.keys(values).sort(longest).map(escape);
  const pattern = new RegExp(
    `\\b(${keys.join('|')})\\b`,
    'g'
  );

  const magicString = new MagicString(code);
  let start: number;
  let end: number;
  let replacement: string;
  let match;

  while ((match = pattern.exec(code))) {

    start = match.index;
    end = start + match[0].length;
    replacement = String(values[match[1]]);

    magicString.overwrite(start, end, replacement);
  }
  return magicString.toString();
}
