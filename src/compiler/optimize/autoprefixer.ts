import * as d from '../../declarations';
import { IS_NODE_ENV, requireFunc } from '@utils';

let cssProcessor: any;

export const autoprefixCss = async (cssText: string, opts: any) => {
  const output: d.OptimizeCssOutput = {
    output: cssText,
    diagnostics: [],
  };
  if (!IS_NODE_ENV) {
    return output;
  }

  try {
    const autoprefixerOpts = opts != null && typeof opts === 'object' ? opts : DEFAULT_AUTOPREFIX_LEGACY;

    const processor = getProcessor(autoprefixerOpts);
    const result = await processor.process(cssText, { map: null });

    result.warnings().forEach((warning: any) => {
      output.diagnostics.push({
        header: `Autoprefix CSS: ${warning.plugin}`,
        messageText: warning.text,
        level: 'warn',
        type: 'css',
      });
    });

    output.output = result.css;
  } catch (e) {
    const diagnostic: d.Diagnostic = {
      header: `Autoprefix CSS`,
      messageText: `CSS Error` + e,
      level: `error`,
      type: `css`,
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
              errorLength: -1,
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

  return output;
};

const getProcessor = (autoprefixerOpts: any) => {
  const { postcss, autoprefixer } = requireFunc('../sys/node/autoprefixer.js');
  if (!cssProcessor) {
    cssProcessor = postcss([autoprefixer(autoprefixerOpts)]);
  }
  return cssProcessor;
};

const DEFAULT_AUTOPREFIX_LEGACY = {
  overrideBrowserslist: ['last 2 versions', 'iOS >= 9', 'Android >= 4.4', 'Explorer >= 11', 'ExplorerMobile >= 11'],
  cascade: false,
  remove: false,
  flexbox: 'no-2009',
};
