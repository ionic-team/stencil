import * as d from '../declarations';
import * as util from './util';
import * as http  from 'http';
import * as path  from 'path';
import * as querystring  from 'querystring';
import * as url  from 'url';

const oie = require(path.join(__dirname, '..', 'sys', 'node', 'open-in-editor.js'));


export async function serveOpenInEditor(fs: d.FileSystem, req: d.HttpRequest, res: http.ServerResponse) {
  let status = 200;

  const data: OpenInEditorResponse = {};

  try {
    data.editors = await getEditors();

    if (data.editors.length > 0) {
      await parseData(fs, req, data);
      await openInEditor(data);
    }

  } catch (e) {
    data.error = e + '';
    status = 500;
  }

  res.writeHead(status, util.responseHeaders({
    'Content-Type': 'application/json'
  }));

  res.write(JSON.stringify(data, null, 2));
  res.end();
}


async function parseData(fs: d.FileSystem, req: d.HttpRequest, data: OpenInEditorResponse) {
  const query = url.parse(req.url).query;
  const qs = querystring.parse(query) as any;

  if (typeof qs.file !== 'string') {
    return;
  }

  data.file = qs.file;

  if (qs.line != null && !isNaN(qs.line)) {
    data.line = parseInt(qs.line, 10);
  } else {
    data.line = 1;
  }

  if (qs.column != null && !isNaN(qs.column)) {
    data.column = parseInt(qs.column, 10);
  } else {
    data.column = 1;
  }

  if (typeof qs.editor === 'string') {
    qs.editor = qs.editor.trim().toLowerCase();
    if (data.editors.some(e => e.id === qs.editor)) {
      data.editor = qs.editor;
    } else {
      data.error = `invalid editor: ${qs.editor}`;
      return;
    }
  } else {
    data.editor = data.editors[0].id;
  }

  try {
    const stat = await fs.stat(data.file);
    data.exists = stat.isFile();
  } catch (e) {
    data.exists = false;
  }
}


async function openInEditor(data: OpenInEditorResponse) {
  if (!data.exists || data.error) {
    return;
  }

  try {

    const opts: any = {
      editor: data.editor
    };

    const editor = oie.openInEditor.configure(opts, (err: any) => data.error = err + '');

    if (data.error) {
      return;
    }

    data.open = `${data.file}:${data.line}:${data.column}`;

    await editor.open(data.open);

  } catch (e) {
    data.error = e + '';
  }
}


export async function getEditors() {
  const editors: Editor[] = [];

  await Promise.all(Object.keys(oie.editors).map(async id => {
    const isSupported = await isEditorSupported(id);

    editors.push({
      id: id,
      priority: EDITOR_PRIORITY[id],
      supported: isSupported
    });
  }));

  return editors
    .filter(e => e.supported)
    .sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    }).map(e => {
      return {
        id: e.id,
        name: EDITORS[e.id]
      } as Editor;
    });
}


async function isEditorSupported(editor: string) {
  let isSupported = false;

  try {
    await oie.editors[editor].detect();
    isSupported = true;
  } catch (e) {}

  return isSupported;
}


const EDITORS: {[editor: string]: string} = {
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


const EDITOR_PRIORITY: {[editor: string]: number} = {
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


interface OpenInEditorResponse {
  file?: string;
  line?: number;
  column?: number;
  open?: string;
  editor?: string;
  editors?: Editor[];
  exists?: boolean;
  error?: string;
}


interface Editor {
  id: string;
  name?: string;
  supported?: boolean;
  priority?: number;
}
