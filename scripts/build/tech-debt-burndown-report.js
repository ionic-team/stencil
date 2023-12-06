"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A script for formatting a Markdown report for CI on some quantities we're tracking as we work
 * on tech debt on the current branch vs on main. The report includes some info about strictNullChecks errors,
 * as well as tracking unused (dead) code.
 */
const fs_1 = __importDefault(require("fs"));
/**
 * Load JSON data, formatted by `tsc-output-parser`
 *
 * In the GH Actions workflow we write two JSON files, one for the PR
 * branch and one for main (so that we can compare them).
 *
 */
const prData = JSON.parse(String(fs_1.default.readFileSync('./null_errors_pr.json')));
const mainData = JSON.parse(String(fs_1.default.readFileSync('./null_errors_main.json')));
const errorsOnMainCount = mainData.length;
const errorsOnPRCount = prData.length;
/**
 * Build a map which just counts the entries in an array
 *
 * @param arr the array whose entries we're going to count
 * @returns a map of counts for `arr`
 */
const countArrayEntries = (arr) => {
    const counts = new Map();
    arr.forEach((entry) => {
        counts.set(entry, (counts.get(entry) ?? 0) + 1);
    });
    return counts;
};
const fileErrorCounts = countArrayEntries(prData.map((error) => error.value.path.value));
const errorCodeCounts = countArrayEntries(prData.map((error) => error.value.tsError.value.errorString));
//// unused exports check ////
// TODO(STENCIL-454): Remove or change up this report once we've eliminated unused exports
/**
 * ts-prune includes this string on lines in its output corresponding to items
 * which are exported and not imported anywhere but which *are* used in their
 * home modules. We want to exclude these and get only the truly dead code.
 */
const USED_IN_MODULE = '(used in module)';
/**
 * Load in data from the unused exports reports
 */
const unusedExportsMain = String(fs_1.default.readFileSync('./unused-exports-main.txt'));
const unusedExportsPR = String(fs_1.default.readFileSync('./unused-exports-pr.txt'));
/**
 * Process and format the raw output from ts-prune into a more coherent format.
 * @param rawFileContents the unprocessed contents of the file
 * @returns an array of dead code location records.
 */
function processUnusedExports(rawFileContents) {
    const deadCodeLines = rawFileContents
        .trim()
        .split('\n')
        .filter((line) => !line.includes(USED_IN_MODULE));
    return deadCodeLines.map((line) => {
        // lines which are _not_ used in their home module are formatted like this:
        // path/to/module.ts:33 - identifierName
        const [fileAndLineNumber, identifier] = line.split(' - ');
        const [fileName, lineNumber] = fileAndLineNumber.split(':');
        return {
            fileName,
            lineNumber,
            identifier,
        };
    });
}
const deadCodeMain = processUnusedExports(unusedExportsMain);
const deadCodePR = processUnusedExports(unusedExportsPR);
// Markdown formatting helpers
/**
 * This makes it straightforward to create a collapsible section in GFM
 * Just pass in a callback which expects an array to push lines onto
 *
 * @param title the title for this collapsible section
 * @param contentCb a callback which is used by the caller to define the section's contents
 * @param lineBreak an (optional) param for setting the line break delimiter
 * @returns the collapsible section, ready for inclusion in a larger markdown context
 */
const collapsible = (title, contentCb, lineBreak = '\n') => {
    const out = [`<details><summary>${title}</summary>`, ''];
    contentCb(out);
    out.push('');
    out.push('</details>');
    return out.join(lineBreak);
};
/**
 * Format a basic table header for GFM
 *
 * @param colNames column names to be formatted into the table
 * @returns a formatted table header
 */
const tableHeader = (...colNames) => [tableRow(...colNames), tableRow(...colNames.map((_) => '---'))].join('\n');
/**
 * Format a GFM table row
 *
 * this looks like `| cell | cell |`
 *
 * @param entries for this row
 * @returns a formatted row
 */
const tableRow = (...entries) => '| ' + entries.join(' | ') + ' |';
/**
 * Helper function get a reverse-sort of the entries in our
 * 'count' maps (the return value of `countArrayEntries`)
 *
 * @param countMap is a map of counts (which we plan to sort)
 * @returns the entries of `countMap`, sorted in descending order by the count
 */
