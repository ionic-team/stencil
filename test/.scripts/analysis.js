const fs = require('fs');
const path = require('path');
const fileSizeProfile = require('./file-size-profile')

const output = [];
const rootDir = path.join(__dirname, '..');


fileSizeProfile('Hello World',
  [
    path.join(rootDir, 'hello-world', 'www', 'build', 'app.js'),
  ],
  output
);

fileSizeProfile('Hello VDOM',
  [
    path.join(rootDir, 'hello-vdom', 'www', 'build', 'app.js'),
  ],
  output
);

fileSizeProfile('Todo App',
  [
    path.join(rootDir, 'todo-app', 'www', 'build', 'app.js'),
  ],
  output
);


fs.writeFileSync(path.join(rootDir, 'readme.md'), output.join('\n'));
