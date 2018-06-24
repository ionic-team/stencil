import * as d from '../../declarations';
import { DEV_SERVER_URL } from '../util';


export function appError(doc: Document, buildResults: d.BuildResults) {
  if (!Array.isArray(buildResults.diagnostics)) {
    return;
  }

  const modal = getDevServerModal(doc);

  buildResults.diagnostics.forEach(diagnostic => {
    consoleLogDiagnostics(diagnostic);
    appendDiagnostic(doc, modal, diagnostic);
  });
}


function appendDiagnostic(doc: Document, modal: HTMLElement, diagnostic: d.Diagnostic) {
  const card = doc.createElement('div');
  card.className = 'dev-server-diagnostic';

  const masthead = doc.createElement('div');
  masthead.className = 'dev-server-diagnostic-masthead';
  masthead.title = `${escapeHtml(diagnostic.type)} error: ${escapeHtml(diagnostic.code)}`;
  card.appendChild(masthead);

  const title = doc.createElement('div');
  title.className = 'dev-server-diagnostic-title';
  title.textContent = `${titleCase(diagnostic.type)} ${titleCase(diagnostic.level)}`;
  masthead.appendChild(title);

  const message = doc.createElement('div');
  message.className = 'dev-server-diagnostic-message';
  message.textContent = diagnostic.messageText;
  masthead.appendChild(message);

  const file = doc.createElement('div');
  file.className = 'dev-server-diagnostic-file';
  card.appendChild(file);

  if (diagnostic.relFilePath) {
    const fileHeader = doc.createElement('div');
    fileHeader.className = 'dev-server-diagnostic-file-header';

    if (diagnostic.absFilePath) {
      fileHeader.title = escapeHtml(diagnostic.absFilePath);
    }

    const parts = diagnostic.relFilePath.split('/');

    const fileName = doc.createElement('span');
    fileName.className = 'dev-server-diagnostic-file-name';
    fileName.textContent = parts.pop();

    const filePath = doc.createElement('span');
    filePath.className = 'dev-server-diagnostic-file-path';
    filePath.textContent = parts.join('/') + '/';

    fileHeader.appendChild(filePath);
    fileHeader.appendChild(fileName);
    file.appendChild(fileHeader);
  }

  if (diagnostic.lines && diagnostic.lines.length > 0) {
    const blob = doc.createElement('div');
    blob.className = 'dev-server-diagnostic-blob';
    file.appendChild(blob);

    const table = doc.createElement('table');
    table.className = 'dev-server-diagnostic-table';
    blob.appendChild(table);

    prepareLines(diagnostic.lines).forEach(l => {
      const tr = doc.createElement('tr');
      if (l.errorCharStart > -1) {
        tr.className = 'dev-server-diagnostic-error-line';
      }
      table.appendChild(tr);

      const tdNum = doc.createElement('td');
      tdNum.className = 'dev-server-diagnostic-blob-num';
      tdNum.setAttribute('data-line-number', l.lineNumber + '');
      tr.appendChild(tdNum);

      const tdCode = doc.createElement('td');
      tdCode.className = 'dev-server-diagnostic-blob-code';
      tdCode.innerHTML = highlightError(l.text, l.errorCharStart, l.errorLength);
      tr.appendChild(tdCode);
    });
  }

  modal.appendChild(card);
}


function getDevServerModal(doc: Document) {
  let outer = doc.getElementById(DEV_SERVER_MODAL);
  if (!outer) {
    outer = doc.createElement('div');
    outer.id = DEV_SERVER_MODAL;
    doc.body.appendChild(outer);
  }

  outer.innerHTML = `
    <style>#${DEV_SERVER_MODAL} { display: none; }</style>
    <link href="${DEV_SERVER_URL}/app-error.css" rel="stylesheet">
    <div id="${DEV_SERVER_MODAL}-inner"></div>
  `;

  return doc.getElementById(`${DEV_SERVER_MODAL}-inner`);
}

const YELLOW = `#f39c12`;
const RED = `#c0392b`;

