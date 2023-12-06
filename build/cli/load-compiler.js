export const loadCoreCompiler = async (sys) => {
    const compilerMod = await sys.dynamicImport(sys.getCompilerExecutingPath());
    // TODO(STENCIL-1018): Remove Rollup Infrastructure
    if (globalThis.stencil) {
        return globalThis.stencil;
    }
    else {
        globalThis.stencil = compilerMod;
        return compilerMod;
    }
};
//# sourceMappingURL=load-compiler.js.map