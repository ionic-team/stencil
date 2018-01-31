import * as d from '../../declarations/index';
const nodeSass = require('node-sass');


export class StyleSassPlugin implements d.Plugin {

  constructor(private renderOpts: RenderOptions = {}) {}

  async transform(sourceText: string, id: string, context: d.PluginCtx): Promise<d.PluginTransformResults> {
    if (!this.usePlugin(id)) {
      return null;
    }

    const renderOpts = Object.assign({}, context.config.sassConfig || {}, this.renderOpts);
    renderOpts.data = sourceText;
    if (!renderOpts.outputStyle) {
      renderOpts.outputStyle = 'expanded';
    }
    renderOpts.includePaths = renderOpts.includePaths || [];

    const dirName = context.sys.path.dirname(id);
    renderOpts.includePaths.push(dirName);

    const results: d.PluginTransformResults = {};

    // create what the new path is post transform (.css)
    const pathParts = id.split('.');
    pathParts.pop();
    pathParts.push('css');
    results.id = pathParts.join('.');

    if (sourceText.trim() === '') {
      results.code = '';
      return results;
    }

    const cacheKey = context.cache.createKey(this.name, renderOpts);
    const cachedContent = await context.cache.get(cacheKey);

    if (cachedContent != null) {
      results.code = cachedContent;
      return results;
    }

    results.code = await new Promise<string>(resolve => {

      nodeSass.render(renderOpts, async (err: any, sassResult: any) => {
        if (err) {
          loadDiagnostic(context, err, id);
          resolve(`/**  sass error${err && err.message ? ': ' + err.message : ''}  **/`);

        } else {
          const css = sassResult.css.toString();

          // write this css content to memory only so it can be referenced
          // later by other plugins (minify css)
          // but no need to actually write to disk
          await context.fs.writeFile(results.id, css, { inMemoryOnly: true });
          resolve(css);
        }
      });
    });

    await context.cache.put(cacheKey, results.code);

    return results;
  }

  usePlugin(id: string) {
    return /(.scss|.sass)$/i.test(id);
  }

  get name() {
    return 'StyleSassPlugin';
  }

}


function loadDiagnostic(context: d.PluginCtx, sassError: any, filePath: string) {
  if (!sassError || !context) {
    return;
  }

  const d: d.Diagnostic = {
    level: 'error',
    type: 'sass',
    language: 'scss',
    header: 'sass error',
    code: sassError.status && sassError.status.toString(),
    relFilePath: null,
    absFilePath: null,
    messageText: sassError.message,
    lines: []
  };

  if (filePath) {
    d.absFilePath = filePath;
    d.relFilePath = formatFileName(context.config.rootDir, d.absFilePath);
    d.header = formatHeader('sass', d.absFilePath, context.config.rootDir, sassError.line);

    if (sassError.line > -1) {
      try {
        const sourceText = context.fs.readFileSync(d.absFilePath);
        const srcLines = sourceText.split(/(\r?\n)/);

        const errorLine: d.PrintLine = {
          lineIndex: sassError.line - 1,
          lineNumber: sassError.line,
          text: srcLines[sassError.line - 1],
          errorCharStart: sassError.column,
          errorLength: 0
        };

        for (let i = errorLine.errorCharStart; i >= 0; i--) {
          if (STOP_CHARS.indexOf(errorLine.text.charAt(i)) > -1) {
            break;
          }
          errorLine.errorCharStart = i;
        }

        for (let j = errorLine.errorCharStart; j <= errorLine.text.length; j++) {
          if (STOP_CHARS.indexOf(errorLine.text.charAt(j)) > -1) {
            break;
          }
          errorLine.errorLength++;
        }

        if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
          errorLine.errorLength = 1;
          errorLine.errorCharStart--;
        }

        d.lines.push(errorLine);

        if (errorLine.lineIndex > 0) {
          const previousLine: d.PrintLine = {
            lineIndex: errorLine.lineIndex - 1,
            lineNumber: errorLine.lineNumber - 1,
            text: srcLines[errorLine.lineIndex - 1],
            errorCharStart: -1,
            errorLength: -1
          };

          d.lines.unshift(previousLine);
        }

        if (errorLine.lineIndex + 1 < srcLines.length) {
          const nextLine: d.PrintLine = {
            lineIndex: errorLine.lineIndex + 1,
            lineNumber: errorLine.lineNumber + 1,
            text: srcLines[errorLine.lineIndex + 1],
            errorCharStart: -1,
            errorLength: -1
          };

          d.lines.push(nextLine);
        }

      } catch (e) {
        console.error(`StyleSassPlugin loadDiagnostic, ${e}`);
      }
    }

  }

  context.diagnostics.push(d);
}


function formatFileName(rootDir: string, fileName: string) {
  if (!rootDir || !fileName) return '';

  fileName = fileName.replace(rootDir, '');
  if (/\/|\\/.test(fileName.charAt(0))) {
    fileName = fileName.substr(1);
  }
  if (fileName.length > 80) {
    fileName = '...' + fileName.substr(fileName.length - 80);
  }
  return fileName;
}


function formatHeader(type: string, fileName: string, rootDir: string, startLineNumber: number = null, endLineNumber: number = null) {
  let header = `${type}: ${formatFileName(rootDir, fileName)}`;

  if (startLineNumber !== null && startLineNumber > 0) {
    if (endLineNumber !== null && endLineNumber > startLineNumber) {
      header += `, lines: ${startLineNumber} - ${endLineNumber}`;
    } else {
      header += `, line: ${startLineNumber}`;
    }
  }

  return header;
}


const STOP_CHARS = ['', '\n', '\r', '\t', ' ', ':', ';', ',', '{', '}', '.', '#', '@', '!', '[', ']', '(', ')', '&', '+', '~', '^', '*', '$'];


export interface RenderOptions {
  file?: string;
  data?: string;
  functions?: { [key: string]: Function };
  includePaths?: string[];
  indentedSyntax?: boolean;
  indentType?: string;
  indentWidth?: number;
  linefeed?: string;
  omitSourceMapUrl?: boolean;
  outFile?: string;
  outputStyle?: 'compact' | 'compressed' | 'expanded' | 'nested';
  precision?: number;
  sourceComments?: boolean;
  sourceMap?: boolean | string;
  sourceMapContents?: boolean;
  sourceMapEmbed?: boolean;
  sourceMapRoot?: string;
}
