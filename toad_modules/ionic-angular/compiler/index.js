'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var fs = require('fs');
var ts = require('typescript');

function bundleComponentModeStyles(config, mode) {
    return Promise.all(mode.styleUrls.map(function (styleUrl) {
        return bundleComponentModeStyle(config, styleUrl);
    })).then(function (results) {
        return mode.styles = results.join('');
    });
}
function bundleComponentModeStyle(config, styleUrl) {
    return new Promise(function (resolve$$1, reject) {
        var scssFilePath = path.join(config.srcDir, styleUrl);
        var sassConfig = {
            file: scssFilePath,
            outputStyle: 'compressed'
        };
        if (config.debug) {
            console.log("bundle, render sass: " + scssFilePath);
        }
        config.packages.nodeSass.render(sassConfig, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                var css = result.css.toString().replace(/\n/g, '').trim();
                resolve$$1(css);
            }
        });
    });
}

function getBundleFileName(bundleId) {
    return "ionic." + bundleId + ".js";
}
function getBundleContent(bundleId, componentModeLoader) {
    return "Ionic.loadComponents('" + bundleId + "'," + componentModeLoader + ");";
}
function getComponentModeLoader(component, mode) {
    var t = [
        "'" + component.tag + "'",
        "'" + mode.name + "'",
        "'" + mode.styles.replace(/'/g, '"') + "'",
        component.componentImporter
    ];
    return "[" + t.join(',') + "]";
}
function getRegistryContent(registry) {
    var content = '(window.Ionic = window.Ionic || {}).components = ';
    content += JSON.stringify(registry, null, 2) + ';';
    return content;
}
function getBundleId(bundleIndex) {
    return bundleIndex.toString();
}

function getFileMeta(ctx, filePath) {
    var fileMeta = ctx.files.get(filePath);
    if (fileMeta) {
        return Promise.resolve(fileMeta);
    }
    return readFile$1(filePath).then(function (srcText) {
        return createFileMeta(ctx, filePath, srcText);
    });
}
function createFileMeta(ctx, filePath, srcText) {
    var fileMeta = {
        fileName: path.basename(filePath),
        filePath: filePath,
        fileExt: path.extname(filePath),
        srcDir: path.dirname(filePath),
        srcText: srcText,
        srcTextWithoutDecorators: null,
        jsFilePath: null,
        jsText: null,
        isTsSourceFile: isTsSourceFile(filePath),
        isTransformable: false,
        cmpMeta: null
    };
    if (fileMeta.isTsSourceFile) {
        fileMeta.isTransformable = isTransformable(fileMeta.srcText);
    }
    ctx.files.set(filePath, fileMeta);
    return fileMeta;
}
function readFile$1(filePath) {
    return new Promise(function (resolve$$1, reject) {
        fs.readFile(filePath, 'utf-8', function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve$$1(data);
            }
        });
    });
}
function writeFile$1(filePath, content) {
    return new Promise(function (resolve$$1, reject) {
        mkdir$1(path.dirname(filePath), function () {
            fs.writeFile(filePath, content, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve$$1();
                }
            });
        });
    });
}

function mkdir$1(root, callback) {
    var chunks = root.split(path.sep);
    var chunk;
    if (path.isAbsolute(root) === true) {
        chunk = chunks.shift();
        if (!chunk) {
            chunk = path.sep;
        }
    }
    else {
        chunk = path.resolve();
    }
    return mkdirRecursive(chunk, chunks, callback);
}
function mkdirRecursive(root, chunks, callback) {
    var chunk = chunks.shift();
    if (!chunk) {
        return callback(null);
    }
    var root = path.join(root, chunk);
    return fs.exists(root, function (exists$$1) {
        if (exists$$1 === true) {
            return mkdirRecursive(root, chunks, callback);
        }
        return fs.mkdir(root, function (err) {
            if (err) {
                return callback(err);
            }
            return mkdirRecursive(root, chunks, callback);
        });
    });
}
function isTsSourceFile(filePath) {
    var parts = filePath.toLowerCase().split('.');
    if (parts.length > 1) {
        if (parts[parts.length - 1] === 'ts') {
            if (parts.length > 2 && parts[parts.length - 2] === 'd') {
                return false;
            }
            return true;
        }
    }
    return false;
}
function isTransformable(sourceText) {
    return (sourceText.indexOf('@Component') > -1);
}
function logError(results, msg) {
    results.errors = results.errors || [];
    results.errors.push(msg);
    return results;
}

