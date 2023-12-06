import { mockConfig, mockLoadConfigInit } from '@stencil/core/testing';
import { buildWarn } from '@utils';
import { validateConfig } from '../validate-config';
describe('validateCustom', () => {
    let userConfig;
    beforeEach(() => {
        userConfig = mockConfig();
    });
    it('should log warning', () => {
        userConfig.outputTargets = [
            {
                type: 'custom',
                name: 'test',
                validate: (_, diagnostics) => {
                    const warn = buildWarn(diagnostics);
                    warn.messageText = 'test warning';
                },
                generator: async () => {
                    return;
                },
            },
        ];
        const { diagnostics } = validateConfig(userConfig, mockLoadConfigInit());
        expect(diagnostics.length).toBe(1);
    });
});
//# sourceMappingURL=validate-custom.spec.js.map