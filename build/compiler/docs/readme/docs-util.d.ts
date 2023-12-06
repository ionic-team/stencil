export declare class MarkdownTable {
    private rows;
    addHeader(data: string[]): void;
    addRow(data: string[], isHeader?: boolean): void;
    toMarkdown(): string[];
}