function bundle(config, ctx) {
    if (ctx === void 0) { ctx = {}; }
    if (config.debug) {
        console.log("bundle, srcDir: " + config.srcDir);
        console.log("bundle, destDir: " + config.destDir);
    }
    ctx.results = {};
    return getManifest(config, ctx).then(function (manifest) {
        var components = getComponents(ctx, manifest);
        return Promise.all(Object.keys(components).map(function (tag) {
            return bundleComponent(config, components[tag]);
        }))
            .then(function () {
            return buildCoreJs(config, ctx, manifest);
        }).then(function () {
            return ctx.results;
        }).catch(function (err) {
            return logError(ctx.results, err);
        });
    });
}
function bundleComponent(config, component) {
    return bundleComponentModule(config, component).then(function () {
        var modeNames = Object.keys(component.modes);
        return Promise.all(modeNames.map(function (modeName) {
            component.modes[modeName].name = modeName;
            return bundleComponentMode(config, component, component.modes[modeName]);
        }));
    });
}
function bundleComponentModule(config, component) {
    if (component.componentImporter) {
        return Promise.resolve(component.componentImporter);
    }
    var rollupConfig = {
        entry: path.join(config.srcDir, component.componentUrl),
        format: 'cjs'
    };
    if (config.debug) {
        console.log("bundle, bundleComponentModule, entry: " + rollupConfig.entry);
    }
    return config.packages.rollup.rollup(rollupConfig).then(function (bundle) {
        var bundleOutput = bundle.generate(rollupConfig);
        var code = "function importComponent(exports) { " + bundleOutput.code + " }";
        return component.componentImporter = code;
    });
}
function bundleComponentMode(config, component, mode) {
    if (config.debug) {
        console.log("bundle, bundleComponentMode: " + component.tag + ", " + mode.name);
    }
    return bundleComponentModeStyles(config, mode).then(function () {
        return getComponentModeLoader(component, mode);
    });
}
function getComponents(ctx, manifest) {
    if (!ctx.components) {
        ctx.components = {};
        Object.keys(manifest.components).forEach(function (tag) {
            ctx.components[tag] = Object.assign({}, manifest.components[tag]);
            ctx.components[tag].tag = tag;
        });
    }
    return ctx.components;
}
function buildCoreJs(config, ctx, manifest) {
    ctx.bundles = [];
    manifest.bundles.forEach(function (bundleComponentTags) {
        buildComponentBundles(ctx, bundleComponentTags);
    });
    return generateBundleFiles(config, ctx).then(function () {
        var content = getRegistryContent(ctx.registry);
        var promises = [];
        Object.keys(ctx.manifest.coreFiles).forEach(function (coreDirName) {
            var corePath = ctx.manifest.coreFiles[coreDirName];
            promises.push(createCoreJs(config, content, corePath, true));
            promises.push(createCoreJs(config, content, corePath, false));
        });
        return promises;
    });
}
function buildComponentBundles(ctx, bundleComponentTags) {
    var allModeNames = getAllModeNames(ctx);
    allModeNames.forEach(function (modeName) {
        var bundle = {
            components: []
        };
        bundleComponentTags.forEach(function (bundleComponentTag) {
            var component = ctx.components[bundleComponentTag];
            if (!component)
                return;
            var mode = component.modes[modeName];
            if (!mode)
                return;
            bundle.components.push({
                component: component,
                mode: mode
            });
        });
        if (bundle.components.length) {
            ctx.bundles.push(bundle);
        }
    });
}
function generateBundleFiles(config, ctx) {
    ctx.registry = {};
    return Promise.all(ctx.bundles.map(function (bundle, bundleIndex) {
        var componentModeLoaders = bundle.components.map(function (bundleComponent) {
            return getComponentModeLoader(bundleComponent.component, bundleComponent.mode);
        }).join(',');
        bundle.id = getBundleId(bundleIndex);
        bundle.fileName = getBundleFileName(bundle.id);
        bundle.filePath = path.join(config.destDir, bundle.fileName);
        bundle.content = getBundleContent(bundle.id, componentModeLoaders);
        bundle.components.forEach(function (bundleComponent) {
            var tag = bundleComponent.component.tag;
            var modeName = bundleComponent.mode.name;
            ctx.registry[tag] = ctx.registry[tag] || [];
            var modes = ctx.registry[tag][0] || {};
            modes[modeName] = bundle.id;
            ctx.registry[tag][0] = modes;
        });
        var minifyResults = config.packages.uglify.minify(bundle.content, {
            fromString: true
        });
        var prodFilePath = bundle.filePath;
        var devFilePath = bundle.filePath.replace('.js', '.dev.js');
        return Promise.all([
            writeFile$1(prodFilePath, minifyResults.code),
            writeFile$1(devFilePath, bundle.content)
        ]);
    }));
}
function createCoreJs(config, registryContent, srcFilePath, minify) {
    if (!minify) {
        srcFilePath = srcFilePath.replace('.js', '.dev.js');
    }
    var fileName = path.basename(srcFilePath);
    srcFilePath = path.join(config.srcDir, srcFilePath);
    var destFilePath = path.join(config.destDir, fileName);
    return readFile$1(srcFilePath).then(function (coreJsContent) {
        var content;
        if (minify) {
            registryContent = registryContent.replace(/\s/g, '');
            content = registryContent + '\n' + coreJsContent;
        }
        else {
            content = registryContent + '\n\n' + coreJsContent;
        }
        if (config.debug) {
            console.log("bundle, createCoreJs: " + destFilePath);
        }
        return writeFile$1(destFilePath, content);
    });
}
function getAllModeNames(ctx) {
    var allModeNames = [];
    Object.keys(ctx.components).forEach(function (tag) {
        var component = ctx.components[tag];
        Object.keys(component.modes).forEach(function (modeName) {
            if (allModeNames.indexOf(modeName) === -1) {
                allModeNames.push(modeName);
            }
        });
    });
    return allModeNames;
}
function getManifest(config, ctx) {
    if (ctx.manifest) {
        return Promise.resolve(ctx.manifest);
    }
    var manifestFilePath = path.join(config.srcDir, 'manifest.json');
    if (config.debug) {
        console.log("bundle, manifestFilePath: " + manifestFilePath);
    }
    return readFile$1(manifestFilePath).then(function (manifestStr) {
        return ctx.manifest = JSON.parse(manifestStr);
    });
}

