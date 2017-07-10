// import { IRuleFailurePositionJson, RuleFailure } from 'tslint';
// import { splitLineBreaks } from '../util/helpers';
// import { BuildContext, Diagnostic, PrintLine } from '../util/interfaces';
// import { Logger } from './logger';


// const STOP_CHARS = [' ', '=', ',', '.', '\t', '{', '}', '(', ')', '"', '\'', '`', '?', ':', ';', '+', '-', '*', '/', '<', '>', '&', '[', ']', '|'];


// export function runTsLintDiagnostics(context: BuildContext, failures: RuleFailure[]) {
//   return failures.map(failure => loadDiagnostic(context, failure));
// }


// export function loadDiagnostic(context: BuildContext, failure: RuleFailure) {
//   const start: IRuleFailurePositionJson = failure.getStartPosition()
//     .toJson();
//   const end: IRuleFailurePositionJson = failure.getEndPosition()
//     .toJson();
//   const fileName = failure.getFileName();
//   const sourceFile = failure.getRawLines();

//   const d: Diagnostic = {
//     level: 'warn',
//     type: 'tslint',
//     language: 'typescript',
//     absFileName: fileName,
//     relFileName: Logger.formatFileName(context.rootDir, fileName),
//     header: Logger.formatHeader('tslint', fileName, context.rootDir, start.line + 1, end.line + 1),
//     code: failure.getRuleName(),
//     messageText: failure.getFailure(),
//     lines: []
//   };

//   if (sourceFile) {
//     const srcLines = splitLineBreaks(sourceFile);

//     for (let i = start.line; i <= end.line; i++) {
//       if (srcLines[i].trim().length) {
//         const errorLine: PrintLine = {
//           lineIndex: i,
//           lineNumber: i + 1,
//           text: srcLines[i],
//           html: srcLines[i],
//           errorCharStart: (i === start.line) ? start.character : (i === end.line) ? end.character : -1,
//           errorLength: 0,
//         };
//         for (let j = errorLine.errorCharStart; j < errorLine.text.length; j++) {
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
//       }
//     }

//     if (start.line > 0) {
//       const beforeLine: PrintLine = {
//         lineIndex: start.line - 1,
//         lineNumber: start.line,
//         text: srcLines[start.line - 1],
//         html: srcLines[start.line - 1],
//         errorCharStart: -1,
//         errorLength: -1
//       };
//       d.lines.unshift(beforeLine);
//     }

//     if (end.line < srcLines.length) {
//       const afterLine: PrintLine = {
//         lineIndex: end.line + 1,
//         lineNumber: end.line + 2,
//         text: srcLines[end.line + 1],
//         html: srcLines[end.line + 1],
//         errorCharStart: -1,
//         errorLength: -1
//       };
//       d.lines.push(afterLine);
//     }
//   }

//   return d;
// }
