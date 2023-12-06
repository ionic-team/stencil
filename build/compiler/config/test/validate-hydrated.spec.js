import { validateHydrated } from '../validate-hydrated';
describe('validate-hydrated', () => {
    describe('validateHydrated', () => {
        let inputConfig;
        let inputHydrateFlagConfig;
        beforeEach(() => {
            inputHydrateFlagConfig = {};
            inputConfig = {
                hydratedFlag: inputHydrateFlagConfig,
            };
        });
        it.each([null, false])('returns undefined for hydratedFlag=%s', (badValue) => {
            // this test explicitly checks for a bad value in the stencil.config file, hence the type assertion
            inputConfig.hydratedFlag = badValue;
            const actual = validateHydrated(inputConfig);
            expect(actual).toBeNull();
        });
        it.each([[], true])('returns a default value when hydratedFlag=%s', (badValue) => {
            // this test explicitly checks for a bad value in the stencil.config file, hence the type assertion
            inputConfig.hydratedFlag = badValue;
            const actual = validateHydrated(inputConfig);
            expect(actual).toEqual({
                hydratedValue: 'inherit',
                initialValue: 'hidden',
                name: 'hydrated',
                property: 'visibility',
                selector: 'class',
            });
        });
    });
});
//# sourceMappingURL=validate-hydrated.spec.js.map