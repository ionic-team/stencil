"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderCoreStatementsPlugin = void 0;
const typescript_1 = __importDefault(require("typescript"));
function reorderCoreStatementsPlugin() {
    return {
        name: 'internalClient',
        generateBundle(options, bundles) {
            reorderCoreStatements(options, bundles);
        },
    };
}
exports.reorderCoreStatementsPlugin = reorderCoreStatementsPlugin;
function reorderCoreStatements(options, bundles) {
    if (options.format === 'es') {
        Object.keys(bundles).forEach((fileName) => {
            const bundle = bundles[fileName];
            if (bundle.isEntry) {
                bundle.code = reorderStatements(bundle.code);
            }
        });
    }
}
function reorderStatements(code) {
    function transform() {
        return () => {
            return (tsSourceFile) => {
                const s = tsSourceFile.statements;
                const importStatements = s.filter(typescript_1.default.isImportDeclaration);
                const exportStatements = s.filter(typescript_1.default.isExportDeclaration);
                const letNoInitializerStatements = s.filter(isLetNoInitializer);
                const letWithInitializer = s.filter(isLetWithInitializer);
                const otherStatements = s.filter((n) => !isLet(n) && !typescript_1.default.isImportDeclaration(n) && !typescript_1.default.isExportDeclaration(n));
                return typescript_1.default.factory.updateSourceFile(tsSourceFile, [
                    ...letNoInitializerStatements,
                    ...letWithInitializer,
                    ...importStatements,
                    ...otherStatements,
                    ...exportStatements,
                ]);
            };
        };
    }
    function isLet(n) {
        if (typescript_1.default.isVariableStatement(n) && n.declarationList) {
            if (n.declarationList.kind === typescript_1.default.SyntaxKind.VariableDeclarationList) {
                if (n.declarationList.flags === typescript_1.default.NodeFlags.Let) {
                    return true;
                }
            }
        }
        return false;
    }
    function isLetNoInitializer(n) {
        return isLet(n) && !isLetWithInitializer(n);
    }
    function isLetWithInitializer(n) {
        if (isLet(n) && n.declarationList.declarations) {
            return n.declarationList.declarations.some((d) => {
                return !!d.initializer;
            });
        }
        return false;
    }
    const output = typescript_1.default.transpileModule(code, {
        compilerOptions: {
            module: typescript_1.default.ModuleKind.ESNext,
            target: typescript_1.default.ScriptTarget.ES2017,
        },
        transformers: {
            after: [transform()],
        },
    });
    return output.outputText;
}
