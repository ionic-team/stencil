import type { OutputTarget, OutputTargetCopy, OutputTargetDistCustomElements, OutputTargetDistTypes, ValidatedConfig } from '../../../declarations';
/**
 * Validate one or more `dist-custom-elements` output targets. Validation of an output target may involve back-filling
 * fields that are omitted with sensible defaults and/or creating additional supporting output targets that were not
 * explicitly defined by the user
 * @param config the Stencil configuration associated with the project being compiled
 * @param userOutputs the output target(s) specified by the user
 * @returns the validated output target(s)
 */
export declare const validateCustomElement: (config: ValidatedConfig, userOutputs: ReadonlyArray<OutputTarget>) => ReadonlyArray<OutputTargetDistCustomElements | OutputTargetDistTypes | OutputTargetCopy>;
