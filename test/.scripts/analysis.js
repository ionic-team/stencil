const fs = require('fs');
const path = require('path');
const fileSizeProfile = require('./file-size-profile')

const output = [
  `# Test Apps`,
  '',
  '`npm run build`',
  ''
];
const rootDir = path.join(__dirname, '..');


fileSizeProfile('Hello World App',
  [
    path.join(rootDir, 'hello-world', 'www', '*.js'),
  ],
  output
);

fileSizeProfile('Hello VDOM App',
  [
    path.join(rootDir, 'hello-vdom', 'www', 'build', '*'),
  ],
  output
);

fileSizeProfile('Todo App',
  [
    path.join(rootDir, 'todo-app', 'public', 'index.js'),
  ],
  output
);

fileSizeProfile('End-to-end App',
  [
    path.join(rootDir, 'end-to-end', 'www', 'build', 'app.js'),
  ],
  output
);


fs.writeFileSync(path.join(rootDir, 'readme.md'), output.join('\n'));
