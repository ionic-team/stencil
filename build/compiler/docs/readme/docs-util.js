export class MarkdownTable {
    constructor() {
        this.rows = [];
    }
    addHeader(data) {
        this.addRow(data, true);
    }
    addRow(data, isHeader = false) {
        const colData = [];
        data.forEach((text) => {
            const col = {
                text: escapeMarkdownTableColumn(text),
                width: text.length,
            };
            colData.push(col);
        });
        this.rows.push({
            columns: colData,
            isHeader: isHeader,
        });
    }
    toMarkdown() {
        return createTable(this.rows);
    }
}
const escapeMarkdownTableColumn = (text) => {
    text = text.replace(/\r?\n/g, ' ');
    text = text.replace(/\|/g, '\\|');
    return text;
};
const createTable = (rows) => {
    const content = [];
    if (rows.length === 0) {
        return content;
    }
    normalizeColumCount(rows);
    normalizeColumnWidth(rows);
    const th = rows.find((r) => r.isHeader);
    if (th) {
        const headerRow = createRow(th);
        content.push(headerRow);
        content.push(createBorder(th));
    }
    const tds = rows.filter((r) => !r.isHeader);
    tds.forEach((td) => {
        content.push(createRow(td));
    });
    return content;
};
const createBorder = (th) => {
    const border = {
        columns: [],
        isHeader: false,
    };
    th.columns.forEach((c) => {
        const borderCol = {
            text: '',
            width: c.width,
        };
        while (borderCol.text.length < borderCol.width) {
            borderCol.text += '-';
        }
        border.columns.push(borderCol);
    });
    return createRow(border);
};
const createRow = (row) => {
    const content = ['| '];
    row.columns.forEach((c) => {
        content.push(c.text);
        content.push(' | ');
    });
    return content.join('').trim();
};
const normalizeColumCount = (rows) => {
    let columnCount = 0;
    rows.forEach((r) => {
        if (r.columns.length > columnCount) {
            columnCount = r.columns.length;
        }
    });
    rows.forEach((r) => {
        while (r.columns.length < columnCount) {
            r.columns.push({
                text: ``,
                width: 0,
            });
        }
    });
};
const normalizeColumnWidth = (rows) => {
    const columnCount = rows[0].columns.length;
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        let longestText = 0;
        rows.forEach((r) => {
            const col = r.columns[columnIndex];
            if (col.text.length > longestText) {
                longestText = col.text.length;
            }
        });
        rows.forEach((r) => {
            const col = r.columns[columnIndex];
            col.width = longestText;
            while (col.text.length < longestText) {
                col.text += ' ';
            }
        });
    }
};
//# sourceMappingURL=docs-util.js.map