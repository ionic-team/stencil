// import { BuildContext, Diagnostic, PrintLine } from '../util/interfaces';
// import { highlight } from '../highlight/highlight';
// import { Logger } from './logger';
// import { readFileSync } from 'fs';
// import { SassError } from 'node-sass';
// import { splitLineBreaks } from '../util/helpers';


// export function runSassDiagnostics(context: BuildContext, sassError: SassError) {
//   if (!sassError) {
//     return [];
//   }

//   const d: Diagnostic = {
//     level: 'error',
//     type: 'sass',
//     language: 'scss',
//     header: 'sass error',
//     code: sassError.status && sassError.status.toString(),
//     relFileName: null,
//     absFileName: null,
//     messageText: sassError.message,
//     lines: []
//   };

//   if (sassError.file) {
//     d.absFileName = sassError.file;
//     d.relFileName = Logger.formatFileName(context.rootDir, d.absFileName);
//     d.header = Logger.formatHeader('sass', d.absFileName, context.rootDir, sassError.line);

//     if (sassError.line > -1) {
//       try {
//         const sourceText = readFileSync(d.absFileName, 'utf8');
//         const srcLines = splitLineBreaks(sourceText);
//         let htmlLines = srcLines;

//         try {
//           htmlLines = splitLineBreaks(highlight(d.language, sourceText, true).value);
//         } catch (e) {}

//         const errorLine: PrintLine = {
//           lineIndex: sassError.line - 1,
//           lineNumber: sassError.line,
//           text: srcLines[sassError.line - 1],
//           html: htmlLines[sassError.line - 1],
//           errorCharStart: sassError.column,
//           errorLength: 0
//         };

//         if (errorLine.html.indexOf('class="hljs') === -1) {
//           try {
//             errorLine.html = highlight(d.language, errorLine.text, true).value;
//           } catch (e) {}
//         }

//         for (let i = errorLine.errorCharStart; i >= 0; i--) {
//           if (STOP_CHARS.indexOf(errorLine.text.charAt(i)) > -1) {
//             break;
//           }
//           errorLine.errorCharStart = i;
//         }

//         for (let j = errorLine.errorCharStart; j <= errorLine.text.length; j++) {
//           if (STOP_CHARS.indexOf(errorLine.text.charAt(j)) > -1) {
//             break;
//           }
//           errorLine.errorLength++;
//         }

//         if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
//           errorLine.errorLength = 1;
//           errorLine.errorCharStart--;
//         }

//         d.lines.push(errorLine);

//         if (errorLine.lineIndex > 0) {
//           const previousLine: PrintLine = {
//             lineIndex: errorLine.lineIndex - 1,
//             lineNumber: errorLine.lineNumber - 1,
//             text: srcLines[errorLine.lineIndex - 1],
//             html: htmlLines[errorLine.lineIndex - 1],
//             errorCharStart: -1,
//             errorLength: -1
//           };

//           if (previousLine.html.indexOf('class="hljs') === -1) {
//             try {
//               previousLine.html = highlight(d.language, previousLine.text, true).value;
//             } catch (e) {}
//           }

//           d.lines.unshift(previousLine);
//         }

//         if (errorLine.lineIndex + 1 < srcLines.length) {
//           const nextLine: PrintLine = {
//             lineIndex: errorLine.lineIndex + 1,
//             lineNumber: errorLine.lineNumber + 1,
//             text: srcLines[errorLine.lineIndex + 1],
//             html: htmlLines[errorLine.lineIndex + 1],
//             errorCharStart: -1,
//             errorLength: -1
//           };

//           if (nextLine.html.indexOf('class="hljs') === -1) {
//             try {
//               nextLine.html = highlight(d.language, nextLine.text, true).value;
//             } catch (e) {}
//           }

//           d.lines.push(nextLine);
//         }

//       } catch (e) {
//         Logger.debug(`sass loadDiagnostic, ${e}`);
//       }
//     }

//   }

//   return [d];
// }

// const STOP_CHARS = ['', '\n', '\r', '\t', ' ', ':', ';', ',', '{', '}', '.', '#', '@', '!', '[', ']', '(', ')', '&', '+', '~', '^', '*', '$'];
