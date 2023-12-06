import { MarkdownTable } from './docs-util';
export const eventsToMarkdown = (events) => {
    const content = [];
    if (events.length === 0) {
        return content;
    }
    content.push(`## Events`);
    content.push(``);
    const table = new MarkdownTable();
    table.addHeader(['Event', 'Description', 'Type']);
    events.forEach((ev) => {
        table.addRow([`\`${ev.event}\``, getDocsField(ev), `\`CustomEvent<${ev.detail}>\``]);
    });
    content.push(...table.toMarkdown());
    content.push(``);
    content.push(``);
    return content;
};
const getDocsField = (prop) => {
    return `${prop.deprecation !== undefined
        ? `<span style="color:red">**[DEPRECATED]**</span> ${prop.deprecation}<br/><br/>`
        : ''}${prop.docs}`;
};
//# sourceMappingURL=markdown-events.js.map