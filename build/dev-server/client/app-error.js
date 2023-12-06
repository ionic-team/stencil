import appErrorCss from './app-error.css';
export const appError = (data) => {
    const results = {
        diagnostics: [],
        status: null,
    };
    if (data && data.window && Array.isArray(data.buildResults.diagnostics)) {
        const diagnostics = data.buildResults.diagnostics.filter((diagnostic) => diagnostic.level === 'error');
        if (diagnostics.length > 0) {
            const modal = getDevServerModal(data.window.document);
            diagnostics.forEach((diagnostic) => {
                results.diagnostics.push(diagnostic);
                appendDiagnostic(data.window.document, data.openInEditor, modal, diagnostic);
            });
            results.status = 'error';
        }
    }
    return results;
};
const appendDiagnostic = (doc, openInEditor, modal, diagnostic) => {
    var _a, _b, _c, _d;
    const card = doc.createElement('div');
    card.className = 'dev-server-diagnostic';
    const masthead = doc.createElement('div');
    masthead.className = 'dev-server-diagnostic-masthead';
    masthead.title = `${escapeHtml(diagnostic.type)} error: ${escapeHtml((_a = diagnostic.code) !== null && _a !== void 0 ? _a : 'unknown error')}`;
    card.appendChild(masthead);
    const title = doc.createElement('div');
    title.className = 'dev-server-diagnostic-title';
    if (typeof diagnostic.header === 'string' && diagnostic.header.trim().length > 0) {
        title.textContent = diagnostic.header;
    }
    else {
        title.textContent = `${titleCase(diagnostic.type)} ${titleCase(diagnostic.level)}`;
    }
    masthead.appendChild(title);
    const message = doc.createElement('div');
    message.className = 'dev-server-diagnostic-message';
    message.textContent = diagnostic.messageText;
    masthead.appendChild(message);
    const file = doc.createElement('div');
    file.className = 'dev-server-diagnostic-file';
    card.appendChild(file);
    const isUrl = typeof diagnostic.absFilePath === 'string' && diagnostic.absFilePath.indexOf('http') === 0;
    const canOpenInEditor = typeof openInEditor === 'function' && typeof diagnostic.absFilePath === 'string' && !isUrl;
    if (isUrl) {
        const fileHeader = doc.createElement('a');
        fileHeader.href = (_b = diagnostic.absFilePath) !== null && _b !== void 0 ? _b : '';
        fileHeader.setAttribute('target', '_blank');
        fileHeader.setAttribute('rel', 'noopener noreferrer');
        fileHeader.className = 'dev-server-diagnostic-file-header';
        const filePath = doc.createElement('span');
        filePath.className = 'dev-server-diagnostic-file-path';
        filePath.textContent = (_c = diagnostic.absFilePath) !== null && _c !== void 0 ? _c : '';
        fileHeader.appendChild(filePath);
        file.appendChild(fileHeader);
    }
    else if (diagnostic.relFilePath) {
        const fileHeader = doc.createElement(canOpenInEditor ? 'a' : 'div');
        fileHeader.className = 'dev-server-diagnostic-file-header';
        if (diagnostic.absFilePath) {
            fileHeader.title = escapeHtml(diagnostic.absFilePath);
            if (canOpenInEditor) {
                addOpenInEditor(openInEditor, fileHeader, diagnostic.absFilePath, diagnostic.lineNumber, diagnostic.columnNumber);
            }
        }
        const parts = diagnostic.relFilePath.split('/');
        const fileName = doc.createElement('span');
        fileName.className = 'dev-server-diagnostic-file-name';
        fileName.textContent = (_d = parts.pop()) !== null && _d !== void 0 ? _d : '';
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
        prepareLines(diagnostic.lines).forEach((l) => {
            var _a, _b, _c;
            const tr = doc.createElement('tr');
            if (l.errorCharStart > 0) {
                tr.classList.add('dev-server-diagnostic-error-line');
            }
            if (canOpenInEditor) {
                tr.classList.add('dev-server-diagnostic-open-in-editor');
            }
            table.appendChild(tr);
            const tdNum = doc.createElement('td');
            tdNum.className = 'dev-server-diagnostic-blob-num';
            if (l.lineNumber > 0) {
                tdNum.setAttribute('data-line-number', l.lineNumber + '');
                tdNum.title = escapeHtml((_a = diagnostic.relFilePath) !== null && _a !== void 0 ? _a : '') + ', line ' + l.lineNumber;
                const maybeFile = diagnostic.absFilePath;
                if (canOpenInEditor && maybeFile) {
                    const column = l.lineNumber === diagnostic.lineNumber ? diagnostic.columnNumber : 1;
                    addOpenInEditor(openInEditor, tdNum, maybeFile, l.lineNumber, column);
                }
            }
            tr.appendChild(tdNum);
            const tdCode = doc.createElement('td');
            tdCode.className = 'dev-server-diagnostic-blob-code';
            tdCode.innerHTML = highlightError((_b = l.text) !== null && _b !== void 0 ? _b : '', l.errorCharStart, (_c = l.errorLength) !== null && _c !== void 0 ? _c : 0);
            tr.appendChild(tdCode);
        });
    }
    modal.appendChild(card);
};
const addOpenInEditor = (openInEditor, elm, file, line, column) => {
    if (elm.tagName === 'A') {
        elm.href = '#open-in-editor';
    }
    const lineNumber = typeof line !== 'number' || line < 1 ? 1 : line;
    const columnNumber = typeof column !== 'number' || column < 1 ? 1 : column;
    elm.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openInEditor({
            file: file,
            line: lineNumber,
            column: columnNumber,
        });
    });
};
const getDevServerModal = (doc) => {
    let outer = doc.getElementById(DEV_SERVER_MODAL);
    if (!outer) {
        outer = doc.createElement('div');
        outer.id = DEV_SERVER_MODAL;
        outer.setAttribute('role', 'dialog');
        doc.body.appendChild(outer);
    }
    outer.innerHTML = `<style>${appErrorCss}</style><div id="${DEV_SERVER_MODAL}-inner"></div>`;
    return doc.getElementById(`${DEV_SERVER_MODAL}-inner`);
};
export const clearAppErrorModal = (data) => {
    const appErrorElm = data.window.document.getElementById(DEV_SERVER_MODAL);
    if (appErrorElm === null || appErrorElm === void 0 ? void 0 : appErrorElm.parentNode) {
        appErrorElm.parentNode.removeChild(appErrorElm);
    }
};
const escapeHtml = (unsafe) => {
    if (typeof unsafe === 'number' || typeof unsafe === 'boolean') {
        return unsafe.toString();
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
};
const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const highlightError = (text, errorCharStart, errorLength) => {
    if (typeof text !== 'string') {
        return '';
    }
    const errorCharEnd = errorCharStart + errorLength;
    return text
        .split('')
        .map((inputChar, charIndex) => {
        let outputChar;
        if (inputChar === `<`) {
            outputChar = `&lt;`;
        }
        else if (inputChar === `>`) {
            outputChar = `&gt;`;
        }
        else if (inputChar === `"`) {
            outputChar = `&quot;`;
        }
        else if (inputChar === `'`) {
            outputChar = `&#039;`;
        }
        else if (inputChar === `&`) {
            outputChar = `&amp;`;
        }
        else {
            outputChar = inputChar;
        }
        if (charIndex >= errorCharStart && charIndex < errorCharEnd) {
            outputChar = `<span class="dev-server-diagnostic-error-chr">${outputChar}</span>`;
        }
        return outputChar;
    })
        .join('');
};
const prepareLines = (orgLines) => {
    var _a, _b, _c;
    const lines = JSON.parse(JSON.stringify(orgLines));
    for (let i = 0; i < 100; i++) {
        if (!eachLineHasLeadingWhitespace(lines)) {
            return lines;
        }
        for (let i = 0; i < lines.length; i++) {
            lines[i].text = (_b = (_a = lines[i].text) === null || _a === void 0 ? void 0 : _a.slice(1)) !== null && _b !== void 0 ? _b : '';
            lines[i].errorCharStart--;
            if (!((_c = lines[i].text) === null || _c === void 0 ? void 0 : _c.length)) {
                return lines;
            }
        }
    }
    return lines;
};
const eachLineHasLeadingWhitespace = (lines) => {
    var _a, _b, _c;
    if (!lines.length) {
        return false;
    }
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].text || ((_b = (_a = lines[i].text) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < 1) {
            return false;
        }
        const firstChar = (_c = lines[i].text) === null || _c === void 0 ? void 0 : _c.charAt(0);
        if (firstChar !== ' ' && firstChar !== '\t') {
            return false;
        }
    }
    return true;
};
const DEV_SERVER_MODAL = `dev-server-modal`;
//# sourceMappingURL=app-error.js.map