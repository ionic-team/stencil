import * as d from '../../declarations';
import { PROP_TYPE } from '../../util/constants';

export class MarkdownTable {
  private rows: RowData[] = [];

  addHeader(data: string[]) {
    this.addRow(data, true);
  }

  addRow(data: string[], isHeader = false) {
    const colData: ColumnData[] = [];

    data.forEach(text => {
      const col: ColumnData = {
        text: text.replace(/\r?\n/g, ' '),
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

export function getMemberDocumentation(jsDoc: d.JsDoc) {
  if (jsDoc && typeof jsDoc.documentation === 'string') {
    return jsDoc.documentation.trim();
  }
  return '';
}

export function getMemberType(jsDoc: d.JsDoc) {
  if (jsDoc && typeof jsDoc.type === 'string') {
    return jsDoc.type.trim();
  }
  return '';
}

export function getMethodParameters({
  parameters
}: d.JsDoc): d.JsonDocMethodParameter[] {
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

export function getPropType(
  memberMeta: d.MemberMeta,
  format = (type: string) => type
) {
  if (memberMeta.attribType && memberMeta.attribType.text) {
    if (!memberMeta.attribType.text.includes('(')) {
      const typeSplit = memberMeta.attribType.text.split('|').map(t => {
        return format(t.replace(/\'/g, '"').trim());
      });

      return typeSplit.join(', ');
    }

    return format(memberMeta.attribType.text);
  }

  let propType;
  switch (memberMeta.propType) {
    case PROP_TYPE.Any:
      propType = 'any';
      break;
    case PROP_TYPE.Boolean:
      propType = 'boolean';
      break;
    case PROP_TYPE.Number:
      propType = 'number';
      break;
    case PROP_TYPE.String:
      propType = 'string';
      break;
    default:
      propType = '';
      break;
  }

  return format(propType);
}
