import { join } from 'path';
import { readdirSync, statSync, writeFileSync, Stats } from 'fs';

interface DirInfo {
  name: string,
  path: string,
  stat: Stats
}
interface DirInfoMap {
  [key: string]: string[]
}

const exampleDir = join(__dirname);
const outputFile = join(__dirname, 'index.html');

const exampleDirs = readdirSync(exampleDir);

const exampleDirInfos: DirInfoMap = exampleDirs
  .map((fileName: string) =>
    ({
      name: fileName,
      path: join(exampleDir, fileName, 'cmp.examples'),
      stat: statSync(join(exampleDir, fileName))
    } as DirInfo)
  )
  .filter((dirInfo: DirInfo) => {
    return dirInfo.stat.isDirectory();
  })
  .reduce((finalMap, dirInfo: DirInfo) => {
    let contents: string[] = [];
    try {
      contents = require(dirInfo.path);
      finalMap[dirInfo.name] = contents;
    } catch (e) {}
      return finalMap;
  }, {} as DirInfoMap);


const html = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <script src="app.js"></script>
</head>
<body>
  <div id="main">
    <ul>
${
  Object.keys(exampleDirInfos)
    .map(dirName => `<li><a href="?dir=${dirName}&example=0">${dirName}</a></li>`)
    .join('\n')
}
    </ul>
  </div>
<script>
const contents = ${
JSON.stringify(exampleDirInfos, null, 2)
}
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('dir') && urlParams.has('example')) {
    const dir = urlParams.get('dir')
    const index = parseInt(urlParams.get('example'), 10);
    const content = contents[dir].default[index];

    document.querySelector('#main').innerHTML = content;
  }
</script>
</body>
</html>
`;

writeFileSync(outputFile, html);
console.log(`
--- Open the following file ---
${outputFile}
`);
