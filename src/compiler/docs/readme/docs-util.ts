import * as d from '../../../declarations';


export class MarkdownTable {
  private rows: RowData[] = [];

  addHeader(data: string[]) {
    this.addRow(data, true);
  }

  addRow(data: string[], isHeader = false) {
    const colData: ColumnData[] = [];

    data.forEach(text => {
      const col: ColumnData = {
        text: escapeMarkdownTableColumn(text),
        width: text.length
      };
      colData.push(col);
    });

    this.rows.push({
      columns: colData,
      isHeader: isHeader
    });
  }

  toMarkdown() {
    return createTable(this.rows);
  }

}


function escapeMarkdownTableColumn(text: string) {
  text = text.replace(/\r?\n/g, ' ');
  text = text.replace(/\|/g, '\\|');
  return text;
}


function createTable(rows: RowData[]) {
  const content: string[] = [];
  if (rows.length === 0) {
    return content;
  }

  normalize(rows);

  const th = rows.find(r => r.isHeader);
  if (th) {
    const headerRow = createRow(th);
    content.push(headerRow);
    content.push(createBorder(th));
  }

  const tds = rows.filter(r => !r.isHeader);
  tds.forEach(td => {
    content.push(createRow(td));
  });

  return content;
}


function createBorder(th: RowData) {
  const border: RowData = {
    columns: [],
    isHeader: false
  };

  th.columns.forEach(c => {
    const borderCol: ColumnData = {
      text: '',
      width: c.width
    };
    while (borderCol.text.length < borderCol.width) {
      borderCol.text += '-';
    }
    border.columns.push(borderCol);
  });

  return createRow(border);
}


function createRow(row: RowData) {
  const content: string[] = ['| '];

  row.columns.forEach(c => {
    content.push(c.text);
    content.push(' | ');
  });

  return content.join('').trim();
}


function normalize(rows: RowData[]) {
  normalizeColumCount(rows);
  normalizeColumnWidth(rows);
}


function normalizeColumCount(rows: RowData[]) {
  let columnCount = 0;

  rows.forEach(r => {
    if (r.columns.length > columnCount) {
      columnCount = r.columns.length;
    }
  });

  rows.forEach(r => {
    while (r.columns.length < columnCount) {
      r.columns.push({
        text: ``,
        width: 0
      });
    }
  });
}


function normalizeColumnWidth(rows: RowData[]) {
  const columnCount = rows[0].columns.length;

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    let longestText = 0;

    rows.forEach(r => {
      const col = r.columns[columnIndex];
      if (col.text.length > longestText) {
        longestText = col.text.length;
      }
    });

    rows.forEach(r => {
      const col = r.columns[columnIndex];
      col.width = longestText;
      while (col.text.length < longestText) {
        col.text += ' ';
      }
    });
  }

}


interface ColumnData {
  text: string;
  width: number;
}

interface RowData {
  columns: ColumnData[];
  isHeader?: boolean;
}

export function getEventDetailType(eventType: d.JsDoc) {
  if (eventType && eventType.type && typeof eventType.type === 'string' && eventType.type !== 'void') {
    return eventType.type.trim();
  }
  return 'void';
}


export function getMemberDocumentation(jsDoc: d.JsDoc) {
  if (jsDoc && typeof jsDoc.documentation === 'string') {
    return jsDoc.documentation.trim();
  }
  return '';
}

export function getPlatform(jsDoc: d.JsDoc) {
  const tag = jsDoc.tags.find(t => t.name === 'platform');
  return tag.text || 'all';
}

export function getMemberType(jsDoc: d.JsDoc) {
  if (jsDoc && typeof jsDoc.type === 'string') {
    return jsDoc.type.trim();
  }
  return '';
}

export function getMethodParameters({ parameters }: d.JsDoc): d.JsonDocMethodParameter[] {
  if (parameters) {
    return parameters.map(({ name, type, documentation }) => ({
      name,
      type,
      docs: documentation
    }));
  }
  return [];
}

export function getMethodReturns({ returns }: d.JsDoc): d.JsonDocsMethodReturn {
  if (returns) {
    return {
      type: returns.type,
      docs: returns.documentation
    };
  }
  return null;
}
