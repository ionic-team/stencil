import { dirname, join } from 'path';
import fs from 'fs-extra';
import { BuildOptions, getOptions } from '../utils/options';
import { PackageData } from '../utils/write-pkg-json';
import ts from 'typescript';

/**
 * Used to triple check that the final build files
 * ready to be published are good to go
 */

const pkgs: TestPackage[] = [
  {
    // cli
    packageJson: 'cli/package.json',
    files: [
      'cli/cli-worker.js',
      'cli/index_legacy.js',
    ],
  },
  {
    // compiler
    packageJson: 'compiler/package.json',
    files: [
      'compiler/index.js',
    ],
  },
  {
    // dev-server
    packageJson: 'dev-server/package.json',
    files: [
      'dev-server/static/app-error.css',
      'dev-server/static/favicon.ico',
      'dev-server/templates/directory-index.html',
      'dev-server/templates/initial-load.html',
      'dev-server/connector.html',
      'dev-server/content-type-db.json',
      'dev-server/open-in-editor-api.js',
      'dev-server/server-worker.js',
      'dev-server/visualstudio.vbs',
      'dev-server/ws.js',
      'dev-server/xdg-open',
    ],
  },
  {
    // internal/app-data
    packageJson: 'internal/app-data/package.json',
  },
  {
    // internal/client
    packageJson: 'internal/client/package.json',
    files: [
      'internal/client/polyfills/'
    ],
  },
  {
    // internal/hydrate
    packageJson: 'internal/hydrate/package.json',
    files: [
      'internal/hydrate/runner.d.ts',
      'internal/hydrate/runner.mjs',
    ]
  },
  {
    // internal/testing
    packageJson: 'internal/testing/package.json',
  },
  {
    // internal
    packageJson: 'internal/package.json',
    files: [
      'internal/stencil-core.d.ts',
      'internal/stencil-core.js',
      'internal/stencil-ext-modules.d.ts',
      'internal/stencil-private.d.ts',
      'internal/stencil-public-compiler.d.ts',
      'internal/stencil-public-docs.d.ts',
      'internal/stencil-public-runtime.d.ts',
    ]
  },
  {
    // mock-doc
    packageJson: 'mock-doc/package.json',
  },
  {
    // screenshot
    packageJson: 'screenshot/package.json',
    files: [
      'screenshot/compare/',
      'screenshot/connector.js',
      'screenshot/local-connector.js',
      'screenshot/pixel-match.js',
    ],
  },
  {
    // sys/node
    files: [
      'sys/node/graceful-fs.js',
      'sys/node/index.js',
      'sys/node/node-fetch.js',
      'sys/node/sys-worker.js',
    ],
  },
  {
    // testing
    packageJson: 'testing/package.json',
    files: [
      'testing/jest-environment.js',
      'testing/jest-preprocessor.js',
      'testing/jest-preset.js',
      'testing/jest-runner.js',
      'testing/jest-setuptestframework.js',
    ],
  },
  {
    // @stencil/core
    packageJson: 'package.json',
    packageJsonFiles: [
      'bin/',
      'cli/',
      'compiler/',
      'dev-server/',
      'internal/',
      'mock-doc/',
      'screenshot/',
      'sys/',
      'testing/'
    ],
    files: [
      'CHANGELOG.md',
      'LICENSE.md',
      'readme.md'
    ],
    hasBin: true,
  }
];


export function validateBuild(rootDir: string) {
  const dtsEntries: string[] = [];
  const opts = getOptions(rootDir);
  pkgs.forEach(testPkg => {
    validatePackage(opts, testPkg, dtsEntries);
  });

  validateDts(opts, dtsEntries);

  console.log(`👾  Validated build files and distribution`);
}


function validatePackage(opts: BuildOptions, testPkg: TestPackage, dtsEntries: string[]) {
  const rootDir = opts.rootDir;

  if (testPkg.packageJson) {
    testPkg.packageJson = join(rootDir, testPkg.packageJson)
    const pkgDir = dirname(testPkg.packageJson);
    const pkgJson: PackageData = require(testPkg.packageJson);

    if (!pkgJson.name) {
      throw new Error('missing package.json name: ' + testPkg.packageJson);
    }

    if (!pkgJson.main) {
      throw new Error('missing package.json main: ' + testPkg.packageJson);
    }

    if (testPkg.packageJsonFiles) {
      if (!Array.isArray(pkgJson.files)) {
        throw new Error(testPkg.packageJson + ' missing "files" property');
      }
      pkgJson.files.forEach(f => {
        const pkgFile = join(pkgDir, f);
        fs.accessSync(pkgFile);
      });
      testPkg.packageJsonFiles.forEach(testPkgFile => {
        if (!pkgJson.files.includes(testPkgFile)) {
          throw new Error(testPkg.packageJson + ' missing file ' + testPkgFile);
        }

        const filePath = join(pkgDir, testPkgFile);
        fs.accessSync(filePath);
      });
    }

    if (testPkg.hasBin && !pkgJson.bin) {
      throw new Error(testPkg.packageJson + ' missing bin');
    }

    if (pkgJson.bin) {
      Object.keys(pkgJson.bin).forEach(k => {
        const binExe = join(pkgDir, pkgJson.bin[k]);
        fs.accessSync(binExe);
      });
    }

    const mainIndex = join(pkgDir, pkgJson.main);
    fs.accessSync(mainIndex);

    if (pkgJson.module) {
      const moduleIndex = join(pkgDir, pkgJson.module);
      fs.accessSync(moduleIndex);
    }

    if (pkgJson.browser) {
      const browserIndex = join(pkgDir, pkgJson.browser);
      fs.accessSync(browserIndex);
    }

    if (pkgJson.types) {
      const pkgTypes = join(pkgDir, pkgJson.types);
      fs.accessSync(pkgTypes);
      dtsEntries.push(pkgTypes);
    }
  }

  if (testPkg.files) {
    testPkg.files.forEach(file => {
      const filePath = join(rootDir, file);
      fs.statSync(filePath);
    });
  }
}

function validateDts(opts: BuildOptions, dtsEntries: string[]) {
  const program = ts.createProgram(dtsEntries, {
    baseUrl: '.',
    paths: {
      '@stencil/core/internal': [
        join(opts.rootDir, 'internal', 'index.d.ts')
      ],
      '@stencil/core/internal/testing': [
        join(opts.rootDir, 'internal', 'testing', 'index.d.ts')
      ],
    },
  });

  const tsDiagnostics = program
		.getSemanticDiagnostics()
    .concat(program.getSyntacticDiagnostics());

  if (tsDiagnostics.length > 0) {
    const host = {
      getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
      getNewLine: () => ts.sys.newLine,
      getCanonicalFileName: (f: string) => f,
    };
    throw new Error('🧨  ' + ts.formatDiagnostics(tsDiagnostics, host));
  }
}

interface TestPackage {
  packageJson?: string;
  packageJsonFiles?: string[];
  files?: string[];
  hasBin?: boolean;
}
