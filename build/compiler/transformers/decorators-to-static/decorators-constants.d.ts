/**
 * All the decorators supported by Stencil
 */
export declare const STENCIL_DECORATORS: readonly ["AttachInternals", "Component", "Element", "Event", "Listen", "Method", "Prop", "State", "Watch"];
export type StencilDecorator = (typeof STENCIL_DECORATORS)[number];
/**
 * Decorators on class declarations that we remove as part of the compilation
 * process
 */
export declare const CLASS_DECORATORS_TO_REMOVE: readonly ["Component"];
/**
 * Decorators on class members that we remove as part of the compilation
 * process
 */
export declare const MEMBER_DECORATORS_TO_REMOVE: readonly ["AttachInternals", "Element", "Event", "Listen", "Method", "Prop", "State", "Watch"];
/**
 * Decorators whose 'decorees' we need to rewrite during compilation from
 * class fields to instead initialize them in a constructor.
 */
export declare const CONSTRUCTOR_DEFINED_MEMBER_DECORATORS: readonly ["State", "Prop"];
/**
 * The names used for the static getters added to Stencil components when they
 * are transformed to remove decorated properties.
 */
export declare const STATIC_GETTER_NAMES: readonly ["COMPILER_META", "assetsDirs", "attachInternalsMemberName", "cmpMeta", "delegatesFocus", "elementRef", "encapsulation", "events", "formAssociated", "is", "listeners", "methods", "originalStyleUrls", "properties", "states", "style", "styleMode", "styleUrl", "styleUrls", "styles", "watchers"];
export type StencilStaticGetter = (typeof STATIC_GETTER_NAMES)[number];