function transpile(config, ctx) {
    var tsFileNames = getTsFileNames(ctx);
    if (config.debug) {
        console.log("compile, transpile: " + tsFileNames);
    }
    if (!tsFileNames.length) {
        return Promise.resolve();
    }
    var tsCompilerOptions = createTsCompilerConfigs(config);
    var tsHost = ts.createCompilerHost(tsCompilerOptions);
    var tsSysReadFile = ts.sys.readFile;
    ts.sys.readFile = function (tsFilePath) {
        var fileMeta = ctx.files.get(tsFilePath);
        if (fileMeta) {
            return fileMeta.srcTextWithoutDecorators || fileMeta.srcText;
        }
        fileMeta = createFileMeta(ctx, tsFilePath, fs.readFileSync(tsFilePath, 'utf-8'));
        return fileMeta.srcText;
    };
    var program = ts.createProgram(tsFileNames, tsCompilerOptions, tsHost);
    function writeFile$$1(fileName, data, writeByteOrderMark, onError, sourceFiles) {
        sourceFiles.forEach(function (s) {
            var fileMeta = ctx.files.get(s.fileName);
            if (fileMeta) {
                fileMeta.jsFilePath = fileName;
                fileMeta.jsText = data;
            }
        });
        writeByteOrderMark;
        onError;
    }
    program.emit(undefined, writeFile$$1);
    ts.sys.readFile = tsSysReadFile;
    return writeJsFiles(config, ctx);
}
function writeJsFiles(config, ctx) {
    ctx.files.forEach(function (f) {
        if (f.jsFilePath && f.jsText) {
            if (!f.cmpMeta) {
                return;
            }
            if (config.debug) {
                console.log("compile, transpile, writeJsFile: " + f.jsFilePath);
            }
            f.jsText = f.jsText.replace("Object.defineProperty(exports, \"__esModule\", { value: true });", '');
            f.jsText = f.jsText.trim();
            ts.sys.writeFile(f.jsFilePath, f.jsText);
        }
    });
    return Promise.resolve();
}
function createTsCompilerConfigs(config) {
    var tsCompilerOptions = Object.assign({}, config.compilerOptions);
    tsCompilerOptions.noImplicitUseStrict = true;
    tsCompilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
    tsCompilerOptions.module = getTsModule(config.compilerOptions.module);
    tsCompilerOptions.target = getTsScriptTarget(config.compilerOptions.target);
    tsCompilerOptions.lib = tsCompilerOptions.lib || [];
    if (!tsCompilerOptions.lib.indexOf('dom')) {
        tsCompilerOptions.lib.push('dom');
    }
    if (!tsCompilerOptions.lib.indexOf('es2015')) {
        tsCompilerOptions.lib.push('es2015');
    }
    return tsCompilerOptions;
}
function getTsFileNames(ctx) {
    var fileNames = [];
    ctx.files.forEach(function (fileMeta) {
        if (!fileMeta.isTsSourceFile || !fileMeta.cmpMeta) {
            return;
        }
        fileNames.push(fileMeta.filePath);
    });
    return fileNames;
}
function getTsScriptTarget(str) {
    if (str === 'es2015') {
        return ts.ScriptTarget.ES2015;
    }
    return ts.ScriptTarget.ES5;
}
function getTsModule(str) {
    if (str === 'es2015') {
        return ts.ModuleKind.ES2015;
    }
    return ts.ModuleKind.CommonJS;
}

