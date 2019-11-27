import * as d from '../../declarations';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcss, { AcceptedPlugin } from 'postcss';
import { catchError } from '@utils';


export const optimizeCssWorker = async (inputOpts: d.OptimizeCssInput) => {
  const output: d.OptimizeCssOutput = {
    css: inputOpts.css,
    diagnostics: []
  };

  try {
    const plugins: AcceptedPlugin[] = [];

    if (inputOpts.autoprefixer !== false && inputOpts.autoprefixer !== null) {
      const autoprefixerOpts = (inputOpts.autoprefixer != null && typeof inputOpts.autoprefixer === 'object') ?
        inputOpts.autoprefixer :
        DEFAULT_AUTOPREFIX_LEGACY;

      plugins.push(autoprefixer(autoprefixerOpts));
    }

    if (inputOpts.minify) {
      const cssnanoPlugin = cssnano({
        preset: 'default'
      });
      plugins.push(cssnanoPlugin);
    }

    if (plugins.length === 0) {
      return output;
    }

    const processor = postcss(plugins);

    try {
      const result = await processor.process(inputOpts.css, {
        map: null,
        from: inputOpts.filePath
      });

      result.warnings().forEach(warning => {
        output.diagnostics.push({
          header: `Optimize CSS: ${warning.plugin}`,
          messageText: warning.text,
          level: 'warn',
          type: 'css',
          absFilePath: inputOpts.filePath
        });
      });

      output.css = result.css;

    } catch (e) {
      const diagnostic: d.Diagnostic = {
        header: `Optimize CSS`,
        messageText: `CSS Error` + e,
        level: `error`,
        type: `css`,
        absFilePath: inputOpts.filePath
      };

      if (typeof e.name === 'string') {
        diagnostic.header = e.name;
      }

      if (typeof e.reason === 'string') {
        diagnostic.messageText = e.reason;
      }

      if (typeof e.source === 'string' && typeof e.line === 'number') {
        const lines = (e.source as string).replace(/\r/g, '\n').split('\n');

        if (lines.length > 0) {
          const addLine = (lineNumber: number) => {
            const line = lines[lineNumber];
            if (typeof line === 'string') {
              const printLine: d.PrintLine = {
                lineIndex: -1,
                lineNumber: -1,
                text: line,
                errorCharStart: -1,
                errorLength: -1
              };
              diagnostic.lines = diagnostic.lines || [];
              diagnostic.lines.push(printLine);
            }
          };

          addLine(e.line - 3);
          addLine(e.line - 2);
          addLine(e.line - 1);
          addLine(e.line);
          addLine(e.line + 1);
          addLine(e.line + 2);
          addLine(e.line + 3);
        }
      }

      output.diagnostics.push(diagnostic);
    }

  } catch (e) {
    catchError(output.diagnostics, e);
  }

  return output;
};


const DEFAULT_AUTOPREFIX_LEGACY = {
  overrideBrowserslist: [
    'last 2 versions',
    'iOS >= 9',
    'Android >= 4.4',
    'Explorer >= 11',
    'ExplorerMobile >= 11'
  ],
  cascade: false,
  remove: false,
  flexbox: 'no-2009'
};
