// import { Diagnostic, PrintLine } from '../util/interfaces';
// import { escapeHtml, splitLineBreaks } from '../util/helpers';
// import { generateCodeBlock, getDiagnosticsHtmlContent } from './logger-diagnostics';
// import { highlight } from '../highlight/highlight';
// import { readFileSync } from 'fs';
// import { resolve , normalize} from 'path';


// export function generateRuntimeDiagnosticContent(rootDir: string, buildDir: string, runtimeErrorMessage: string, runtimeErrorStack: string) {
//   let c: string[] = [];

//   c.push(`<div class="ion-diagnostic">`);
//   c.push(`<div class="ion-diagnostic-masthead">`);
//   c.push(`<div class="ion-diagnostic-header">Runtime Error</div>`);

//   if (runtimeErrorMessage) {
//     runtimeErrorMessage = runtimeErrorMessage.replace(/inline template:\d+:\d+/g, '');
//     runtimeErrorMessage = runtimeErrorMessage.replace('inline template', '');

//     c.push(`<div class="ion-diagnostic-message">${escapeHtml(runtimeErrorMessage)}</div>`);
//   }
//   c.push(`</div>`); // .ion-diagnostic-masthead

//   const diagnosticsHtmlCache = generateRuntimeStackDiagnostics(rootDir, runtimeErrorStack);
//   diagnosticsHtmlCache.forEach(d => {
//     c.push(generateCodeBlock(d));
//   });

//   if (runtimeErrorStack) {
//     c.push(`<div class="ion-diagnostic-stack-header">Stack</div>`);
//     c.push(`<div class="ion-diagnostic-stack">${escapeHtml(runtimeErrorStack)}</div>`);
//   }

//   c.push(`</div>`); // .ion-diagnostic

//   return getDiagnosticsHtmlContent(buildDir, c.join('\n'));
// }


// export function generateRuntimeStackDiagnostics(rootDir: string, stack: string) {
//   const diagnostics: Diagnostic[] = [];

//   if (stack) {
//     splitLineBreaks(stack).forEach(stackLine => {
//       try {
//         const match = WEBPACK_FILE_REGEX.exec(stackLine);
//         if (!match) return;

//         const fileSplit = match[1].split('?');
//         if (fileSplit.length !== 2) return;

//         const linesSplit = fileSplit[1].split(':');
//         if (linesSplit.length !== 3) return;

//         const fileName = fileSplit[0];
//         if (fileName.indexOf('~') > -1) return;

//         const errorLineNumber = parseInt(linesSplit[1], 10);
//         const errorCharNumber = parseInt(linesSplit[2], 10);

//         const d: Diagnostic = {
//           level: 'error',
//           language: 'typescript',
//           type: 'runtime',
//           header: '',
//           code: 'runtime',
//           messageText: '',
//           absFileName: resolve(rootDir, fileName),
//           relFileName: normalize(fileName),
//           lines: []
//         };

//         const sourceText = readFileSync(d.absFileName, 'utf8');
//         const srcLines = splitLineBreaks(sourceText);
//         if (!srcLines.length || errorLineNumber >= srcLines.length) return;

//         let htmlLines = srcLines;

//         try {
//           htmlLines = splitLineBreaks(highlight(d.language, sourceText, true).value);
//         } catch (e) {}

//         const errorLine: PrintLine = {
//           lineIndex: errorLineNumber - 1,
//           lineNumber: errorLineNumber,
//           text: srcLines[errorLineNumber - 1],
//           html: htmlLines[errorLineNumber - 1],
//           errorCharStart: errorCharNumber + 1,
//           errorLength: 1
//         };

//         if (errorLine.html.indexOf('class="hljs') === -1) {
//           try {
//             errorLine.html = highlight(d.language, errorLine.text, true).value;
//           } catch (e) {}
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

//         if (errorLine.lineIndex < srcLines.length) {
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

//         diagnostics.push(d);

//       } catch (e) {}
//     });
//   }

//   return diagnostics;
// }

// const WEBPACK_FILE_REGEX = /\(webpack:\/\/\/(.*?)\)/;
