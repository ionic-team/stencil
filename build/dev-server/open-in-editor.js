import { responseHeaders } from './dev-server-utils';
import openInEditorApi from './open-in-editor-api';
export async function serveOpenInEditor(serverCtx, req, res) {
    let status = 200;
    const data = {};
    try {
        const editors = await getEditors();
        if (editors.length > 0) {
            await parseData(editors, serverCtx.sys, req, data);
            await openDataInEditor(data);
        }
        else {
            data.error = `no editors available`;
        }
    }
    catch (e) {
        data.error = e + '';
        status = 500;
    }
    serverCtx.logRequest(req, status);
    res.writeHead(status, responseHeaders({
        'content-type': 'application/json; charset=utf-8',
    }));
    res.write(JSON.stringify(data, null, 2));
    res.end();
}
async function parseData(editors, sys, req, data) {
    const qs = req.searchParams;
    if (!qs.has('file')) {
        data.error = `missing file`;
        return;
    }
    data.file = qs.get('file');
    if (qs.has('line') && !isNaN(qs.get('line'))) {
        data.line = parseInt(qs.get('line'), 10);
    }
    if (typeof data.line !== 'number' || data.line < 1) {
        data.line = 1;
    }
    if (qs.has('column') && !isNaN(qs.get('column'))) {
        data.column = parseInt(qs.get('column'), 10);
    }
    if (typeof data.column !== 'number' || data.column < 1) {
        data.column = 1;
    }
    let editor = qs.get('editor');
    if (typeof editor === 'string') {
        editor = editor.trim().toLowerCase();
        if (editors.some((e) => e.id === editor)) {
            data.editor = editor;
        }
        else {
            data.error = `invalid editor: ${editor}`;
            return;
        }
    }
    else {
        data.editor = editors[0].id;
    }
    const stat = await sys.stat(data.file);
    data.exists = stat.isFile;
}
async function openDataInEditor(data) {
    if (!data.exists || data.error) {
        return;
    }
    try {
        const opts = {
            editor: data.editor,
        };
        const editor = openInEditorApi.configure(opts, (err) => (data.error = err + ''));
        if (data.error) {
            return;
        }
        data.open = `${data.file}:${data.line}:${data.column}`;
        await editor.open(data.open);
    }
    catch (e) {
        data.error = e + '';
    }
}
let editors = null;
export function getEditors() {
    if (!editors) {
        editors = new Promise(async (resolve) => {
            const editors = [];
            try {
                await Promise.all(Object.keys(openInEditorApi.editors).map(async (editorId) => {
                    const isSupported = await isEditorSupported(editorId);
                    editors.push({
                        id: editorId,
                        priority: EDITOR_PRIORITY[editorId],
                        supported: isSupported,
                    });
                }));
            }
            catch (e) { }
            resolve(editors
                .filter((e) => e.supported)
                .sort((a, b) => {
                if (a.priority < b.priority)
                    return -1;
                if (a.priority > b.priority)
                    return 1;
                return 0;
            })
                .map((e) => {
                return {
                    id: e.id,
                    name: EDITORS[e.id],
                };
            }));
        });
    }
    return editors;
}
async function isEditorSupported(editorId) {
    let isSupported = false;
    try {
        await openInEditorApi.editors[editorId].detect();
        isSupported = true;
    }
    catch (e) { }
    return isSupported;
}
const EDITORS = {
    atom: 'Atom',
    code: 'Code',
    emacs: 'Emacs',
    idea14ce: 'IDEA 14 Community Edition',
    phpstorm: 'PhpStorm',
    sublime: 'Sublime',
    webstorm: 'WebStorm',
    vim: 'Vim',
    visualstudio: 'Visual Studio',
};
const EDITOR_PRIORITY = {
    code: 1,
    atom: 2,
    sublime: 3,
    visualstudio: 4,
    idea14ce: 5,
    webstorm: 6,
    phpstorm: 7,
    vim: 8,
    emacs: 9,
};
//# sourceMappingURL=open-in-editor.js.map