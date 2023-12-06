import { catchError, COPY, isOutputTargetCustom } from '@utils';
export const validateCustomOutput = (config, diagnostics, userOutputs) => {
    return userOutputs.filter(isOutputTargetCustom).map((o) => {
        if (o.validate) {
            const localDiagnostics = [];
            try {
                o.validate(config, diagnostics);
            }
            catch (e) {
                catchError(localDiagnostics, e);
            }
            if (o.copy && o.copy.length > 0) {
                config.outputTargets.push({
                    type: COPY,
                    dir: config.rootDir,
                    copy: [...o.copy],
                });
            }
            diagnostics.push(...localDiagnostics);
        }
        return o;
    });
};
//# sourceMappingURL=validate-custom-output.js.map