function parseTsSrcFile(file, config, ctx) {
    var scriptTarget = getTsScriptTarget(config.compilerOptions.target);
    var tsSrcFile = ts.createSourceFile(file.filePath, file.srcText, scriptTarget, true);
    inspectNode(tsSrcFile, file, config, ctx);
}
function inspectNode(n, file, config, ctx) {
    if (n.kind === ts.SyntaxKind.ClassDeclaration) {
        ts.forEachChild(n, function (childNode) {
            if (childNode.kind === ts.SyntaxKind.Decorator) {
                inspectClassDecorator(childNode, file);
            }
        });
    }
    ts.forEachChild(n, function (childNode) {
        inspectNode(childNode, file, config, ctx);
    });
}
function inspectClassDecorator(n, file) {
    var orgText = n.getText();
    if (orgText.replace(/\s/g, '').indexOf('@Component({') !== 0) {
        return;
    }
    var text = orgText.replace('@Component', '');
    file.cmpMeta = parseComponentMeta(text);
    updateComponentMeta(file.cmpMeta, orgText);
    file.srcTextWithoutDecorators = file.srcText.replace(orgText, '');
}
function updateComponentMeta(cmpMeta, orgText) {
    if (!cmpMeta) {
        throw "invalid component decorator";
    }
    if (cmpMeta.selector) {
        console.log("Please use \"tag\" instead of \"selector\" in component decorator: " + cmpMeta.selector);
        cmpMeta.tag = cmpMeta.selector;
    }
    if (!cmpMeta.tag || cmpMeta.tag.trim() == '') {
        throw "tag missing in component decorator: " + orgText;
    }
    updateTag(cmpMeta);
    updateModes(cmpMeta);
    updateStyles(cmpMeta);
    updateProperties(cmpMeta);
}
function updateTag(cmpMeta) {
    cmpMeta.tag = cmpMeta.tag.trim().toLowerCase();
    var invalidChars = cmpMeta.tag.replace(/\w|-/g, '');
    if (invalidChars !== '') {
        throw "\"" + cmpMeta.tag + "\" tag contains invalid characters: " + invalidChars;
    }
    if (cmpMeta.tag.indexOf('-') === -1) {
        throw "\"" + cmpMeta.tag + "\" tag must contain a dash (-)";
    }
    if (cmpMeta.tag.indexOf('-') === 0) {
        throw "\"" + cmpMeta.tag + "\" tag cannot start with a dash (-)";
    }
    if (cmpMeta.tag.lastIndexOf('-') === cmpMeta.tag.length - 1) {
        throw "\"" + cmpMeta.tag + "\" tag cannot end with a dash (-)";
    }
}
function updateModes(cmpMeta) {
    cmpMeta.modes = cmpMeta.modes = {};
}
function updateStyles(cmpMeta) {
    var styleModes = cmpMeta.styleUrls;
    if (styleModes) {
        Object.keys(styleModes).forEach(function (styleModeName) {
            cmpMeta.modes[styleModeName] = {
                styleUrls: [styleModes[styleModeName]]
            };
        });
    }
}
function updateProperties(cmpMeta) {
    if (!cmpMeta.props)
        return;
    var validPropTypes = ['string', 'boolean', 'number', 'Array', 'Object'];
    Object.keys(cmpMeta.props).forEach(function (propName) {
        if (propName.indexOf('-') > -1) {
            throw "\"" + propName + "\" property name cannot have a dash (-) in it";
        }
        if (!isNaN(propName.charAt(0))) {
            throw "\"" + propName + "\" property name cannot start with a number";
        }
        var prop = cmpMeta.props[propName];
        if (prop.type) {
            if (typeof prop.type === 'string') {
                prop.type = prop.type.trim().toLowerCase();
            }
            if (prop.type === 'array') {
                prop.type = 'Array';
            }
            if (prop.type === 'object') {
                prop.type = 'Object';
            }
            if (validPropTypes.indexOf(prop.type) === -1) {
                throw "\"" + propName + "\" invalid for property type: " + prop.type;
            }
        }
    });
}
function parseComponentMeta(text) {
    return new Function("return " + text + ";")();
}

