import * as d from '../../declarations';
import { captializeFirstLetter } from '../../util/helpers';

export function usageToMarkdown(usages: d.JsonDocsUsage) {
  const content: string[] = [];
  const merged = mergeUsages(usages);
  if (merged.length === 0) {
    return content;
  }

  content.push(`## Usage`);

  merged.forEach(({name, text}) => {
    content.push('');
    content.push(`### ${captializeFirstLetter(name)}`);
    content.push('');
    content.push(text);
    content.push('');
  }),

  content.push('');
  content.push('');

  return content;
}

export function mergeUsages(usages: d.JsonDocsUsage) {
  const keys = Object.keys(usages);
  const map = new Map<string, string[]>();
  keys.forEach(key => {
    const usage = usages[key].trim();
    const array = map.get(usage) || [];
    array.push(key);
    map.set(usage, array);
  });
  const merged: {name: string, text: string}[] = [];
  map.forEach((value, key) => {
    merged.push({
      name: value.join(' / '),
      text: key
    });
  });
  return merged;
}

