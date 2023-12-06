import { isString } from '@utils';
/**
 * Validate the `.hydratedFlag` property on the supplied config object and
 * return a properly-validated value.
 *
 * @param config the configuration we're examining
 * @returns a suitable value for the hydratedFlag property
 */
export const validateHydrated = (config) => {
    var _a;
    /**
     * If `config.hydratedFlag` is set to `null` that is an explicit signal that we
     * should _not_ create a default configuration when validating and should instead
     * just return `null`. It may also have been set to `false`; this is an invalid
     * value as far as the type system is concerned, but users may ignore this.
     *
     * See {@link HydratedFlag} for more details.
     */
    if (config.hydratedFlag === null || config.hydratedFlag === false) {
        return null;
    }
    // Here we start building up a default config since `.hydratedFlag` wasn't set to
    // `null` on the provided config.
    const hydratedFlag = { ...((_a = config.hydratedFlag) !== null && _a !== void 0 ? _a : {}) };
    if (!isString(hydratedFlag.name) || hydratedFlag.property === '') {
        hydratedFlag.name = `hydrated`;
    }
    if (hydratedFlag.selector === 'attribute') {
        hydratedFlag.selector = `attribute`;
    }
    else {
        hydratedFlag.selector = `class`;
    }
    if (!isString(hydratedFlag.property) || hydratedFlag.property === '') {
        hydratedFlag.property = `visibility`;
    }
    if (!isString(hydratedFlag.initialValue) && hydratedFlag.initialValue !== null) {
        hydratedFlag.initialValue = `hidden`;
    }
    if (!isString(hydratedFlag.hydratedValue) && hydratedFlag.initialValue !== null) {
        hydratedFlag.hydratedValue = `inherit`;
    }
    return hydratedFlag;
};
//# sourceMappingURL=validate-hydrated.js.map