function compile(config, ctx) {
    if (ctx === void 0) { ctx = {}; }
    if (config.debug) {
        console.log("compile, include: " + config.include);
        console.log("compile, outDir: " + config.compilerOptions.outDir);
    }
    if (!ctx.files) {
        ctx.files = new Map();
    }
    ctx.results = {};
    if (typeof config.include === 'string') {
        config.include = [config.include];
    }
    else if (!Array.isArray(config.include)) {
        throw Error('compile config "include" must be an array');
    }
    config.include = config.include || [];
    if (!config.exclude) {
        config.exclude = ['node_modules', 'bower_components'];
    }
    var promises = config.include.map(function (includePath) {
        return scanDirectory(includePath, config, ctx);
    });
    return Promise.all(promises)
        .then(function () {
        return transpile(config, ctx);
    }).then(function () {
        return processStyles(config, ctx);
    }).then(function () {
        return generateManifest(config, ctx);
    }).then(function () {
        return ctx.results;
    }).catch(function (err) {
        return logError(ctx.results, err);
    });
}
function scanDirectory(dir, config, ctx) {
    return new Promise(function (resolve$$1) {
        if (config.debug) {
            console.log("compile, scanDirectory: " + dir);
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                logError(ctx.results, err);
                resolve$$1();
                return;
            }
            var promises = [];
            files.forEach(function (dirItem) {
                var readPath = path.join(dir, dirItem);
                if (!isValidDirectory(config, readPath)) {
                    return;
                }
                promises.push(new Promise(function (resolve$$1) {
                    fs.stat(readPath, function (err, stats) {
                        if (err) {
                            logError(ctx.results, err);
                            resolve$$1();
                            return;
                        }
                        if (stats.isDirectory()) {
                            scanDirectory(readPath, config, ctx).then(function () {
                                resolve$$1();
                            });
                        }
                        else if (isTsSourceFile(readPath)) {
                            inspectTsFile(readPath, config, ctx).then(function () {
                                resolve$$1();
                            });
                        }
                        else {
                            resolve$$1();
                        }
                    });
                }));
            });
            Promise.all(promises).then(function () {
                resolve$$1();
            });
        });
    });
}
function inspectTsFile(filePath, config, ctx) {
    if (ctx === void 0) { ctx = {}; }
    if (!ctx.files) {
        ctx.files = new Map();
    }
    if (config.debug) {
        console.log("compile, inspectTsFile: " + filePath);
    }
    return getFileMeta(ctx, filePath).then(function (fileMeta) {
        if (!fileMeta.isTsSourceFile || !fileMeta.isTransformable) {
            return;
        }
        parseTsSrcFile(fileMeta, config, ctx);
    });
}
function isValidDirectory(config, filePath) {
    for (var i = 0; i < config.exclude.length; i++) {
        if (filePath.indexOf(config.exclude[i]) > -1) {
            return false;
        }
    }
    return true;
}
function processStyles(config, ctx) {
    var destDir = config.compilerOptions.outDir;
    var promises = [];
    var includedSassFiles = [];
    ctx.files.forEach(function (f) {
        if (!f.isTsSourceFile || !f.cmpMeta)
            return;
        Object.keys(f.cmpMeta.modes).forEach(function (modeName) {
            f.cmpMeta.modes[modeName].styleUrls.forEach(function (styleUrl) {
                var srcAbsolutePath = path.join(f.srcDir, styleUrl);
                promises.push(getIncludedSassFiles(config, ctx, includedSassFiles, srcAbsolutePath));
            });
        });
    });
    return Promise.all(promises).then(function () {
        var promises = [];
        includedSassFiles.forEach(function (includedSassFile) {
            config.include.forEach(function (includeDir) {
                if (includedSassFile.indexOf(includeDir) === 0) {
                    var src = includedSassFile;
                    var relative = includedSassFile.replace(includeDir, '');
                    var dest_1 = path.join(destDir, relative);
                    promises.push(readFile$1(src).then(function (content) {
                        return writeFile$1(dest_1, content);
                    }));
                }
            });
        });
        return Promise.all(promises);
    });
}
function getIncludedSassFiles(config, ctx, includedSassFiles, scssFilePath) {
    return new Promise(function (resolve$$1, reject) {
        var sassConfig = {
            file: scssFilePath
        };
        if (config.debug) {
            console.log("compile, getIncludedSassFiles: " + scssFilePath);
        }
        config.packages.nodeSass.render(sassConfig, function (err, result) {
            if (err) {
                logError(ctx.results, err);
                reject(err);
            }
            else {
                result.stats.includedFiles.forEach(function (includedFile) {
                    if (includedSassFiles.indexOf(includedFile) === -1) {
                        includedSassFiles.push(includedFile);
                    }
                });
                resolve$$1();
            }
        });
    });
}
function generateManifest(config, ctx) {
    var manifest = {
        components: {},
        bundles: []
    };
    var destDir = config.compilerOptions.outDir;
    ctx.files.forEach(function (f) {
        if (!f.isTsSourceFile || !f.cmpMeta)
            return;
        var componentUrl = f.jsFilePath.replace(destDir + path.sep, '');
        var modes = f.cmpMeta.modes;
        var componentDir = path.dirname(componentUrl);
        Object.keys(modes).forEach(function (modeName) {
            modes[modeName].styleUrls = modes[modeName].styleUrls.map(function (styleUrl) {
                return path.join(componentDir, styleUrl);
            });
        });
        manifest.components[f.cmpMeta.tag] = {
            componentUrl: componentUrl,
            modes: modes
        };
    });
    if (config.bundles) {
        manifest.bundles = config.bundles;
    }
    else {
        ctx.files.forEach(function (f) {
            if (f.isTsSourceFile && f.cmpMeta) {
                manifest.bundles.push([f.cmpMeta.tag]);
            }
        });
    }
    var manifestFile = path.join(config.compilerOptions.outDir, 'manifest.json');
    var json = JSON.stringify(manifest, null, 2);
    return writeFile$1(manifestFile, json);
}

exports.bundle = bundle;
exports.compile = compile;
