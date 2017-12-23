/**
 * Adapted from https://github.com/thgh/rollup-plugin-scss
 */
import { existsSync, mkdirSync, writeFile } from 'fs';
import { dirname } from 'path';

export interface ScssOptions {
  dest?: string;
  verbose?: boolean;
  output?: boolean | string;
  processor?: any;
  include?: string[];
  includePaths?: string[];
  failOnError?: boolean;
}

export default function css (options: ScssOptions = {}) {
  const filter = (id: string) => {
    return id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass');
  };
  let dest = options.output;

  const styles: { [key: string]: string } = {};
  let includePaths = options.includePaths || [];
  includePaths.push(process.cwd());

  return {
    name: 'css',
    transform (code: string, id: string) {
      if (!filter(id)) {
        return undefined;
      }

      // When output is disabled, the stylesheet is exported as a string
      if (options.output === false) {
        return {
          code: 'export default ' + JSON.stringify(code),
          map: { mappings: '' }
        };
      }

      // Map of every stylesheet
      styles[id] = code;
      includePaths.push(dirname(id));

      return '';
    },
    ongenerate (opts: ScssOptions) {
      // No stylesheet needed
      if (options.output === false) {
        return;
      }

      // Combine all stylesheets
      let css = '';
      for (const id in styles) {
        css += styles[id] || '';
      }

      // Compile SASS to CSS
      if (css.length) {
        includePaths = includePaths.filter((v, i, a) => a.indexOf(v) === i);
        try {
          css = require('node-sass').renderSync(Object.assign({
            data: css,
            includePaths
          }, options)).css.toString();
        } catch (e) {
          if (options.failOnError) {
            throw e;
          }
          console.log();
          console.log(red('Error:\n\t' + e.message));
          if (e.message.includes('Invalid CSS')) {
            console.log(green('Solution:\n\t' + 'fix your Sass code'));
            console.log('Line:   ' + e.line);
            console.log('Column: ' + e.column);
          }
          if (e.message.includes('node-sass') && e.message.includes('find module')) {
            console.log(green('Solution:\n\t' + 'npm install --save node-sass'));
          }
          if (e.message.includes('node-sass') && e.message.includes('bindigs')) {
            console.log(green('Solution:\n\t' + 'npm rebuild node-sass --force'));
          }
          console.log();
        }
      }

      // Possibly process CSS (e.g. by PostCSS)
      if (typeof options.processor === 'function') {
        css = options.processor(css, styles);
      }

      // Resolve if porcessor returned a Promise
      Promise.resolve(css).then(css => {
        // Emit styles through callback
        if (typeof options.output === 'function') {
          options.output(css, styles);
          return;
        }

        if (typeof dest !== 'string') {
          // Don't create unwanted empty stylesheets
          if (!css.length) {
            return;
          }

          // Guess destination filename
          dest = opts.dest || 'bundle.js';
          if (dest.endsWith('.js')) {
            dest = dest.slice(0, -3);
          }
          dest = dest + '.css';
        }

        // Ensure that dest parent folders exist (create the missing ones)
        ensureParentDirsSync(dirname(dest));

        // Emit styles to file
        writeFile(dest, css, (err) => {
          if (opts.verbose !== false) {
            if (err) {
              console.error(red(err.message));
            } else {
              console.log(green(dest as string), getSize(css.length));
            }
          }
        });
      });
    }
  };
}

function red (text: string) {
  return '\x1b[1m\x1b[31m' + text + '\x1b[0m';
}

function green (text: string) {
  return '\x1b[1m\x1b[32m' + text + '\x1b[0m';
}

function getSize (bytes: number) {
  return bytes < 10000
    ? bytes.toFixed(0) + ' B'
    : bytes < 1024000
    ? (bytes / 1024).toPrecision(3) + ' kB'
    : (bytes / 1024 / 1024).toPrecision(4) + ' MB';
}

function ensureParentDirsSync (dir: string) {
  if (existsSync(dir)) {
    return;
  }

  try {
    mkdirSync(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      ensureParentDirsSync(dirname(dir));
      ensureParentDirsSync(dir);
    }
  }
}