const sortEntries = (countMap) => [...countMap.entries()].sort((a, b) => {
    if (a[1] < b[1]) {
        return 1;
    }
    if (a[1] > b[1]) {
        return -1;
    }
    return 0;
});
/**
 * Start formatting some Markdown to write out as a comment
 */
const lines = [];
lines.push('### `--strictNullChecks` error report');
lines.push('');
lines.push(`Typechecking with \`--strictNullChecks\` resulted in ${prData.length} errors on this branch.`);
lines.push('');
// we can check the number of errors just to write a different message out here
// depending on the delta between this branch and main
if (errorsOnPRCount === errorsOnMainCount) {
    lines.push("That's the same number of errors on main, so at least we're not creating new ones!");
}
else if (errorsOnPRCount < errorsOnMainCount) {
    lines.push(`That's ${errorsOnMainCount - errorsOnPRCount} fewer than on \`main\`! 🎉🎉🎉`);
}
else {
    lines.push(`Unfortunately, it looks like that's an increase of ${errorsOnPRCount - errorsOnMainCount} over \`main\` 😞.`);
    const newEntries = prData.filter((prTsError) => !mainData.some((mainTsError) => prTsError.value.path.value === mainTsError.value.path.value &&
        prTsError.value.cursor.value.line === mainTsError.value.cursor.value.line &&
        prTsError.value.cursor.value.col === mainTsError.value.cursor.value.col &&
        prTsError.value.tsError.value.errorString === mainTsError.value.tsError.value.errorString));
    lines.push(collapsible('Violations Not on `main` (may be more than the count above)', (out) => {
        out.push(tableHeader('Path', 'Location', 'Error', 'Message'));
        newEntries.forEach(({ value }) => {
            const location = value.cursor.value;
            out.push(tableRow(`${value.path.value}`, `(${location.line}, ${location.col})`, `${value.tsError.value.errorString}`));
        });
    }));
    lines.push('');
}
lines.push('');
lines.push('#### reports and statistics');
lines.push('');
// first we add details on the most error-prone files we can just grab the 20
// files with the most errors and print a table showing the filepath and number
// of errors
lines.push(collapsible('Our most error-prone files', (out) => {
    out.push(tableHeader('Path', 'Error Count'));
    sortEntries(fileErrorCounts)
        .slice(0, 20)
        .forEach(([path, errorCount]) => {
        out.push(tableRow(path, String(errorCount)));
    });
}));
lines.push('');
// then we can do something similar with errors, building a table with the
// TypeScript error code, the number of occurrences, and a collapsed section
// with the actual concrete errors messages for that error code.
lines.push(collapsible('Our most common errors', (out) => {
    out.push(tableHeader('[Typescript Error Code](https://github.com/microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json)', 'Count'));
    sortEntries(errorCodeCounts).forEach(([tsErrorCode, errorCount]) => {
        out.push(tableRow(tsErrorCode, String(errorCount)));
    });
}));
lines.push('');
const deadCodeCountPR = deadCodePR.length;
const deadCodeCountMain = deadCodeMain.length;
lines.push('### Unused exports report');
lines.push('');
const deadCodeLine = [];
deadCodeLine.push(`There are ${deadCodePR.length} unused exports on this PR. `);
// we can check the number of errors just to write a different message out here
// depending on the delta between this branch and main
if (deadCodeCountPR === deadCodeCountMain) {
    deadCodeLine.push("That's the same number of errors on main, so at least we're not creating new ones!");
}
else if (deadCodeCountPR < deadCodeCountMain) {
    deadCodeLine.push(`That's ${deadCodeCountMain - deadCodeCountPR} fewer than on \`main\`! 🎉🎉🎉`);
}
else {
    deadCodeLine.push(`Unfortunately, it looks like that's an increase of ${deadCodeCountPR - deadCodeCountMain} over \`main\` 😞.`);
}
lines.push(deadCodeLine.join(''));
lines.push('');
lines.push(collapsible('Unused exports', (out) => {
    out.push(tableHeader('File', 'Line', 'Identifier'));
    deadCodePR.forEach((deadCode) => {
        out.push(tableRow(deadCode.fileName, deadCode.lineNumber, deadCode.identifier));
    });
}));
console.log(lines.join('\n'));
