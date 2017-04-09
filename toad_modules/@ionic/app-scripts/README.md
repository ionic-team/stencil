[![npm version](https://img.shields.io/npm/v/@ionic/app-scripts.svg)](https://www.npmjs.com/package/@ionic/app-scripts)
[![Circle CI](https://circleci.com/gh/driftyco/ionic-app-scripts.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/driftyco/ionic-app-scripts)
# Ionic App Scripts

Helper scripts to get [Ionic apps](http://ionicframework.com/) up and running quickly (minus the config overload).

To get the latest `@ionic/app-scripts`, please run:

```
npm install @ionic/app-scripts@latest --save-dev
```

### Config Defaults

Out of the box, Ionic starters have been preconfigured with great defaults for building fast apps, including:

- Multi-core processing tasks in parallel for faster builds
- In-memory file transpiling and bundling
- Transpiling source code to ES5 JavaScript
- Ahead of Time (AoT) template compiling
- Just in Time (JiT) template compiling
- Template inlining for JiT builds
- Bundling modules for faster runtime execution
- Treeshaking unused components and dead-code removal
- Generating CSS from bundled component Sass files
- Autoprefixing vendor CSS prefixes
- Minifying JavaScript files
- Compressing CSS files
- Copying `src` static assets to `www`
- Linting source files
- Watching source files for live-reloading

Just the bullet list above is a little overwhelming, and each task requires quite a bit of development time just to get started. Ionic App Script's intention is to make it easier to complete common tasks so developers can focus on building their app, rather than building build scripts.

Note that the [Ionic Framework's](https://github.com/driftyco/ionic) source is made up of modules and can be packaged by any bundler or build process. However, this project's goal is provide simple scripts to make building Ionic apps easier, while also allowing developers to further configure their build process.


### npm Scripts

Instead of depending on external task runners, Ionic App Scripts now prefers being executed from [npm scripts](https://docs.npmjs.com/misc/scripts). Ionic's npm scripts come preconfigured in the project's `package.json` file. For example, this is the default setup for npm scripts in each starter:

```
  "scripts": {
    "ionic:build": "ionic-app-scripts build",
    "ionic:serve": "ionic-app-scripts serve"
  },
```

To run the `build` script found in the `package.json` `scripts` property, execute:

```
npm run build
```


## Custom Configuration

In many cases, the defaults which Ionic provides cover most of the scenarios required by developers; however, Ionic App Scripts does provide multiple ways to configure and override the defaults for each of the various tasks. Note that Ionic will always apply its defaults for any property that was not provided by custom configuration.

[Default Config Files](https://github.com/driftyco/ionic-app-scripts/tree/master/config)

### package.json Config

Ionic projects use the `package.json` file for configuration. There's a handy [config](https://docs.npmjs.com/misc/config#per-package-config-settings) property which can be used. Below is an example of setting a custom config file using the `config` property in a project's `package.json`.

```
  "config": {
    "ionic_bundler": "rollup",
    "ionic_source_map_type": "source-map",
    "ionic_cleancss": "./config/cleancss.config.js"
  },
```

### Command-line Flags

Remember how we're actually running `ionic-app-scripts` from the `scripts` property of a project's `package.json` file? Well we can also add command-line flags to each script, or make new scripts with these custom flags. For example:

```
  "scripts": {
    "build": "ionic-app-scripts build --rollup ./config/rollup.config.js",
    "minify": "ionic-app-scripts minify --cleancss ./config/cleancss.config.js",
  },
```

The same command-line flags can be also applied to `npm run` commands too, such as:

```
npm run build --rollup ./config/rollup.config.js
```


### Overriding Config Files

| Config File | package.json Config | Cmd-line Flag         |
|-------------|---------------------|-----------------------|
| Babili      | `ionic_use_experimental_babili`  | `--babili`            |
| CleanCss    | `ionic_cleancss`    | `--cleancss` or `-e`  |
| Copy        | `ionic_copy`        | `--copy` or `-y`      |
| Closure     | `ionic_closure`     | `--closure` or `-l`   |
| Generator   | `ionic_generator`   | `--generator` or `-g` |
| NGC         | `ionic_ngc`         | `--ngc` or `-n`       |
| Rollup      | `ionic_rollup`      | `--rollup` or `-r`    |
| Sass        | `ionic_sass`        | `--sass` or `-s`      |
| TSLint      | `ionic_tslint`      | `--tslint` or `-i`    |
| UglifyJS    | `ionic_uglifyjs`    | `--uglifyjs` or `-u`  |
| Watch       | `ionic_watch`       | `--watch`             |
| Webpack     | `ionic_webpack`     | `--webpack` or `-w`   |


### Overriding Config Values

| Config Values   | package.json Config | Cmd-line Flag | Defaults        | Details        |
|-----------------|---------------------|---------------|-----------------|----------------|
| root directory  | `ionic_root_dir`    | `--rootDir`   | `process.cwd()` | The directory path of the Ionic app |
| src directory   | `ionic_src_dir`     | `--srcDir`    | `src`           | The directory holding the Ionic src code |
| www directory   | `ionic_www_dir`     | `--wwwDir`    | `www`           | The deployable directory containing everything needed to run the app |
| build directory | `ionic_build_dir`   | `--buildDir`  | `build`         | The build process uses this directory to store generated files, etc |
| temp directory   | `ionic_tmp_dir`     | `--tmpDir`    | `.tmp`           | Temporary directory for writing files for debugging and various build tasks |
| ionic-angular directory | `ionic_angular_dir` | `--ionicAngularDir` | `ionic-angular` | ionic-angular directory |
| ionic-angular entry point | `ionic_angular_entry_point` | `--ionicAngularEntryPoint` | `index.js` | entry point file for ionic-angular |
| bundler         | `ionic_bundler`     | `--bundler`   | `webpack`       | Chooses which bundler to use: `webpack` or `rollup` |
| source map type | `ionic_source_map_type`  | `--sourceMapType` | `source-map` | Chooses the webpack `devtool` option. `eval` and `source-map` are supported |
| generate source map | `ionic_generate_source_map`  | `--generateSourceMap` | `true` | Determines whether to generate a source map or not |
| tsconfig path | `ionic_ts_config`  | `--tsconfig` | `{{rootDir}}/tsconfig.json` | absolute path to tsconfig.json |
| app entry point | `ionic_app_entry_point`  | `--appEntryPoint` | `{{srcDir}}/app/main.ts` | absolute path to app's entrypoint bootstrap file |
| app ng module path | `ionic_app_ng_module_path`  | `--appNgModulePath` | `{{srcDir}}/app/app.module.ts` | absolute path to app's primary `NgModule` |
| app ng module class | `ionic_app_ng_module_class`  | `--appNgModuleClass` | `AppModule` | Exported class name for app's primary `NgModule` |
| clean before copy | `ionic_clean_before_copy`  | `--cleanBeforeCopy` | `false` | clean out existing files before copy task runs |
| output js file | `ionic_output_js_file_name`  | `--outputJsFileName` | `main.js` | name of js file generated in `buildDir` |
| output css file | `ionic_output_css_file_name`  | `--outputCssFileName` | `main.css` | name of css file generated in `buildDir` |
| bail on lint error | `ionic_bail_on_lint_error`  | `--bailOnLintError` | `null` | Set to `true` to make stand-alone lint commands fail with non-zero status code |
| write AoT files to disk | `ionic_aot_write_to_disk` | `--aotWriteToDisk` | `null` | Set to `true` to write files to disk for debugging |
| print dependency tree | `ionic_print_original_dependency_tree` | `--printOriginalDependencyTree` | `null` | Set to `true` to print out the original dependency tree calculated during the optimize step |
| print modified dependency tree | `ionic_print_modified_dependency_tree` | `--printModifiedDependencyTree` | `null` | Set to `true` to print out the modified dependency tree after purging unused modules |
| print webpack dependency tree | `ionic_print_webpack_dependency_tree` | `--printWebpackDependencyTree` | `null` | Set to `true` to print out a dependency tree after running Webpack |
| parse deeplink config | `ionic_parse_deeplinks` | `--parseDeepLinks` | `true` | Parses and extracts data from the `@IonicPage` decorator |
| experimental manual tree shaking | `ionic_experimental_manual_treeshaking` | `--experimentalManualTreeshaking` | `null` | Set to `true` to purge unused Ionic components/code (Experimental) |
| experimental purge decorators | `ionic_experimental_purge_decorators` | `--experimentalPurgeDecorators` | `null` | Set to `true` to purge unneeded decorators to improve tree shakeability of code (Experimental) |
| experimental closure compiler | `ionic_use_experimental_closure` | `--useExperimentalClosure` | `null` | Set to `true` to use closure compiler to minify the final bundle |
| experimental babili | `ionic_use_experimental_babili` | `--useExperimentalBabili` | `null` | Set to `true` to use babili to minify es2015 code |
| convert bundle to ES5 | `ionic_build_to_es5` | `--buildToEs5` | `true` | Convert bundle to ES5 for for production deployments |
| default watch timeout | `ionic_start_watch_timeout` | `--startWatchTimeout` | `3000` | Milliseconds controlling the default watch timeout |





### Ionic Environment Variables

These environment variables are automatically set to [Node's `process.env`](https://nodejs.org/api/process.html#process_process_env) property. These variables can be useful from within custom configuration files, such as custom `webpack.config.js` file.

| Environment Variable       | Description                                                          |
|----------------------------|----------------------------------------------------------------------|
| `IONIC_ENV`                | Value can be either `prod` or `dev`.                                 |
| `IONIC_ROOT_DIR`           | The absolute path to the project's root directory.                   |
| `IONIC_SRC_DIR`            | The absolute path to the app's source directory.                     |
| `IONIC_WWW_DIR`            | The absolute path to the app's public distribution directory.        |
| `IONIC_BUILD_DIR`          | The absolute path to the app's bundled js and css files.             |
| `IONIC_TMP_DIR`            | Temp directory for debugging generated/optimized code and various build tasks |
| `IONIC_NODE_MODULES_DIR`   | The absolute path to the `node_modules` directory.                   |
| `IONIC_ANGULAR_DIR`        | The absolute path to the `ionic-angular` node_module directory.      |
| `IONIC_APP_SCRIPTS_DIR`    | The absolute path to the `@ionic/app-scripts` node_module directory. |
| `IONIC_SOURCE_MAP_TYPE`    | The Webpack `devtool` setting. `eval` and `source-map` are supported.|
| `IONIC_GENERATE_SOURCE_MAP`| Determines whether to generate a sourcemap or not.                   |
| `IONIC_TS_CONFIG`          | The absolute path to the project's `tsconfig.json` file              |
| `IONIC_APP_ENTRY_POINT`    | The absolute path to the project's `main.ts` entry point file        |
| `IONIC_APP_NG_MODULE_PATH` | The absolute path to app's primary `NgModule`                        |
| `IONIC_APP_NG_MODULE_CLASS`    | The exported class name for app's primary `NgModule`             |
| `IONIC_GLOB_UTIL`          | The path to Ionic's `glob-util` script. Used within configs.         |
| `IONIC_CLEAN_BEFORE_COPY`  | Attempt to clean existing directories before copying files.          |
| `IONIC_CLOSURE_JAR`        | The absolute path ot the closure compiler jar file                   |
| `IONIC_OUTPUT_JS_FILE_NAME` | The file name of the generated javascript file                      |
| `IONIC_OUTPUT_CSS_FILE_NAME` | The file name of the generated css file                            |
| `IONIC_WEBPACK_FACTORY`    | The absolute path to Ionic's `webpack-factory` script                |
| `IONIC_WEBPACK_LOADER`     | The absolute path to Ionic's custom webpack loader                   |
| `IONIC_BAIL_ON_LINT_ERROR`     | Boolean determining whether to exit with a non-zero status code on error |
| `IONIC_AOT_WRITE_TO_DISK` | `--aotWriteToDisk` | `null` | Set to `true` to write files to disk for debugging |
| `IONIC_PRINT_ORIGINAL_DEPENDENCY_TREE` | boolean to print out the original dependency tree calculated during the optimize step |
| `IONIC_PRINT_MODIFIED_DEPENDENCY_TREE` | boolean to print out the modified dependency tree after purging unused modules |
| `IONIC_PRINT_WEBPACK_DEPENDENCY_TREE` | boolean to print out a dependency tree after running Webpack |
| `IONIC_PARSE_DEEPLINKS` | boolean to enable parsing the Ionic 3.x deep links API for lazy loading |
| `IONIC_EXPERIMENTAL_MANUAL_TREESHAKING` | boolean to enable purging unused Ionic components/code (Experimental) |
| `IONIC_EXPERIMENTAL_PURGE_DECORATORS` | boolean to enable purging unneeded decorators from source code (Experimental) |
| `IONIC_USE_EXPERIMENTAL_CLOSURE` | boolean to enable use of closure compiler to minify the final bundle |
| `IONIC_USE_EXPERIMENTAL_BABILI` | boolean to enable use of babili to minify es2015 code |
| `IONIC_BUILD_TO_ES5` | boolean to enable converting bundle to ES5 for for production deployments |
| `IONIC_START_WATCH_TIMEOUT` | Milliseconds controlling the default watch timeout |


The `process.env.IONIC_ENV` environment variable can be used to test whether it is a `prod` or `dev` build, which automatically gets set by any command. By default the `build` and `serve` tasks produce `dev` builds (a build that does not include Ahead of Time (AoT) compilation or minification). To force a `prod` build you should use the `--prod` command line flag.

Please take a look at the bottom of the [default Rollup config file](https://github.com/driftyco/ionic-app-scripts/blob/master/config/rollup.config.js) to see how the `IONIC_ENV` environment variable is being used to conditionally change config values for production builds.


## All Available Tasks

These tasks are available within `ionic-app-scripts` and can be added to npm scripts or any Node command.

| Task       | Description                                                                                         |
|------------|-----------------------------------------------------------------------------------------------------|
| `build`    | A complete build of the application. It uses `development` settings by default. Use `--prod` to create an optimized build |
| `clean`    | Empty the `www/build` directory.                                                                          |
| `cleancss` | Compress the output CSS with [CleanCss](https://github.com/jakubpawlowicz/clean-css)                |
| `copy`     | Run the copy tasks, which by defaults copies the `src/assets/` and `src/index.html` files to `www`. |
| `lint`     | Run the linter against the source `.ts` files, using the `tslint.json` config file at the root.     |
| `minify`   | Minifies the output JS bundle and compresses the compiled CSS.                                      |
| `sass`     | Sass compilation of used modules. Bundling must have at least ran once before Sass compilation.     |
| `watch`    | Runs watch for dev builds.                                                                          |

Example NPM Script:

```
  "scripts": {
    "minify": "ionic-app-scripts minify"
  },
```

## Tips
1. The Webpack `devtool` setting is driven by the `ionic_source_map_type` variable. It defaults to `source-map` for the best quality source map. Developers can enable significantly faster builds by setting `ionic_source_map_type` to `eval`.
2. By default, the `lint` command does not exit with a non-zero status code on error. To enable this, pass `--bailOnLintError true` to the command.

```
"scripts" : {
  ...
  "lint": "ionic-app-scripts lint"
  ...
}
```

```
npm run lint --bailOnLintError true
```
3. Set `ionic_experimental_manual_treeshaking` and `ionic_experimental_purge_decorators` to true in the `package.json` to potentially dramatically shrink an app's bundle size.

## The Stack

- [Ionic Framework](http://ionicframework.com/)
- [TypeScript Compiler](https://www.typescriptlang.org/)
- [Angular Compiler (NGC)](https://github.com/angular/angular/tree/master/modules/%40angular/compiler-cli)
- [Rollup Module Bundler](http://rollupjs.org/)
- Ionic Component Sass
- [Node Sass](https://www.npmjs.com/package/node-sass)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [UglifyJS](http://lisperator.net/uglifyjs/)
- [CleanCss](https://github.com/jakubpawlowicz/clean-css)
- [TSLint](http://palantir.github.io/tslint/)

## Contributing

We welcome any PRs, issues, and feedback! Please be respectful and follow the [Code of Conduct](https://github.com/driftyco/ionic/blob/master/CODE_OF_CONDUCT.md).

### Publish a release

Execute the following steps to publish a release:

1. Run `npm run build` to generate the `dist` directory
2. Run `npm run test` to validate the `dist` works
3. Temporarily tick the `package.json` version
4. Run `npm run changelog` to append the latest additions to the changelog
5. Manually verify and commit the changelog changes. Often times you'll want to manually add content/instructions
6. Revert the `package.json` version to the original version
7. Run `npm version patch` to tick the version and generate a git tag
8. Run `npm run github-release` to create the github release entry
9. Run `npm publish` to publish the package to npm
10. `git push origin master` - push changes to master
