import { toTitleCase } from '@utils';
export const usageToMarkdown = (usages) => {
    const content = [];
    const merged = mergeUsages(usages);
    if (merged.length === 0) {
        return content;
    }
    content.push(`## Usage`);
    merged.forEach(({ name, text }) => {
        content.push('');
        content.push(`### ${toTitleCase(name)}`);
        content.push('');
        content.push(text);
        content.push('');
    }),
        content.push('');
    content.push('');
    return content;
};
export const mergeUsages = (usages) => {
    const keys = Object.keys(usages);
    const map = new Map();
    keys.forEach((key) => {
        const usage = usages[key].trim();
        const array = map.get(usage) || [];
        array.push(key);
        map.set(usage, array);
    });
    const merged = [];
    map.forEach((value, key) => {
        merged.push({
            name: value.join(' / '),
            text: key,
        });
    });
    return merged;
};
//# sourceMappingURL=markdown-usage.js.map