function consoleLogDiagnostics(diagnostic: d.Diagnostic) {
  let color = RED;
  let prefix = 'Error';

  if (diagnostic.level === 'warn') {
    color = YELLOW;
    prefix = 'Warning';
  }

  if (diagnostic.header) {
    prefix = diagnostic.header;
  }

  const styledPrefix = [
    '%c' + prefix,
    `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`
  ];

  let msg = ``;

  if (diagnostic.relFilePath) {
    msg += diagnostic.relFilePath;

    if (typeof diagnostic.lineNumber === 'number' && diagnostic.lineNumber > 0) {
      msg += ', line ' + diagnostic.lineNumber;

      if (typeof diagnostic.columnNumber === 'number' && diagnostic.columnNumber > 0) {
        msg += ', column ' + diagnostic.columnNumber;
      }
    }
    msg += `\n`;
  }

  msg += diagnostic.messageText;

  console.log(...styledPrefix, msg);
}


export function clearDevServerModal(doc: Document) {
  const appErrorElm = doc.getElementById(DEV_SERVER_MODAL);
  if (appErrorElm) {
    appErrorElm.parentNode.removeChild(appErrorElm);
  }
}

function escapeHtml(unsafe: string) {
  if (typeof unsafe === 'number' || typeof unsafe === 'boolean') {
    return (unsafe as any).toString();
  }
  if (typeof unsafe === 'string') {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  return '';
}

function titleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function highlightError(htmlInput: string, errorCharStart: number, errorLength: number) {
  if (errorCharStart < 0 || errorLength < 1 || !htmlInput) return htmlInput;

  const chars = htmlInput.split('');
  let inTag = false;
  let textIndex = -1;
  for (var htmlIndex = 0; htmlIndex < chars.length; htmlIndex++) {
    if (chars[htmlIndex] === '<') {
      inTag = true;
      continue;

    } else if (chars[htmlIndex] === '>') {
      inTag = false;
      continue;

    } else if (inTag) {
      continue;

    } else if (chars[htmlIndex] === '&') {

      var isValidEscape = true;
      var escapeChars = '&';
      for (var i = htmlIndex + 1; i < chars.length; i++) {
        if (!chars[i] || chars[i] === ' ') {
          isValidEscape = false;
          break;
        } else if (chars[i] === ';') {
          escapeChars += ';';
          break;
        } else {
          escapeChars += chars[i];
        }
      }
      isValidEscape = (isValidEscape && escapeChars.length > 1 && escapeChars.length < 9 && escapeChars[escapeChars.length - 1] === ';');

      if (isValidEscape) {
        chars[htmlIndex] = escapeChars;
        for (let i = 0; i < escapeChars.length - 1; i++) {
          chars.splice(htmlIndex + 1, 1);
        }
      }
    }

    textIndex++;

    if (textIndex < errorCharStart || textIndex >= errorCharStart + errorLength) {
      continue;
    }

    chars[htmlIndex] = `<span class="dev-server-diagnostic-error-chr">${chars[htmlIndex]}</span>`;
  }

  return chars.join('');
}


function prepareLines(orgLines: d.PrintLine[]) {
  const lines: d.PrintLine[] = JSON.parse(JSON.stringify(orgLines));

  for (let i = 0; i < 100; i++) {
    if (!eachLineHasLeadingWhitespace(lines)) {
      return lines;
    }
    for (let i = 0; i < lines.length; i++) {
      lines[i].text = lines[i].text.substr(1);
      lines[i].errorCharStart--;
      if (!lines[i].text.length) {
        return lines;
      }
    }
  }

  return lines;
}


function eachLineHasLeadingWhitespace(lines: d.PrintLine[]) {
  if (!lines.length) {
    return false;
  }

  for (let i = 0; i < lines.length; i++) {
    if (!(lines[i].text) || lines[i].text.length < 1) {
      return false;
    }
    const firstChar = lines[i].text.charAt(0);
    if (firstChar !== ' ' && firstChar !== '\t') {
      return false;
    }
  }

  return true;
}

const DEV_SERVER_MODAL = `dev-server-modal`;
