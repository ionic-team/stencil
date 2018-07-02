import * as d from '../../declarations';
import { DEV_SERVER_URL } from '../util';
import { logDiagnostic } from './logger';
import { updateBuildStatus } from './build-status';


export function appError(doc: Document, buildResults: d.BuildResults) {
  if (!Array.isArray(buildResults.diagnostics)) {
    return;
  }

  const modal = getDevServerModal(doc);

  buildResults.diagnostics.forEach(diagnostic => {
    logDiagnostic(diagnostic);
    appendDiagnostic(doc, modal, diagnostic);
  });

  updateBuildStatus(doc, 'error');
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

function highlightError(text: string, errorCharStart: number, errorLength: number) {
  const errorCharEnd = errorCharStart + errorLength;

  return text.split('').map((inputChar, charIndex) => {
    let outputChar: string;

    if (inputChar === `<`) {
      outputChar = `&lt;`;
    } else if (inputChar === `>`) {
      outputChar = `&gt;`;
    } else if (inputChar === `"`) {
      outputChar = `&quot;`;
    } else if (inputChar === `'`) {
      outputChar = `&#039;`;
    } else if (inputChar === `&`) {
      outputChar = `&amp;`;
    } else {
      outputChar = inputChar;
    }

    if (charIndex >= errorCharStart && charIndex < errorCharEnd) {
      outputChar = `<span class="dev-server-diagnostic-error-chr">${outputChar}</span>`;
    }

    return outputChar;

  }).join('');
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
